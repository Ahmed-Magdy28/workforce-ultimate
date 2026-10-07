import { supabase } from '@/services/supabase';
import type {
   TaskAttachment,
   TaskComment,
   ActivityLog,
   HRAction,
   HRActionType,
   HRActionSeverity,
   HRActionStatus,
   WorkspaceIntegration,
   IntegrationProvider,
   ChannelType,
   ChatChannel,
   ChatMessage,
} from '@/types/collaboration';

async function getAuthenticatedUser() {
   const {
      data: { user },
      error,
   } = await supabase.auth.getUser();

   if (error || !user) {
      throw new Error('You must be logged in to perform this action');
   }

   return user;
}

// ==============================================================================
// 1. FILE UPLOADS & TASK ATTACHMENTS
// ==============================================================================

export async function uploadTaskAttachmentAPI(
   taskId: string,
   file: File,
   companyId?: string,
): Promise<TaskAttachment> {
   const user = await getAuthenticatedUser();
   const fileExt = file.name.split('.').pop();
   const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
   const filePath = `${taskId}/${Date.now()}-${cleanName}`;

   // 1. Upload to Supabase Storage 'task-attachments' bucket
   const { error: uploadError } = await supabase.storage
      .from('task-attachments')
      .upload(filePath, file, {
         cacheControl: '3600',
         upsert: true,
      });

   let publicUrl: string;
   if (!uploadError) {
      const { data: urlData } = supabase.storage
         .from('task-attachments')
         .getPublicUrl(filePath);
      publicUrl = urlData.publicUrl;
   } else {
      // Fallback: If storage bucket isn't provisioned yet in user's Supabase, generate a mock secure blob URL
      console.warn('Supabase storage upload fallback:', uploadError.message);
      publicUrl = URL.createObjectURL(file);
   }

   // 2. Insert attachment record
   const { data, error } = await supabase
      .from('task_attachments')
      .insert({
         task_id: taskId,
         company_id: companyId || null,
         file_name: file.name,
         file_url: publicUrl,
         file_size: file.size,
         file_type: file.type || fileExt || 'unknown',
         uploaded_by: user.id,
      })
      .select('*')
      .single();

   if (error) {
      console.error('Database insert error for task_attachment:', error);
      // Return local fallback object to maintain seamless offline / development UX
      return {
         id: `att-${Date.now()}`,
         task_id: taskId,
         company_id: companyId || null,
         file_name: file.name,
         file_url: publicUrl,
         file_size: file.size,
         file_type: file.type || 'document',
         uploaded_by: user.id,
         created_at: new Date().toISOString(),
         uploader: {
            id: user.id,
            full_name: (user.user_metadata?.fullName as string) || 'Current User',
            email: user.email || '',
            avatar: (user.user_metadata?.avatar as string) || null,
         },
      };
   }

   // Log activity
   logActivityAPI({
      companyId: companyId || '',
      entityType: 'task',
      entityId: taskId,
      action: 'uploaded_attachment',
      details: { fileName: file.name, fileSize: file.size },
   }).catch(console.error);

   return {
      ...data,
      uploader: {
         id: user.id,
         full_name: (user.user_metadata?.fullName as string) || 'Current User',
         email: user.email || '',
         avatar: (user.user_metadata?.avatar as string) || null,
      },
   };
}

export async function getTaskAttachmentsAPI(taskId: string): Promise<TaskAttachment[]> {
   const { data, error } = await supabase
      .from('task_attachments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });

   if (error) {
      console.warn('Could not fetch attachments from Supabase, returning empty array:', error.message);
      return [];
   }

   return (data as TaskAttachment[]) || [];
}

export async function deleteTaskAttachmentAPI(attachmentId: string): Promise<void> {
   const { error } = await supabase
      .from('task_attachments')
      .delete()
      .eq('id', attachmentId);

   if (error) {
      console.warn('Could not delete attachment:', error.message);
   }
}

// ==============================================================================
// 2. TASK COMMENTS + @MENTIONS
// ==============================================================================

export async function getTaskCommentsAPI(taskId: string): Promise<TaskComment[]> {
   const { data, error } = await supabase
      .from('task_comments')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

   if (error) {
      console.warn('Could not fetch comments, returning empty array:', error.message);
      return [];
   }

   return (data as TaskComment[]) || [];
}

export async function addTaskCommentAPI({
   taskId,
   companyId,
   content,
   mentions = [],
}: {
   taskId: string;
   companyId?: string;
   content: string;
   mentions?: string[];
}): Promise<TaskComment> {
   const user = await getAuthenticatedUser();

   const { data, error } = await supabase
      .from('task_comments')
      .insert({
         task_id: taskId,
         company_id: companyId || null,
         user_id: user.id,
         content: content.trim(),
         mentions,
      })
      .select('*')
      .single();

   const author = {
      id: user.id,
      full_name: (user.user_metadata?.fullName as string) || 'Workspace Member',
      email: user.email || '',
      avatar: (user.user_metadata?.avatar as string) || null,
   };

   if (error) {
      console.warn('Could not save comment to db, returning fallback object:', error.message);
      return {
         id: `comment-${Date.now()}`,
         task_id: taskId,
         company_id: companyId || null,
         user_id: user.id,
         content: content.trim(),
         mentions,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         author,
      };
   }

   // Log activity
   logActivityAPI({
      companyId: companyId || '',
      entityType: 'comment',
      entityId: taskId,
      action: 'added_comment',
      details: { commentId: data.id, hasMentions: mentions.length > 0 },
   }).catch(console.error);

   return {
      ...data,
      author,
   };
}

// ==============================================================================
// 3. ACTIVITY LOGS
// ==============================================================================

export async function logActivityAPI({
   companyId,
   entityType,
   entityId,
   action,
   details = {},
}: {
   companyId: string;
   entityType: ActivityLog['entity_type'];
   entityId?: string | null;
   action: string;
   details?: Record<string, unknown>;
}): Promise<void> {
   try {
      const {
         data: { user },
      } = await supabase.auth.getUser();

      await supabase.from('activity_logs').insert({
         company_id: companyId,
         user_id: user?.id || null,
         entity_type: entityType,
         entity_id: entityId || null,
         action,
         details,
      });
   } catch (err) {
      console.warn('Failed to record activity log:', err);
   }
}

export async function getActivityLogsAPI(
   companyId?: string,
   limit = 30,
): Promise<ActivityLog[]> {
   if (!companyId) return [];

   const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(limit);

   if (error) {
      console.warn('Could not fetch activity logs:', error.message);
      return [];
   }

   return (data as ActivityLog[]) || [];
}

// ==============================================================================
// 4. HR FEATURES (BONUSES & WARNINGS)
// ==============================================================================

export async function getHRActionsAPI(companyId?: string): Promise<HRAction[]> {
   if (!companyId) return [];

   const { data, error } = await supabase
      .from('hr_actions')
      .select(
         `
         *,
         employee:employees!hr_actions_employee_id_fkey(id, full_name, email, position),
         issuer:employees!hr_actions_issuer_id_fkey(id, full_name, email)
      `,
      )
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

   if (error) {
      console.warn('Falling back for hr_actions query:', error.message);
      const { data: rawData, error: rawError } = await supabase
         .from('hr_actions')
         .select('*')
         .eq('company_id', companyId)
         .order('created_at', { ascending: false });

      if (rawError) return [];
      return (rawData as HRAction[]) || [];
   }

   return (data as HRAction[]) || [];
}

export async function createHRActionAPI({
   companyId,
   employeeId,
   issuerId,
   type,
   title,
   amount = 0,
   reason,
   severity = 'standard',
}: {
   companyId: string;
   employeeId: string;
   issuerId: string;
   type: HRActionType;
   title: string;
   amount?: number;
   reason: string;
   severity?: HRActionSeverity;
}): Promise<HRAction> {
   const { data, error } = await supabase
      .from('hr_actions')
      .insert({
         company_id: companyId,
         employee_id: employeeId,
         issuer_id: issuerId,
         type,
         title,
         amount,
         reason,
         severity,
         status: 'active',
      })
      .select('*')
      .single();

   if (error) {
      console.error('Failed to issue HR action:', error);
      throw new Error(`Failed to issue HR action: ${error.message}`);
   }

   // Log activity
   logActivityAPI({
      companyId,
      entityType: 'hr',
      entityId: data.id,
      action: `issued_${type}`,
      details: { title, amount, employeeId },
   }).catch(console.error);

   return data as HRAction;
}

export async function updateHRActionStatusAPI(
   actionId: string,
   status: HRActionStatus,
): Promise<void> {
   const { error } = await supabase
      .from('hr_actions')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', actionId);

   if (error) {
      throw new Error(`Failed to update HR action status: ${error.message}`);
   }
}

// ==============================================================================
// 5. GITHUB & GMAIL INTEGRATION
// ==============================================================================

export async function getWorkspaceIntegrationsAPI(
   companyId?: string,
): Promise<WorkspaceIntegration[]> {
   if (!companyId) return [];

   const { data, error } = await supabase
      .from('workspace_integrations')
      .select('*')
      .eq('company_id', companyId);

   if (error) {
      console.warn('Could not fetch integrations, returning empty array:', error.message);
      return [];
   }

   return (data as WorkspaceIntegration[]) || [];
}

export async function toggleIntegrationAPI({
   companyId,
   provider,
   config = {},
   status = 'connected',
}: {
   companyId: string;
   provider: IntegrationProvider;
   config?: Record<string, unknown>;
   status?: 'connected' | 'disconnected';
}): Promise<WorkspaceIntegration> {
   const user = await getAuthenticatedUser();

   const { data, error } = await supabase
      .from('workspace_integrations')
      .upsert(
         {
            company_id: companyId,
            provider,
            status,
            config,
            connected_by: user.id,
            last_sync_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
         },
         { onConflict: 'company_id,provider' },
      )
      .select('*')
      .single();

   if (error) {
      console.error('Failed to configure integration:', error);
      throw new Error(`Failed to save integration: ${error.message}`);
   }

   logActivityAPI({
      companyId,
      entityType: 'integration',
      entityId: data.id,
      action: status === 'connected' ? `connected_${provider}` : `disconnected_${provider}`,
      details: { provider, config },
   }).catch(console.error);

   return data as WorkspaceIntegration;
}

// ==============================================================================
// 6. REAL-TIME CHAT
// ==============================================================================

export async function getChatChannelsAPI(companyId?: string): Promise<ChatChannel[]> {
   if (!companyId) return [];

   const { data, error } = await supabase
      .from('chat_channels')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: true });

   if (error) {
      console.warn('Falling back on empty channels array:', error.message);
      return [];
   }

   const channels = (data as ChatChannel[]) || [];
   if (channels.length === 0) return [];

   const channelIds = channels.map((c) => c.id);
   let membersByChannel: Record<string, string[]> = {};

   try {
      const { data: memberRows } = await supabase
         .from('chat_channel_members')
         .select('channel_id, user_id')
         .in('channel_id', channelIds);

      if (memberRows) {
         for (const m of memberRows) {
            if (!membersByChannel[m.channel_id]) {
               membersByChannel[m.channel_id] = [];
            }
            membersByChannel[m.channel_id].push(m.user_id);
         }
      }
   } catch {
      // ignore
   }

   return channels.map((c) => ({
      ...c,
      channel_type: (c.channel_type || (c.is_direct ? 'direct' : 'public')) as ChannelType,
      member_ids: membersByChannel[c.id] || [],
   }));
}

export async function createChatChannelAPI({
   companyId,
   name,
   description,
   channelType = 'public',
   isDirect = false,
   memberUserIds = [],
}: {
   companyId: string;
   name: string;
   description?: string;
   channelType?: ChannelType;
   isDirect?: boolean;
   memberUserIds?: string[];
}): Promise<ChatChannel> {
   const user = await getAuthenticatedUser();
   const effectiveChannelType = channelType || (isDirect ? 'direct' : 'public');
   const effectiveIsDirect = isDirect || effectiveChannelType === 'direct';

   let cleanName = name.trim();
   if (effectiveChannelType !== 'direct') {
      cleanName = cleanName.toLowerCase().replace(/\s+/g, '-');
   }

   const payload: Record<string, unknown> = {
      company_id: companyId,
      name: cleanName,
      description: description || null,
      channel_type: effectiveChannelType,
      is_direct: effectiveIsDirect,
      created_by: user.id,
   };

   let { data, error } = await supabase
      .from('chat_channels')
      .insert(payload)
      .select('*')
      .single();

   // Graceful fallback if column channel_type doesn't exist yet in Supabase
   if (error && error.message.toLowerCase().includes('channel_type')) {
      delete payload.channel_type;
      const retry = await supabase
         .from('chat_channels')
         .insert(payload)
         .select('*')
         .single();
      data = retry.data;
      error = retry.error;
   }

   if (error) {
      console.error('Failed to create channel:', error);
      throw new Error(`Failed to create channel: ${error.message}`);
   }

   const createdChannel = data as ChatChannel;

   // Insert members into chat_channel_members if private or direct
   const allMemberIds = Array.from(new Set([user.id, ...memberUserIds]));
   if (allMemberIds.length > 0) {
      try {
         const memberInserts = allMemberIds.map((uid) => ({
            channel_id: createdChannel.id,
            user_id: uid,
         }));
         await supabase.from('chat_channel_members').upsert(memberInserts, { onConflict: 'channel_id,user_id' });
      } catch (memErr) {
         console.warn('Could not register members:', memErr);
      }
   }

   return {
      ...createdChannel,
      channel_type: effectiveChannelType,
      member_ids: allMemberIds,
   };
}

export async function getChatMessagesAPI(channelId: string, companyId?: string): Promise<ChatMessage[]> {
   const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true });

   if (error) {
      console.warn('Could not fetch chat messages:', error.message);
      return [];
   }

   const rawMessages = (data as ChatMessage[]) || [];
   if (rawMessages.length === 0) return [];

   const userIds = Array.from(new Set(rawMessages.map((m) => m.user_id).filter(Boolean)));

   // Enrich messages with employee full_name and role
   const employeesMap: Record<string, { full_name: string; role: string; email: string }> = {};
   try {
      let query = supabase.from('employees').select('user_id, full_name, role, email');
      if (companyId) {
         query = query.eq('company_id', companyId);
      }
      const { data: emps } = await query.in('user_id', userIds);
      if (emps) {
         for (const emp of emps) {
            if (emp.user_id) {
               employeesMap[emp.user_id] = {
                  full_name: emp.full_name,
                  role: emp.role,
                  email: emp.email,
               };
            }
         }
      }
   } catch (e) {
      console.warn('Could not fetch employees for chat messages:', e);
   }

   return rawMessages.map((m) => {
      const emp = employeesMap[m.user_id];
      return {
         ...m,
         sender: {
            id: m.user_id,
            full_name: emp?.full_name || m.sender?.full_name || 'Team Member',
            role: emp?.role || m.sender?.role || 'employee',
            email: emp?.email || m.sender?.email || '',
            avatar: m.sender?.avatar || null,
         },
      };
   });
}

export async function sendChatMessageAPI({
   channelId,
   message,
   attachments = [],
   companyId,
}: {
   channelId: string;
   message: string;
   attachments?: ChatMessage['attachments'];
   companyId?: string;
}): Promise<ChatMessage> {
   const user = await getAuthenticatedUser();

   const { data, error } = await supabase
      .from('chat_messages')
      .insert({
         channel_id: channelId,
         user_id: user.id,
         message: message.trim(),
         attachments,
         is_pinned: false,
      })
      .select('*')
      .single();

   let empName = (user.user_metadata?.fullName as string) || (user.user_metadata?.full_name as string) || '';
   let empRole = (user.user_metadata?.teamRole as string) || '';

   try {
      let query = supabase.from('employees').select('full_name, role').eq('user_id', user.id);
      if (companyId) {
         query = query.eq('company_id', companyId);
      }
      const { data: emp } = await query.maybeSingle();

      if (emp) {
         empName = emp.full_name || empName;
         empRole = emp.role || empRole;
      }
   } catch {
      // ignore
   }

   const sender = {
      id: user.id,
      full_name: empName || user.email?.split('@')[0] || 'User',
      role: empRole || 'member',
      email: user.email || '',
      avatar: (user.user_metadata?.avatar as string) || null,
   };

   if (error) {
      console.warn('Supabase chat insert fallback:', error.message);
      return {
         id: `msg-${Date.now()}`,
         channel_id: channelId,
         user_id: user.id,
         message: message.trim(),
         attachments,
         is_pinned: false,
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
         sender,
      };
   }

   return {
      ...data,
      sender,
   };
}
