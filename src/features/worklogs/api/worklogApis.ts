import { supabase } from '@/services/supabase';
import type { DailyWorkLog, CreateDailyWorkLogInput } from '@/types/worklogs';

async function getAuthenticatedUser() {
   const {
      data: { user },
      error,
   } = await supabase.auth.getUser();

   if (error || !user) {
      throw new Error('You must be logged in to manage work logs');
   }

   return user;
}

export async function getDailyWorkLogsAPI(
   companyId?: string,
   employeeId?: string,
): Promise<DailyWorkLog[]> {
   const user = await getAuthenticatedUser();
   const activeCompanyId =
      companyId ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!activeCompanyId) return [];

   let query = supabase
      .from('daily_work_logs')
      .select(
         '*, employee:employees!daily_work_logs_employee_id_fkey(id, full_name, email)',
      )
      .eq('company_id', activeCompanyId)
      .order('log_date', { ascending: false });

   if (employeeId) {
      query = query.eq('employee_id', employeeId);
   }

   const { data, error } = await query;

   if (error) {
      console.error(error);
      throw new Error(`Failed to fetch daily work logs: ${error.message}`);
   }

   return (data as DailyWorkLog[]) || [];
}

export async function submitDailyWorkLogAPI(
   input: CreateDailyWorkLogInput,
): Promise<DailyWorkLog> {
   const user = await getAuthenticatedUser();

   const { data: emp } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_id', input.company_id)
      .maybeSingle();

   if (!emp) {
      throw new Error('Current user is not an employee in this company');
   }

   const logDate = input.log_date || new Date().toISOString().split('T')[0];

   const { data, error } = await supabase
      .from('daily_work_logs')
      .insert({
         company_id: input.company_id,
         employee_id: emp.id,
         log_date: logDate,
         tasks_completed: input.tasks_completed.trim(),
         hours_worked: input.hours_worked,
         blockers: input.blockers?.trim() || null,
         mood_rating: input.mood_rating || null,
         notes: input.notes?.trim() || null,
      })
      .select(
         '*, employee:employees!daily_work_logs_employee_id_fkey(id, full_name, email)',
      )
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to submit daily work log: ${error.message}`);
   }

   return data as DailyWorkLog;
}
