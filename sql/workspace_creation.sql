-- ============================================
-- 1. WORKSPACES TABLE
-- ============================================
CREATE TABLE workspaces (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  type         text NOT NULL DEFAULT 'personal'
                 CHECK (type IN ('personal', 'team')),
  owner_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id      uuid REFERENCES teams(id) ON DELETE CASCADE,
  company_id   uuid REFERENCES companies(id) ON DELETE CASCADE,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  -- personal workspace مش بيكونش عنده team_id
  CONSTRAINT personal_no_team CHECK (
    (type = 'personal' AND team_id IS NULL) OR
    (type = 'team' AND team_id IS NOT NULL)
  )
);

-- ============================================
-- 2. TASKS TABLE
-- ============================================
CREATE TABLE tasks (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  description    text,
  status         text NOT NULL DEFAULT 'todo'
                   CHECK (status IN ('todo', 'in_progress', 'done')),
  priority       text NOT NULL DEFAULT 'medium'
                   CHECK (priority IN ('low', 'medium', 'high')),
  due_date       timestamptz,
  workspace_id   uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_task_id uuid REFERENCES tasks(id) ON DELETE CASCADE, -- sub-tasks
  created_by     uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  position       int NOT NULL DEFAULT 0, -- ترتيب الـ cards في الـ Kanban
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 3. TASK ASSIGNEES (ناس كتير على task واحدة)
-- ============================================
CREATE TABLE task_assignees (
  task_id     uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (task_id, user_id)
);

-- ============================================
-- 4. TASK COMMENTS
-- ============================================
CREATE TABLE task_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 5. TASK ATTACHMENTS
-- ============================================
CREATE TABLE task_attachments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  file_name   text NOT NULL,
  file_url    text NOT NULL,
  file_size   int,
  file_type   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 6. TRIGGERS updated_at
-- ============================================
CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER task_comments_updated_at
  BEFORE UPDATE ON task_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 7. INDEXES
-- ============================================
CREATE INDEX idx_workspaces_owner      ON workspaces(owner_id);
CREATE INDEX idx_workspaces_team       ON workspaces(team_id);
CREATE INDEX idx_tasks_workspace       ON tasks(workspace_id);
CREATE INDEX idx_tasks_parent          ON tasks(parent_task_id);
CREATE INDEX idx_tasks_created_by      ON tasks(created_by);
CREATE INDEX idx_tasks_status          ON tasks(status);
CREATE INDEX idx_task_assignees_user   ON task_assignees(user_id);
CREATE INDEX idx_task_comments_task    ON task_comments(task_id);
CREATE INDEX idx_task_attachments_task ON task_attachments(task_id);

-- ============================================
-- 8. HELPER FUNCTIONS للـ RLS
-- ============================================

-- اليوزر ده عنده access على الـ workspace ده؟
CREATE OR REPLACE FUNCTION public.can_access_workspace(target_workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspaces w
    WHERE w.id = target_workspace_id
      AND (
        -- workspace شخصي بتاعه
        w.owner_id = auth.uid()
        OR
        -- workspace تيم وهو في التيم ده
        (w.type = 'team' AND public.is_company_member(w.company_id))
      )
  );
$$;

-- اليوزر ده assigned على الـ task دي؟
CREATE OR REPLACE FUNCTION public.is_task_assignee(target_task_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.task_assignees ta
    WHERE ta.task_id = target_task_id
      AND ta.user_id = auth.uid()
  );
$$;

-- ============================================
-- 9. RLS POLICIES
-- ============================================

-- WORKSPACES
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user can manage their personal workspace"
ON workspaces FOR ALL TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "team members can view team workspace"
ON workspaces FOR SELECT TO authenticated
USING (
  type = 'team' AND public.is_company_member(company_id)
);

CREATE POLICY "team admin can manage team workspace"
ON workspaces FOR ALL TO authenticated
USING (
  type = 'team' AND public.is_company_admin(company_id)
)
WITH CHECK (
  type = 'team' AND public.is_company_admin(company_id)
);

-- TASKS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace members can view tasks"
ON tasks FOR SELECT TO authenticated
USING (public.can_access_workspace(workspace_id));

CREATE POLICY "workspace members can create tasks"
ON tasks FOR INSERT TO authenticated
WITH CHECK (
  public.can_access_workspace(workspace_id)
  AND created_by = auth.uid()
);

-- صاحب الـ task أو الـ admin يقدر يعدل كل حاجة
CREATE POLICY "creator or admin can update task"
ON tasks FOR UPDATE TO authenticated
USING (
  created_by = auth.uid()
  OR public.is_task_assignee(id)
  OR EXISTS (
    SELECT 1 FROM workspaces w
    WHERE w.id = tasks.workspace_id
      AND public.is_company_admin(w.company_id)
  )
);

CREATE POLICY "creator or admin can delete task"
ON tasks FOR DELETE TO authenticated
USING (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM workspaces w
    WHERE w.id = tasks.workspace_id
      AND public.is_company_admin(w.company_id)
  )
);

-- TASK ASSIGNEES
ALTER TABLE task_assignees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace members can view assignees"
ON task_assignees FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM tasks t
    WHERE t.id = task_assignees.task_id
      AND public.can_access_workspace(t.workspace_id)
  )
);

CREATE POLICY "task creator or admin can manage assignees"
ON task_assignees FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM tasks t
    JOIN workspaces w ON w.id = t.workspace_id
    WHERE t.id = task_assignees.task_id
      AND (
        t.created_by = auth.uid()
        OR public.is_company_admin(w.company_id)
      )
  )
);

-- TASK COMMENTS
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assignees and members can view comments"
ON task_comments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM tasks t
    WHERE t.id = task_comments.task_id
      AND public.can_access_workspace(t.workspace_id)
  )
);

CREATE POLICY "assignees and members can add comments"
ON task_comments FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM tasks t
    WHERE t.id = task_comments.task_id
      AND public.can_access_workspace(t.workspace_id)
  )
);

CREATE POLICY "user can edit their own comments"
ON task_comments FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "user can delete their own comments"
ON task_comments FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- TASK ATTACHMENTS
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace members can view attachments"
ON task_attachments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM tasks t
    WHERE t.id = task_attachments.task_id
      AND public.can_access_workspace(t.workspace_id)
  )
);

CREATE POLICY "workspace members can add attachments"
ON task_attachments FOR INSERT TO authenticated
WITH CHECK (
  uploaded_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM tasks t
    WHERE t.id = task_attachments.task_id
      AND public.can_access_workspace(t.workspace_id)
  )
);

CREATE POLICY "uploader can delete attachment"
ON task_attachments FOR DELETE TO authenticated
USING (uploaded_by = auth.uid());

-- ============================================
-- 10. RPC: إنشاء workspace تلقائي بعد signup
-- ============================================
CREATE OR REPLACE FUNCTION public.create_personal_workspace()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.workspaces (name, type, owner_id)
  VALUES ('My Workspace', 'personal', auth.uid());
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_personal_workspace() TO authenticated;

-- ============================================
-- 11. RPC: إنشاء team workspace لما تيم اتعمل
-- ============================================
CREATE OR REPLACE FUNCTION public.create_team_workspace(
  p_team_id uuid,
  p_company_id uuid,
  p_name text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace_id uuid;
  team_name_val text;
BEGIN
  SELECT team_name INTO team_name_val
  FROM public.teams WHERE id = p_team_id;

  INSERT INTO public.workspaces (name, type, owner_id, team_id, company_id)
  VALUES (
    COALESCE(p_name, team_name_val || ' Workspace'),
    'team',
    auth.uid(),
    p_team_id,
    p_company_id
  )
  RETURNING id INTO new_workspace_id;

  RETURN new_workspace_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_team_workspace(uuid, uuid, text) TO authenticated;