import { supabase } from '@/services/supabase';
import type {
   AppNotification,
   NotificationPreferences,
} from '@/types/notifications';

async function getAuthenticatedUser() {
   const {
      data: { user },
      error,
   } = await supabase.auth.getUser();

   if (error || !user) {
      throw new Error('You must be logged in to access notifications');
   }

   return user;
}

export async function getNotificationsAPI(): Promise<AppNotification[]> {
   const user = await getAuthenticatedUser();

   const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30);

   if (error) {
      console.error(error);
      throw new Error(`Failed to fetch notifications: ${error.message}`);
   }

   return (data as AppNotification[]) || [];
}

export async function markNotificationReadAPI(
   notificationId: string,
): Promise<void> {
   const { error } = await supabase.rpc('mark_notification_read', {
      p_notification_id: notificationId,
   });

   if (error) {
      // Fallback to direct update
      await supabase
         .from('notifications')
         .update({ is_read: true })
         .eq('id', notificationId);
   }
}

export async function markAllNotificationsReadAPI(): Promise<void> {
   const user = await getAuthenticatedUser();

   const { error } = await supabase.rpc('mark_all_notifications_read');

   if (error) {
      // Fallback
      await supabase
         .from('notifications')
         .update({ is_read: true })
         .eq('user_id', user.id);
   }
}

export async function getNotificationPreferencesAPI(): Promise<NotificationPreferences> {
   const user = await getAuthenticatedUser();

   const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

   if (error) {
      console.error(error);
   }

   if (data) return data as NotificationPreferences;

   // Default preferences
   return {
      id: 'default',
      user_id: user.id,
      email_notifications: true,
      in_app_notifications: true,
      task_assigned: true,
      time_mod_updates: true,
      daily_log_reminders: true,
      evaluations: true,
      updated_at: new Date().toISOString(),
   };
}

export async function updateNotificationPreferencesAPI(
   prefs: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
   const user = await getAuthenticatedUser();

   const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
         user_id: user.id,
         ...prefs,
         updated_at: new Date().toISOString(),
      })
      .select()
      .single();

   if (error) {
      console.error(error);
      throw new Error(`Failed to save preferences: ${error.message}`);
   }

   return data as NotificationPreferences;
}
