-- ==============================================================================
-- FIX INVITATIONS VALIDATION & ACCEPTANCE RLS AND RPC
-- Run this in your Supabase SQL Editor to enable instant code validation
-- and seamless 1-click joining for authenticated users.
-- ==============================================================================

-- 1. Ensure RLS allows selecting invitation codes by anyone (needed for validation)
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can validate invitations by code" ON public.invitations;
CREATE POLICY "Anyone can validate invitations by code"
ON public.invitations FOR SELECT
USING (true);

-- Ensure employees table policies allow reading and inserting own employee record
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own employee record" ON public.employees;
CREATE POLICY "Users can read own employee record"
ON public.employees FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own employee record" ON public.employees;
CREATE POLICY "Users can insert own employee record"
ON public.employees FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Ensure employee email is not globally unique across different companies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'employees_email_key') THEN
    ALTER TABLE public.employees DROP CONSTRAINT employees_email_key;
  END IF;
END $$;

-- 2. Drop existing functions to allow altering table return signature
DROP FUNCTION IF EXISTS public.validate_invitation(text);
DROP FUNCTION IF EXISTS public.accept_company_invitation(text, text, text);

-- 3. Robust validate_invitation function (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.validate_invitation(invite_code text)
RETURNS TABLE (
  valid         boolean,
  company_id    uuid,
  company_name  text,
  role          text,
  message       text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_code text := lower(trim(invite_code));
  inv record;
BEGIN
  IF clean_code IS NULL OR clean_code = '' THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::text, 'Please provide an invitation code'::text;
    RETURN;
  END IF;

  SELECT
    i.id,
    i.company_id,
    i.role,
    i.is_active,
    i.expires_at,
    i.max_uses,
    i.used_count,
    c.name AS comp_name
  INTO inv
  FROM public.invitations i
  LEFT JOIN public.companies c ON c.id = i.company_id
  WHERE lower(trim(i.code)) = clean_code;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::text, 'Invitation code was not found. Please verify the code or ask your admin.'::text;
    RETURN;
  END IF;

  IF inv.is_active = false THEN
    RETURN QUERY SELECT false, inv.company_id, inv.comp_name, inv.role, 'This invitation code is inactive or revoked'::text;
    RETURN;
  END IF;

  IF inv.expires_at IS NOT NULL AND inv.expires_at < now() THEN
    RETURN QUERY SELECT false, inv.company_id, inv.comp_name, inv.role, 'This invitation code has expired'::text;
    RETURN;
  END IF;

  IF inv.used_count >= inv.max_uses THEN
    RETURN QUERY SELECT false, inv.company_id, inv.comp_name, inv.role, 'This invitation code has already reached maximum uses'::text;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, inv.company_id, inv.comp_name, inv.role, 'valid'::text;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_invitation(text) TO anon, authenticated;

-- 4. Robust accept_company_invitation function (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.accept_company_invitation(
  p_invite_code text,
  p_full_name text DEFAULT NULL,
  p_work_email text DEFAULT NULL
)
RETURNS TABLE (
  company_id uuid,
  role text,
  employee_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_code text := lower(trim(p_invite_code));
  invite_record public.invitations%ROWTYPE;
  inserted_employee_id uuid;
  resolved_name text;
  resolved_email text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'You must be logged in to join a company';
  END IF;

  SELECT *
  INTO invite_record
  FROM public.invitations
  WHERE lower(trim(code)) = clean_code
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation code was not found';
  END IF;

  IF invite_record.is_active = false THEN
    RAISE EXCEPTION 'Invitation code is inactive or revoked';
  END IF;

  IF invite_record.expires_at IS NOT NULL AND invite_record.expires_at < now() THEN
    RAISE EXCEPTION 'Invitation code has expired';
  END IF;

  IF invite_record.used_count >= invite_record.max_uses THEN
    RAISE EXCEPTION 'Invitation code has reached maximum uses';
  END IF;

  -- Resolve full name and email
  resolved_name := COALESCE(NULLIF(trim(p_full_name), ''), (SELECT raw_user_meta_data->>'fullName' FROM auth.users WHERE id = auth.uid()), (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = auth.uid()), 'Team Member');
  resolved_email := COALESCE(NULLIF(lower(trim(p_work_email)), ''), (SELECT email FROM auth.users WHERE id = auth.uid()));

  -- Check if employee already exists for this company
  SELECT e.id
  INTO inserted_employee_id
  FROM public.employees e
  WHERE (e.user_id = auth.uid() OR (resolved_email IS NOT NULL AND lower(e.email) = resolved_email))
    AND e.company_id = invite_record.company_id
  LIMIT 1;

  IF inserted_employee_id IS NULL THEN
    INSERT INTO public.employees (
      full_name,
      email,
      role,
      company_id,
      user_id
    )
    VALUES (
      resolved_name,
      resolved_email,
      invite_record.role,
      invite_record.company_id,
      auth.uid()
    )
    RETURNING id INTO inserted_employee_id;
  ELSE
    UPDATE public.employees
    SET
      user_id = auth.uid(),
      role = invite_record.role,
      full_name = resolved_name,
      updated_at = now()
    WHERE id = inserted_employee_id;
  END IF;

  -- Increment usage and deactivate if limit reached
  UPDATE public.invitations
  SET
    used_count = used_count + 1,
    is_active = CASE
      WHEN used_count + 1 >= max_uses THEN false
      ELSE true
    END
  WHERE id = invite_record.id;

  RETURN QUERY
  SELECT
    invite_record.company_id,
    invite_record.role,
    inserted_employee_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_company_invitation(text, text, text) TO authenticated;
