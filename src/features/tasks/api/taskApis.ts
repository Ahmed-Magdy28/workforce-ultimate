import { supabase } from '@/services/supabase';
import type {
   TaskWithDetails,
   CreateTaskInput,
   UpdateTaskInput,
   TaskStatus,
} from '@/types/task';

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

export type TaskFilters = {
   companyId?: string;
   projectId?: string;
   assignedTo?: string;
   status?: TaskStatus;
};

export async function getTasksAPI(
   filters: TaskFilters = {},
): Promise<TaskWithDetails[]> {
   const user = await getAuthenticatedUser();
   const companyId =
      filters.companyId ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   let query = supabase
      .from('tasks')
      .select(
         `
         *,
         project:projects(id, name),
         assignee:employees!tasks_assigned_to_fkey(id, full_name, email)
      `,
      )
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });

   if (companyId) {
      query = query.eq('company_id', companyId);
   }

   if (filters.projectId) {
      query = query.eq('project_id', filters.projectId);
   }

   if (filters.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
   }

   if (filters.status) {
      query = query.eq('status', filters.status);
   }

   const { data, error } = await query;

   if (error) {
      console.error(error);
      throw new Error(`Failed to fetch tasks: ${error.message}`);
   }

   return (data as TaskWithDetails[]) || [];
}

export async function createTaskAPI(
   input: CreateTaskInput,
): Promise<TaskWithDetails> {
   const user = await getAuthenticatedUser();
   const companyId =
      input.company_id ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   const { data, error } = await supabase
      .from('tasks')
      .insert({
         title: input.title.trim(),
         description: input.description?.trim() || null,
         status: input.status || 'todo',
         priority: input.priority || 'medium',
         due_date: input.due_date || null,
         company_id: companyId || null,
         project_id: input.project_id || null,
         workspace_id: input.workspace_id || null,
         assigned_to: input.assigned_to || null,
         estimated_hours: input.estimated_hours || 0,
         position: input.position || 0,
         created_by: user.id,
      })
      .select(
         `
         *,
         project:projects(id, name),
         assignee:employees!tasks_assigned_to_fkey(id, full_name, email)
      `,
      )
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to create task: ${error.message}`);
   }

   return data as TaskWithDetails;
}

export async function updateTaskAPI(
   taskId: string,
   input: UpdateTaskInput,
): Promise<TaskWithDetails> {
   const { data, error } = await supabase
      .from('tasks')
      .update({
         ...input,
         updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select(
         `
         *,
         project:projects(id, name),
         assignee:employees!tasks_assigned_to_fkey(id, full_name, email)
      `,
      )
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to update task: ${error.message}`);
   }

   return data as TaskWithDetails;
}

export async function updateTaskStatusAPI(
   taskId: string,
   status: TaskStatus,
): Promise<TaskWithDetails> {
   return updateTaskAPI(taskId, { status });
}

export async function deleteTaskAPI(taskId: string): Promise<string> {
   const { error } = await supabase.from('tasks').delete().eq('id', taskId);

   if (error) {
      console.error(error);
      throw new Error(`Failed to delete task: ${error.message}`);
   }

   return taskId;
}

