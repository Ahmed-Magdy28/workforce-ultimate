'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Paperclip,
   MessageSquare,
   Upload,
   Trash2,
   Download,
   Send,
   AtSign,
   FileText,
   Image as ImageIcon,
   X,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import {
   getTaskAttachmentsAPI,
   uploadTaskAttachmentAPI,
   deleteTaskAttachmentAPI,
   getTaskCommentsAPI,
   addTaskCommentAPI,
} from '@/features/collaboration/api/collaborationApis';
import type { TaskWithDetails } from '@/types/task';
import type { TaskAttachment, TaskComment } from '@/types/collaboration';
import type { Employee } from '@/types/apis';

type TaskCollaborationModalProps = {
   task: TaskWithDetails;
   companyId?: string;
   employees?: Employee[];
   isOpen: boolean;
   onClose: () => void;
};

export default function TaskCollaborationModal({
   task,
   companyId,
   employees = [],
   isOpen,
   onClose,
}: TaskCollaborationModalProps) {
   const queryClient = useQueryClient();
   const [activeTab, setActiveTab] = useState<'comments' | 'attachments'>('comments');
   const [newComment, setNewComment] = useState('');
   const [isMentionListOpen, setIsMentionListOpen] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);

   // Query Attachments
   const { data: attachments = [], isLoading: isAttachmentsLoading } = useQuery({
      queryKey: ['task-attachments', task.id],
      queryFn: () => getTaskAttachmentsAPI(task.id),
      enabled: isOpen,
   });

   // Query Comments
   const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
      queryKey: ['task-comments', task.id],
      queryFn: () => getTaskCommentsAPI(task.id),
      enabled: isOpen,
   });

   // Upload Attachment Mutation
   const uploadMutation = useMutation({
      mutationFn: (file: File) => uploadTaskAttachmentAPI(task.id, file, companyId),
      onSuccess: (newAtt) => {
         toast.success(`Attached "${newAtt.file_name}"`);
         queryClient.invalidateQueries({ queryKey: ['task-attachments', task.id] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to upload attachment'),
   });

   // Delete Attachment Mutation
   const deleteAttachmentMutation = useMutation({
      mutationFn: (attachmentId: string) => deleteTaskAttachmentAPI(attachmentId),
      onSuccess: () => {
         toast.success('Attachment removed');
         queryClient.invalidateQueries({ queryKey: ['task-attachments', task.id] });
      },
   });

   // Add Comment Mutation
   const addCommentMutation = useMutation({
      mutationFn: () => {
         // Extract mentions: e.g. @John Doe or employee IDs
         const mentionMatches = newComment.match(/@(\w+)/g) || [];
         const matchedEmployeeIds = employees
            .filter((emp) =>
               mentionMatches.some((m) =>
                  emp.full_name.toLowerCase().includes(m.slice(1).toLowerCase()),
               ),
            )
            .map((emp) => emp.id);

         return addTaskCommentAPI({
            taskId: task.id,
            companyId,
            content: newComment,
            mentions: matchedEmployeeIds,
         });
      },
      onSuccess: () => {
         setNewComment('');
         queryClient.invalidateQueries({ queryKey: ['task-comments', task.id] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to post comment'),
   });

   if (!isOpen) return null;

   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const file = files[0];
      if (file.size > 15 * 1024 * 1024) {
         toast.error('File size exceeds 15MB limit');
         return;
      }
      uploadMutation.mutate(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
   };

   const insertMention = (empName: string) => {
      setNewComment((prev) => `${prev}@${empName.replace(/\s+/g, '')} `);
      setIsMentionListOpen(false);
   };

   const lastAtMatch = newComment.match(/@(\w*)$/);
   const currentMentionQuery = lastAtMatch ? lastAtMatch[1].toLowerCase() : '';
   const filteredEmployees = employees.filter((e) =>
      e.full_name.toLowerCase().includes(currentMentionQuery),
   );

   const formatBytes = (bytes: number) => {
      if (!bytes || bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
         <div className="flex h-[90vh] max-h-[720px] w-full max-w-2xl flex-col rounded-2xl border bg-card shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b p-5">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <Badge variant="outline" className="text-xs uppercase">
                        {task.status.replace('_', ' ')}
                     </Badge>
                     <span className="text-xs text-muted-foreground">
                        {task.project?.name || 'Workspace Project'}
                     </span>
                  </div>
                  <h2 className="text-lg font-bold leading-tight">{task.title}</h2>
               </div>
               <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
               >
                  <X className="size-5" />
               </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-5">
               <button
                  type="button"
                  onClick={() => setActiveTab('comments')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                     activeTab === 'comments'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
               >
                  <MessageSquare className="size-4" />
                  Comments ({comments.length})
               </button>
               <button
                  type="button"
                  onClick={() => setActiveTab('attachments')}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                     activeTab === 'attachments'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
               >
                  <Paperclip className="size-4" />
                  Attachments ({attachments.length})
               </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
               {activeTab === 'comments' ? (
                  <div className="space-y-4">
                     {isCommentsLoading ? (
                        <div className="flex justify-center py-10">
                           <Spinner />
                        </div>
                     ) : comments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                           <MessageSquare className="size-10 stroke-[1.5] text-muted-foreground/50" />
                           <p className="mt-2 text-sm font-medium">No comments yet</p>
                           <p className="text-xs">
                              Start the conversation or mention teammates with @ to notify them.
                           </p>
                        </div>
                     ) : (
                        <div className="space-y-3">
                           {comments.map((c: TaskComment) => (
                              <div
                                 key={c.id}
                                 className="flex items-start gap-3 rounded-xl border bg-muted/30 p-3.5 transition-colors hover:bg-muted/50"
                              >
                                 <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    {(c.author?.full_name || 'U').slice(0, 2).toUpperCase()}
                                 </div>
                                 <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                       <span className="text-xs font-semibold">
                                          {c.author?.full_name || 'Team Member'}
                                       </span>
                                       <span className="text-[11px] text-muted-foreground">
                                          {new Date(c.created_at).toLocaleTimeString([], {
                                             hour: '2-digit',
                                             minute: '2-digit',
                                          })}
                                       </span>
                                    </div>
                                    <p className="text-xs whitespace-pre-wrap leading-relaxed text-foreground/90">
                                       {c.content}
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div>
                           <h4 className="text-sm font-semibold">Task Attachments</h4>
                           <p className="text-xs text-muted-foreground">
                              Images, documents, or design specs up to 15MB.
                           </p>
                        </div>
                        <Button
                           size="sm"
                           onClick={() => fileInputRef.current?.click()}
                           disabled={uploadMutation.isPending}
                           className="gap-1.5 text-xs"
                        >
                           <Upload className="size-3.5" />
                           {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
                        </Button>
                        <input
                           ref={fileInputRef}
                           type="file"
                           className="hidden"
                           onChange={handleFileSelect}
                        />
                     </div>

                     {isAttachmentsLoading ? (
                        <div className="flex justify-center py-10">
                           <Spinner />
                        </div>
                     ) : attachments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                           <Paperclip className="size-10 stroke-[1.5] text-muted-foreground/50" />
                           <p className="mt-2 text-sm font-medium">No files attached</p>
                           <p className="text-xs">
                              Click upload or drag & drop project assets here.
                           </p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                           {attachments.map((att: TaskAttachment) => (
                              <div
                                 key={att.id}
                                 className="flex items-center justify-between rounded-xl border bg-card p-3 shadow-xs hover:border-primary/40"
                              >
                                 <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                       {att.file_type.includes('image') ? (
                                          <ImageIcon className="size-4" />
                                       ) : (
                                          <FileText className="size-4" />
                                       )}
                                    </div>
                                    <div className="min-w-0">
                                       <p className="truncate text-xs font-semibold">
                                          {att.file_name}
                                       </p>
                                       <p className="text-[10px] text-muted-foreground">
                                          {formatBytes(att.file_size)} •{' '}
                                          {new Date(att.created_at).toLocaleDateString()}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-1">
                                    <a
                                       href={att.file_url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    >
                                       <Download className="size-4" />
                                    </a>
                                    <button
                                       type="button"
                                       onClick={() => deleteAttachmentMutation.mutate(att.id)}
                                       className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                    >
                                       <Trash2 className="size-4" />
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               )}
            </div>

            {/* Comment Input Footer */}
            {activeTab === 'comments' && (
               <div className="relative border-t bg-card p-4">
                  {/* Mention Picker Popup */}
                  {isMentionListOpen && (
                     <div className="absolute bottom-[calc(100%+0.5rem)] left-4 z-20 w-64 rounded-xl border bg-card p-2 shadow-xl">
                        <p className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                           Mention a teammate
                        </p>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                           {filteredEmployees.map((emp) => (
                              <button
                                 key={emp.id}
                                 type="button"
                                 onClick={() => insertMention(emp.full_name)}
                                 className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted"
                              >
                                 <div className="size-5 rounded-full bg-primary/10 text-[10px] font-bold flex items-center justify-center text-primary">
                                    {emp.full_name[0]}
                                 </div>
                                 <span className="truncate">{emp.full_name}</span>
                              </button>
                           ))}
                        </div>
                     </div>
                  )}

                  <div className="space-y-2">
                     <Textarea
                        rows={2}
                        placeholder="Write a comment... Type @ to mention team members"
                        value={newComment}
                        onChange={(e) => {
                           setNewComment(e.target.value);
                           if (e.target.value.endsWith('@')) {
                              setIsMentionListOpen(true);
                           }
                        }}
                        className="resize-none text-xs"
                     />
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                           <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsMentionListOpen((prev) => !prev)}
                              className="h-7 px-2 text-xs text-muted-foreground"
                           >
                              <AtSign className="size-3.5 mr-1" />
                              Mention
                           </Button>
                           <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                 setActiveTab('attachments');
                                 fileInputRef.current?.click();
                              }}
                              className="h-7 px-2 text-xs text-muted-foreground"
                           >
                              <Paperclip className="size-3.5 mr-1" />
                              Attach
                           </Button>
                        </div>
                        <Button
                           size="sm"
                           disabled={!newComment.trim() || addCommentMutation.isPending}
                           onClick={() => addCommentMutation.mutate()}
                           className="h-7 gap-1.5 text-xs"
                        >
                           <Send className="size-3.5" />
                           {addCommentMutation.isPending ? 'Posting...' : 'Comment'}
                        </Button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
