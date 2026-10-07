'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   ClipboardList,
   Star,
   BarChart3,
   Bell,
   Download,
   Plus,
   Clock,
   Building,
   Users,
   Kanban,
   Sliders,
   TrendingUp,
   AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import {
   getDailyWorkLogsAPI,
   submitDailyWorkLogAPI,
} from '@/features/worklogs/api/worklogApis';
import {
   getPerformanceGoalsAPI,
   createPerformanceGoalAPI,
   updateGoalProgressAPI,
   getPerformanceReviewsAPI,
   createPerformanceReviewAPI,
} from '@/features/performance/api/performanceApis';
import {
   getNotificationsAPI,
   markAllNotificationsReadAPI,
   getNotificationPreferencesAPI,
   updateNotificationPreferencesAPI,
} from '@/features/notifications/api/notificationApis';
import { getCurrentCompanyEmployeesAPI } from '@/features/company/api/companyApis';
import { getProjectsAPI } from '@/features/projects/api/projectApis';
import { getTasksAPI } from '@/features/tasks/api/taskApis';
import PWAInstallBanner from '@/components/common/PWAInstallBanner';
import AdvancedReportingView from '@/components/reporting/AdvancedReportingView';
import BackgroundJobsManager from '@/components/jobs/BackgroundJobsManager';
import { Activity, Github, Mail, Power, Cpu, FileText } from 'lucide-react';
import {
   getActivityLogsAPI,
   getWorkspaceIntegrationsAPI,
   toggleIntegrationAPI,
} from '@/features/collaboration/api/collaborationApis';
import type { ActivityLog, IntegrationProvider } from '@/types/collaboration';

type TabKey =
   | 'worklogs'
   | 'performance'
   | 'analytics'
   | 'reporting'
   | 'jobs'
   | 'notifications'
   | 'activity'
   | 'integrations'
   | 'tools';

export default function MorePage() {
   const { companyId } = useAuth();
   const { isManagerOrAbove } = useRole();
   const queryClient = useQueryClient();


   const [activeTab, setActiveTab] = useState<TabKey>('worklogs');

   // WORK LOG FORM STATE
   const [tasksCompleted, setTasksCompleted] = useState('');
   const [hoursWorked, setHoursWorked] = useState(8);
   const [blockers, setBlockers] = useState('');
   const [moodRating, setMoodRating] = useState(4);
   const [logNotes, setLogNotes] = useState('');

   // GOAL FORM STATE
   const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
   const [goalTitle, setGoalTitle] = useState('');
   const [goalDesc, setGoalDesc] = useState('');
   const [goalEmployeeId, setGoalEmployeeId] = useState('');
   const [goalTargetDate, setGoalTargetDate] = useState('');

   // REVIEW FORM STATE
   const [isNewReviewOpen, setIsNewReviewOpen] = useState(false);
   const [reviewEmployeeId, setReviewEmployeeId] = useState('');
   const [reviewCycle, setReviewCycle] = useState('2026 Q3');
   const [reviewRating, setReviewRating] = useState(5);
   const [reviewStrengths, setReviewStrengths] = useState('');
   const [reviewGrowth, setReviewGrowth] = useState('');
   const [reviewFeedback, setReviewFeedback] = useState('');

   // FILTER STATES
   const [logSearchQuery, setLogSearchQuery] = useState('');

   // QUERIES
   const { data: employees = [] } = useQuery({
      queryKey: ['company-employees', companyId],
      queryFn: getCurrentCompanyEmployeesAPI,
      enabled: Boolean(companyId),
   });

   const { data: projects = [] } = useQuery({
      queryKey: ['projects', companyId],
      queryFn: () => getProjectsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: tasks = [] } = useQuery({
      queryKey: ['tasks', companyId],
      queryFn: () => getTasksAPI({ companyId: companyId || undefined }),
      enabled: Boolean(companyId),
   });

   // Activity Logs Query
   const { data: activityLogs = [], isLoading: isActivityLoading } = useQuery({
      queryKey: ['activity-logs', companyId],
      queryFn: () => getActivityLogsAPI(companyId || undefined, 50),
      enabled: Boolean(companyId),
   });

   // Integrations Query
   const { data: integrations = [] } = useQuery({
      queryKey: ['workspace-integrations', companyId],
      queryFn: () => getWorkspaceIntegrationsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   // Integration Toggle Mutation
   const toggleIntegrationMutation = useMutation({
      mutationFn: ({
         provider,
         status,
         config = {},
      }: {
         provider: IntegrationProvider;
         status: 'connected' | 'disconnected';
         config?: Record<string, unknown>;
      }) =>
         toggleIntegrationAPI({
            companyId: companyId!,
            provider,
            status,
            config,
         }),
      onSuccess: (_, vars) => {
         toast.success(`Integration ${vars.provider} updated (${vars.status})`);
         queryClient.invalidateQueries({ queryKey: ['workspace-integrations'] });
         queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to toggle integration'),
   });

   const { data: workLogs = [], isLoading: isLogsLoading } = useQuery({
      queryKey: ['daily-work-logs', companyId],
      queryFn: () => getDailyWorkLogsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: goals = [], isLoading: isGoalsLoading } = useQuery({
      queryKey: ['performance-goals', companyId],
      queryFn: () => getPerformanceGoalsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
      queryKey: ['performance-reviews', companyId],
      queryFn: () => getPerformanceReviewsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: notifications = [] } = useQuery({
      queryKey: ['notifications'],
      queryFn: getNotificationsAPI,
   });

   const { data: preferences } = useQuery({
      queryKey: ['notification-preferences'],
      queryFn: getNotificationPreferencesAPI,
   });

   // MUTATIONS
   const submitLogMutation = useMutation({
      mutationFn: () =>
         submitDailyWorkLogAPI({
            company_id: companyId!,
            tasks_completed: tasksCompleted,
            hours_worked: Number(hoursWorked),
            blockers: blockers || undefined,
            mood_rating: Number(moodRating),
            notes: logNotes || undefined,
         }),
      onSuccess: () => {
         toast.success("Today's work log submitted successfully!");
         setTasksCompleted('');
         setBlockers('');
         setLogNotes('');
         queryClient.invalidateQueries({ queryKey: ['daily-work-logs'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to submit log'),
   });

   const createGoalMutation = useMutation({
      mutationFn: () =>
         createPerformanceGoalAPI({
            company_id: companyId!,
            employee_id: goalEmployeeId,
            title: goalTitle,
            description: goalDesc,
            target_date: goalTargetDate || undefined,
            progress: 0,
         }),
      onSuccess: () => {
         toast.success('Performance goal created successfully');
         setIsNewGoalOpen(false);
         setGoalTitle('');
         setGoalDesc('');
         queryClient.invalidateQueries({ queryKey: ['performance-goals'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to create goal'),
   });

   const updateGoalMutation = useMutation({
      mutationFn: ({ goalId, progress }: { goalId: string; progress: number }) =>
         updateGoalProgressAPI(goalId, progress),
      onSuccess: () => {
         toast.success('Goal progress updated');
         queryClient.invalidateQueries({ queryKey: ['performance-goals'] });
      },
   });

   const createReviewMutation = useMutation({
      mutationFn: () =>
         createPerformanceReviewAPI({
            company_id: companyId!,
            employee_id: reviewEmployeeId,
            cycle: reviewCycle,
            rating: Number(reviewRating),
            strengths: reviewStrengths,
            growth_areas: reviewGrowth,
            feedback: reviewFeedback,
         }),
      onSuccess: () => {
         toast.success('Performance evaluation recorded');
         setIsNewReviewOpen(false);
         setReviewFeedback('');
         setReviewStrengths('');
         setReviewGrowth('');
         queryClient.invalidateQueries({ queryKey: ['performance-reviews'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to record review'),
   });

   const togglePrefMutation = useMutation({
      mutationFn: (key: string) => {
         const current = preferences as Record<string, unknown> | undefined;
         const newVal = !current?.[key];
         return updateNotificationPreferencesAPI({ [key]: newVal });
      },
      onSuccess: () => {
         toast.success('Preference updated');
         queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
      },
   });

   const markAllReadMutation = useMutation({
      mutationFn: markAllNotificationsReadAPI,
      onSuccess: () => {
         toast.success('All marked as read');
         queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
   });

   // CSV EXPORTERS
   const exportWorkLogsCsv = () => {
      const rows = [
         ['Date', 'Employee', 'Hours', 'Tasks Completed', 'Blockers', 'Mood'],
         ...workLogs.map((l) => [
            l.log_date,
            l.employee?.full_name || 'Employee',
            l.hours_worked.toString(),
            `"${l.tasks_completed.replace(/"/g, '""')}"`,
            `"${(l.blockers || '').replace(/"/g, '""')}"`,
            l.mood_rating ? `${l.mood_rating}/5` : 'N/A',
         ]),
      ];
      const csv = rows.map((r) => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `work_logs_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
   };

   const exportPerformanceCsv = () => {
      const rows = [
         ['Cycle', 'Employee', 'Reviewer', 'Rating', 'Feedback'],
         ...reviews.map((r) => [
            r.cycle,
            r.employee?.full_name || 'Employee',
            r.reviewer?.full_name || 'Reviewer',
            `${r.rating}/5`,
            `"${r.feedback.replace(/"/g, '""')}"`,
         ]),
      ];
      const csv = rows.map((r) => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evaluations_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
   };

   // Filter work logs
   const filteredLogs = workLogs.filter((log) => {
      if (!logSearchQuery.trim()) return true;
      const q = logSearchQuery.toLowerCase();
      return (
         log.tasks_completed.toLowerCase().includes(q) ||
         (log.employee?.full_name && log.employee.full_name.toLowerCase().includes(q)) ||
         log.log_date.includes(q)
      );
   });

   // Analytics calculations
   const totalHoursLoggedAllTime = tasks.reduce((sum, t) => sum + (t.logged_hours || 0), 0);
   const completedTasksCount = tasks.filter((t) => t.status === 'done').length;
   const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
   const avgRating =
      reviews.length > 0
         ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
         : '5.0';

   return (
      <div className="space-y-8">
         {/* Top Header */}
         <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
               Workforce Operations & Scale Hub
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
               Scale & Polish — Advanced reporting, background jobs queue, PWA capabilities, and integrations.
            </p>
         </div>

         {/* PWA Install & Push Notification Banner */}
         <PWAInstallBanner />

         {/* Navigation Tabs */}
         <div className="flex flex-wrap items-center gap-2 border-b pb-3">
            <Button
               variant={activeTab === 'reporting' ? 'default' : 'ghost'}
               size="sm"
               onClick={() => setActiveTab('reporting')}
               className="gap-2"
            >
               <FileText className="size-4" />
               Advanced Reporting
            </Button>
            <Button
               variant={activeTab === 'jobs' ? 'default' : 'ghost'}
               size="sm"
               onClick={() => setActiveTab('jobs')}
               className="gap-2"
            >
               <Cpu className="size-4" />
               Background Jobs
            </Button>
            <Button
               variant={activeTab === 'worklogs' ? 'default' : 'ghost'}
               size="sm"
               onClick={() => setActiveTab('worklogs')}
               className="gap-2"
            >
               <ClipboardList className="size-4" />
               Daily Work Logs
            </Button>
            <Button
               variant={activeTab === 'performance' ? 'default' : 'ghost'}
               size="sm"
               onClick={() => setActiveTab('performance')}
               className="gap-2"
            >
               <Star className="size-4" />
               Performance & Goals
            </Button>
            <Button
               variant={activeTab === 'analytics' ? 'default' : 'ghost'}
               size="sm"
               onClick={() => setActiveTab('analytics')}
               className="gap-2"
            >
               <BarChart3 className="size-4" />
               Analytics & Reports
            </Button>
            <Button
               variant={activeTab === 'notifications' ? 'default' : 'ghost'}
               size="sm"
               onClick={() => setActiveTab('notifications')}
               className="gap-2"
            >
               <Bell className="size-4" />
               Notifications
            </Button>
            <Button
               variant={activeTab === 'activity' ? 'default' : 'ghost'}
               size="sm"
               onClick={() => setActiveTab('activity')}
               className="gap-2"
            >
               <Activity className="size-4" />
               Activity Logs
            </Button>
            <Button
               variant={activeTab === 'integrations' ? 'default' : 'ghost'}
               size="sm"
               onClick={() => setActiveTab('integrations')}
               className="gap-2"
            >
               <Github className="size-4" />
               Integrations (GitHub/Gmail)
            </Button>
            <Button
               variant={activeTab === 'tools' ? 'default' : 'ghost'}
               size="sm"
               onClick={() => setActiveTab('tools')}
               className="gap-2"
            >
               <Sliders className="size-4" />
               Quick Shortcuts
            </Button>
         </div>

         {/* TAB 1: DAILY WORK LOGS */}
         {activeTab === 'worklogs' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Submission Form */}
                  <Card className="lg:col-span-1 shadow-sm">
                     <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                           <ClipboardList className="size-5 text-primary" />
                           Submit Daily Log
                        </CardTitle>
                        <CardDescription>
                           Report completed tasks, blockers, and hours for today.
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="wl-tasks">Tasks Completed Today</Label>
                           <Textarea
                              id="wl-tasks"
                              rows={3}
                              placeholder="e.g. Completed API endpoints for auth, attended sprint review..."
                              value={tasksCompleted}
                              onChange={(e) => setTasksCompleted(e.target.value)}
                           />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-2">
                              <Label htmlFor="wl-hours">Hours Spent</Label>
                              <Input
                                 id="wl-hours"
                                 type="number"
                                 min="0.5"
                                 step="0.5"
                                 value={hoursWorked}
                                 onChange={(e) => setHoursWorked(Number(e.target.value))}
                              />
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="wl-mood">Mood / Productivity</Label>
                              <select
                                 id="wl-mood"
                                 value={moodRating}
                                 onChange={(e) => setMoodRating(Number(e.target.value))}
                                 className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs outline-none"
                              >
                                 <option value="5">🔥 Excellent (5/5)</option>
                                 <option value="4">😊 Good (4/5)</option>
                                 <option value="3">😐 Normal (3/5)</option>
                                 <option value="2">😕 Slow (2/5)</option>
                                 <option value="1">😫 Blocked (1/5)</option>
                              </select>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="wl-blockers">Blockers / Challenges (Optional)</Label>
                           <Input
                              id="wl-blockers"
                              placeholder="Any impediments slowing you down?"
                              value={blockers}
                              onChange={(e) => setBlockers(e.target.value)}
                           />
                        </div>

                        <Button
                           className="w-full gap-2 mt-2"
                           disabled={!tasksCompleted.trim() || submitLogMutation.isPending}
                           onClick={() => submitLogMutation.mutate()}
                        >
                           {submitLogMutation.isPending ? 'Submitting...' : "Submit Today's Log"}
                        </Button>
                     </CardContent>
                  </Card>

                  {/* Work Log History */}
                  <Card className="lg:col-span-2 shadow-sm">
                     <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div>
                           <CardTitle className="text-lg">Work Log History</CardTitle>
                           <CardDescription>
                              Submitted daily records across team members.
                           </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                           <Input
                              type="search"
                              placeholder="Search logs..."
                              value={logSearchQuery}
                              onChange={(e) => setLogSearchQuery(e.target.value)}
                              className="h-8 w-44 text-xs"
                           />
                           <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5 text-xs"
                              onClick={exportWorkLogsCsv}
                           >
                              <Download className="size-3.5" />
                              Export CSV
                           </Button>
                        </div>
                     </CardHeader>
                     <CardContent>
                        {isLogsLoading ? (
                           <div className="flex h-40 items-center justify-center">
                              <Spinner />
                           </div>
                        ) : filteredLogs.length === 0 ? (
                           <p className="p-8 text-center text-xs text-muted-foreground">
                              No work logs found. Submit your first daily work report above.
                           </p>
                        ) : (
                           <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                              {filteredLogs.map((log) => (
                                 <div
                                    key={log.id}
                                    className="rounded-xl border bg-muted/20 p-3.5 text-xs space-y-2 transition-colors hover:bg-muted/40"
                                 >
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-2">
                                          <span className="font-semibold text-foreground">
                                             {log.employee?.full_name || 'Employee'}
                                          </span>
                                          <Badge variant="outline" className="text-[10px]">
                                             {log.log_date}
                                          </Badge>
                                       </div>
                                       <div className="flex items-center gap-2 text-muted-foreground">
                                          <span className="font-medium text-foreground">
                                             {log.hours_worked} hrs
                                          </span>
                                          {log.mood_rating && (
                                             <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                                                ★ {log.mood_rating}/5
                                             </span>
                                          )}
                                       </div>
                                    </div>
                                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                                       {log.tasks_completed}
                                    </p>
                                    {log.blockers && (
                                       <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-[11px] bg-amber-500/10 p-1.5 rounded">
                                          <AlertTriangle className="size-3 shrink-0" />
                                          <span>Blocker: {log.blockers}</span>
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        )}
                     </CardContent>
                  </Card>
               </div>
            </div>
         )}

         {/* TAB 2: PERFORMANCE & GOALS */}
         {activeTab === 'performance' && (
            <div className="space-y-8">
               {/* GOALS SECTION */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div>
                        <h2 className="text-xl font-bold">Goals & OKRs</h2>
                        <p className="text-xs text-muted-foreground">
                           Strategic objectives and progress tracking for team members.
                        </p>
                     </div>
                     <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setIsNewGoalOpen(true)}
                     >
                        <Plus className="size-4" />
                        New Goal
                     </Button>
                  </div>

                  {isGoalsLoading ? (
                     <div className="flex h-32 items-center justify-center">
                        <Spinner />
                     </div>
                  ) : goals.length === 0 ? (
                     <Card className="p-8 text-center text-xs text-muted-foreground">
                        No goals established yet. Create an objective to start tracking progress.
                     </Card>
                  ) : (
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {goals.map((g) => (
                           <Card key={g.id} className="flex flex-col justify-between">
                              <CardHeader className="pb-2">
                                 <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-base font-semibold">
                                       {g.title}
                                    </CardTitle>
                                    <Badge
                                       variant={g.status === 'completed' ? 'secondary' : 'outline'}
                                       className="capitalize text-[10px]"
                                    >
                                       {g.status.replace('_', ' ')}
                                    </Badge>
                                 </div>
                                 <CardDescription className="text-xs line-clamp-2">
                                    {g.description || 'No description'}
                                 </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3 pt-0">
                                 <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Assigned: {g.employee?.full_name || 'Unassigned'}</span>
                                    <span className="font-bold text-foreground">{g.progress}%</span>
                                 </div>
                                 <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                    <div
                                       className="h-full bg-primary transition-all"
                                       style={{ width: `${g.progress}%` }}
                                    />
                                 </div>
                                 <div className="flex items-center gap-1.5 pt-2 border-t">
                                    <Button
                                       size="sm"
                                       variant="outline"
                                       className="h-7 text-[10px] flex-1"
                                       onClick={() =>
                                          updateGoalMutation.mutate({
                                             goalId: g.id,
                                             progress: Math.min(100, g.progress + 20),
                                          })
                                       }
                                    >
                                       +20% Progress
                                    </Button>
                                    <Button
                                       size="sm"
                                       variant="secondary"
                                       className="h-7 text-[10px]"
                                       onClick={() =>
                                          updateGoalMutation.mutate({
                                             goalId: g.id,
                                             progress: 100,
                                          })
                                       }
                                    >
                                       Complete
                                    </Button>
                                 </div>
                              </CardContent>
                           </Card>
                        ))}
                     </div>
                  )}
               </div>

               {/* REVIEWS SECTION */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div>
                        <h2 className="text-xl font-bold">Performance Evaluations</h2>
                        <p className="text-xs text-muted-foreground">
                           Structured feedback cycles and rating records.
                        </p>
                     </div>
                     <div className="flex items-center gap-2">
                        <Button
                           variant="outline"
                           size="sm"
                           className="gap-1.5 text-xs"
                           onClick={exportPerformanceCsv}
                        >
                           <Download className="size-3.5" />
                           Export CSV
                        </Button>
                        {isManagerOrAbove && (
                           <Button
                              size="sm"
                              className="gap-1.5"
                              onClick={() => setIsNewReviewOpen(true)}
                           >
                              <Plus className="size-4" />
                              Conduct Evaluation
                           </Button>
                        )}
                     </div>
                  </div>

                  {isReviewsLoading ? (
                     <div className="flex h-32 items-center justify-center">
                        <Spinner />
                     </div>
                  ) : reviews.length === 0 ? (
                     <Card className="p-8 text-center text-xs text-muted-foreground">
                        No performance evaluations recorded yet.
                     </Card>
                  ) : (
                     <div className="space-y-3">
                        {reviews.map((rev) => (
                           <Card key={rev.id}>
                              <CardContent className="p-4 space-y-2 text-xs">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <span className="font-bold text-sm text-foreground">
                                          {rev.employee?.full_name}
                                       </span>
                                       <Badge variant="outline">{rev.cycle}</Badge>
                                       <span className="text-muted-foreground">
                                          Reviewed by {rev.reviewer?.full_name}
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-1 font-bold text-amber-500">
                                       ★ {rev.rating} / 5
                                    </div>
                                 </div>
                                 <p className="text-foreground leading-relaxed">
                                    {rev.feedback}
                                 </p>
                                 {(rev.strengths || rev.growth_areas) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t text-[11px]">
                                       {rev.strengths && (
                                          <div className="rounded bg-emerald-500/10 p-2 text-emerald-700 dark:text-emerald-400">
                                             <span className="font-semibold">Strengths:</span> {rev.strengths}
                                          </div>
                                       )}
                                       {rev.growth_areas && (
                                          <div className="rounded bg-blue-500/10 p-2 text-blue-700 dark:text-blue-400">
                                             <span className="font-semibold">Growth areas:</span> {rev.growth_areas}
                                          </div>
                                       )}
                                    </div>
                                 )}
                              </CardContent>
                           </Card>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* TAB 3: BASIC ANALYTICS & REPORTS */}
         {activeTab === 'analytics' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Headcount</CardTitle>
                        <Users className="size-4 text-muted-foreground" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold">{employees.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active staff</p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Task Velocity</CardTitle>
                        <TrendingUp className="size-4 text-emerald-500" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                           {taskCompletionRate}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                           {completedTasksCount} of {tasks.length} tasks completed
                        </p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
                        <Clock className="size-4 text-blue-500" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                           {totalHoursLoggedAllTime} hrs
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Across all projects</p>
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg Evaluation</CardTitle>
                        <Star className="size-4 text-amber-500" />
                     </CardHeader>
                     <CardContent>
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                           ★ {avgRating}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                           Across {reviews.length} review cycles
                        </p>
                     </CardContent>
                  </Card>
               </div>

               {/* Project and Task Distribution */}
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">Project Status Breakdown</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        {['active', 'planning', 'completed'].map((status) => {
                           const count = projects.filter((p) => p.status === status).length;
                           const pct = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0;
                           return (
                              <div key={status} className="space-y-1 text-xs">
                                 <div className="flex justify-between font-medium capitalize">
                                    <span>{status}</span>
                                    <span>{count} ({pct}%)</span>
                                 </div>
                                 <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                       className="h-full bg-primary"
                                       style={{ width: `${pct}%` }}
                                    />
                                 </div>
                              </div>
                           );
                        })}
                     </CardContent>
                  </Card>

                  <Card>
                     <CardHeader>
                        <CardTitle className="text-base">Task Priority Breakdown</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        {['urgent', 'high', 'medium', 'low'].map((priority) => {
                           const count = tasks.filter((t) => t.priority === priority).length;
                           const pct = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
                           return (
                              <div key={priority} className="space-y-1 text-xs">
                                 <div className="flex justify-between font-medium uppercase">
                                    <span>{priority}</span>
                                    <span>{count} ({pct}%)</span>
                                 </div>
                                 <div className="h-2 rounded-full bg-muted overflow-hidden">
                                    <div
                                       className={`h-full ${
                                          priority === 'urgent'
                                             ? 'bg-red-500'
                                             : priority === 'high'
                                             ? 'bg-amber-500'
                                             : 'bg-primary'
                                       }`}
                                       style={{ width: `${pct}%` }}
                                    />
                                 </div>
                              </div>
                           );
                        })}
                     </CardContent>
                  </Card>
               </div>

               {/* Export Center */}
               <Card>
                  <CardHeader>
                     <CardTitle className="text-base">Data Export Center</CardTitle>
                     <CardDescription>
                        Generate CSV files for payroll, executive reporting, and external analysis.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                     <Button variant="outline" size="sm" onClick={exportWorkLogsCsv} className="gap-2">
                        <Download className="size-4" />
                        Download Work Logs (CSV)
                     </Button>
                     <Button variant="outline" size="sm" onClick={exportPerformanceCsv} className="gap-2">
                        <Download className="size-4" />
                        Download Evaluations (CSV)
                     </Button>
                  </CardContent>
               </Card>
            </div>
         )}

         {/* TAB 4: NOTIFICATIONS & PREFERENCES */}
         {activeTab === 'notifications' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Notification List */}
                  <Card className="lg:col-span-2 shadow-sm">
                     <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div>
                           <CardTitle className="text-lg">Recent Alerts</CardTitle>
                           <CardDescription>
                              Activity stream and system notifications.
                           </CardDescription>
                        </div>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => markAllReadMutation.mutate()}
                           className="text-xs"
                        >
                           Mark all as read
                        </Button>
                     </CardHeader>
                     <CardContent>
                        {notifications.length === 0 ? (
                           <p className="p-8 text-center text-xs text-muted-foreground">
                              No notifications in your feed.
                           </p>
                        ) : (
                           <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                              {notifications.map((n) => (
                                 <div
                                    key={n.id}
                                    className={`flex items-start justify-between rounded-xl border p-3 text-xs ${
                                       n.is_read ? 'bg-card' : 'bg-primary/5 font-medium border-primary/20'
                                    }`}
                                 >
                                    <div className="space-y-1">
                                       <p className="font-semibold text-foreground">{n.title}</p>
                                       <p className="text-muted-foreground">{n.message}</p>
                                       <span className="text-[10px] text-muted-foreground">
                                          {new Date(n.created_at).toLocaleString()}
                                       </span>
                                    </div>
                                    {!n.is_read && (
                                       <Badge variant="default" className="text-[10px]">
                                          Unread
                                       </Badge>
                                    )}
                                 </div>
                              ))}
                           </div>
                        )}
                     </CardContent>
                  </Card>

                  {/* Preferences Toggles */}
                  <Card className="lg:col-span-1 shadow-sm">
                     <CardHeader>
                        <CardTitle className="text-lg">Notification Preferences</CardTitle>
                        <CardDescription>
                           Configure which events trigger alerts.
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4 text-xs">
                        {[
                           { key: 'email_notifications', label: 'Email Notifications' },
                           { key: 'in_app_notifications', label: 'In-App Alerts' },
                           { key: 'task_assigned', label: 'Task Assignments' },
                           { key: 'time_mod_updates', label: 'Time Modification Updates' },
                           { key: 'daily_log_reminders', label: 'Daily Work Log Reminders' },
                           { key: 'evaluations', label: 'Performance Evaluations' },
                        ].map(({ key, label }) => {
                           const currentPrefs = preferences as Record<string, boolean> | undefined;
                           const isEnabled = currentPrefs ? currentPrefs[key] : true;
                           return (
                              <div key={key} className="flex items-center justify-between">
                                 <span>{label}</span>
                                 <Button
                                    variant={isEnabled ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-7 text-[10px]"
                                    onClick={() => togglePrefMutation.mutate(key)}
                                 >
                                    {isEnabled ? 'Enabled' : 'Disabled'}
                                 </Button>
                              </div>
                           );
                        })}
                     </CardContent>
                  </Card>
               </div>
            </div>
         )}


         {/* TAB: ACTIVITY LOGS (WORKSPACE AUDIT STREAM) */}
         {activeTab === 'activity' && (
            <div className="space-y-6">
               <Card>
                  <CardHeader>
                     <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                           <CardTitle className="text-lg flex items-center gap-2">
                              <Activity className="size-5 text-primary" />
                              Workspace Activity Logs & Audit Stream
                           </CardTitle>
                           <CardDescription>
                              Live timeline of actions across tasks, projects, personnel, and system events.
                           </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs w-fit">
                           {activityLogs.length} events logged
                        </Badge>
                     </div>
                  </CardHeader>
                  <CardContent>
                     {isActivityLoading ? (
                        <div className="flex justify-center py-12">
                           <Spinner />
                        </div>
                     ) : activityLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                           <Activity className="size-10 stroke-[1.5] text-muted-foreground/40" />
                           <p className="mt-2 text-sm font-medium">No recent activity</p>
                           <p className="text-xs">
                              Workspace interactions like task changes, comments, and logins will appear here.
                           </p>
                        </div>
                     ) : (
                        <div className="relative border-l border-border/60 ml-4 space-y-6 py-2">
                           {activityLogs.map((log: ActivityLog) => (
                              <div key={log.id} className="relative pl-6">
                                 <span className="absolute -left-2 top-1.5 size-4 rounded-full border-2 border-background bg-primary" />
                                 <div className="space-y-1 rounded-xl border bg-card p-3 shadow-xs">
                                    <div className="flex items-center justify-between text-xs">
                                       <span className="font-semibold capitalize text-foreground">
                                          {log.action.replace(/_/g, ' ')}
                                       </span>
                                       <span className="text-[11px] text-muted-foreground">
                                          {new Date(log.created_at).toLocaleString()}
                                       </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                       Entity: <span className="font-mono font-medium text-foreground">{log.entity_type}</span>
                                       {log.entity_id ? ` #${log.entity_id.slice(0, 8)}` : ''}
                                    </p>
                                    {log.details && Object.keys(log.details).length > 0 && (
                                       <pre className="mt-2 rounded-lg bg-muted p-2 text-[10px] text-muted-foreground overflow-x-auto">
                                          {JSON.stringify(log.details, null, 2)}
                                       </pre>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         )}

         {/* TAB: INTEGRATIONS (GITHUB & GMAIL) */}
         {activeTab === 'integrations' && (
            <div className="space-y-6">
               <div>
                  <h2 className="text-lg font-semibold">Connected Workspace Apps & Services</h2>
                  <p className="text-xs text-muted-foreground">
                     Synchronize pull requests, commits, and emails directly into task workflows.
                  </p>
               </div>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* GitHub Card */}
                  {(() => {
                     const githubInt = integrations.find((i) => i.provider === 'github');
                     const isConnected = githubInt?.status === 'connected';

                     return (
                        <Card className={isConnected ? 'border-emerald-500/30 bg-emerald-500/5' : ''}>
                           <CardHeader>
                              <div className="flex items-start justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
                                       <Github className="size-5" />
                                    </div>
                                    <div>
                                       <CardTitle className="text-base">GitHub</CardTitle>
                                       <CardDescription className="text-xs">
                                          Repository PRs, commit linking, and issue tracking.
                                       </CardDescription>
                                    </div>
                                 </div>
                                 <Badge
                                    variant={isConnected ? 'default' : 'secondary'}
                                    className="capitalize text-[10px]"
                                 >
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                 </Badge>
                              </div>
                           </CardHeader>
                           <CardContent className="space-y-4 pt-0 text-xs">
                              <p className="text-muted-foreground leading-relaxed">
                                 Link GitHub branches and commits automatically by referencing task IDs (e.g. <code>#task-123</code>) in commit messages.
                              </p>
                              {isConnected && (
                                 <div className="rounded-lg border bg-background/50 p-3 space-y-1 text-xs">
                                    <div className="flex justify-between text-muted-foreground">
                                       <span>Status:</span>
                                       <span className="font-medium text-emerald-600 dark:text-emerald-400">Sync Active</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                       <span>Last sync:</span>
                                       <span>{githubInt?.last_sync_at ? new Date(githubInt.last_sync_at).toLocaleTimeString() : 'Just now'}</span>
                                    </div>
                                 </div>
                              )}
                              <div className="flex justify-end pt-2">
                                 <Button
                                    variant={isConnected ? 'outline' : 'default'}
                                    size="sm"
                                    disabled={toggleIntegrationMutation.isPending}
                                    onClick={() =>
                                       toggleIntegrationMutation.mutate({
                                          provider: 'github',
                                          status: isConnected ? 'disconnected' : 'connected',
                                          config: { repo: 'workforce-ultimate/main', auto_close_tasks: true },
                                       })
                                    }
                                    className="gap-1.5"
                                 >
                                    <Power className="size-3.5" />
                                    {isConnected ? 'Disconnect GitHub' : 'Connect Repository'}
                                 </Button>
                              </div>
                           </CardContent>
                        </Card>
                     );
                  })()}

                  {/* Gmail Card */}
                  {(() => {
                     const gmailInt = integrations.find((i) => i.provider === 'gmail');
                     const isConnected = gmailInt?.status === 'connected';

                     return (
                        <Card className={isConnected ? 'border-blue-500/30 bg-blue-500/5' : ''}>
                           <CardHeader>
                              <div className="flex items-start justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                                       <Mail className="size-5" />
                                    </div>
                                    <div>
                                       <CardTitle className="text-base">Gmail / Google Workspace</CardTitle>
                                       <CardDescription className="text-xs">
                                          Notification digest forwarding and inbox action items.
                                       </CardDescription>
                                    </div>
                                 </div>
                                 <Badge
                                    variant={isConnected ? 'default' : 'secondary'}
                                    className="capitalize text-[10px]"
                                 >
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                 </Badge>
                              </div>
                           </CardHeader>
                           <CardContent className="space-y-4 pt-0 text-xs">
                              <p className="text-muted-foreground leading-relaxed">
                                 Forward task assignments and mention alerts directly to team member Gmail inboxes.
                              </p>
                              {isConnected && (
                                 <div className="rounded-lg border bg-background/50 p-3 space-y-1 text-xs">
                                    <div className="flex justify-between text-muted-foreground">
                                       <span>Status:</span>
                                       <span className="font-medium text-blue-600 dark:text-blue-400">Delivery Active</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                       <span>Last sync:</span>
                                       <span>{gmailInt?.last_sync_at ? new Date(gmailInt.last_sync_at).toLocaleTimeString() : 'Just now'}</span>
                                    </div>
                                 </div>
                              )}
                              <div className="flex justify-end pt-2">
                                 <Button
                                    variant={isConnected ? 'outline' : 'default'}
                                    size="sm"
                                    disabled={toggleIntegrationMutation.isPending}
                                    onClick={() =>
                                       toggleIntegrationMutation.mutate({
                                          provider: 'gmail',
                                          status: isConnected ? 'disconnected' : 'connected',
                                          config: { forward_notifications: true, auto_digest: 'daily' },
                                       })
                                    }
                                    className="gap-1.5"
                                 >
                                    <Power className="size-3.5" />
                                    {isConnected ? 'Disconnect Gmail' : 'Connect Workspace Email'}
                                 </Button>
                              </div>
                           </CardContent>
                        </Card>
                     );
                  })()}
               </div>
            </div>
         )}

         {/* TAB: ADVANCED REPORTING ENGINE */}
         {activeTab === 'reporting' && <AdvancedReportingView />}

         {/* TAB: BACKGROUND JOBS MANAGER */}
         {activeTab === 'jobs' && <BackgroundJobsManager />}

         {/* TAB 5: QUICK SHORTCUTS */}
         {activeTab === 'tools' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
               <Link href="/company">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                     <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                           <Building className="size-4 text-primary" />
                           Company Settings
                        </CardTitle>
                        <CardDescription>
                           Manage organization info, brand assets, and billing tier.
                        </CardDescription>
                     </CardHeader>
                  </Card>
               </Link>

               <Link href="/teams">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                     <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                           <Users className="size-4 text-purple-500" />
                           5-Tier Hierarchy & Teams
                        </CardTitle>
                        <CardDescription>
                           Organizational chart, functional units, and leadership roles.
                        </CardDescription>
                     </CardHeader>
                  </Card>
               </Link>

               <Link href="/planner">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                     <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                           <Kanban className="size-4 text-emerald-500" />
                           Projects & Kanban Tasks
                        </CardTitle>
                        <CardDescription>
                           Lifecycle kanban board, time estimates, and deliverables.
                        </CardDescription>
                     </CardHeader>
                  </Card>
               </Link>

               <Link href="/people">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                     <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                           <Users className="size-4 text-blue-500" />
                           Employee Directory
                        </CardTitle>
                        <CardDescription>
                           Searchable staff directory with CSV export.
                        </CardDescription>
                     </CardHeader>
                  </Card>
               </Link>

               <Link href="/invite">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                     <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                           <Plus className="size-4 text-amber-500" />
                           Invitations Hub
                        </CardTitle>
                        <CardDescription>
                           Send invitations and share onboard codes.
                        </CardDescription>
                     </CardHeader>
                  </Card>
               </Link>

               <Link href="/roadmap">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                     <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                           <Star className="size-4 text-rose-500" />
                           Product Roadmap
                        </CardTitle>
                        <CardDescription>
                           Explore Phases 1, 2, 2.5, 3, 4 and future capabilities.
                        </CardDescription>
                     </CardHeader>
                  </Card>
               </Link>
            </div>
         )}

         {/* MODAL: NEW GOAL */}
         {isNewGoalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
               <Card className="w-full max-w-md shadow-xl">
                  <CardHeader>
                     <CardTitle>Create Performance Goal</CardTitle>
                     <CardDescription>
                        Set an actionable OKR or KPI for an employee.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="g-emp">Assign To</Label>
                        <select
                           id="g-emp"
                           value={goalEmployeeId}
                           onChange={(e) => setGoalEmployeeId(e.target.value)}
                           className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs outline-none"
                        >
                           <option value="">Select employee...</option>
                           {employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                 {emp.full_name} ({emp.role})
                              </option>
                           ))}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="g-title">Goal Title</Label>
                        <Input
                           id="g-title"
                           placeholder="e.g. Increase test coverage to 85%"
                           value={goalTitle}
                           onChange={(e) => setGoalTitle(e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="g-desc">Description</Label>
                        <Textarea
                           id="g-desc"
                           rows={2}
                           placeholder="Success criteria..."
                           value={goalDesc}
                           onChange={(e) => setGoalDesc(e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="g-date">Target Date</Label>
                        <Input
                           id="g-date"
                           type="date"
                           value={goalTargetDate}
                           onChange={(e) => setGoalTargetDate(e.target.value)}
                        />
                     </div>
                     <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsNewGoalOpen(false)}>
                           Cancel
                        </Button>
                        <Button
                           disabled={!goalTitle.trim() || !goalEmployeeId || createGoalMutation.isPending}
                           onClick={() => createGoalMutation.mutate()}
                        >
                           {createGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

         {/* MODAL: NEW REVIEW */}
         {isNewReviewOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
               <Card className="w-full max-w-md shadow-xl">
                  <CardHeader>
                     <CardTitle>Conduct Performance Review</CardTitle>
                     <CardDescription>
                        Evaluate employee deliverables, culture, and achievements.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="r-emp">Employee</Label>
                        <select
                           id="r-emp"
                           value={reviewEmployeeId}
                           onChange={(e) => setReviewEmployeeId(e.target.value)}
                           className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs outline-none"
                        >
                           <option value="">Select employee...</option>
                           {employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                 {emp.full_name} ({emp.role})
                              </option>
                           ))}
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                           <Label htmlFor="r-cycle">Review Cycle</Label>
                           <Input
                              id="r-cycle"
                              value={reviewCycle}
                              onChange={(e) => setReviewCycle(e.target.value)}
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="r-rating">Rating (1-5)</Label>
                           <select
                              id="r-rating"
                              value={reviewRating}
                              onChange={(e) => setReviewRating(Number(e.target.value))}
                              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs outline-none"
                           >
                              <option value="5">5 - Exceptional</option>
                              <option value="4">4 - Exceeds Expectations</option>
                              <option value="3">3 - Meets Expectations</option>
                              <option value="2">2 - Needs Improvement</option>
                              <option value="1">1 - Unsatisfactory</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="r-feedback">Overall Feedback</Label>
                        <Textarea
                           id="r-feedback"
                           rows={2}
                           placeholder="Summary of contributions..."
                           value={reviewFeedback}
                           onChange={(e) => setReviewFeedback(e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="r-str">Key Strengths (Optional)</Label>
                        <Input
                           id="r-str"
                           placeholder="e.g. Excellent teamwork, proactive problem solving"
                           value={reviewStrengths}
                           onChange={(e) => setReviewStrengths(e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="r-gro">Growth Areas (Optional)</Label>
                        <Input
                           id="r-gro"
                           placeholder="e.g. Communication in cross-functional meetings"
                           value={reviewGrowth}
                           onChange={(e) => setReviewGrowth(e.target.value)}
                        />
                     </div>
                     <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsNewReviewOpen(false)}>
                           Cancel
                        </Button>
                        <Button
                           disabled={!reviewFeedback.trim() || !reviewEmployeeId || createReviewMutation.isPending}
                           onClick={() => createReviewMutation.mutate()}
                        >
                           {createReviewMutation.isPending ? 'Recording...' : 'Record Evaluation'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}
      </div>
   );
}
