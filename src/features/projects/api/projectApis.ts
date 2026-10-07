import { supabase } from '@/services/supabase';
import type {
   ProjectWithDetails,
   CreateProjectInput,
   UpdateProjectInput,
} from '@/types/project';

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

export async function getProjectsAPI(
   companyId?: string,
): Promise<ProjectWithDetails[]> {
   const user = await getAuthenticatedUser();
   const activeCompanyId =
      companyId ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!activeCompanyId) return [];

   const { data, error } = await supabase
      .from('projects')
      .select(
         `
         *,
         team:teams(id, team_name),
         manager:employees!projects_manager_id_fkey(id, full_name, email)
      `,
      )
      .eq('company_id', activeCompanyId)
      .order('created_at', { ascending: false });

   if (error) {
      console.error(error);
      throw new Error(`Failed to fetch projects: ${error.message}`);
   }

   return (data as ProjectWithDetails[]) || [];
}

export async function createProjectAPI(
   input: CreateProjectInput,
): Promise<ProjectWithDetails> {
   const user = await getAuthenticatedUser();

   const { data, error } = await supabase
      .from('projects')
      .insert({
         company_id: input.company_id,
         team_id: input.team_id ?? null,
         manager_id: input.manager_id ?? null,
         name: input.name.trim(),
         description: input.description?.trim() || null,
         status: input.status || 'planning',
         priority: input.priority || 'medium',
         budget: input.budget || 0,
         start_date: input.start_date || null,
         due_date: input.due_date || null,
         created_by: user.id,
      })
      .select(
         `
         *,
         team:teams(id, team_name),
         manager:employees!projects_manager_id_fkey(id, full_name, email)
      `,
      )
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to create project: ${error.message}`);
   }

   return data as ProjectWithDetails;
}

export async function updateProjectAPI(
   projectId: string,
   input: UpdateProjectInput,
): Promise<ProjectWithDetails> {
   const { data, error } = await supabase
      .from('projects')
      .update({
         ...input,
         updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select(
         `
         *,
         team:teams(id, team_name),
         manager:employees!projects_manager_id_fkey(id, full_name, email)
      `,
      )
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to update project: ${error.message}`);
   }

   return data as ProjectWithDetails;
}

export async function deleteProjectAPI(projectId: string): Promise<string> {
   const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

   if (error) {
      console.error(error);
      throw new Error(`Failed to delete project: ${error.message}`);
   }

   return projectId;
}

