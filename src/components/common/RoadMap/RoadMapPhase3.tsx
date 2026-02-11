import { useTranslation } from 'react-i18next';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from '@/components/ui/accordion';
import {
   CheckCircle2,
   FileUp,
   MessageSquare,
   History,
   Award,
   GitBranch,
   MessageCircle,
   ArrowRight,
   Target,
   Rocket,
   FileText,
} from 'lucide-react';
import type { JSX } from 'react';

export default function RoadMapPhase3() {
   const { t } = useTranslation();

   type TaskStatus = 'completed' | 'in-progress' | 'pending';
   type CategoryTask = {
      name: string;
      description: string;
      status: TaskStatus;
   };
   type Category = {
      title: string;
      description: string;
      icon: JSX.Element;
      color: string;
      bgColor: string;
      tasks: CategoryTask[];
   };

   const categories: Category[] = [
      {
         title: t('roadmap.phase3.uploads.title', 'File Uploads & Attachments'),
         description: t(
            'roadmap.phase3.uploads.description',
            'Secure file storage and attachment system across the platform',
         ),
         icon: <FileUp className="h-5 w-5" />,
         color: 'text-teal-500',
         bgColor: 'bg-teal-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase3.uploads.employee',
                  'Employee Profile Documents',
               ),
               description: t(
                  'roadmap.phase3.uploads.employeeDesc',
                  'CV, certificates, contracts, photos – private to employee/HR',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.uploads.task',
                  'Task / Goal Attachments',
               ),
               description: t(
                  'roadmap.phase3.uploads.taskDesc',
                  'Upload files directly to tasks, goals, evaluations',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.uploads.storage',
                  'Supabase Storage Integration',
               ),
               description: t(
                  'roadmap.phase3.uploads.storageDesc',
                  'Signed URLs, size limits, file type validation, virus scan stub',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase3.uploads.preview', 'Basic File Previews'),
               description: t(
                  'roadmap.phase3.uploads.previewDesc',
                  'Image thumbnails, PDF first-page preview, download button',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase3.comments.title', 'Task Comments & @Mentions'),
         description: t(
            'roadmap.phase3.comments.description',
            'Discussion threads on tasks, goals, evaluations and profiles',
         ),
         icon: <MessageSquare className="h-5 w-5" />,
         color: 'text-cyan-500',
         bgColor: 'bg-cyan-500/10',
         tasks: [
            {
               name: t('roadmap.phase3.comments.thread', 'Comment Threads'),
               description: t(
                  'roadmap.phase3.comments.threadDesc',
                  'Rich text comments with markdown support (bold, lists, links)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.comments.mentions',
                  '@Mentions & Notifications',
               ),
               description: t(
                  'roadmap.phase3.comments.mentionsDesc',
                  'Type @ → autocomplete employees → trigger in-app/email notification',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase3.comments.reactions', 'Emoji Reactions'),
               description: t(
                  'roadmap.phase3.comments.reactionsDesc',
                  'Quick thumbs up, heart, etc. on comments',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.comments.editing',
                  'Edit / Delete Comments',
               ),
               description: t(
                  'roadmap.phase3.comments.editingDesc',
                  'Own comments editable for short time window + soft delete',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase3.activity.title',
            'Activity Logs & Audit Trail',
         ),
         description: t(
            'roadmap.phase3.activity.description',
            'Track who did what and when across the system',
         ),
         icon: <History className="h-5 w-5" />,
         color: 'text-indigo-500',
         bgColor: 'bg-indigo-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase3.activity.employee',
                  'Employee Profile Activity',
               ),
               description: t(
                  'roadmap.phase3.activity.employeeDesc',
                  'Changes to personal info, documents, status',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.activity.tasks',
                  'Task / Goal Activity Feed',
               ),
               description: t(
                  'roadmap.phase3.activity.tasksDesc',
                  'Created, assigned, commented, status changed, files added',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase3.activity.admin', 'Admin / HR Audit Log'),
               description: t(
                  'roadmap.phase3.activity.adminDesc',
                  'Role changes, warnings issued, bonuses granted, sensitive actions',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase3.activity.ui', 'Activity Timeline UI'),
               description: t(
                  'roadmap.phase3.activity.uiDesc',
                  'Chronological list with avatars, time ago, filters (today, week…)',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase3.hrfeatures.title',
            'HR Actions (Bonuses, Warnings, …)',
         ),
         description: t(
            'roadmap.phase3.hrfeatures.description',
            'Formal HR records and disciplinary/performance actions',
         ),
         icon: <Award className="h-5 w-5" />,
         color: 'text-amber-500',
         bgColor: 'bg-amber-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase3.hrfeatures.bonus',
                  'Bonus / Reward Records',
               ),
               description: t(
                  'roadmap.phase3.hrfeatures.bonusDesc',
                  'Amount, reason, date, approving manager',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.hrfeatures.warning',
                  'Verbal/Written Warnings',
               ),
               description: t(
                  'roadmap.phase3.hrfeatures.warningDesc',
                  'Type, reason, effective date, attached evidence, acknowledgment',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.hrfeatures.history',
                  'HR Actions History',
               ),
               description: t(
                  'roadmap.phase3.hrfeatures.historyDesc',
                  'Timeline in employee profile showing all bonuses/warnings',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase3.integrations.title',
            'Integrations (GitHub + Gmail)',
         ),
         description: t(
            'roadmap.phase3.integrations.description',
            'Connect external tools to enrich employee & task data',
         ),
         icon: <GitBranch className="h-5 w-5" />,
         color: 'text-pink-500',
         bgColor: 'bg-pink-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase3.integrations.github',
                  'GitHub OAuth + Commits',
               ),
               description: t(
                  'roadmap.phase3.integrations.githubDesc',
                  'Link GitHub account → show recent commits on profile/activity',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.integrations.gmail',
                  'Gmail / Google Calendar',
               ),
               description: t(
                  'roadmap.phase3.integrations.gmailDesc',
                  'Read calendar events → suggest work log entries / show conflicts',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.integrations.sync',
                  'Basic Two-way Sync Stub',
               ),
               description: t(
                  'roadmap.phase3.integrations.syncDesc',
                  'Future foundation for calendar sync and commit logging',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase3.chat.title', 'Real-time Chat (Internal)'),
         description: t(
            'roadmap.phase3.chat.description',
            'Simple team messaging to replace external tools',
         ),
         icon: <MessageCircle className="h-5 w-5" />,
         color: 'text-violet-500',
         bgColor: 'bg-violet-500/10',
         tasks: [
            {
               name: t('roadmap.phase3.chat.direct', 'Direct Messages (1:1)'),
               description: t(
                  'roadmap.phase3.chat.directDesc',
                  'Private chat between two employees',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase3.chat.group', 'Group Chats / Channels'),
               description: t(
                  'roadmap.phase3.chat.groupDesc',
                  'Department-based or custom groups',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.chat.realtime',
                  'Supabase Realtime Chat',
               ),
               description: t(
                  'roadmap.phase3.chat.realtimeDesc',
                  'Live message delivery, typing indicators, read receipts',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase3.chat.attach',
                  'File & Image Attachments in Chat',
               ),
               description: t(
                  'roadmap.phase3.chat.attachDesc',
                  'Send documents/images directly in messages',
               ),
               status: 'pending' as const,
            },
         ],
      },
   ];

   const getStatusBadge = (status: TaskStatus) => {
      const statusConfig = {
         completed: {
            label: t('roadmap.status.completed', 'Completed'),
            variant: 'default' as const,
            icon: <CheckCircle2 className="h-3 w-3" />,
         },
         'in-progress': {
            label: t('roadmap.status.inProgress', 'In Progress'),
            variant: 'secondary' as const,
            icon: <ArrowRight className="h-3 w-3" />,
         },
         pending: {
            label: t('roadmap.status.pending', 'Pending'),
            variant: 'outline' as const,
            icon: <Target className="h-3 w-3" />,
         },
      };

      const config = statusConfig[status];
      return (
         <Badge variant={config.variant} className="flex items-center gap-1">
            {config.icon}
            {config.label}
         </Badge>
      );
   };

   const calculateProgress = () => {
      const totalTasks = categories.reduce(
         (sum, cat) => sum + cat.tasks.length,
         0,
      );
      const completedTasks = categories.reduce(
         (sum, cat) =>
            sum + cat.tasks.filter((t) => t.status === 'completed').length,
         0,
      );
      return Math.round((completedTasks / totalTasks) * 100);
   };

   const progress = calculateProgress();

   return (
      <section className="space-y-8 pb-12">
         {/* Phase Header – always visible */}
         <Card className="border-2 border-teal-500/20 bg-linear-to-br from-teal-500/5 to-transparent">
            <CardHeader>
               <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                     <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500">
                        <Rocket className="h-8 w-8" />
                     </div>
                     <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                           <CardTitle className="text-3xl">
                              {t('roadmap.phase3Label', 'Phase 3')}
                           </CardTitle>
                           <Badge className="bg-teal-500">
                              {t(
                                 'roadmap.phase3.status',
                                 'Collaboration & Communication',
                              )}
                           </Badge>
                        </div>
                        <CardDescription className="text-xl font-semibold mb-2">
                           {t(
                              'roadmap.phase3.title',
                              'Collaboration – Tasks, Chat, Files & HR Actions',
                           )}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">
                           {t('roadmap.phase3.duration', 'Duration: 3-4 weeks')}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Progress Bar */}
               <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                     <span className="font-medium">
                        {t('roadmap.progress', 'Overall Progress')}
                     </span>
                     <span className="font-bold text-teal-500">
                        {progress}%
                     </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                     <div
                        className="h-full bg-linear-to-r from-teal-500 to-teal-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                     />
                  </div>
               </div>

               {/* Goal */}
               <div className="mt-6 rounded-lg border bg-card p-4">
                  <p className="mb-2 text-sm font-semibold">
                     {t('roadmap.goal', 'Goal')}:
                  </p>
                  <p className="text-muted-foreground">
                     {t(
                        'roadmap.phase3.goal',
                        'Transform the system from individual tracking into a collaborative workspace. Enable file sharing, discussions, real-time communication, and formal HR documentation — making the platform the central place for team & HR interaction.',
                     )}
                  </p>
               </div>
            </CardHeader>
         </Card>

         {/* Collapsible detailed content */}
         <Accordion type="single" collapsible defaultValue={undefined}>
            <AccordionItem value="details" className="border-none">
               <AccordionTrigger className="rounded-lg border bg-muted/40 px-5 py-4 hover:no-underline hover:bg-muted/60">
                  <div className="flex items-center gap-3 font-medium text-lg">
                     <FileText className="h-5 w-5 text-muted-foreground" />
                     {t('roadmap.showDetails', 'Show phase details & tasks')}
                  </div>
               </AccordionTrigger>

               <AccordionContent className="pt-6">
                  <div className="space-y-10">
                     {/* Categories */}
                     <div className="grid gap-6">
                        {categories.map((category, index) => (
                           <Card
                              key={index}
                              className="border-2 transition-shadow hover:shadow-lg"
                           >
                              <CardHeader>
                                 <div className="flex items-center gap-3">
                                    <div
                                       className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${category.bgColor} ${category.color}`}
                                    >
                                       {category.icon}
                                    </div>
                                    <div className="flex-1">
                                       <CardTitle className="text-xl">
                                          {category.title}
                                       </CardTitle>
                                       <CardDescription>
                                          {category.description}
                                       </CardDescription>
                                    </div>
                                 </div>
                              </CardHeader>

                              <CardContent>
                                 <div className="space-y-3">
                                    {category.tasks.map((task, taskIndex) => (
                                       <div
                                          key={taskIndex}
                                          className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                                       >
                                          <div className="flex-1 space-y-1">
                                             <div className="flex items-center justify-between gap-3">
                                                <h4 className="font-semibold">
                                                   {task.name}
                                                </h4>
                                                {getStatusBadge(task.status)}
                                             </div>
                                             <p className="text-sm text-muted-foreground">
                                                {task.description}
                                             </p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </CardContent>
                           </Card>
                        ))}
                     </div>

                     {/* Deliverable */}
                     <Card className="border-2 border-primary/20 bg-primary/5">
                        <CardContent className="pt-6">
                           <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                 <Target className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                 <h3 className="mb-2 font-semibold">
                                    {t(
                                       'roadmap.deliverable',
                                       'Phase Deliverable',
                                    )}
                                 </h3>
                                 <p className="text-muted-foreground">
                                    {t(
                                       'roadmap.phase3.deliverable',
                                       '🎯 Team members can discuss tasks, attach files, mention colleagues, see activity history. HR can record formal actions. Basic internal chat and external tool integrations (GitHub/Gmail) are in place — turning the platform into a collaborative HR & work hub.',
                                    )}
                                 </p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     {/* Key Technologies */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              {t(
                                 'roadmap.phase3.technologies',
                                 'Key Technologies / Additions',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {[
                                 'Supabase Storage (file uploads)',
                                 'Supabase Realtime (chat + live updates)',
                                 'Tiptap / Lexical / React Markdown (rich comments)',
                                 'Google OAuth / Gmail API (calendar integration)',
                                 'GitHub OAuth / API (commit history)',
                                 'TanStack Query + Realtime subscriptions',
                                 'Sonner (toasts & notifications)',
                                 'date-fns + lodash (formatting & utils)',
                              ].map((tech, index) => (
                                 <div
                                    key={index}
                                    className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3"
                                 >
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                    <span className="text-sm font-medium">
                                       {tech}
                                    </span>
                                 </div>
                              ))}
                           </div>
                        </CardContent>
                     </Card>

                     {/* Success Criteria */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                              {t(
                                 'roadmap.phase3.successCriteria',
                                 'Success Criteria',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                              {[
                                 t(
                                    'roadmap.phase3.criteria1',
                                    'Users can upload and view files in profiles and tasks',
                                 ),
                                 t(
                                    'roadmap.phase3.criteria2',
                                    'Comments with @mentions trigger proper notifications',
                                 ),
                                 t(
                                    'roadmap.phase3.criteria3',
                                    'Activity logs are visible and filterable',
                                 ),
                                 t(
                                    'roadmap.phase3.criteria4',
                                    'HR can record bonuses and warnings with history',
                                 ),
                                 t(
                                    'roadmap.phase3.criteria5',
                                    'GitHub commits and Gmail calendar events appear where relevant',
                                 ),
                                 t(
                                    'roadmap.phase3.criteria6',
                                    'Basic real-time chat works between users and in groups',
                                 ),
                                 t(
                                    'roadmap.phase3.criteria7',
                                    'All collaboration features respect RBAC and tenant isolation',
                                 ),
                                 t(
                                    'roadmap.phase3.criteria8',
                                    'System feels like a connected team workspace, not just a tracker',
                                 ),
                              ].map((criterion, index) => (
                                 <li
                                    key={index}
                                    className="flex items-start gap-3"
                                 >
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                                    <span className="text-sm">{criterion}</span>
                                 </li>
                              ))}
                           </ul>
                        </CardContent>
                     </Card>
                  </div>
               </AccordionContent>
            </AccordionItem>
         </Accordion>
      </section>
   );
}
