export type DailyWorkLog = {
   id: string;
   company_id: string;
   employee_id: string;
   log_date: string;
   tasks_completed: string;
   hours_worked: number;
   blockers: string | null;
   mood_rating: number | null;
   notes: string | null;
   created_at: string;
   updated_at: string;
   employee?: {
      id: string;
      full_name: string;
      email: string | null;
   } | null;
};

export type CreateDailyWorkLogInput = {
   company_id: string;
   log_date?: string;
   tasks_completed: string;
   hours_worked: number;
   blockers?: string;
   mood_rating?: number;
   notes?: string;
};
