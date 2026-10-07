'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Hash,
   Send,
   Plus,
   Users,
   MessageSquare,
   Search,
   Lock,
   Shield,
   User,
   Check,
   CheckCheck,
   Sparkles,
   Globe,
   UserPlus,
   MessageCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { getCurrentCompanyEmployeesAPI } from '@/features/company/api/companyApis';
import {
   getChatChannelsAPI,
   createChatChannelAPI,
   getChatMessagesAPI,
   sendChatMessageAPI,
} from '@/features/collaboration/api/collaborationApis';
import { supabase } from '@/services/supabase';
import type { ChatChannel, ChatMessage, ChannelType } from '@/types/collaboration';

function getRoleBadgeStyle(role?: string) {
   const normalized = (role || '').toLowerCase();
   if (normalized === 'owner') {
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
   }
   if (normalized === 'hr') {
      return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
   }
   if (normalized === 'admin') {
      return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
   }
   if (
      normalized.includes('manager') ||
      normalized === 'lead'
   ) {
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
   }
   return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20';
}

export default function ChatView() {
   const { user, companyId } = useAuth();
   const { role: userRole, isOwner, isManagerOrAbove } = useRole();
   const queryClient = useQueryClient();

   const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
   const [messageText, setMessageText] = useState('');
   const [searchChannel, setSearchChannel] = useState('');
   const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);

   // Channel creation modal state
   const [channelType, setChannelType] = useState<ChannelType>('public');
   const [newChannelName, setNewChannelName] = useState('');
   const [newChannelDesc, setNewChannelDesc] = useState('');
   const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
   const [memberSearchQuery, setMemberSearchQuery] = useState('');

   const messagesEndRef = useRef<HTMLDivElement>(null);

   // 1. Fetch Company Employees
   const { data: employees = [] } = useQuery({
      queryKey: ['company-employees', companyId],
      queryFn: getCurrentCompanyEmployeesAPI,
      enabled: Boolean(companyId),
   });

   // 2. Fetch Channels
   const {
      data: channels = [],
      isLoading: isChannelsLoading,
   } = useQuery({
      queryKey: ['chat-channels', companyId],
      queryFn: () => getChatChannelsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   // Filter channels by user's access rights
   const accessibleChannels = useMemo(() => {
      const currentUserId = user?.id;

      return channels.filter((c) => {
         const type = c.channel_type || (c.is_direct ? 'direct' : 'public');

         // Public channels are accessible to everyone
         if (type === 'public') return true;

         // Managers channels are accessible to owner, hr, admins, and managers
         if (type === 'managers') {
            if (isOwner || isManagerOrAbove) return true;
            if (c.created_by === currentUserId) return true;
            return false;
         }

         // Private and Direct channels: accessible ONLY if creator or listed member
         if (type === 'private' || type === 'direct') {
            if (c.created_by === currentUserId) return true;
            if (currentUserId && c.member_ids?.includes(currentUserId)) return true;
            if (isOwner) return true; // Owner can oversee workspace channels
            return false;
         }

         return true;
      });
   }, [channels, user?.id, isOwner, isManagerOrAbove]);

   // Effective active channel
   const effectiveActiveChannelId =
      activeChannelId || (accessibleChannels.length > 0 ? accessibleChannels[0].id : null);

   const activeChannel = accessibleChannels.find((c) => c.id === effectiveActiveChannelId);

   // 3. Query Messages for Active Channel
   const {
      data: messages = [],
      isLoading: isMessagesLoading,
   } = useQuery({
      queryKey: ['chat-messages', effectiveActiveChannelId],
      queryFn: () =>
         effectiveActiveChannelId
            ? getChatMessagesAPI(effectiveActiveChannelId, companyId || undefined)
            : Promise.resolve([]),
      enabled: Boolean(effectiveActiveChannelId),
      refetchInterval: 3000,
   });

   // Supabase Real-time Subscription for Live Messages
   useEffect(() => {
      if (!effectiveActiveChannelId) return;

      const channelSub = supabase
         .channel(`chat_messages:${effectiveActiveChannelId}`)
         .on(
            'postgres_changes',
            {
               event: 'INSERT',
               schema: 'public',
               table: 'chat_messages',
               filter: `channel_id=eq.${effectiveActiveChannelId}`,
            },
            () => {
               queryClient.invalidateQueries({
                  queryKey: ['chat-messages', effectiveActiveChannelId],
               });
            },
         )
         .subscribe();

      return () => {
         supabase.removeChannel(channelSub);
      };
   }, [effectiveActiveChannelId, queryClient]);

   // Auto-scroll to bottom
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   // Helper: Resolve human-readable name & role for any message sender
   function getSenderDetails(msgUserId: string, fallbackSender?: ChatMessage['sender']) {
      const emp = employees.find(
         (e) =>
            e.user_id === msgUserId ||
            (fallbackSender?.email && e.email === fallbackSender.email),
      );

      const isCurrent = user?.id === msgUserId;

      let name = emp?.full_name || fallbackSender?.full_name;
      if (!name && isCurrent) {
         name =
            (user?.user_metadata?.fullName as string) ||
            (user?.user_metadata?.full_name as string) ||
            (user?.email ? user.email.split('@')[0] : 'You');
      }
      if (!name) name = 'Workspace Colleague';

      let role = emp?.role || fallbackSender?.role;
      if (!role && isCurrent) {
         role = (userRole as string) || (user?.user_metadata?.teamRole as string) || (isOwner ? 'owner' : undefined);
      }
      if (!role) role = 'member';

      return {
         name,
         role: role.toUpperCase(),
         isCurrent,
      };
   }

   // Helper: Resolve label for direct message channel
   function getDirectChannelDisplayName(channel: ChatChannel) {
      if (channel.channel_type !== 'direct') return channel.name;

      // Find the other member in DM
      const otherUserId = channel.member_ids?.find((id) => id !== user?.id) || channel.created_by;
      const otherEmp = employees.find((e) => e.user_id === otherUserId);

      if (otherEmp) {
         return `${otherEmp.full_name} (${otherEmp.role.toUpperCase()})`;
      }

      return channel.name.replace(/^dm-/, '').replace(/-/g, ' ');
   }

   // 4. Create Channel Mutation
   const createChannelMutation = useMutation({
      mutationFn: () => {
         let finalName = newChannelName.trim();
         let membersToAssign = selectedMemberIds;

         if (channelType === 'direct') {
            const recipient = employees.find((e) => e.user_id === selectedMemberIds[0]);
            finalName = recipient ? `DM with ${recipient.full_name}` : 'Direct Message';
         }

         if (channelType === 'managers') {
            const managerUserIds = employees
               .filter((e) =>
                  ['owner', 'admin', 'hr', 'manager', 'senior_manager', 'regional_manager'].includes(
                     e.role.toLowerCase(),
                  ),
               )
               .map((e) => e.user_id)
               .filter((id): id is string => Boolean(id));
            membersToAssign = Array.from(new Set([...membersToAssign, ...managerUserIds]));
         }

         return createChatChannelAPI({
            companyId: companyId!,
            name: finalName,
            description: newChannelDesc,
            channelType,
            memberUserIds: membersToAssign,
         });
      },
      onSuccess: (newChan) => {
         toast.success(
            channelType === 'direct'
               ? 'Direct chat started!'
               : `Channel #${newChan.name} created!`,
         );
         setIsCreateChannelOpen(false);
         setNewChannelName('');
         setNewChannelDesc('');
         setSelectedMemberIds([]);
         setChannelType('public');
         queryClient.invalidateQueries({ queryKey: ['chat-channels', companyId] });
         setActiveChannelId(newChan.id);
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to create channel'),
   });

   // 5. Send Message Mutation
   const sendMessageMutation = useMutation({
      mutationFn: () =>
         sendChatMessageAPI({
            channelId: effectiveActiveChannelId!,
            message: messageText,
            companyId: companyId || undefined,
         }),
      onSuccess: () => {
         setMessageText('');
         queryClient.invalidateQueries({
            queryKey: ['chat-messages', effectiveActiveChannelId],
         });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to send message'),
   });

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         if (messageText.trim() && !sendMessageMutation.isPending) {
            sendMessageMutation.mutate();
         }
      }
   };

   // Toggle member selection in modal
   const toggleMemberSelection = (userId: string) => {
      if (channelType === 'direct') {
         setSelectedMemberIds([userId]);
         return;
      }
      setSelectedMemberIds((prev) =>
         prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
      );
   };

   // Filter employees for member selection
   const filteredEmployees = employees.filter((emp) => {
      if (!emp.user_id || emp.user_id === user?.id) return false;
      const q = memberSearchQuery.toLowerCase();
      return (
         emp.full_name.toLowerCase().includes(q) ||
         (emp.email ? emp.email.toLowerCase().includes(q) : false) ||
         emp.role.toLowerCase().includes(q)
      );
   });

   // Group accessible channels for clean UI layout
   const publicChannels = accessibleChannels.filter(
      (c) => (c.channel_type || (c.is_direct ? 'direct' : 'public')) === 'public',
   );
   const privateChannels = accessibleChannels.filter((c) => c.channel_type === 'private');
   const managerChannels = accessibleChannels.filter((c) => c.channel_type === 'managers');
   const directChannels = accessibleChannels.filter(
      (c) => c.channel_type === 'direct' || c.is_direct,
   );

   const channelMatchesSearch = (c: ChatChannel) => {
      const displayName = getDirectChannelDisplayName(c);
      return (
         c.name.toLowerCase().includes(searchChannel.toLowerCase()) ||
         displayName.toLowerCase().includes(searchChannel.toLowerCase())
      );
   };

   return (
      <div className="flex h-[calc(100vh-8.5rem)] min-h-[520px] w-full overflow-hidden rounded-2xl border bg-card shadow-sm">
         {/* LEFT SIDEBAR: Channels */}
         <div className="flex w-72 shrink-0 flex-col border-r bg-muted/20">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
               <div>
                  <h3 className="text-sm font-bold tracking-tight">Team Channels</h3>
                  <p className="text-[11px] text-muted-foreground">
                     {accessibleChannels.length} active chats
                  </p>
               </div>
               <Button
                  size="sm"
                  variant="default"
                  className="h-8 gap-1.5 px-2.5 text-xs font-semibold"
                  onClick={() => {
                     setChannelType('public');
                     setNewChannelName('');
                     setNewChannelDesc('');
                     setSelectedMemberIds([]);
                     setIsCreateChannelOpen(true);
                  }}
                  title="Create new channel or chat"
               >
                  <Plus className="size-3.5" />
                  New Chat
               </Button>
            </div>

            {/* Channel Search */}
            <div className="border-b p-3">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                  <Input
                     placeholder="Search channels & DMs..."
                     value={searchChannel}
                     onChange={(e) => setSearchChannel(e.target.value)}
                     className="h-8 bg-background pl-8 text-xs"
                  />
               </div>
            </div>

            {/* Channels List */}
            <div className="flex-1 space-y-4 overflow-y-auto p-2">
               {isChannelsLoading ? (
                  <div className="flex justify-center py-6">
                     <Spinner />
                  </div>
               ) : accessibleChannels.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                     No channels created yet.
                     <Button
                        variant="link"
                        size="sm"
                        className="mx-auto mt-1 block text-xs text-primary"
                        onClick={() => setIsCreateChannelOpen(true)}
                     >
                        + Create First Channel
                     </Button>
                  </div>
               ) : (
                  <>
                     {/* 1. Public Channels */}
                     {publicChannels.filter(channelMatchesSearch).length > 0 && (
                        <div className="space-y-1">
                           <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                              <Globe className="size-3 text-muted-foreground/80" />
                              Public Channels
                           </div>
                           {publicChannels.filter(channelMatchesSearch).map((c) => {
                              const isSelected = c.id === effectiveActiveChannelId;
                              return (
                                 <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setActiveChannelId(c.id)}
                                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                                       isSelected
                                          ? 'bg-primary text-primary-foreground shadow-xs'
                                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                 >
                                    <Hash className="size-3.5 shrink-0 opacity-70" />
                                    <span className="truncate">{c.name}</span>
                                 </button>
                              );
                           })}
                        </div>
                     )}

                     {/* 2. Private Channels */}
                     {privateChannels.filter(channelMatchesSearch).length > 0 && (
                        <div className="space-y-1">
                           <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              <Lock className="size-3 text-amber-500" />
                              Private Channels
                           </div>
                           {privateChannels.filter(channelMatchesSearch).map((c) => {
                              const isSelected = c.id === effectiveActiveChannelId;
                              return (
                                 <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setActiveChannelId(c.id)}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                                       isSelected
                                          ? 'bg-primary text-primary-foreground shadow-xs'
                                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                 >
                                    <div className="flex min-w-0 items-center gap-2 truncate">
                                       <Lock className="size-3.5 shrink-0 text-amber-500" />
                                       <span className="truncate">{c.name}</span>
                                    </div>
                                    {c.member_ids && c.member_ids.length > 0 && (
                                       <span className="ml-1 rounded-full bg-background/50 px-1.5 py-0.2 text-[10px] font-bold opacity-80">
                                          {c.member_ids.length}
                                       </span>
                                    )}
                                 </button>
                              );
                           })}
                        </div>
                     )}

                     {/* 3. Management Channels */}
                     {managerChannels.filter(channelMatchesSearch).length > 0 && (
                        <div className="space-y-1">
                           <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                              <Shield className="size-3 text-purple-500" />
                              Management Only
                           </div>
                           {managerChannels.filter(channelMatchesSearch).map((c) => {
                              const isSelected = c.id === effectiveActiveChannelId;
                              return (
                                 <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setActiveChannelId(c.id)}
                                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                                       isSelected
                                          ? 'bg-primary text-primary-foreground shadow-xs'
                                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                 >
                                    <Shield className="size-3.5 shrink-0 text-purple-500" />
                                    <span className="truncate">{c.name}</span>
                                 </button>
                              );
                           })}
                        </div>
                     )}

                     {/* 4. Direct Messages */}
                     {directChannels.filter(channelMatchesSearch).length > 0 && (
                        <div className="space-y-1">
                           <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              <MessageCircle className="size-3 text-emerald-500" />
                              Direct Messages
                           </div>
                           {directChannels.filter(channelMatchesSearch).map((c) => {
                              const isSelected = c.id === effectiveActiveChannelId;
                              const displayName = getDirectChannelDisplayName(c);
                              return (
                                 <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setActiveChannelId(c.id)}
                                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                                       isSelected
                                          ? 'bg-primary text-primary-foreground shadow-xs'
                                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                 >
                                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-600">
                                       {displayName.slice(0, 1).toUpperCase()}
                                    </div>
                                    <span className="truncate">{displayName}</span>
                                 </button>
                              );
                           })}
                        </div>
                     )}
                  </>
               )}
            </div>

            {/* Workspace Members Online Widget */}
            <div className="border-t bg-background/50 p-3">
               <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold">
                     <Users className="size-3" />
                     Coworkers ({employees.length})
                  </span>
               </div>
               <div className="flex -space-x-1.5 overflow-hidden py-1">
                  {employees.slice(0, 6).map((emp) => (
                     <div
                        key={emp.id}
                        title={`${emp.full_name} (${emp.role})`}
                        className="flex size-6 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-[10px] font-bold text-primary"
                     >
                        {emp.full_name[0]}
                     </div>
                  ))}
                  {employees.length > 6 && (
                     <div className="flex size-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] text-muted-foreground">
                        +{employees.length - 6}
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* RIGHT: Chat Room Conversation */}
         <div className="flex flex-1 flex-col overflow-hidden bg-background">
            {activeChannel ? (
               <>
                  {/* Channel Header */}
                  <div className="flex h-14 items-center justify-between border-b px-5">
                     <div className="flex items-center gap-2.5">
                        {activeChannel.channel_type === 'direct' ? (
                           <div className="flex size-7 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-600">
                              <User className="size-4" />
                           </div>
                        ) : activeChannel.channel_type === 'private' ? (
                           <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
                              <Lock className="size-4" />
                           </div>
                        ) : activeChannel.channel_type === 'managers' ? (
                           <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600">
                              <Shield className="size-4" />
                           </div>
                        ) : (
                           <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Hash className="size-4" />
                           </div>
                        )}

                        <div>
                           <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold">
                                 {getDirectChannelDisplayName(activeChannel)}
                              </h4>
                              <span
                                 className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                                    activeChannel.channel_type === 'private'
                                       ? 'bg-amber-500/15 text-amber-600'
                                       : activeChannel.channel_type === 'managers'
                                         ? 'bg-purple-500/15 text-purple-600'
                                         : activeChannel.channel_type === 'direct'
                                           ? 'bg-emerald-500/15 text-emerald-600'
                                           : 'bg-muted text-muted-foreground'
                                 }`}
                              >
                                 {activeChannel.channel_type || 'public'}
                              </span>
                           </div>
                           {activeChannel.description && (
                              <p className="max-w-md truncate text-[11px] text-muted-foreground">
                                 {activeChannel.description}
                              </p>
                           )}
                        </div>
                     </div>

                     <Badge variant="outline" className="gap-1 text-[10px]">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        Live Real-time
                     </Badge>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 space-y-4 overflow-y-auto p-5">
                     {isMessagesLoading ? (
                        <div className="flex justify-center py-12">
                           <Spinner />
                        </div>
                     ) : messages.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                           <MessageSquare className="mb-2 size-12 stroke-[1.2] text-muted-foreground/30" />
                           <h5 className="text-sm font-semibold">
                              Welcome to {getDirectChannelDisplayName(activeChannel)}
                           </h5>
                           <p className="mt-1 max-w-xs text-xs">
                              {activeChannel.channel_type === 'direct'
                                 ? 'This is a private 1-on-1 direct message conversation.'
                                 : activeChannel.channel_type === 'private'
                                   ? 'This is a private channel visible only to selected members.'
                                   : 'This is the start of this channel. Say hello to your team!'}
                           </p>
                        </div>
                     ) : (
                        messages.map((msg: ChatMessage) => {
                           const sender = getSenderDetails(msg.user_id, msg.sender);
                           return (
                              <div
                                 key={msg.id}
                                 className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                                    sender.isCurrent
                                       ? 'bg-primary/5 hover:bg-primary/10'
                                       : 'hover:bg-muted/40'
                                 }`}
                              >
                                 <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                                    {sender.name.slice(0, 2).toUpperCase()}
                                 </div>
                                 <div className="flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                       <span className="text-xs font-bold text-foreground">
                                          {sender.name}
                                       </span>
                                       {sender.role && (
                                          <span
                                             className={`inline-flex items-center rounded-md border px-1.5 py-0.2 text-[10px] font-bold tracking-wider ${getRoleBadgeStyle(
                                                sender.role,
                                             )}`}
                                          >
                                             {sender.role}
                                          </span>
                                       )}
                                       {sender.isCurrent && (
                                          <span className="text-[10px] font-medium text-muted-foreground">
                                             (You)
                                          </span>
                                       )}
                                       <span className="ml-1 text-[10px] text-muted-foreground">
                                          {new Date(msg.created_at).toLocaleTimeString([], {
                                             hour: '2-digit',
                                             minute: '2-digit',
                                          })}
                                       </span>
                                    </div>
                                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
                                       {msg.message}
                                    </p>
                                 </div>
                              </div>
                           );
                        })
                     )}
                     <div ref={messagesEndRef} />
                  </div>

                  {/* Message Composer Footer */}
                  <div className="border-t bg-card/60 p-3">
                     <div className="space-y-2">
                        <Textarea
                           rows={2}
                           placeholder={`Message ${getDirectChannelDisplayName(activeChannel)}... (Press Enter to send)`}
                           value={messageText}
                           onChange={(e) => setMessageText(e.target.value)}
                           onKeyDown={handleKeyDown}
                           className="resize-none bg-background text-xs"
                        />
                        <div className="flex items-center justify-between">
                           <p className="text-[10px] text-muted-foreground">
                              Tip: Press <kbd className="rounded border px-1">Enter</kbd> to send,{' '}
                              <kbd className="rounded border px-1">Shift+Enter</kbd> for newline
                           </p>
                           <Button
                              size="sm"
                              disabled={!messageText.trim() || sendMessageMutation.isPending}
                              onClick={() => sendMessageMutation.mutate()}
                              className="h-8 gap-1.5 px-3 text-xs"
                           >
                              <Send className="size-3.5" />
                              {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
                           </Button>
                        </div>
                     </div>
                  </div>
               </>
            ) : (
               <div className="flex h-full flex-col items-center justify-center p-6 text-center text-muted-foreground">
                  <Hash className="mb-2 size-12 stroke-[1.2] text-muted-foreground/30" />
                  <p className="text-sm font-semibold">No Channel Selected</p>
                  <p className="mt-1 max-w-xs text-xs">
                     Select an existing channel or start a new public, private, or direct conversation.
                  </p>
                  <Button
                     className="mt-4 gap-1.5 text-xs"
                     size="sm"
                     onClick={() => setIsCreateChannelOpen(true)}
                  >
                     <Plus className="size-3.5" />
                     Create Channel
                  </Button>
               </div>
            )}
         </div>

         {/* MODAL: Create New Channel / Direct Chat */}
         {isCreateChannelOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
               <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto shadow-2xl">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-base">
                        <Sparkles className="size-4 text-primary" />
                        Create New Chat or Channel
                     </CardTitle>
                     <CardDescription className="text-xs">
                        Choose whether this chat should be public to everyone, restricted to managers,
                        private to selected colleagues, or a 1-on-1 direct conversation.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                     {/* 1. Chat Scope / Privacy Selector */}
                     <div className="space-y-2">
                        <label className="text-xs font-semibold">Channel Privacy & Type</label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                           {/* Public */}
                           <button
                              type="button"
                              onClick={() => setChannelType('public')}
                              className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                                 channelType === 'public'
                                    ? 'border-primary bg-primary/10 text-primary shadow-xs'
                                    : 'border-border/70 hover:bg-muted/50'
                              }`}
                           >
                              <Globe className="mb-1 size-4" />
                              <span className="text-xs font-bold">Public</span>
                              <span className="text-[10px] text-muted-foreground">Whole team</span>
                           </button>

                           {/* Private */}
                           <button
                              type="button"
                              onClick={() => setChannelType('private')}
                              className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                                 channelType === 'private'
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 shadow-xs'
                                    : 'border-border/70 hover:bg-muted/50'
                              }`}
                           >
                              <Lock className="mb-1 size-4" />
                              <span className="text-xs font-bold">Private</span>
                              <span className="text-[10px] text-muted-foreground">Selected only</span>
                           </button>

                           {/* Managers */}
                           <button
                              type="button"
                              onClick={() => setChannelType('managers')}
                              className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                                 channelType === 'managers'
                                    ? 'border-purple-500 bg-purple-500/10 text-purple-600 shadow-xs'
                                    : 'border-border/70 hover:bg-muted/50'
                              }`}
                           >
                              <Shield className="mb-1 size-4" />
                              <span className="text-xs font-bold">Managers</span>
                              <span className="text-[10px] text-muted-foreground">Leadership</span>
                           </button>

                           {/* Direct Message */}
                           <button
                              type="button"
                              onClick={() => setChannelType('direct')}
                              className={`flex flex-col items-center rounded-xl border p-2.5 text-center transition-all ${
                                 channelType === 'direct'
                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 shadow-xs'
                                    : 'border-border/70 hover:bg-muted/50'
                              }`}
                           >
                              <MessageCircle className="mb-1 size-4" />
                              <span className="text-xs font-bold">Direct (1:1)</span>
                              <span className="text-[10px] text-muted-foreground">One colleague</span>
                           </button>
                        </div>
                     </div>

                     {/* 2. Channel Name & Description (Hidden for DM) */}
                     {channelType !== 'direct' && (
                        <>
                           <div className="space-y-1.5">
                              <label className="text-xs font-semibold">Channel Name</label>
                              <Input
                                 placeholder="e.g. general, frontend, marketing-sprint"
                                 value={newChannelName}
                                 onChange={(e) => setNewChannelName(e.target.value)}
                                 className="text-xs"
                              />
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-xs font-semibold">Description (Optional)</label>
                              <Input
                                 placeholder="e.g. Workspace updates and project discussions"
                                 value={newChannelDesc}
                                 onChange={(e) => setNewChannelDesc(e.target.value)}
                                 className="text-xs"
                              />
                           </div>
                        </>
                     )}

                     {/* 3. Member Selection (For Private Channels & Direct Messages) */}
                     {(channelType === 'private' || channelType === 'direct') && (
                        <div className="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-3">
                           <div className="flex items-center justify-between">
                              <label className="text-xs font-semibold">
                                 {channelType === 'direct'
                                    ? 'Select Coworker to Chat With'
                                    : `Select Members (${selectedMemberIds.length} chosen)`}
                              </label>
                              {channelType === 'private' && (
                                 <div className="flex gap-2">
                                    <button
                                       type="button"
                                       onClick={() =>
                                          setSelectedMemberIds(
                                             filteredEmployees
                                                .map((e) => e.user_id)
                                                .filter((id): id is string => Boolean(id)),
                                          )
                                       }
                                       className="text-[11px] text-primary hover:underline"
                                    >
                                       Select All
                                    </button>
                                    <span className="text-muted-foreground">•</span>
                                    <button
                                       type="button"
                                       onClick={() => setSelectedMemberIds([])}
                                       className="text-[11px] text-muted-foreground hover:underline"
                                    >
                                       Clear
                                    </button>
                                 </div>
                              )}
                           </div>

                           {/* Search filter */}
                           <Input
                              placeholder="Search coworkers by name, email, or role..."
                              value={memberSearchQuery}
                              onChange={(e) => setMemberSearchQuery(e.target.value)}
                              className="h-8 bg-background text-xs"
                           />

                           {/* Employees list */}
                           <div className="max-h-44 space-y-1.5 overflow-y-auto pt-1">
                              {filteredEmployees.length === 0 ? (
                                 <p className="py-3 text-center text-xs text-muted-foreground">
                                    No other coworkers found in this workspace.
                                 </p>
                              ) : (
                                 filteredEmployees.map((emp) => {
                                    const isSelected = selectedMemberIds.includes(emp.user_id!);
                                    return (
                                       <button
                                          key={emp.id}
                                          type="button"
                                          onClick={() => toggleMemberSelection(emp.user_id!)}
                                          className={`flex w-full items-center justify-between rounded-lg border p-2 text-left text-xs transition-colors ${
                                             isSelected
                                                ? 'border-primary/50 bg-primary/10'
                                                : 'border-border/50 hover:bg-background'
                                          }`}
                                       >
                                          <div className="flex items-center gap-2">
                                             <div className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                                                {emp.full_name[0]}
                                             </div>
                                             <div>
                                                <p className="font-semibold text-foreground">
                                                   {emp.full_name}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                   {emp.email}
                                                </p>
                                             </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                             <span
                                                className={`rounded-md border px-1.5 py-0.2 text-[10px] font-bold uppercase ${getRoleBadgeStyle(
                                                   emp.role,
                                                )}`}
                                             >
                                                {emp.role}
                                             </span>
                                             <div
                                                className={`flex size-4 items-center justify-center rounded-full border ${
                                                   isSelected
                                                      ? 'border-primary bg-primary text-primary-foreground'
                                                      : 'border-muted-foreground/40'
                                                }`}
                                             >
                                                {isSelected && <Check className="size-2.5 stroke-[3]" />}
                                             </div>
                                          </div>
                                       </button>
                                    );
                                 })
                              )}
                           </div>
                        </div>
                     )}

                     {/* Action Buttons */}
                     <div className="flex justify-end gap-2 pt-2 border-t">
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setIsCreateChannelOpen(false)}
                        >
                           Cancel
                        </Button>
                        <Button
                           size="sm"
                           disabled={
                              createChannelMutation.isPending ||
                              (channelType !== 'direct' && !newChannelName.trim()) ||
                              ((channelType === 'direct' || channelType === 'private') &&
                                 selectedMemberIds.length === 0)
                           }
                           onClick={() => createChannelMutation.mutate()}
                        >
                           {createChannelMutation.isPending ? 'Creating...' : 'Create Chat'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}
      </div>
   );
}
