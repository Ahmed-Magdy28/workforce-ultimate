import { supabase } from '@/services/supabase';
import type {
   TimeLog,
   TimeModificationRequestWithDetails,
   CreateTimeModificationRequestInput,
} from '@/types/time';

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

export async function logTaskTimeAPI(
   taskId: string,
   hours: number,
   description?: string,
): Promise<string> {
   if (hours <= 0) {
      throw new Error('Logged hours must be greater than 0');
   }

   const { data, error } = await supabase.rpc('log_task_time', {
      p_task_id: taskId,
      p_hours: hours,
      p_description: description?.trim() || null,
   });

   if (error) {
      console.error(error);
      throw new Error(`Failed to log time: ${error.message}`);
   }

   return data as string;
}

export async function getTaskTimeLogsAPI(taskId: string): Promise<TimeLog[]> {
   const { data, error } = await supabase
      .from('time_logs')
      .select('*')
      .eq('task_id', taskId)
      .order('logged_at', { ascending: false });

   if (error) {
      console.error(error);
      throw new Error(`Failed to fetch time logs: ${error.message}`);
   }

   return (data as TimeLog[]) || [];
}

export async function submitTimeModificationRequestAPI(
   input: CreateTimeModificationRequestInput,
): Promise<string> {
   const user = await getAuthenticatedUser();

   // Get employee id
   const { data: emp, error: empErr } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_id', input.company_id)
      .maybeSingle();

   if (empErr || !emp) {
      throw new Error('Current user is not an employee in this company');
   }

   const { data, error } = await supabase
      .from('time_modification_requests')
      .insert({
         company_id: input.company_id,
         task_id: input.task_id,
         employee_id: emp.id,
         requested_hours: input.requested_hours,
         current_hours: input.current_hours,
         type: input.type,
         reason: input.reason.trim(),
         status: 'pending',
      })
      .select('id')
      .single();

   if (error) {
      console.error(error);
      throw new Error(
         `Failed to submit modification request: ${error.message}`,
      );
   }

   return data.id;
}

export async function getTimeModificationRequestsAPI(
   companyId?: string,
): Promise<TimeModificationRequestWithDetails[]> {
   const user = await getAuthenticatedUser();
   const activeCompanyId =
      companyId ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!activeCompanyId) return [];

   const { data, error } = await supabase
      .from('time_modification_requests')
      .select(
         `
         *,
         task:tasks(id, title),
         employee:employees!time_modification_requests_employee_id_fkey(id, full_name, email),
         reviewer:employees!time_modification_requests_reviewed_by_fkey(id, full_name)
      `,
      )
      .eq('company_id', activeCompanyId)
      .order('created_at', { ascending: false });

   if (error) {
      console.error(error);
      throw new Error(
         `Failed to fetch time modification requests: ${error.message}`,
      );
   }

   return (data as TimeModificationRequestWithDetails[]) || [];
}

export async function reviewTimeModificationRequestAPI(
   requestId: string,
   status: 'approved' | 'rejected',
   reviewerFeedback?: string,
): Promise<boolean> {
   const { data, error } = await supabase.rpc(
      'review_time_modification_request',
      {
         p_request_id: requestId,
         p_status: status,
         p_reviewer_feedback: reviewerFeedback?.trim() || null,
      },
   );

   if (error) {
      console.error(error);
      throw new Error(
         `Failed to review time modification request: ${error.message}`,
      );
   }

   return Boolean(data);
}
