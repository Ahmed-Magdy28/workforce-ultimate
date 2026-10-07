-- ==============================================================================
-- WORKFORCE ULTIMATE — PHASE 2.5: ESSENTIAL FEATURES DATABASE MIGRATION
-- Notifications, Performance Evaluations & Goals, Daily Work Logs
-- Run this in your Supabase SQL Editor.
-- ==============================================================================

-- ==============================================================================
-- 1. NOTIFICATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id  uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  title       text NOT NULL,
  message     text NOT NULL,
  type        text NOT NULL DEFAULT 'info'
                CHECK (type IN ('info', 'success', 'warning', 'approval', 'task', 'system')),
  link        text,
  is_read     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 2. NOTIFICATION PREFERENCES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications  boolean NOT NULL DEFAULT true,
  in_app_notifications boolean NOT NULL DEFAULT true,
  task_assigned        boolean NOT NULL DEFAULT true,
  time_mod_updates     boolean NOT NULL DEFAULT true,
  daily_log_reminders  boolean NOT NULL DEFAULT true,
  evaluations          boolean NOT NULL DEFAULT true,
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. DAILY WORK LOGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.daily_work_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id     uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  log_date        date NOT NULL DEFAULT current_date,
  tasks_completed text NOT NULL,
  hours_worked    numeric NOT NULL CHECK (hours_worked > 0),
  blockers        text,
  mood_rating     int CHECK (mood_rating BETWEEN 1 AND 5),
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. PERFORMANCE GOALS (OKRs) TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.performance_goals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  creator_id  uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  title       text NOT NULL,
  description text,
  progress    int NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  target_date date,
  status      text NOT NULL DEFAULT 'in_progress'
                CHECK (status IN ('not_started', 'in_progress', 'completed', 'cancelled')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 5. PERFORMANCE REVIEWS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.performance_reviews (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  employee_id  uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  reviewer_id  uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  cycle        text NOT NULL,
  rating       numeric NOT NULL CHECK (rating >= 1 AND rating <= 5),
  strengths    text,
  growth_areas text,
  feedback     text NOT NULL,
  status       text NOT NULL DEFAULT 'completed'
                 CHECK (status IN ('draft', 'submitted', 'completed')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 6. INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_daily_logs_company ON public.daily_work_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_employee ON public.daily_work_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON public.daily_work_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_goals_company ON public.performance_goals(company_id);
CREATE INDEX IF NOT EXISTS idx_goals_employee ON public.performance_goals(employee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_company ON public.performance_reviews(company_id);
CREATE INDEX IF NOT EXISTS idx_reviews_employee ON public.performance_reviews(employee_id);

-- ==============================================================================
-- 7. TRIGGERS FOR updated_at
-- ==============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'daily_work_logs_updated_at') THEN
    CREATE TRIGGER daily_work_logs_updated_at
      BEFORE UPDATE ON public.daily_work_logs
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'performance_goals_updated_at') THEN
    CREATE TRIGGER performance_goals_updated_at
      BEFORE UPDATE ON public.performance_goals
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'performance_reviews_updated_at') THEN
    CREATE TRIGGER performance_reviews_updated_at
      BEFORE UPDATE ON public.performance_reviews
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- NOTIFICATIONS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can view their notifications" ON public.notifications;
CREATE POLICY "users can view their notifications"
ON public.notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "users can update their notifications" ON public.notifications;
CREATE POLICY "users can update their notifications"
ON public.notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- NOTIFICATION PREFERENCES
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can manage their preferences" ON public.notification_preferences;
CREATE POLICY "users can manage their preferences"
ON public.notification_preferences FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DAILY WORK LOGS
ALTER TABLE public.daily_work_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members can view company work logs" ON public.daily_work_logs;
CREATE POLICY "members can view company work logs"
ON public.daily_work_logs FOR SELECT TO authenticated
USING (public.is_company_member(company_id) OR public.is_company_admin(company_id));

DROP POLICY IF EXISTS "employees can insert their work logs" ON public.daily_work_logs;
CREATE POLICY "employees can insert their work logs"
ON public.daily_work_logs FOR INSERT TO authenticated
WITH CHECK (
  public.is_company_member(company_id)
  AND employee_id = public.get_current_employee_id(company_id)
);

DROP POLICY IF EXISTS "employees can update their work logs" ON public.daily_work_logs;
CREATE POLICY "employees can update their work logs"
ON public.daily_work_logs FOR UPDATE TO authenticated
USING (employee_id = public.get_current_employee_id(company_id));

-- PERFORMANCE GOALS
ALTER TABLE public.performance_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "members can view company goals" ON public.performance_goals;
CREATE POLICY "members can view company goals"
ON public.performance_goals FOR SELECT TO authenticated
USING (public.is_company_member(company_id) OR public.is_company_admin(company_id));

DROP POLICY IF EXISTS "managers and above can manage goals" ON public.performance_goals;
CREATE POLICY "managers and above can manage goals"
ON public.performance_goals FOR ALL TO authenticated
USING (
  public.is_company_manager_or_above(company_id)
  OR employee_id = public.get_current_employee_id(company_id)
)
WITH CHECK (
  public.is_company_manager_or_above(company_id)
  OR employee_id = public.get_current_employee_id(company_id)
);

-- PERFORMANCE REVIEWS
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "employees can view their own reviews or managers can view all" ON public.performance_reviews;
CREATE POLICY "employees can view their own reviews or managers can view all"
ON public.performance_reviews FOR SELECT TO authenticated
USING (
  public.is_company_manager_or_above(company_id)
  OR employee_id = public.get_current_employee_id(company_id)
);

DROP POLICY IF EXISTS "managers and above can create/edit reviews" ON public.performance_reviews;
CREATE POLICY "managers and above can create/edit reviews"
ON public.performance_reviews FOR ALL TO authenticated
USING (public.is_company_manager_or_above(company_id))
WITH CHECK (public.is_company_manager_or_above(company_id));

-- ==============================================================================
-- 9. RPC FUNCTIONS
-- ==============================================================================

-- 1. Helper to create a notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id uuid,
  p_company_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'info',
  p_link text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_notif_id uuid;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    company_id,
    title,
    message,
    type,
    link
  )
  VALUES (
    p_user_id,
    p_company_id,
    p_title,
    p_message,
    p_type,
    p_link
  )
  RETURNING id INTO v_notif_id;

  RETURN v_notif_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_notification(uuid, uuid, text, text, text, text) TO authenticated;

-- 2. Mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = true
  WHERE id = p_notification_id AND user_id = auth.uid();

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_notification_read(uuid) TO authenticated;

-- 3. Mark all notifications as read
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = true
  WHERE user_id = auth.uid() AND is_read = false;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mark_all_notifications_read() TO authenticated;

