// ============================================
// WORKSPACE
// ============================================
export type WorkspaceType = 'personal' | 'team';

export type Workspace = {
   id: string;
   name: string;
   type: WorkspaceType;
   owner_id: string;
   team_id: string | null;
   company_id: string | null;
   is_active: boolean;
   created_at: string;
   updated_at: string;
};

// ============================================
// TASK
// ============================================
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
   id: string;
   title: string;
   description: string | null;
   status: TaskStatus;
   priority: TaskPriority;
   due_date: string | null;
   workspace_id: string;
   parent_task_id: string | null;
   created_by: string;
   position: number;
   is_active: boolean;
   created_at: string;
   updated_at: string;
};

export type TaskAssignee = {
   task_id: string;
   user_id: string;
   assigned_by: string;
   assigned_at: string;
};

export type TaskComment = {
   id: string;
   task_id: string;
   user_id: string;
   content: string;
   created_at: string;
   updated_at: string;
};

export type TaskAttachment = {
   id: string;
   task_id: string;
   uploaded_by: string;
   file_name: string;
   file_url: string;
   file_size: number | null;
   file_type: string | null;
   created_at: string;
};

// ============================================
// JOINED TYPES
// ============================================
export type TaskWithDetails = Task & {
   assignees: Pick<TaskAssignee, 'user_id' | 'assigned_at'>[];
   comments: TaskComment[];
   attachments: TaskAttachment[];
   sub_tasks: Task[];
};

export type KanbanBoard = {
   todo: Task[];
   in_progress: Task[];
   done: Task[];
};
