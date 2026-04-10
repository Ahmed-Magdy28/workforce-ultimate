-- Fix recursive RLS on employees and move company create/join into RPCs.

CREATE OR REPLACE FUNCTION public.is_company_member(target_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.employees e
    WHERE e.user_id = auth.uid()
      AND e.company_id = target_company_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_company_admin(target_company_id uuid)
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
      AND e.role IN ('owner', 'admin')
  );
$$;

DROP POLICY IF EXISTS "employees can view their colleagues" ON public.employees;
DROP POLICY IF EXISTS "admin can manage employees" ON public.employees;
DROP POLICY IF EXISTS "employees can view their company" ON public.companies;
DROP POLICY IF EXISTS "employees can view their teams" ON public.teams;
DROP POLICY IF EXISTS "admin can manage teams" ON public.teams;

CREATE POLICY "employees can view their company"
ON public.companies FOR SELECT TO authenticated
USING (
  owner_id = auth.uid()
  OR public.is_company_member(id)
);

CREATE POLICY "employees can view their teams"
ON public.teams FOR SELECT TO authenticated
USING (
  public.is_company_member(company_id)
  OR EXISTS (
    SELECT 1
    FROM public.companies c
    WHERE c.id = teams.company_id
      AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "admin can manage teams"
ON public.teams FOR ALL TO authenticated
USING (public.is_company_admin(company_id))
WITH CHECK (public.is_company_admin(company_id));

CREATE POLICY "employees can view their colleagues"
ON public.employees FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_company_member(company_id)
  OR EXISTS (
    SELECT 1
    FROM public.companies c
    WHERE c.id = employees.company_id
      AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "admin can manage employees"
ON public.employees FOR ALL TO authenticated
USING (public.is_company_admin(company_id))
WITH CHECK (public.is_company_admin(company_id));

DROP POLICY IF EXISTS "admin can manage invitations" ON public.invitations;

CREATE POLICY "admin can manage invitations"
ON public.invitations FOR ALL TO authenticated
USING (public.is_company_admin(company_id))
WITH CHECK (public.is_company_admin(company_id));

CREATE OR REPLACE FUNCTION public.create_company_with_owner(
  p_name text,
  p_industry text DEFAULT NULL,
  p_website text DEFAULT NULL,
  p_work_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_country text DEFAULT NULL,
  p_timezone text DEFAULT NULL,
  p_headquarter text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_tagline text DEFAULT NULL,
  p_logo_url text DEFAULT NULL,
  p_subscription_limit int DEFAULT NULL,
  p_plan text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_company_id uuid;
  owner_full_name text;
  owner_email text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'You must be logged in to create a company';
  END IF;

  INSERT INTO public.companies (
    owner_id,
    name,
    industry,
    website,
    work_email,
    phone,
    country,
    timezone,
    headquarter,
    description,
    tagline,
    logo_url,
    subscription_limit,
    plan
  )
  VALUES (
    auth.uid(),
    p_name,
    p_industry,
    p_website,
    p_work_email,
    p_phone,
    p_country,
    COALESCE(NULLIF(p_timezone, ''), 'UTC'),
    p_headquarter,
    p_description,
    p_tagline,
    p_logo_url,
    COALESCE(p_subscription_limit, 10),
    COALESCE(NULLIF(p_plan, ''), 'free')
  )
  RETURNING id INTO new_company_id;

  owner_full_name := COALESCE(
    NULLIF(auth.jwt() -> 'user_metadata' ->> 'fullName', ''),
    split_part(COALESCE(auth.jwt() ->> 'email', ''), '@', 1),
    'Company Owner'
  );

  owner_email := COALESCE(
    NULLIF(p_work_email, ''),
    NULLIF(auth.jwt() ->> 'email', '')
  );

  INSERT INTO public.employees (
    full_name,
    email,
    role,
    company_id,
    user_id
  )
  VALUES (
    owner_full_name,
    owner_email,
    'owner',
    new_company_id,
    auth.uid()
  );

  RETURN new_company_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_company_with_owner(
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  text,
  int,
  text
) TO authenticated;

CREATE OR REPLACE FUNCTION public.accept_company_invitation(
  p_invite_code text,
  p_full_name text,
  p_work_email text
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
  invite_record public.invitations%ROWTYPE;
  inserted_employee_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'You must be logged in to join a company';
  END IF;

  SELECT *
  INTO invite_record
  FROM public.invitations
  WHERE code = lower(trim(p_invite_code))
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation code was not found';
  END IF;

  IF invite_record.is_active = false THEN
    RAISE EXCEPTION 'Invitation code is inactive';
  END IF;

  IF invite_record.expires_at < now() THEN
    RAISE EXCEPTION 'Invitation code has expired';
  END IF;

  IF invite_record.used_count >= invite_record.max_uses THEN
    RAISE EXCEPTION 'Invitation code has already been used';
  END IF;

  SELECT e.id
  INTO inserted_employee_id
  FROM public.employees e
  WHERE e.user_id = auth.uid()
    AND e.company_id = invite_record.company_id;

  IF inserted_employee_id IS NULL THEN
    INSERT INTO public.employees (
      full_name,
      email,
      role,
      company_id,
      user_id
    )
    VALUES (
      trim(p_full_name),
      lower(trim(p_work_email)),
      invite_record.role,
      invite_record.company_id,
      auth.uid()
    )
    RETURNING id INTO inserted_employee_id;
  END IF;

  UPDATE public.invitations
  SET
    used_count = used_count + 1,
    is_active = CASE
      WHEN used_count + 1 >= max_uses THEN false
      ELSE true
    END
  WHERE id = invite_record.id;

  RETURN QUERY
  SELECT invite_record.company_id, invite_record.role, inserted_employee_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_company_invitation(text, text, text)
TO authenticated;
