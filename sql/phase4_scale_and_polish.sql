-- ==============================================================================
-- PHASE 4: SCALE & POLISH DATABASE MIGRATION
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- 1. BACKGROUND JOBS QUEUE TABLE
CREATE TABLE IF NOT EXISTS public.background_jobs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  job_type      text NOT NULL,
  status        text NOT NULL DEFAULT 'queued'
                CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')),
  priority      text NOT NULL DEFAULT 'normal'
                CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  payload       jsonb DEFAULT '{}'::jsonb,
  result        jsonb DEFAULT '{}'::jsonb,
  error_message text,
  retry_count   integer NOT NULL DEFAULT 0,
  max_retries   integer NOT NULL DEFAULT 3,
  scheduled_at  timestamptz NOT NULL DEFAULT now(),
  started_at    timestamptz,
  completed_at  timestamptz,
  created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 2. JOB EXECUTION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.job_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id      uuid NOT NULL REFERENCES public.background_jobs(id) ON DELETE CASCADE,
  level       text NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'warn', 'error', 'debug')),
  message     text NOT NULL,
  details     jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 3. WEB PUSH NOTIFICATION SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id  uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  endpoint    text NOT NULL UNIQUE,
  p256dh      text NOT NULL,
  auth_token  text NOT NULL,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_background_jobs_company_status ON public.background_jobs(company_id, status);
CREATE INDEX IF NOT EXISTS idx_background_jobs_scheduled ON public.background_jobs(status, scheduled_at ASC);
CREATE INDEX IF NOT EXISTS idx_job_logs_job ON public.job_logs(job_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user ON public.push_subscriptions(user_id);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Background Jobs RLS: authenticated members can view company jobs
DROP POLICY IF EXISTS "Users can view company background jobs" ON public.background_jobs;
CREATE POLICY "Users can view company background jobs"
ON public.background_jobs FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can enqueue background jobs" ON public.background_jobs;
CREATE POLICY "Users can enqueue background jobs"
ON public.background_jobs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update company background jobs" ON public.background_jobs;
CREATE POLICY "Users can update company background jobs"
ON public.background_jobs FOR UPDATE
USING (auth.role() = 'authenticated');

-- Job Logs RLS
DROP POLICY IF EXISTS "Users can view job logs" ON public.job_logs;
CREATE POLICY "Users can view job logs"
ON public.job_logs FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert job logs" ON public.job_logs;
CREATE POLICY "Users can insert job logs"
ON public.job_logs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Push Subscriptions RLS: users manage own subscriptions
DROP POLICY IF EXISTS "Users can manage own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can manage own push subscriptions"
ON public.push_subscriptions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. HELPER FUNCTION: ENQUEUE BACKGROUND JOB
CREATE OR REPLACE FUNCTION public.enqueue_background_job(
  p_company_id uuid,
  p_job_type text,
  p_priority text DEFAULT 'normal',
  p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job_id uuid;
BEGIN
  INSERT INTO public.background_jobs (
    company_id,
    job_type,
    priority,
    payload,
    created_by,
    status
  )
  VALUES (
    p_company_id,
    p_job_type,
    COALESCE(p_priority, 'normal'),
    COALESCE(p_payload, '{}'::jsonb),
    auth.uid(),
    'queued'
  )
  RETURNING id INTO v_job_id;

  INSERT INTO public.job_logs (job_id, level, message, details)
  VALUES (v_job_id, 'info', 'Job enqueued successfully', jsonb_build_object('job_type', p_job_type));

  RETURN v_job_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.enqueue_background_job(uuid, text, text, jsonb) TO authenticated;

-- 7. REALTIME PUBLICATION
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'background_jobs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.background_jobs;
  END IF;
END $$;

