-- ==============================================================================
-- WORKFORCE ULTIMATE — PHASE 3: COLLABORATION DATABASE MIGRATION
-- Task Attachments, Comments with Mentions, Activity Logs,
-- HR Bonuses & Warnings, Integrations (GitHub & Gmail), Real-time Chat
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- ==============================================================================
-- 1. TASK ATTACHMENTS (File uploads)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.task_attachments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id       uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  company_id    uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  file_name     text NOT NULL,
  file_url      text NOT NULL,
  file_size     bigint NOT NULL DEFAULT 0,
  file_type     text NOT NULL DEFAULT 'application/octet-stream',
  uploaded_by   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 2. TASK COMMENTS & MENTIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.task_comments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id       uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  company_id    uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content       text NOT NULL,
  mentions      uuid[] DEFAULT '{}', -- Array of user/employee IDs mentioned
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. ACTIVITY LOGS (Workspace Audit & Event Stream)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type   text NOT NULL -- 'task', 'project', 'comment', 'member', 'hr', 'integration', 'chat'
                CHECK (entity_type IN ('task', 'project', 'comment', 'member', 'hr', 'integration', 'chat', 'system')),
  entity_id     text,
  action        text NOT NULL, -- e.g. 'created', 'updated', 'deleted', 'assigned', 'status_changed', 'rewarded', 'warned'
  details       jsonb DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. HR ACTIONS: BONUSES & WARNINGS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.hr_actions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id   uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  issuer_id     uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  type          text NOT NULL CHECK (type IN ('bonus', 'warning', 'recognition')),
  title         text NOT NULL,
  amount        numeric DEFAULT 0, -- Monetary or credit amount (for bonus)
  reason        text NOT NULL,
  severity      text DEFAULT 'standard' CHECK (severity IN ('low', 'standard', 'high', 'critical')),
  status        text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'revoked')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 5. WORKSPACE INTEGRATIONS (GitHub & Gmail / Google Workspace)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.workspace_integrations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  provider      text NOT NULL CHECK (provider IN ('github', 'gmail', 'slack', 'webhook')),
  status        text NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'syncing', 'error')),
  config        jsonb NOT NULL DEFAULT '{}'::jsonb, -- e.g. repo_name, sync_branches, email_address, webhooks
  connected_by  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_sync_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, provider)
);

-- ==============================================================================
-- 6. REAL-TIME CHAT: CHANNELS & MESSAGES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_channels (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name          text NOT NULL,
  description   text,
  is_direct     boolean NOT NULL DEFAULT false,
  created_by    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_channel_members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id    uuid NOT NULL REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(channel_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id    uuid NOT NULL REFERENCES public.chat_channels(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message       text NOT NULL,
  attachments   jsonb DEFAULT '[]'::jsonb,
  is_pinned     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 7. STORAGE BUCKET FOR TASK ATTACHMENTS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-attachments', 'task-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated uploads to task-attachments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload attachments' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Authenticated users can upload attachments"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'task-attachments' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public can view task-attachments' AND tablename = 'objects'
  ) THEN
    CREATE POLICY "Public can view task-attachments"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'task-attachments');
  END IF;
END $$;

-- ==============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_task_attachments_task ON public.task_attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_task ON public.task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_company ON public.activity_logs(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hr_actions_employee ON public.hr_actions(employee_id);
CREATE INDEX IF NOT EXISTS idx_hr_actions_company ON public.hr_actions(company_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON public.chat_messages(channel_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chat_channels_company ON public.chat_channels(company_id);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Task Attachments RLS
CREATE POLICY "Users can view attachments in their company tasks"
ON public.task_attachments FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can upload task attachments"
ON public.task_attachments FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their task attachments"
ON public.task_attachments FOR DELETE
USING (auth.uid() = uploaded_by);

-- Task Comments RLS
CREATE POLICY "Users can view task comments"
ON public.task_comments FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can add comments"
ON public.task_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Activity Logs RLS
CREATE POLICY "Users can view their company activity logs"
ON public.activity_logs FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert activity logs"
ON public.activity_logs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- HR Actions RLS
CREATE POLICY "Users can view HR actions"
ON public.hr_actions FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "HR and Managers can insert HR actions"
ON public.hr_actions FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "HR and Managers can update HR actions"
ON public.hr_actions FOR UPDATE
USING (auth.role() = 'authenticated');

-- Workspace Integrations RLS
CREATE POLICY "Users can view workspace integrations"
ON public.workspace_integrations FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Company admins can manage integrations"
ON public.workspace_integrations FOR ALL
USING (auth.role() = 'authenticated');

-- Chat RLS
CREATE POLICY "Users can view company chat channels"
ON public.chat_channels FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create company chat channels"
ON public.chat_channels FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view channel memberships"
ON public.chat_channel_members FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can join channels"
ON public.chat_channel_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view channel messages"
ON public.chat_messages FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can post channel messages"
ON public.chat_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Real-time publication for chat messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
END $$;

