// ============================================
// ENUMS
// ============================================
export type CompanyPlan = 'free' | 'pro' | 'enterprise';

export type EmployeeRole = 'owner' | 'admin' | 'hr' | 'manager' | 'employee';

// ============================================
// COMPANY
// ============================================
export type Company = {
   id: string;
   owner_id: string;
   name: string;
   industry: string | null;
   subscription_limit: number;
   logo_url: string | null;
   website: string | null;
   work_email: string | null;
   phone: string | null;
   country: string | null;
   timezone: string;
   headquarter: string | null;
   description: string | null;
   tagline: string | null;
   is_active: boolean;
   plan: CompanyPlan;
   regional_manager_id: string | null;
   hr_id: string | null;
   created_at: string;
   updated_at: string;
};

// ============================================
// TEAM
// ============================================
export type Team = {
   id: string;
   created_at: string;
   updated_at: string;
   created_by: string | null;
   team_name: string;
   company_id: string;
   team_lead_id: string | null;
};

// ============================================
// EMPLOYEE
// ============================================
export type Employee = {
   id: string;
   created_at: string;
   updated_at: string;
   full_name: string;
   email: string | null;
   role: EmployeeRole;
   company_id: string;
   team_id: string | null;
   user_id: string | null;
};

// ============================================
// INVITATION
// ============================================
export type Invitation = {
   id: string;
   company_id: string;
   code: string;
   created_by: string | null;
   role: EmployeeRole;
   expires_at: string;
   max_uses: number;
   used_count: number;
   is_active: boolean;
   created_at: string;
};

// ============================================
// JOINED TYPES (للاستخدام مع Supabase select)
// ============================================
export type TeamWithLead = Team & {
   lead: Pick<Employee, 'id' | 'full_name' | 'email'> | null;
};

export type EmployeeWithTeam = Employee & {
   team: Pick<Team, 'id' | 'team_name'> | null;
};

export type CompanyWithDetails = Company & {
   regional_manager: Pick<Employee, 'id' | 'full_name' | 'email'> | null;
   hr: Pick<Employee, 'id' | 'full_name' | 'email'> | null;
};
