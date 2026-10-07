-- ==============================================================================
-- WORKFORCE ULTIMATE — PHASE 2: CORE MVP DATABASE MIGRATION
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- ==============================================================================
-- 1. UPDATE ROLE CONSTRAINTS TO SUPPORT 5-TIER HIERARCHY
-- Roles: owner, admin, hr, regional_manager, senior_manager, manager, employee
-- ==============================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'employees_role_check'
  ) THEN
    ALTER TABLE public.employees DROP CONSTRAINT employees_role_check;
  END IF;
END $$;

ALTER TABLE public.employees
  ADD CONSTRAINT employees_role_check
  CHECK (role IN ('owner', 'admin', 'hr', 'regional_manager', 'senior_manager', 'manager', 'employee'));

-- Update invitations role check if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'invitations_role_check'
  ) THEN
    ALTER TABLE public.invitations DROP CONSTRAINT invitations_role_check;
  END IF;
END $$;

-- Helper function: check if user is manager or higher in company
CREATE OR REPLACE FUNCTION public.is_company_manager_or_above(target_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.companies c
    WHERE c.id = target_company_id
      AND c.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.employees e
    WHERE e.user_id = auth.uid()
      AND e.company_id = target_company_id
      AND e.role IN ('owner', 'admin', 'hr', 'regional_manager', 'senior_manager', 'manager')
  );
$$;

-- Helper function: get current employee record id for logged-in user
CREATE OR REPLACE FUNCTION public.get_current_employee_id(target_company_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT e.id
  FROM public.employees e
  WHERE e.user_id = auth.uid()
    AND e.company_id = target_company_id
  LIMIT 1;
$$;

-- ==============================================================================
-- 2. PROJECTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  team_id      uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  manager_id   uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  name         text NOT NULL,
  description  text,
  status       text NOT NULL DEFAULT 'planning'
                 CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  priority     text NOT NULL DEFAULT 'medium'
                 CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  budget       numeric NOT NULL DEFAULT 0,
  start_date   timestamptz,
  due_date     timestamptz,
  created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. ENSURE TASKS TABLE SUPPORTS PHASE 2 ATTRIBUTES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  description    text,
  status         text NOT NULL DEFAULT 'todo'
                   CHECK (status IN ('todo', 'in_progress', 'in_review', 'done', 'blocked')),
  priority       text NOT NULL DEFAULT 'medium'
                   CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date       timestamptz,
  workspace_id   uuid REFERENCES public.workspaces(id) ON DELETE CASCADE,
  parent_task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_by     uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  position       int NOT NULL DEFAULT 0,
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Alter tasks to add project, company, hours, and assignee if not existing
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.employees(id) ON DELETE SET NULL;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS estimated_hours numeric NOT NULL DEFAULT 0;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS logged_hours numeric NOT NULL DEFAULT 0;

DO $$
BEGIN
  -- Make workspace_id optional so tasks can belong directly to projects/companies
  ALTER TABLE public.tasks ALTER COLUMN workspace_id DROP NOT NULL;
EXCEPTION
  WHEN undefined_column THEN
    NULL;
END $$;

-- Update status check on tasks to include in_review and blocked
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_status_check') THEN
    ALTER TABLE public.tasks DROP CONSTRAINT tasks_status_check;
  END IF;
  ALTER TABLE public.tasks ADD CONSTRAINT tasks_status_check
    CHECK (status IN ('todo', 'in_progress', 'in_review', 'done', 'blocked'));
END $$;

-- ==============================================================================
-- 4. TIME LOGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.time_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  company_id  uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  hours       numeric NOT NULL CHECK (hours > 0),
  description text,
  logged_at   timestamptz NOT NULL DEFAULT now(),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 5. TIME MODIFICATION REQUESTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.time_modification_requests (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id         uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  task_id            uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  employee_id        uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  requested_hours    numeric NOT NULL,
  current_hours      numeric NOT NULL DEFAULT 0,
  type               text NOT NULL CHECK (type IN ('estimate_change', 'log_adjustment')),
  reason             text NOT NULL,
  status             text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by        uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  reviewed_at        timestamptz,
  reviewer_feedback  text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 6. COMPANY JOIN REQUESTS TABLE (USER-COMPANY LINKING)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.company_join_requests (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id         uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id            uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name          text NOT NULL,
  email              text NOT NULL,
  status             text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  desired_role       text DEFAULT 'employee',
  assigned_role      text DEFAULT 'employee' CHECK (assigned_role IN ('owner', 'admin', 'hr', 'regional_manager', 'senior_manager', 'manager', 'employee')),
  assigned_team_id   uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  reviewed_by        uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  reviewed_at        timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 7. INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_company ON public.projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_team ON public.projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_manager ON public.projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_company ON public.tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);

CREATE INDEX IF NOT EXISTS idx_time_logs_task ON public.time_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_employee ON public.time_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_company ON public.time_logs(company_id);

CREATE INDEX IF NOT EXISTS idx_time_mod_task ON public.time_modification_requests(task_id);
CREATE INDEX IF NOT EXISTS idx_time_mod_employee ON public.time_modification_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_mod_company ON public.time_modification_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_time_mod_status ON public.time_modification_requests(status);

CREATE INDEX IF NOT EXISTS idx_join_req_company ON public.company_join_requests(company_id);
CREATE INDEX IF NOT EXISTS idx_join_req_user ON public.company_join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_join_req_status ON public.company_join_requests(status);

-- ==============================================================================
-- 8. TRIGGERS FOR updated_at
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'projects_updated_at') THEN
    CREATE TRIGGER projects_updated_at
      BEFORE UPDATE ON public.projects
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'time_modification_requests_updated_at') THEN
    CREATE TRIGGER time_modification_requests_updated_at
      BEFORE UPDATE ON public.time_modification_requests
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'company_join_requests_updated_at') THEN
    CREATE TRIGGER company_join_requests_updated_at
      BEFORE UPDATE ON public.company_join_requests
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- PROJECTS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members can view company projects" ON public.projects;
CREATE POLICY "members can view company projects"
ON public.projects FOR SELECT TO authenticated
USING (public.is_company_member(company_id) OR public.is_company_admin(company_id));

DROP POLICY IF EXISTS "managers and admins can manage projects" ON public.projects;
CREATE POLICY "managers and admins can manage projects"
ON public.projects FOR ALL TO authenticated
USING (public.is_company_manager_or_above(company_id))
WITH CHECK (public.is_company_manager_or_above(company_id));

-- TASKS (Add Company-Level Policies)
DROP POLICY IF EXISTS "members can view company tasks" ON public.tasks;
CREATE POLICY "members can view company tasks"
ON public.tasks FOR SELECT TO authenticated
USING (
  (company_id IS NOT NULL AND (public.is_company_member(company_id) OR public.is_company_admin(company_id)))
  OR (workspace_id IS NOT NULL AND public.can_access_workspace(workspace_id))
);

DROP POLICY IF EXISTS "members can create tasks" ON public.tasks;
CREATE POLICY "members can create tasks"
ON public.tasks FOR INSERT TO authenticated
WITH CHECK (
  (company_id IS NOT NULL AND (public.is_company_member(company_id) OR public.is_company_admin(company_id)))
  OR (workspace_id IS NOT NULL AND public.can_access_workspace(workspace_id))
);

DROP POLICY IF EXISTS "members can update tasks" ON public.tasks;
CREATE POLICY "members can update tasks"
ON public.tasks FOR UPDATE TO authenticated
USING (
  (company_id IS NOT NULL AND (public.is_company_member(company_id) OR public.is_company_admin(company_id)))
  OR (workspace_id IS NOT NULL AND public.can_access_workspace(workspace_id))
);

DROP POLICY IF EXISTS "managers and creators can delete tasks" ON public.tasks;
CREATE POLICY "managers and creators can delete tasks"
ON public.tasks FOR DELETE TO authenticated
USING (
  created_by = auth.uid()
  OR (company_id IS NOT NULL AND public.is_company_manager_or_above(company_id))
);

-- TIME LOGS
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members can view time logs" ON public.time_logs;
CREATE POLICY "members can view time logs"
ON public.time_logs FOR SELECT TO authenticated
USING (public.is_company_member(company_id) OR public.is_company_admin(company_id));

DROP POLICY IF EXISTS "employees can insert their own time logs" ON public.time_logs;
CREATE POLICY "employees can insert their own time logs"
ON public.time_logs FOR INSERT TO authenticated
WITH CHECK (
  public.is_company_member(company_id)
  AND employee_id = public.get_current_employee_id(company_id)
);

-- TIME MODIFICATION REQUESTS
ALTER TABLE public.time_modification_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members can view time modification requests" ON public.time_modification_requests;
CREATE POLICY "members can view time modification requests"
ON public.time_modification_requests FOR SELECT TO authenticated
USING (
  public.is_company_manager_or_above(company_id)
  OR employee_id = public.get_current_employee_id(company_id)
);

DROP POLICY IF EXISTS "employees can submit time modification requests" ON public.time_modification_requests;
CREATE POLICY "employees can submit time modification requests"
ON public.time_modification_requests FOR INSERT TO authenticated
WITH CHECK (
  public.is_company_member(company_id)
  AND employee_id = public.get_current_employee_id(company_id)
);

DROP POLICY IF EXISTS "managers can review time modification requests" ON public.time_modification_requests;
CREATE POLICY "managers can review time modification requests"
ON public.time_modification_requests FOR UPDATE TO authenticated
USING (public.is_company_manager_or_above(company_id))
WITH CHECK (public.is_company_manager_or_above(company_id));

-- COMPANY JOIN REQUESTS
ALTER TABLE public.company_join_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users and admins can view join requests" ON public.company_join_requests;
CREATE POLICY "users and admins can view join requests"
ON public.company_join_requests FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_company_admin(company_id)
  OR EXISTS (
    SELECT 1 FROM public.employees e
    WHERE e.user_id = auth.uid()
      AND e.company_id = company_join_requests.company_id
      AND e.role IN ('owner', 'admin', 'hr')
  )
);

DROP POLICY IF EXISTS "users can submit join requests" ON public.company_join_requests;
CREATE POLICY "users can submit join requests"
ON public.company_join_requests FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admins can update join requests" ON public.company_join_requests;
CREATE POLICY "admins can update join requests"
ON public.company_join_requests FOR UPDATE TO authenticated
USING (
  public.is_company_admin(company_id)
  OR EXISTS (
    SELECT 1 FROM public.employees e
    WHERE e.user_id = auth.uid()
      AND e.company_id = company_join_requests.company_id
      AND e.role IN ('owner', 'admin', 'hr')
  )
);

-- ==============================================================================
-- 10. RPC STORED PROCEDURES (BUSINESS LOGIC)
-- ==============================================================================

-- 1. Log time directly and update task's logged_hours
CREATE OR REPLACE FUNCTION public.log_task_time(
  p_task_id uuid,
  p_hours numeric,
  p_description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_task public.tasks%ROWTYPE;
  v_employee_id uuid;
  v_new_log_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'You must be authenticated';
  END IF;

  SELECT * INTO v_task FROM public.tasks WHERE id = p_task_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found';
  END IF;

  SELECT id INTO v_employee_id
  FROM public.employees
  WHERE user_id = auth.uid() AND company_id = v_task.company_id
  LIMIT 1;

  IF v_employee_id IS NULL THEN
    RAISE EXCEPTION 'You are not an employee of this company';
  END IF;

  INSERT INTO public.time_logs (
    task_id,
    employee_id,
    company_id,
    hours,
    description
  )
  VALUES (
    p_task_id,
    v_employee_id,
    v_task.company_id,
    p_hours,
    p_description
  )
  RETURNING id INTO v_new_log_id;

  -- Increment logged_hours on task
  UPDATE public.tasks
  SET logged_hours = COALESCE(logged_hours, 0) + p_hours,
      updated_at = now()
  WHERE id = p_task_id;

  RETURN v_new_log_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_task_time(uuid, numeric, text) TO authenticated;

-- 2. Review and process Time Modification Request
CREATE OR REPLACE FUNCTION public.review_time_modification_request(
  p_request_id uuid,
  p_status text,
  p_reviewer_feedback text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_req public.time_modification_requests%ROWTYPE;
  v_reviewer_id uuid;
BEGIN
  IF p_status NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Status must be approved or rejected';
  END IF;

  SELECT * INTO v_req
  FROM public.time_modification_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found';
  END IF;

  IF NOT public.is_company_manager_or_above(v_req.company_id) THEN
    RAISE EXCEPTION 'You do not have permission to review requests for this company';
  END IF;

  SELECT id INTO v_reviewer_id
  FROM public.employees
  WHERE user_id = auth.uid() AND company_id = v_req.company_id
  LIMIT 1;

  -- Apply changes if approved
  IF p_status = 'approved' THEN
    IF v_req.type = 'estimate_change' THEN
      UPDATE public.tasks
      SET estimated_hours = v_req.requested_hours,
          updated_at = now()
      WHERE id = v_req.task_id;
    ELSIF v_req.type = 'log_adjustment' THEN
      UPDATE public.tasks
      SET logged_hours = v_req.requested_hours,
          updated_at = now()
      WHERE id = v_req.task_id;
    END IF;
  END IF;

  UPDATE public.time_modification_requests
  SET status = p_status,
      reviewed_by = v_reviewer_id,
      reviewed_at = now(),
      reviewer_feedback = p_reviewer_feedback,
      updated_at = now()
  WHERE id = p_request_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.review_time_modification_request(uuid, text, text) TO authenticated;

-- 3. Review and process Company Join Request
CREATE OR REPLACE FUNCTION public.review_company_join_request(
  p_request_id uuid,
  p_status text,
  p_assigned_role text DEFAULT 'employee',
  p_assigned_team_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_req public.company_join_requests%ROWTYPE;
  v_reviewer_id uuid;
  v_existing_emp_id uuid;
BEGIN
  IF p_status NOT IN ('approved', 'rejected') THEN
    RAISE EXCEPTION 'Status must be approved or rejected';
  END IF;

  SELECT * INTO v_req
  FROM public.company_join_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Join request not found';
  END IF;

  IF NOT (public.is_company_admin(v_req.company_id) OR EXISTS (
    SELECT 1 FROM public.employees e
    WHERE e.user_id = auth.uid()
      AND e.company_id = v_req.company_id
      AND e.role IN ('owner', 'admin', 'hr')
  )) THEN
    RAISE EXCEPTION 'You do not have permission to review join requests';
  END IF;

  SELECT id INTO v_reviewer_id
  FROM public.employees
  WHERE user_id = auth.uid() AND company_id = v_req.company_id
  LIMIT 1;

  IF p_status = 'approved' THEN
    -- Check if employee already exists
    SELECT id INTO v_existing_emp_id
    FROM public.employees
    WHERE user_id = v_req.user_id AND company_id = v_req.company_id;

    IF v_existing_emp_id IS NULL THEN
      INSERT INTO public.employees (
        full_name,
        email,
        role,
        company_id,
        team_id,
        user_id
      )
      VALUES (
        v_req.full_name,
        v_req.email,
        COALESCE(p_assigned_role, 'employee'),
        v_req.company_id,
        p_assigned_team_id,
        v_req.user_id
      );
    ELSE
      UPDATE public.employees
      SET role = COALESCE(p_assigned_role, role),
          team_id = COALESCE(p_assigned_team_id, team_id),
          updated_at = now()
      WHERE id = v_existing_emp_id;
    END IF;
  END IF;

  UPDATE public.company_join_requests
  SET status = p_status,
      assigned_role = COALESCE(p_assigned_role, 'employee'),
      assigned_team_id = p_assigned_team_id,
      reviewed_by = v_reviewer_id,
      reviewed_at = now(),
      updated_at = now()
  WHERE id = p_request_id;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.review_company_join_request(uuid, text, text, uuid) TO authenticated;

