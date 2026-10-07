import { supabase } from '@/services/supabase';
import type {
   PerformanceGoal,
   PerformanceReview,
   CreateGoalInput,
   CreateReviewInput,
   GoalStatus,
} from '@/types/performance';

async function getAuthenticatedUser() {
   const {
      data: { user },
      error,
   } = await supabase.auth.getUser();

   if (error || !user) {
      throw new Error('You must be logged in to manage performance');
   }

   return user;
}

export async function getPerformanceGoalsAPI(
   companyId?: string,
   employeeId?: string,
): Promise<PerformanceGoal[]> {
   const user = await getAuthenticatedUser();
   const activeCompanyId =
      companyId ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!activeCompanyId) return [];

   let query = supabase
      .from('performance_goals')
      .select(
         '*, employee:employees!performance_goals_employee_id_fkey(id, full_name, email)',
      )
      .eq('company_id', activeCompanyId)
      .order('created_at', { ascending: false });

   if (employeeId) {
      query = query.eq('employee_id', employeeId);
   }

   const { data, error } = await query;

   if (error) {
      console.error(error);
      throw new Error(`Failed to fetch goals: ${error.message}`);
   }

   return (data as PerformanceGoal[]) || [];
}

export async function createPerformanceGoalAPI(
   input: CreateGoalInput,
): Promise<PerformanceGoal> {
   const user = await getAuthenticatedUser();

   const { data: emp } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_id', input.company_id)
      .maybeSingle();

   const { data, error } = await supabase
      .from('performance_goals')
      .insert({
         company_id: input.company_id,
         employee_id: input.employee_id,
         creator_id: emp?.id || null,
         title: input.title.trim(),
         description: input.description?.trim() || null,
         target_date: input.target_date || null,
         progress: input.progress || 0,
         status: 'in_progress',
      })
      .select(
         '*, employee:employees!performance_goals_employee_id_fkey(id, full_name, email)',
      )
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to create goal: ${error.message}`);
   }

   return data as PerformanceGoal;
}

export async function updateGoalProgressAPI(
   goalId: string,
   progress: number,
   status?: GoalStatus,
): Promise<void> {
   const calculatedStatus =
      status || (progress >= 100 ? 'completed' : 'in_progress');

   const { error } = await supabase
      .from('performance_goals')
      .update({
         progress: Math.min(100, Math.max(0, progress)),
         status: calculatedStatus,
         updated_at: new Date().toISOString(),
      })
      .eq('id', goalId);

   if (error) {
      console.error(error);
      throw new Error(`Failed to update goal: ${error.message}`);
   }
}

export async function getPerformanceReviewsAPI(
   companyId?: string,
   employeeId?: string,
): Promise<PerformanceReview[]> {
   const user = await getAuthenticatedUser();
   const activeCompanyId =
      companyId ||
      (user.user_metadata?.company as string | undefined) ||
      (user.user_metadata?.company_id as string | undefined);

   if (!activeCompanyId) return [];

   let query = supabase
      .from('performance_reviews')
      .select(
         `
         *,
         employee:employees!performance_reviews_employee_id_fkey(id, full_name, email),
         reviewer:employees!performance_reviews_reviewer_id_fkey(id, full_name)
      `,
      )
      .eq('company_id', activeCompanyId)
      .order('created_at', { ascending: false });

   if (employeeId) {
      query = query.eq('employee_id', employeeId);
   }

   const { data, error } = await query;

   if (error) {
      console.error(error);
      throw new Error(`Failed to fetch reviews: ${error.message}`);
   }

   return (data as PerformanceReview[]) || [];
}

export async function createPerformanceReviewAPI(
   input: CreateReviewInput,
): Promise<PerformanceReview> {
   const user = await getAuthenticatedUser();

   const { data: reviewer } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .eq('company_id', input.company_id)
      .maybeSingle();

   if (!reviewer) {
      throw new Error('Current user is not an employee in this company');
   }

   const { data, error } = await supabase
      .from('performance_reviews')
      .insert({
         company_id: input.company_id,
         employee_id: input.employee_id,
         reviewer_id: reviewer.id,
         cycle: input.cycle.trim(),
         rating: input.rating,
         strengths: input.strengths?.trim() || null,
         growth_areas: input.growth_areas?.trim() || null,
         feedback: input.feedback.trim(),
         status: 'completed',
      })
      .select(
         `
         *,
         employee:employees!performance_reviews_employee_id_fkey(id, full_name, email),
         reviewer:employees!performance_reviews_reviewer_id_fkey(id, full_name)
      `,
      )
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to create review: ${error.message}`);
   }

   return data as PerformanceReview;
}
