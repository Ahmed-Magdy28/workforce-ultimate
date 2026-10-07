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
   fullName?: string;
   workEmail?: string;
};

export type ValidateInvitationResult = {
   valid: boolean;
   company_id: string | null;
   company_name?: string | null;
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
      .select('*, team:teams!employees_team_id_fkey(id, team_name)')
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

export async function validateInvitationAPI(inviteCode: string): Promise<ValidateInvitationResult> {
   const normalizedCode = inviteCode.trim().toLowerCase();

   if (!normalizedCode) {
      throw new Error('Invitation code is required');
   }

   // 1. First try the RPC function validate_invitation
   try {
      const { data, error } = await supabase.rpc('validate_invitation', {
         invite_code: normalizedCode,
      });

      if (!error && Array.isArray(data) && data.length > 0) {
         const row = data[0];
         return {
            valid: Boolean(row.valid),
            company_id: row.company_id || null,
            company_name: row.company_name || null,
            role: (row.role as EmployeeRole) || null,
            message: row.message || (row.valid ? 'valid' : 'Invitation code is not valid'),
         };
      }
   } catch (rpcErr) {
      console.warn('validate_invitation RPC warning:', rpcErr);
   }

   // 2. Direct fallback query against public.invitations with company info
   const { data: invite, error: inviteError } = await supabase
      .from('invitations')
      .select('id, company_id, role, is_active, expires_at, max_uses, used_count, companies(name)')
      .eq('code', normalizedCode)
      .maybeSingle();

   if (inviteError) {
      console.error('Error fetching invitation directly:', inviteError);
   }

   if (!invite) {
      return {
         valid: false,
         company_id: null,
         company_name: null,
         role: null,
         message: 'Invitation code was not found. Please verify the code or ask your admin.',
      };
   }

   const companyName = (invite as { companies?: { name?: string } | null })?.companies?.name ?? null;

   if (!invite.is_active) {
      return {
         valid: false,
         company_id: invite.company_id,
         company_name: companyName,
         role: invite.role as EmployeeRole,
         message: 'This invitation code is currently inactive or deactivated.',
      };
   }

   if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return {
         valid: false,
         company_id: invite.company_id,
         company_name: companyName,
         role: invite.role as EmployeeRole,
         message: 'This invitation code has expired.',
      };
   }

   if (invite.used_count >= invite.max_uses) {
      return {
         valid: false,
         company_id: invite.company_id,
         company_name: companyName,
         role: invite.role as EmployeeRole,
         message: 'This invitation code has reached its maximum number of redemptions.',
      };
   }

   return {
      valid: true,
      company_id: invite.company_id,
      company_name: companyName,
      role: invite.role as EmployeeRole,
      message: 'valid',
   };
}

export async function joinCompanyWithInvitationAPI(input: JoinCompanyInput) {
   const cleanCode = input.inviteCode.trim().toLowerCase();

   const {
      data: { user },
      error: userError,
   } = await supabase.auth.getUser();

   if (userError || !user) {
      throw new Error('You must be logged in to join a company');
   }

   const userMetaName =
      (user.user_metadata?.fullName as string | undefined) ||
      (user.user_metadata?.full_name as string | undefined) ||
      '';
   const userEmail = user.email || '';
   const cleanName = (input.fullName?.trim() || userMetaName || userEmail.split('@')[0] || 'Team Member').trim();
   const cleanEmail = (input.workEmail?.trim().toLowerCase() || userEmail).trim().toLowerCase();

   // 1. Try RPC function accept_company_invitation
   const { data, error } = await supabase.rpc('accept_company_invitation', {
      p_invite_code: cleanCode,
      p_full_name: cleanName,
      p_work_email: cleanEmail,
   });

   if (!error && data) {
      const result = Array.isArray(data) ? data[0] : data;
      if (result?.company_id && result?.role && result?.employee_id) {
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
   }

   // 2. Fallback: Direct table execution if RPC function is missing from Supabase
   console.warn('accept_company_invitation RPC failed or missing, trying direct fallback:', error?.message);

   // Find the invitation
   const { data: invite, error: fetchError } = await supabase
      .from('invitations')
      .select('*')
      .eq('code', cleanCode)
      .maybeSingle();

   if (fetchError || !invite) {
      throw new Error('Invitation code was not found');
   }

   if (!invite.is_active) {
      throw new Error('This invitation code is inactive or revoked');
   }

   if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      throw new Error('This invitation code has expired');
   }

   if (invite.used_count >= invite.max_uses) {
      throw new Error('This invitation code has reached its maximum uses');
   }

   // Upsert employee record
   const { data: existingEmp } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_id', invite.company_id)
      .maybeSingle();

   let empId = existingEmp?.id;

   if (!empId) {
      const { data: newEmp, error: insertError } = await supabase
         .from('employees')
         .insert({
            full_name: cleanName,
            email: cleanEmail,
            role: invite.role,
            company_id: invite.company_id,
            user_id: user.id,
         })
         .select('id')
         .single();

      if (insertError) {
         console.error('Failed to create employee record:', insertError);
         throw new Error(`Failed to join company: ${insertError.message}`);
      }
      empId = newEmp.id;
   }

   // Update invitation used count
   const newUsedCount = (invite.used_count || 0) + 1;
   await supabase
      .from('invitations')
      .update({
         used_count: newUsedCount,
         is_active: newUsedCount < invite.max_uses,
      })
      .eq('id', invite.id);

   await updateAuthenticatedUserMetadata({
      company: invite.company_id,
      company_id: invite.company_id,
      teamRole: invite.role,
   });

   return {
      companyId: invite.company_id as string,
      role: invite.role as EmployeeRole,
      employeeId: empId as string,
   };
}
