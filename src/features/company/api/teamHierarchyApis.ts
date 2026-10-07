import { supabase } from '@/services/supabase';
import type {
   Team,
   TeamWithLead,
   EmployeeRole,
   CompanyJoinRequest,
   Invitation,
} from '@/types/apis';

async function getAuthenticatedUser() {
   const {
      data: { user },
      error,
   } = await supabase.auth.getUser();

   if (error || !user) {
      throw new Error('You must be logged in to perform this action');
   }

   return user;
}

export type TeamHierarchy = TeamWithLead & {
   members: Array<{
      id: string;
      full_name: string;
      email: string | null;
      role: EmployeeRole;
   }>;
};

export async function getTeamsHierarchyAPI(
   companyId?: string,
): Promise<TeamHierarchy[]> {
   const user = await getAuthenticatedUser();
   const activeCompanyId =
      companyId ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!activeCompanyId) return [];

   // Fetch teams
   const { data: teams, error: teamsErr } = await supabase
      .from('teams')
      .select('*, lead:employees!fk_team_lead(id, full_name, email)')
      .eq('company_id', activeCompanyId)
      .order('team_name', { ascending: true });

   if (teamsErr) {
      console.error(teamsErr);
      throw new Error(`Failed to fetch teams: ${teamsErr.message}`);
   }

   // Fetch employees of this company
   const { data: employees, error: empErr } = await supabase
      .from('employees')
      .select('id, full_name, email, role, team_id')
      .eq('company_id', activeCompanyId);

   if (empErr) {
      console.error(empErr);
      throw new Error(`Failed to fetch team members: ${empErr.message}`);
   }

   return (teams || []).map((t) => {
      const members = (employees || [])
         .filter((e) => e.team_id === t.id)
         .map((e) => ({
            id: e.id,
            full_name: e.full_name,
            email: e.email,
            role: e.role as EmployeeRole,
         }));

      return {
         ...t,
         lead: t.lead ?? null,
         members,
         members_count: members.length,
      } as TeamHierarchy;
   });
}

export async function createTeamAPI(
   teamName: string,
   teamLeadId?: string | null,
   companyId?: string,
): Promise<Team> {
   const user = await getAuthenticatedUser();
   const activeCompanyId =
      companyId ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!activeCompanyId) throw new Error('Company ID is required');

   const { data, error } = await supabase
      .from('teams')
      .insert({
         company_id: activeCompanyId,
         team_name: teamName.trim(),
         team_lead_id: teamLeadId || null,
         created_by: user.id,
      })
      .select()
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to create team: ${error.message}`);
   }

   return data as Team;
}

export async function updateTeamLeadAPI(
   teamId: string,
   teamLeadId: string | null,
): Promise<void> {
   const { error } = await supabase
      .from('teams')
      .update({ team_lead_id: teamLeadId, updated_at: new Date().toISOString() })
      .eq('id', teamId);

   if (error) {
      console.error(error);
      throw new Error(`Failed to update team lead: ${error.message}`);
   }
}

export async function getCompanyJoinRequestsAPI(
   companyId?: string,
): Promise<CompanyJoinRequest[]> {
   const user = await getAuthenticatedUser();
   const activeCompanyId =
      companyId ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!activeCompanyId) return [];

   const { data, error } = await supabase
      .from('company_join_requests')
      .select('*')
      .eq('company_id', activeCompanyId)
      .order('created_at', { ascending: false });

   if (error) {
      console.error(error);
      throw new Error(`Failed to fetch join requests: ${error.message}`);
   }

   return (data as CompanyJoinRequest[]) || [];
}

export async function submitCompanyJoinRequestAPI(
   companyId: string,
   desiredRole: string = 'employee',
): Promise<string> {
   const user = await getAuthenticatedUser();
   const fullName =
      (user.user_metadata?.fullName as string | undefined) ||
      user.email?.split('@')[0] ||
      'User';
   const email = user.email || '';

   const { data, error } = await supabase
      .from('company_join_requests')
      .insert({
         company_id: companyId,
         user_id: user.id,
         full_name: fullName,
         email: email,
         desired_role: desiredRole,
         status: 'pending',
      })
      .select('id')
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to submit join request: ${error.message}`);
   }

   return data.id;
}

export async function reviewCompanyJoinRequestAPI(
   requestId: string,
   status: 'approved' | 'rejected',
   assignedRole: EmployeeRole = 'employee',
   assignedTeamId?: string | null,
): Promise<boolean> {
   const { data, error } = await supabase.rpc('review_company_join_request', {
      p_request_id: requestId,
      p_status: status,
      p_assigned_role: assignedRole,
      p_assigned_team_id: assignedTeamId || null,
   });

   if (error) {
      console.error(error);
      throw new Error(`Failed to review join request: ${error.message}`);
   }

   return Boolean(data);
}

export async function createCompanyInviteAPI(
   companyId: string,
   role: EmployeeRole = 'employee',
   maxUses: number = 5,
): Promise<Invitation> {
   const user = await getAuthenticatedUser();

   // Get current employee id
   const { data: emp } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_id', companyId)
      .maybeSingle();

   const { data, error } = await supabase
      .from('invitations')
      .insert({
         company_id: companyId,
         role: role,
         max_uses: maxUses,
         created_by: emp?.id || null,
      })
      .select('*')
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to generate invite code: ${error.message}`);
   }

   return data as Invitation;
}

export async function getCompanyInvitationsAPI(
   companyId?: string,
): Promise<Invitation[]> {
   const user = await getAuthenticatedUser();
   const activeCompanyId =
      companyId ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!activeCompanyId) return [];

   const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('company_id', activeCompanyId)
      .order('created_at', { ascending: false });

   if (error) {
      console.error(error);
      throw new Error(`Failed to fetch invitations: ${error.message}`);
   }

   return (data as Invitation[]) || [];
}

export async function toggleInvitationActiveAPI(
   invitationId: string,
   isActive: boolean,
): Promise<void> {
   const { error } = await supabase
      .from('invitations')
      .update({ is_active: isActive })
      .eq('id', invitationId);

   if (error) {
      console.error(error);
      throw new Error(`Failed to update invitation status: ${error.message}`);
   }
}

export async function deleteInvitationAPI(invitationId: string): Promise<void> {
   const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', invitationId);

   if (error) {
      console.error(error);
      throw new Error(`Failed to delete invitation code: ${error.message}`);
   }
}


