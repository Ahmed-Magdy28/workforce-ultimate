export type TaskAttachment = {
   id: string;
   task_id: string;
   company_id?: string | null;
   file_name: string;
   file_url: string;
   file_size: number;
   file_type: string;
   uploaded_by: string;
   created_at: string;
   uploader?: {
      id: string;
      full_name: string;
      email: string;
      avatar?: string | null;
   };
};

export type TaskComment = {
   id: string;
   task_id: string;
   company_id?: string | null;
   user_id: string;
   content: string;
   mentions: string[];
   created_at: string;
   updated_at: string;
   author?: {
      id: string;
      full_name: string;
      email: string;
      avatar?: string | null;
   };
};

export type ActivityLog = {
   id: string;
   company_id: string;
   user_id: string | null;
   entity_type:
      | 'task'
      | 'project'
      | 'comment'
      | 'member'
      | 'hr'
      | 'integration'
      | 'chat'
      | 'system';
   entity_id: string | null;
   action: string;
   details: Record<string, unknown>;
   created_at: string;
   actor?: {
      full_name: string;
      email: string;
      avatar?: string | null;
   };
};

export type HRActionType = 'bonus' | 'warning' | 'recognition';
export type HRActionSeverity = 'low' | 'standard' | 'high' | 'critical';
export type HRActionStatus = 'active' | 'acknowledged' | 'resolved' | 'revoked';

export type HRAction = {
   id: string;
   company_id: string;
   employee_id: string;
   issuer_id: string;
   type: HRActionType;
   title: string;
   amount: number;
   reason: string;
   severity: HRActionSeverity;
   status: HRActionStatus;
   created_at: string;
   updated_at: string;
   employee?: {
      id: string;
      full_name: string;
      email: string;
      position?: string | null;
   };
   issuer?: {
      id: string;
      full_name: string;
      email: string;
   };
};

export type IntegrationProvider = 'github' | 'gmail' | 'slack' | 'webhook';
export type IntegrationStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

export type WorkspaceIntegration = {
   id: string;
   company_id: string;
   provider: IntegrationProvider;
   status: IntegrationStatus;
   config: Record<string, unknown>;
   connected_by: string;
   last_sync_at: string | null;
   created_at: string;
   updated_at: string;
};

export type ChannelType = 'public' | 'private' | 'managers' | 'direct';

export type ChatChannel = {
   id: string;
   company_id: string;
   name: string;
   description?: string | null;
   channel_type?: ChannelType;
   is_direct: boolean;
   created_by: string;
   created_at: string;
   member_ids?: string[];
   unread_count?: number;
};

export type ChatMessage = {
   id: string;
   channel_id: string;
   user_id: string;
   message: string;
   attachments?: {
      name: string;
      url: string;
      size: number;
      type: string;
   }[];
   is_pinned: boolean;
   created_at: string;
   updated_at: string;
   sender?: {
      id: string;
      full_name: string;
      role?: string;
      email: string;
      avatar?: string | null;
   };
};

