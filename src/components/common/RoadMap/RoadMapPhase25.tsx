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
   Bell,
   Star,
   ClipboardList,
   Search,
   BarChart3,
   ArrowRight,
   Target,
   Rocket,
   Sparkles,
   FileText,
} from 'lucide-react';
import type { JSX } from 'react';

export default function RoadMapPhase25() {
   const { t } = useTranslation('roadmap');

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
         title: t(
            'roadmap.phase25.notifications.title',
            'Notifications (Email + In-App)',
         ),
         description: t(
            'roadmap.phase25.notifications.description',
            'Real-time alerts and reminders to keep users engaged and informed',
         ),
         icon: <Bell className="h-5 w-5" />,
         color: 'text-rose-500',
         bgColor: 'bg-rose-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase25.notifications.inapp',
                  'In-App Notification Center',
               ),
               description: t(
                  'roadmap.phase25.notifications.inappDesc',
                  'Bell icon with dropdown showing unread notifications, mark as read, history',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.notifications.email',
                  'Email Notifications',
               ),
               description: t(
                  'roadmap.phase25.notifications.emailDesc',
                  'Transactional emails via Supabase/Resend/SendGrid (welcome, password reset, mentions, etc.)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.notifications.triggers',
                  'Key Event Triggers',
               ),
               description: t(
                  'roadmap.phase25.notifications.triggersDesc',
                  'New employee added, profile updated, evaluation due, work log submitted, approval requests',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.notifications.preferences',
                  'Notification Preferences',
               ),
               description: t(
                  'roadmap.phase25.notifications.preferencesDesc',
                  'User can toggle email/in-app for different categories',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.notifications.realTime',
                  'Real-time (WebSockets / Supabase Realtime)',
               ),
               description: t(
                  'roadmap.phase25.notifications.realTimeDesc',
                  'Live updates for approvals, mentions, urgent alerts',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase25.evaluation.title',
            'Performance Evaluation System (Basic)',
         ),
         description: t(
            'roadmap.phase25.evaluation.description',
            'Simple goal setting + review cycles to start tracking performance',
         ),
         icon: <Star className="h-5 w-5" />,
         color: 'text-amber-500',
         bgColor: 'bg-amber-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase25.evaluation.goals',
                  'Goal / OKR Creation & Assignment',
               ),
               description: t(
                  'roadmap.phase25.evaluation.goalsDesc',
                  'Managers create assignable goals with title, description, due date, progress %',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.evaluation.review',
                  'Performance Review Forms',
               ),
               description: t(
                  'roadmap.phase25.evaluation.reviewDesc',
                  'Customizable templates (self-review + manager review), rating scales, comments',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.evaluation.cycles',
                  'Review Cycles / Schedules',
               ),
               description: t(
                  'roadmap.phase25.evaluation.cyclesDesc',
                  'Quarterly / annual cycles with start/end dates and auto-reminders',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.evaluation.history',
                  'Performance History View',
               ),
               description: t(
                  'roadmap.phase25.evaluation.historyDesc',
                  'Employee profile shows past reviews, average scores, trends',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase25.worklogs.title', 'Daily Work Logs'),
         description: t(
            'roadmap.phase25.worklogs.description',
            'Simple daily activity tracking for employees (self-reported)',
         ),
         icon: <ClipboardList className="h-5 w-5" />,
         color: 'text-cyan-500',
         bgColor: 'bg-cyan-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase25.worklogs.entry',
                  'Daily Log Entry Form',
               ),
               description: t(
                  'roadmap.phase25.worklogs.entryDesc',
                  'Quick form: date, tasks done, hours spent, notes / blockers',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.worklogs.history',
                  'Personal Work Log History',
               ),
               description: t(
                  'roadmap.phase25.worklogs.historyDesc',
                  'Calendar / list view of past logs with edit option (limited time window)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.worklogs.managerView',
                  'Manager / Team View',
               ),
               description: t(
                  'roadmap.phase25.worklogs.managerViewDesc',
                  'See team members’ recent logs, filter by date / employee',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.worklogs.reminders',
                  'Daily Submission Reminder',
               ),
               description: t(
                  'roadmap.phase25.worklogs.remindersDesc',
                  'End-of-day notification / email nudge to submit log',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase25.search.title',
            'Global Search & Advanced Filters',
         ),
         description: t(
            'roadmap.phase25.search.description',
            'Make finding people, logs, evaluations fast and intuitive',
         ),
         icon: <Search className="h-5 w-5" />,
         color: 'text-violet-500',
         bgColor: 'bg-violet-500/10',
         tasks: [
            {
               name: t('roadmap.phase25.search.global', 'Global Search Bar'),
               description: t(
                  'roadmap.phase25.search.globalDesc',
                  'Search employees by name, email, department, job title (top navbar)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.search.filters',
                  'Advanced Filters Everywhere',
               ),
               description: t(
                  'roadmap.phase25.search.filtersDesc',
                  'Employee list, work logs, evaluations — department, status, date range, role',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase25.search.quick', 'Quick Employee Jump'),
               description: t(
                  'roadmap.phase25.search.quickDesc',
                  'Type name → instant dropdown with profile link',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase25.analytics.title',
            'Basic Analytics & Reports',
         ),
         description: t(
            'roadmap.phase25.analytics.description',
            'Simple dashboards and exportable insights',
         ),
         icon: <BarChart3 className="h-5 w-5" />,
         color: 'text-emerald-500',
         bgColor: 'bg-emerald-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase25.analytics.dashboard',
                  'Enhanced Dashboard Widgets',
               ),
               description: t(
                  'roadmap.phase25.analytics.dashboardDesc',
                  'Headcount trends, average performance score, log submission rate, goals completion %',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase25.analytics.reports',
                  'Exportable Reports',
               ),
               description: t(
                  'roadmap.phase25.analytics.reportsDesc',
                  'CSV / PDF export: employee list, performance summaries, work log summaries',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase25.analytics.period', 'Period Comparison'),
               description: t(
                  'roadmap.phase25.analytics.periodDesc',
                  'Month-over-month or quarter-over-quarter key metrics',
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
         <Card className="border-2 border-purple-500/20 bg-linear-to-br from-purple-500/5 to-transparent">
            <CardHeader>
               <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                     <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                        <Rocket className="h-8 w-8" />
                     </div>
                     <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                           <CardTitle className="text-3xl">
                              {t('roadmap.phase25Label', 'Phase 2.5')}
                           </CardTitle>
                           <Badge className="bg-purple-500">
                              {t(
                                 'roadmap.phase25.status',
                                 'Essential Features Sprint',
                              )}
                           </Badge>
                        </div>
                        <CardDescription className="text-xl font-semibold mb-2">
                           {t(
                              'roadmap.phase25.title',
                              'Essential Features — Notifications + Evaluation + Logs + Search + Analytics',
                           )}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">
                           {t(
                              'roadmap.phase25.duration',
                              'Duration: 2-3 weeks',
                           )}
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
                     <span className="font-bold text-purple-500">
                        {progress}%
                     </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                     <div
                        className="h-full bg-linear-to-r from-purple-500 to-purple-600 transition-all duration-500"
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
                        'roadmap.phase25.goal',
                        'Add daily habits, communication, visibility, and light performance tracking to make the system feel alive and useful on a day-to-day basis. Increase user retention and daily active usage.',
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
                                       'roadmap.phase25.deliverable',
                                       '🎯 Users receive timely notifications. Managers can assign goals and run basic reviews. Employees log daily work. Everyone finds data quickly. Leadership gets simple visibility into activity and performance trends.',
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
                              <Sparkles className="h-5 w-5" />
                              {t(
                                 'roadmap.phase25.technologies',
                                 'Key Technologies / Additions',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {[
                                 'Supabase Realtime (for live notifications)',
                                 'Resend / Nodemailer / SendGrid (emails)',
                                 'TanStack Query (data fetching & caching)',
                                 'Recharts (analytics charts)',
                                 'React Hook Form + Zod (forms)',
                                 'Sonner (in-app toasts)',
                                 'date-fns (date handling)',
                                 'Command + Dialog (global search)',
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
                                 'roadmap.phase25.successCriteria',
                                 'Success Criteria',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                              {[
                                 t(
                                    'roadmap.phase25.criteria1',
                                    'Users see relevant in-app + email notifications for key events',
                                 ),
                                 t(
                                    'roadmap.phase25.criteria2',
                                    'Managers can create goals and start simple performance reviews',
                                 ),
                                 t(
                                    'roadmap.phase25.criteria3',
                                    'Employees can submit daily work logs easily and managers can view them',
                                 ),
                                 t(
                                    'roadmap.phase25.criteria4',
                                    'Global search finds employees quickly; filters work across lists',
                                 ),
                                 t(
                                    'roadmap.phase25.criteria5',
                                    'Dashboard shows meaningful basic analytics (completion rates, trends)',
                                 ),
                                 t(
                                    'roadmap.phase25.criteria6',
                                    'All new features respect RBAC and multi-tenancy',
                                 ),
                                 t(
                                    'roadmap.phase25.criteria7',
                                    'System feels more interactive and useful day-to-day',
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
