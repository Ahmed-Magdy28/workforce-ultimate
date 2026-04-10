import { supabase } from '@/services/supabase';
import type { Company, EmployeeRole, EmployeeWithTeam } from '@/types/apis';

export type CreateCompanyInput = {
   name: string;
   industry?: string;
   website?: string;
   workEmail?: string;
   phone?: string;
   country?: string;
   timezone?: string;
   headquarter?: string;
   description?: string;
   tagline?: string;
   logoUrl?: string;
   subscriptionLimit?: number;
   plan?: Company['plan'];
};

export type UpdateCompanyInput = Partial<CreateCompanyInput>;

export type JoinCompanyInput = {
   inviteCode: string;
   fullName: string;
   workEmail: string;
};

export type ValidateInvitationResult = {
   valid: boolean;
   company_id: string | null;
   role: EmployeeRole | null;
   message: string;
};

type CompanyInsertPayload = {
   owner_id: string;
   name: string;
   industry?: string;
   website?: string;
   work_email?: string;
   phone?: string;
   country?: string;
   timezone?: string;
   headquarter?: string;
   description?: string;
   tagline?: string;
   logo_url?: string;
   subscription_limit?: number;
   plan?: Company['plan'];
};

function cleanObject<T extends Record<string, unknown>>(obj: T) {
   return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined),
   ) as Partial<T>;
}

function normalizeOptionalText(value?: string) {
   const trimmed = value?.trim();
   return trimmed ? trimmed : undefined;
}

function formatCompanyMutationError(error: { message: string }) {
   if (error.message.includes('companies_name_unique')) {
      return 'This company name is already in use. Please choose a different name.';
   }

   if (error.message.includes('companies_tagline_unique')) {
      return 'This tagline is already in use. Please choose a different tagline.';
   }

   return error.message;
}

function mapCompanyInputToDbPayload(
   input: UpdateCompanyInput,
): Partial<Omit<CompanyInsertPayload, 'owner_id'>> {
   return cleanObject({
      name: normalizeOptionalText(input.name),
      industry: normalizeOptionalText(input.industry),
      website: normalizeOptionalText(input.website),
      work_email: normalizeOptionalText(input.workEmail),
      phone: normalizeOptionalText(input.phone),
      country: normalizeOptionalText(input.country),
      timezone: normalizeOptionalText(input.timezone),
      headquarter: normalizeOptionalText(input.headquarter),
      description: normalizeOptionalText(input.description),
      tagline: normalizeOptionalText(input.tagline),
      logo_url: normalizeOptionalText(input.logoUrl),
      subscription_limit: input.subscriptionLimit,
      plan: input.plan,
   });
}

async function getAuthenticatedUser() {
   const {
      data: { user },
      error,
   } = await supabase.auth.getUser();

   if (error) {
      console.error(error);
      throw new Error(`Could not get authenticated user: ${error.message}`);
   }

   if (!user) throw new Error('You must be logged in to manage a company');

   return user;
}

async function updateAuthenticatedUserMetadata(
   metadataPatch: Record<string, string>,
) {
   const user = await getAuthenticatedUser();

   const { data, error } = await supabase.auth.updateUser({
      data: {
         ...(user.user_metadata ?? {}),
         ...metadataPatch,
      },
   });

   if (error) {
      console.error(error);
      throw new Error(`Could not update user metadata: ${error.message}`);
   }

   return data.user;
}

export async function getCompaniesAPI() {
   const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

   if (error) {
      console.error(error);
      throw new Error(`Could not fetch companies: ${error.message}`);
   }

   return data as Company[];
}

export async function getCompanyByIdAPI(companyId: string) {
   const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Could not fetch company: ${error.message}`);
   }

   return data as Company;
}

export async function getCurrentUserCompanyAPI() {
   const user = await getAuthenticatedUser();
   const companyId =
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!companyId) return null;

   const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .maybeSingle();

   if (error) {
      console.error(error);
      throw new Error(`Could not fetch current user company: ${error.message}`);
   }

   return (data as Company | null) ?? null;
}

export async function getCurrentCompanyEmployeesAPI() {
   const user = await getAuthenticatedUser();
   const companyId =
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!companyId) return [];

   const { data, error } = await supabase
      .from('employees')
      .select('*, team:teams(id, team_name)')
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

   if (error) {
      console.error(error);
      throw new Error(`Could not fetch company employees: ${error.message}`);
   }

   return data as EmployeeWithTeam[];
}

export async function createCompanyAPI(input: CreateCompanyInput) {
   const payload = mapCompanyInputToDbPayload(input);
   const { data: companyId, error } = await supabase.rpc(
      'create_company_with_owner',
      {
         p_name: input.name.trim(),
         p_industry: payload.industry ?? null,
         p_website: payload.website ?? null,
         p_work_email: payload.work_email ?? null,
         p_phone: payload.phone ?? null,
         p_country: payload.country ?? null,
         p_timezone: payload.timezone ?? null,
         p_headquarter: payload.headquarter ?? null,
         p_description: payload.description ?? null,
         p_tagline: payload.tagline ?? null,
         p_logo_url: payload.logo_url ?? null,
         p_subscription_limit: payload.subscription_limit ?? null,
         p_plan: payload.plan ?? null,
      },
   );

   if (error) {
      console.error(error);
      throw new Error(
         `Could not create company: ${formatCompanyMutationError(error)}`,
      );
   }

   await updateAuthenticatedUserMetadata({
      company: companyId,
      company_id: companyId,
      teamRole: 'owner',
   });

   return getCompanyByIdAPI(companyId);
}

export async function updateCompanyAPI(
   companyId: string,
   updates: UpdateCompanyInput,
) {
   const payload = mapCompanyInputToDbPayload(updates);

   if (Object.keys(payload).length === 0) {
      throw new Error('No company fields were provided for update');
   }

   const { data, error } = await supabase
      .from('companies')
      .update(payload)
      .eq('id', companyId)
      .select()
      .single();

   if (error) {
      console.error(error);
      throw new Error(
         `Could not update company: ${formatCompanyMutationError(error)}`,
      );
   }

   return data as Company;
}

export async function deleteCompanyAPI(companyId: string) {
   const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId);

   if (error) {
      console.error(error);
      throw new Error(`Could not delete company: ${error.message}`);
   }

   return companyId;
}

export async function validateInvitationAPI(inviteCode: string) {
   const normalizedCode = inviteCode.trim().toLowerCase();

   if (!normalizedCode) {
      throw new Error('Invitation code is required');
   }

   const { data, error } = await supabase.rpc('validate_invitation', {
      invite_code: normalizedCode,
   });

   if (error) {
      console.error(error);
      throw new Error(`Could not validate invitation: ${error.message}`);
   }

   const invitation = (data?.[0] as ValidateInvitationResult | undefined) ?? {
      valid: false,
      company_id: null,
      role: null,
      message: 'Invitation code was not found',
   };

   return invitation;
}

export async function joinCompanyWithInvitationAPI(input: JoinCompanyInput) {
   const { data, error } = await supabase.rpc('accept_company_invitation', {
      p_invite_code: input.inviteCode.trim().toLowerCase(),
      p_full_name: input.fullName.trim(),
      p_work_email: input.workEmail.trim().toLowerCase(),
   });

   if (error) {
      console.error(error);
      throw new Error(`Could not join company: ${error.message}`);
   }

   const result = Array.isArray(data) ? data[0] : data;

   if (!result?.company_id || !result?.role || !result?.employee_id) {
      throw new Error('Invitation join did not return a valid result');
   }

   await updateAuthenticatedUserMetadata({
      company: result.company_id,
      company_id: result.company_id,
      teamRole: result.role,
   });

   return {
      companyId: result.company_id as string,
      role: result.role as EmployeeRole,
      employeeId: result.employee_id as string,
   };
}
