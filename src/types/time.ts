export type TimeLog = {
   id: string;
   task_id: string;
   employee_id: string;
   company_id: string;
   hours: number;
   description: string | null;
   logged_at: string;
   created_at: string;
};

export type TimeModificationRequestType =
   | 'estimate_change'
   | 'log_adjustment';

export type TimeModificationRequestStatus =
   | 'pending'
   | 'approved'
   | 'rejected';

export type TimeModificationRequest = {
   id: string;
   company_id: string;
   task_id: string;
   employee_id: string;
   requested_hours: number;
   current_hours: number;
   type: TimeModificationRequestType;
   reason: string;
   status: TimeModificationRequestStatus;
   reviewed_by: string | null;
   reviewed_at: string | null;
   reviewer_feedback: string | null;
   created_at: string;
   updated_at: string;
};

export type TimeModificationRequestWithDetails = TimeModificationRequest & {
   task?: {
      id: string;
      title: string;
   } | null;
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

export type CreateTimeLogInput = {
   task_id: string;
   company_id: string;
   hours: number;
   description?: string;
   logged_at?: string;
};

export type CreateTimeModificationRequestInput = {
   task_id: string;
   company_id: string;
   requested_hours: number;
   current_hours: number;
   type: TimeModificationRequestType;
   reason: string;
};

