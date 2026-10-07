'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Clock,
   Play,
   RotateCw,
   CheckCircle2,
   AlertCircle,
   XCircle,
   Server,
   Database,
   FileSpreadsheet,
   RefreshCw,
   Trash2,
   Cpu,
   Plus,
   ShieldCheck,
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
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import {
   getBackgroundJobsAPI,
   enqueueBackgroundJobAPI,
   executeBackgroundJobNowAPI,
   retryBackgroundJobAPI,
   cancelBackgroundJobAPI,
} from '@/features/jobs/api/jobApis';
import type { BackgroundJob, JobType, JobPriority } from '@/types/jobs';

function getJobTypeMeta(type: JobType) {
   switch (type) {
      case 'cleanup_expired_invitations':
         return {
            title: 'Purge Expired Invitations',
            icon: Trash2,
            desc: 'Scans invitation codes past expiration date and revokes them.',
         };
      case 'sync_integrations':
         return {
            title: 'Sync Workspace Integrations',
            icon: RefreshCw,
            desc: 'Polls external services (GitHub, Gmail) for new events & webhooks.',
         };
      case 'generate_weekly_report':
         return {
            title: 'Generate Weekly Executive Rollup',
            icon: FileSpreadsheet,
            desc: 'Aggregates hours, completed tasks, and KPI performance metrics.',
         };
      case 'evaluate_monthly_kpis':
         return {
            title: 'Evaluate Monthly KPI Scores',
            icon: Cpu,
            desc: 'Calculates department score averages and evaluates KPI thresholds.',
         };
      case 'backup_workspace_data':
         return {
            title: 'Snapshot Workspace Backup',
            icon: Database,
            desc: 'Creates a verifiable snapshot of members, tasks, and configurations.',
         };
      default:
         return {
            title: type.replace(/_/g, ' '),
            icon: Server,
            desc: 'Asynchronous background system job.',
         };
   }
}

function getStatusBadge(status: BackgroundJob['status']) {
   switch (status) {
      case 'completed':
         return (
            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1">
               <CheckCircle2 className="size-3" />
               Completed
            </Badge>
         );
      case 'processing':
         return (
            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 gap-1 animate-pulse">
               <RotateCw className="size-3 animate-spin" />
               Processing
            </Badge>
         );
      case 'failed':
         return (
            <Badge className="bg-destructive/15 text-destructive border-destructive/30 gap-1">
               <AlertCircle className="size-3" />
               Failed
            </Badge>
         );
      case 'cancelled':
         return (
            <Badge variant="outline" className="text-muted-foreground gap-1">
               <XCircle className="size-3" />
               Cancelled
            </Badge>
         );
      default:
         return (
            <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 gap-1">
               <Clock className="size-3" />
               Queued
            </Badge>
         );
   }
}

export default function BackgroundJobsManager() {
   const { companyId } = useAuth();
   const queryClient = useQueryClient();
   const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

   const {
      data: jobs = [],
      isLoading,
   } = useQuery({
      queryKey: ['background-jobs', companyId],
      queryFn: () => getBackgroundJobsAPI(companyId || undefined),
      enabled: Boolean(companyId),
      refetchInterval: 5000,
   });

   // Enqueue Mutation
   const enqueueMutation = useMutation({
      mutationFn: enqueueBackgroundJobAPI,
      onSuccess: (newJob) => {
         toast.success(`Job "${newJob.job_type}" scheduled in queue`);
         queryClient.invalidateQueries({ queryKey: ['background-jobs', companyId] });
      },
      onError: (err: Error) => toast.error(err.message),
   });

   // Run Now Mutation
   const runNowMutation = useMutation({
      mutationFn: executeBackgroundJobNowAPI,
      onSuccess: (completedJob) => {
         toast.success(`Job completed successfully!`);
         queryClient.invalidateQueries({ queryKey: ['background-jobs', companyId] });
      },
      onError: (err: Error) => toast.error(err.message),
   });

   // Retry Mutation
   const retryMutation = useMutation({
      mutationFn: retryBackgroundJobAPI,
      onSuccess: () => {
         toast.success('Job reset to queue');
         queryClient.invalidateQueries({ queryKey: ['background-jobs', companyId] });
      },
   });

   // Cancel Mutation
   const cancelMutation = useMutation({
      mutationFn: cancelBackgroundJobAPI,
      onSuccess: () => {
         toast.success('Job cancelled');
         queryClient.invalidateQueries({ queryKey: ['background-jobs', companyId] });
      },
   });

   const queuedCount = jobs.filter((j) => j.status === 'queued' || j.status === 'processing').length;
   const completedCount = jobs.filter((j) => j.status === 'completed').length;
   const failedCount = jobs.filter((j) => j.status === 'failed').length;

   const triggerRoutine = async (jobType: JobType, priority: JobPriority = 'high') => {
      if (!companyId) return;
      try {
         const enqueued = await enqueueMutation.mutateAsync({
            companyId,
            jobType,
            priority,
            payload: { triggered_manually: true, at: new Date().toISOString() },
         });
         await runNowMutation.mutateAsync(enqueued);
      } catch (err) {
         // handled by mutation
      }
   };

   return (
      <div className="space-y-6">
         {/* Summary Cards */}
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-xs">
               <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-xs font-medium text-muted-foreground">Total Background Jobs</p>
                     <p className="text-2xl font-bold">{jobs.length}</p>
                  </div>
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                     <Cpu className="size-5" />
                  </div>
               </CardContent>
            </Card>

            <Card className="shadow-xs">
               <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-xs font-medium text-muted-foreground">Queued & Running</p>
                     <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{queuedCount}</p>
                  </div>
                  <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600">
                     <Clock className="size-5" />
                  </div>
               </CardContent>
            </Card>

            <Card className="shadow-xs">
               <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-xs font-medium text-muted-foreground">Completed Successfully</p>
                     <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600">
                     <CheckCircle2 className="size-5" />
                  </div>
               </CardContent>
            </Card>

            <Card className="shadow-xs">
               <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                     <p className="text-xs font-medium text-muted-foreground">Failed Jobs</p>
                     <p className="text-2xl font-bold text-destructive">{failedCount}</p>
                  </div>
                  <div className="rounded-xl bg-destructive/10 p-2.5 text-destructive">
                     <AlertCircle className="size-5" />
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Quick Triggers Action Bar */}
         <Card className="border-primary/20 bg-linear-to-r from-primary/8 via-background to-background shadow-xs">
            <CardHeader className="pb-3">
               <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  Manual System Routines
               </CardTitle>
               <CardDescription className="text-xs">
                  Trigger automated background maintenance routines on demand.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex flex-wrap gap-2.5">
                  <Button
                     size="sm"
                     variant="outline"
                     disabled={runNowMutation.isPending}
                     onClick={() => triggerRoutine('cleanup_expired_invitations')}
                     className="gap-1.5 text-xs font-medium"
                  >
                     <Trash2 className="size-3.5 text-amber-500" />
                     Clean Expired Invites
                  </Button>

                  <Button
                     size="sm"
                     variant="outline"
                     disabled={runNowMutation.isPending}
                     onClick={() => triggerRoutine('sync_integrations')}
                     className="gap-1.5 text-xs font-medium"
                  >
                     <RefreshCw className="size-3.5 text-blue-500" />
                     Sync Integrations
                  </Button>

                  <Button
                     size="sm"
                     variant="outline"
                     disabled={runNowMutation.isPending}
                     onClick={() => triggerRoutine('generate_weekly_report')}
                     className="gap-1.5 text-xs font-medium"
                  >
                     <FileSpreadsheet className="size-3.5 text-emerald-500" />
                     Generate Weekly Rollup
                  </Button>

                  <Button
                     size="sm"
                     variant="outline"
                     disabled={runNowMutation.isPending}
                     onClick={() => triggerRoutine('backup_workspace_data')}
                     className="gap-1.5 text-xs font-medium"
                  >
                     <Database className="size-3.5 text-purple-500" />
                     Snapshot Workspace Data
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Job Queue List */}
         <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
               <div>
                  <CardTitle className="text-base">Background Job Queue</CardTitle>
                  <CardDescription className="text-xs">
                     Live view of queued, processing, and historical job runs.
                  </CardDescription>
               </div>
               <Badge variant="outline" className="text-xs gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Realtime Polling
               </Badge>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                  <div className="flex justify-center py-10">
                     <Spinner />
                  </div>
               ) : jobs.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                     No background jobs have been scheduled yet.
                  </div>
               ) : (
                  <div className="divide-y divide-border/60">
                     {jobs.map((job) => {
                        const meta = getJobTypeMeta(job.job_type);
                        const Icon = meta.icon;
                        const isExpanded = expandedJobId === job.id;

                        return (
                           <div key={job.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                 <div className="flex items-start gap-3">
                                    <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                                       <Icon className="size-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                       <div className="flex items-center gap-2 flex-wrap">
                                          <p className="text-sm font-semibold text-foreground">
                                             {meta.title}
                                          </p>
                                          {getStatusBadge(job.status)}
                                          <span className="text-[10px] font-mono uppercase bg-muted px-1.5 py-0.2 rounded text-muted-foreground">
                                             {job.priority} priority
                                          </span>
                                       </div>
                                       <p className="text-xs text-muted-foreground">
                                          {meta.desc}
                                       </p>
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-2 self-end sm:self-center">
                                    {job.status === 'queued' && (
                                       <Button
                                          size="sm"
                                          variant="default"
                                          disabled={runNowMutation.isPending}
                                          onClick={() => runNowMutation.mutate(job)}
                                          className="h-7 text-xs gap-1 px-2.5 font-medium"
                                       >
                                          <Play className="size-3" />
                                          Run Now
                                       </Button>
                                    )}

                                    {job.status === 'failed' && (
                                       <Button
                                          size="sm"
                                          variant="outline"
                                          disabled={retryMutation.isPending}
                                          onClick={() => retryMutation.mutate(job.id)}
                                          className="h-7 text-xs gap-1 px-2.5 font-medium"
                                       >
                                          <RotateCw className="size-3" />
                                          Retry
                                       </Button>
                                    )}

                                    {job.status === 'queued' && (
                                       <Button
                                          size="sm"
                                          variant="ghost"
                                          disabled={cancelMutation.isPending}
                                          onClick={() => cancelMutation.mutate(job.id)}
                                          className="h-7 text-xs text-muted-foreground hover:text-destructive px-2"
                                       >
                                          Cancel
                                       </Button>
                                    )}

                                    <Button
                                       size="sm"
                                       variant="ghost"
                                       onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                                       className="h-7 text-xs text-muted-foreground px-2"
                                    >
                                       {isExpanded ? 'Hide Details' : 'Details'}
                                    </Button>
                                 </div>
                              </div>

                              {/* Expanded Payload & Result Details */}
                              {isExpanded && (
                                 <div className="rounded-xl border border-border/70 bg-muted/20 p-3 text-xs space-y-2 mt-2 font-mono">
                                    <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                                       <span>ID: {job.id}</span>
                                       <span>Scheduled: {new Date(job.scheduled_at).toLocaleString()}</span>
                                       {job.completed_at && (
                                          <span>Completed: {new Date(job.completed_at).toLocaleString()}</span>
                                       )}
                                       {job.error_message && (
                                          <span className="text-destructive font-bold">Error: {job.error_message}</span>
                                       )}
                                    </div>
                                    {job.result && (
                                       <div>
                                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                                             Execution Result:
                                          </p>
                                          <pre className="p-2 rounded bg-background border text-[11px] overflow-x-auto text-emerald-600 dark:text-emerald-400">
                                             {JSON.stringify(job.result, null, 2)}
                                          </pre>
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
}

