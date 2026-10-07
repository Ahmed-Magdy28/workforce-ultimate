export type TaskStatus =
   | 'todo'
   | 'in_progress'
   | 'in_review'
   | 'done'
   | 'blocked';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Task = {
   id: string;
   title: string;
   description: string | null;
   status: TaskStatus;
   priority: TaskPriority;
   due_date: string | null;
   company_id: string | null;
   project_id: string | null;
   workspace_id?: string | null;
   parent_task_id?: string | null;
   assigned_to: string | null;
   created_by: string;
   estimated_hours: number;
   logged_hours: number;
   position: number;
   is_active: boolean;
   created_at: string;
   updated_at: string;
};

export type TaskWithDetails = Task & {
   project?: {
      id: string;
      name: string;
   } | null;
   assignee?: {
      id: string;
      full_name: string;
      email: string | null;
   } | null;
};

export type CreateTaskInput = {
   company_id?: string | null;
   project_id?: string | null;
   workspace_id?: string | null;
   title: string;
   description?: string | null;
   status?: TaskStatus;
   priority?: TaskPriority;
   due_date?: string | null;
   assigned_to?: string | null;
   estimated_hours?: number;
   position?: number;
};

export type UpdateTaskInput = Partial<CreateTaskInput>;
