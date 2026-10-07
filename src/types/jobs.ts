export type JobStatus =
   | 'queued'
   | 'processing'
   | 'completed'
   | 'failed'
   | 'cancelled';
export type JobPriority = 'low' | 'normal' | 'high' | 'critical';
export type JobType =
   | 'generate_weekly_report'
   | 'cleanup_expired_invitations'
   | 'sync_integrations'
   | 'evaluate_monthly_kpis'
   | 'backup_workspace_data'
   | 'send_scheduled_notifications';

export type BackgroundJob = {
   id: string;
   company_id: string;
   job_type: JobType;
   status: JobStatus;
   priority: JobPriority;
   payload: Record<string, unknown>;
   result?: Record<string, unknown> | null;
   error_message?: string | null;
   retry_count: number;
   max_retries: number;
   scheduled_at: string;
   started_at?: string | null;
   completed_at?: string | null;
   created_by?: string | null;
   created_at: string;
};

export type JobLog = {
   id: string;
   job_id: string;
   level: 'info' | 'warn' | 'error' | 'debug';
   message: string;
   details?: Record<string, unknown> | null;
   created_at: string;
};
