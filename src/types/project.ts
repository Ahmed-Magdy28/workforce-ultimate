export type ProjectStatus =
   | 'planning'
   | 'active'
   | 'on_hold'
   | 'completed'
   | 'cancelled';

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Project = {
   id: string;
   company_id: string;
   team_id: string | null;
   manager_id: string | null;
   name: string;
   description: string | null;
   status: ProjectStatus;
   priority: ProjectPriority;
   budget: number;
   start_date: string | null;
   due_date: string | null;
   created_by: string | null;
   created_at: string;
   updated_at: string;
};

export type ProjectWithDetails = Project & {
   team?: {
      id: string;
      team_name: string;
   } | null;
   manager?: {
      id: string;
      full_name: string;
      email: string | null;
   } | null;
   task_count?: number;
   completed_task_count?: number;
};

export type CreateProjectInput = {
   company_id: string;
   name: string;
   description?: string;
   team_id?: string | null;
   manager_id?: string | null;
   status?: ProjectStatus;
   priority?: ProjectPriority;
   budget?: number;
   start_date?: string | null;
   due_date?: string | null;
};

export type UpdateProjectInput = Partial<CreateProjectInput>;
