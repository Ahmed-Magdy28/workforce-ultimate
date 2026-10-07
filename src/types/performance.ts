export type GoalStatus =
   | 'not_started'
   | 'in_progress'
   | 'completed'
   | 'cancelled';

export type PerformanceGoal = {
   id: string;
   company_id: string;
   employee_id: string;
   creator_id: string | null;
   title: string;
   description: string | null;
   progress: number;
   target_date: string | null;
   status: GoalStatus;
   created_at: string;
   updated_at: string;
   employee?: {
      id: string;
      full_name: string;
      email: string | null;
   } | null;
};

export type PerformanceReview = {
   id: string;
   company_id: string;
   employee_id: string;
   reviewer_id: string;
   cycle: string;
   rating: number;
   strengths: string | null;
   growth_areas: string | null;
   feedback: string;
   status: 'draft' | 'submitted' | 'completed';
   created_at: string;
   updated_at: string;
   employee?: {
      id: string;
      full_name: string;
      email: string | null;
   } | null;
   reviewer?: {
      id: string;
      full_name: string;
   } | null;
};

export type CreateGoalInput = {
   company_id: string;
   employee_id: string;
   title: string;
   description?: string;
   target_date?: string;
   progress?: number;
};

export type CreateReviewInput = {
   company_id: string;
   employee_id: string;
   cycle: string;
   rating: number;
   strengths?: string;
   growth_areas?: string;
   feedback: string;
};
