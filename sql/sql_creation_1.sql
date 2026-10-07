-- ============================================
-- 1. COMPANIES TABLE
-- ============================================
CREATE TABLE companies (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  name                text NOT NULL,
  industry            text,
  subscription_limit  int NOT NULL DEFAULT 10,
  logo_url            text,
  website             text,
  work_email          text,
  phone               text,
  country             text,
  timezone            text DEFAULT 'UTC',
  headquarter         text,
  description         text,
  tagline             text,
  is_active           boolean NOT NULL DEFAULT true,
  plan                text NOT NULL DEFAULT 'free'
                        CHECK (plan IN ('free', 'pro', 'enterprise')),
  regional_manager_id uuid,
  hr_id               uuid,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 2. TEAMS TABLE
-- ============================================
CREATE TABLE teams (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES auth.users(id),
  team_name     text NOT NULL,
  company_id    uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  team_lead_id  uuid
);

-- ============================================
-- 3. EMPLOYEES TABLE
-- ============================================
CREATE TABLE employees (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  full_name   text NOT NULL,
  email       text UNIQUE,
  role        text NOT NULL DEFAULT 'employee'
                CHECK (role IN ('owner', 'admin', 'hr', 'manager', 'employee')),
  company_id  uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  team_id     uuid REFERENCES teams(id) ON DELETE SET NULL,
  user_id     uuid REFERENCES auth.users(id)
);

-- ============================================
-- 4. FOREIGN KEYS اللى كانت بتانتظر employees
-- ============================================
ALTER TABLE companies
  ADD CONSTRAINT fk_regional_manager
    FOREIGN KEY (regional_manager_id) REFERENCES employees(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_hr
    FOREIGN KEY (hr_id) REFERENCES employees(id) ON DELETE SET NULL;

ALTER TABLE teams
  ADD CONSTRAINT fk_team_lead
    FOREIGN KEY (team_lead_id) REFERENCES employees(id) ON DELETE SET NULL;

-- ============================================
-- 5. INVITATIONS TABLE
-- ============================================
CREATE TABLE invitations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code        text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_by  uuid REFERENCES employees(id) ON DELETE SET NULL,
  role        text NOT NULL DEFAULT 'employee',
  expires_at  timestamptz NOT NULL DEFAULT now() + interval '7 days',
  max_uses    int NOT NULL DEFAULT 1,
  used_count  int NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================
-- 6. INDEXES
-- ============================================
CREATE INDEX idx_companies_owner      ON companies(owner_id);
CREATE INDEX idx_companies_plan       ON companies(plan);
CREATE INDEX idx_teams_company        ON teams(company_id);
CREATE INDEX idx_employees_company    ON employees(company_id);
CREATE INDEX idx_employees_team       ON employees(team_id);
CREATE INDEX idx_employees_user       ON employees(user_id);
CREATE INDEX idx_invitations_code     ON invitations(code);
CREATE INDEX idx_invitations_company  ON invitations(company_id);

-- ============================================
-- 7. AUTO UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 8. FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION validate_invitation(invite_code text)
RETURNS TABLE (
  valid       boolean,
  company_id  uuid,
  role        text,
  message     text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE
      WHEN i.id IS NULL               THEN false
      WHEN i.is_active = false        THEN false
      WHEN i.expires_at < now()       THEN false
      WHEN i.used_count >= i.max_uses THEN false
      ELSE true
    END AS valid,
    i.company_id,
    i.role,
    CASE
      WHEN i.id IS NULL               THEN 'كود غير موجود'
      WHEN i.is_active = false        THEN 'الكود متوقف'
      WHEN i.expires_at < now()       THEN 'الكود منتهي'
      WHEN i.used_count >= i.max_uses THEN 'الكود اتستخدم قبل كده'
      ELSE 'valid'
    END AS message
  FROM invitations i
  WHERE i.code = invite_code;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION use_invitation(invite_code text)
RETURNS boolean AS $$
DECLARE
  invite invitations%ROWTYPE;
BEGIN
  SELECT * INTO invite
  FROM invitations
  WHERE code = invite_code
  FOR UPDATE;

  IF NOT FOUND THEN RETURN false; END IF;
  IF invite.is_active = false THEN RETURN false; END IF;
  IF invite.expires_at < now() THEN RETURN false; END IF;
  IF invite.used_count >= invite.max_uses THEN RETURN false; END IF;

  UPDATE invitations
  SET
    used_count = used_count + 1,
    is_active  = CASE
                   WHEN used_count + 1 >= max_uses THEN false
                   ELSE true
                 END
  WHERE code = invite_code;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. RLS POLICIES
-- ============================================

-- COMPANIES
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated can create company"
ON companies FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "owner can update company"
ON companies FOR UPDATE TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "owner can delete company"
ON companies FOR DELETE TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "employees can view their company"
ON companies FOR SELECT TO authenticated
USING (
  owner_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM employees
    WHERE employees.user_id = auth.uid()
    AND employees.company_id = companies.id
  )
);

-- TEAMS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employees can view their teams"
ON teams FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees
    WHERE employees.user_id = auth.uid()
    AND employees.company_id = teams.company_id
  )
);

CREATE POLICY "admin can manage teams"
ON teams FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees
    WHERE employees.user_id = auth.uid()
    AND employees.company_id = teams.company_id
    AND employees.role IN ('owner', 'admin')
  )
);

-- EMPLOYEES
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employees can view their colleagues"
ON employees FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees e
    WHERE e.user_id = auth.uid()
    AND e.company_id = employees.company_id
  )
);

CREATE POLICY "admin can manage employees"
ON employees FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees e
    WHERE e.user_id = auth.uid()
    AND e.company_id = employees.company_id
    AND e.role IN ('owner', 'admin')
  )
);

-- INVITATIONS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin can manage invitations"
ON invitations FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees
    WHERE employees.user_id = auth.uid()
    AND employees.company_id = invitations.company_id
    AND employees.role IN ('owner', 'admin')
  )
);





ALTER TABLE companies
  ADD CONSTRAINT companies_name_unique UNIQUE (name),
  ADD CONSTRAINT companies_tagline_unique UNIQUE (tagline);