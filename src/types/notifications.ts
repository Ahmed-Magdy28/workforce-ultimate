export type NotificationType =
   | 'info'
   | 'success'
   | 'warning'
   | 'approval'
   | 'task'
   | 'system';

export type AppNotification = {
   id: string;
   user_id: string;
   company_id: string | null;
   title: string;
   message: string;
   type: NotificationType;
   link: string | null;
   is_read: boolean;
   created_at: string;
};

export type NotificationPreferences = {
   id: string;
   user_id: string;
   email_notifications: boolean;
   in_app_notifications: boolean;
   task_assigned: boolean;
   time_mod_updates: boolean;
   daily_log_reminders: boolean;
   evaluations: boolean;
   updated_at: string;
};
