'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Briefcase,
   Clock,
   Users,
   XCircle,
   Kanban,
   Check,
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
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { getProjectsAPI } from '@/features/projects/api/projectApis';
import { getTasksAPI } from '@/features/tasks/api/taskApis';
import {
   getTimeModificationRequestsAPI,
   reviewTimeModificationRequestAPI,
} from '@/features/time/api/timeApis';
import { getTeamsHierarchyAPI } from '@/features/company/api/teamHierarchyApis';

export default function ManagerDashboard() {
   const { companyId } = useAuth();
   const queryClient = useQueryClient();

   const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});

   // Queries
   const { data: projects = [], isLoading: isProjLoading } = useQuery({
      queryKey: ['projects', companyId],
      queryFn: () => getProjectsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: tasks = [] } = useQuery({
      queryKey: ['tasks', companyId],
      queryFn: () => getTasksAPI({ companyId: companyId || undefined }),
      enabled: Boolean(companyId),
   });


   const { data: teams = [] } = useQuery({
      queryKey: ['teams-hierarchy', companyId],
      queryFn: () => getTeamsHierarchyAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: modRequests = [], isLoading: isReqLoading } = useQuery({
      queryKey: ['time-mod-requests', companyId],
      queryFn: () => getTimeModificationRequestsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const pendingRequests = modRequests.filter((r) => r.status === 'pending');
   const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'planning');

   // Review mutation
   const reviewMutation = useMutation({
      mutationFn: ({
         requestId,
         status,
         feedback,
      }: {
         requestId: string;
         status: 'approved' | 'rejected';
         feedback?: string;
      }) => reviewTimeModificationRequestAPI(requestId, status, feedback),
      onSuccess: (_, vars) => {
         toast.success(
            `Request ${vars.status === 'approved' ? 'approved' : 'rejected'} successfully`,
         );
         queryClient.invalidateQueries({ queryKey: ['time-mod-requests'] });
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to review request'),
   });

   return (
      <div className="space-y-8">
         {/* Top Header */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Manager Dashboard
               </h1>
               <p className="text-sm text-muted-foreground">
                  Team project oversight, task allocation, and time modification approval workflows.
               </p>
            </div>
            <div className="flex items-center gap-2">
               <Link href="/planner">
                  <Button variant="outline" className="gap-2">
                     <Kanban className="h-4 w-4" />
                     Manage Tasks
                  </Button>
               </Link>
            </div>
         </div>

         {/* 4 Stat Cards */}
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Projects</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                     {activeProjects.length} active or in planning
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Tasks in Pipeline</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                     {tasks.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                     {tasks.filter((t) => t.status === 'done').length} completed
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Teams Overseen</CardTitle>
                  <Users className="h-4 w-4 text-purple-500" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                     {teams.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Active functional units</p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <Clock className="h-4 w-4 text-amber-500" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                     {pendingRequests.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Time adjustment requests</p>
               </CardContent>
            </Card>
         </div>

         {/* PENDING APPROVALS QUEUE */}
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-semibold">
                  Time Modification Approvals Queue ({pendingRequests.length})
               </h2>
            </div>

            {isReqLoading ? (
               <div className="flex h-32 items-center justify-center">
                  <Spinner />
               </div>
            ) : pendingRequests.length === 0 ? (
               <Card className="p-8 text-center text-sm text-muted-foreground">
                  No pending time modification requests. All logs and estimates are aligned.
               </Card>
            ) : (
               <div className="space-y-3">
                  {pendingRequests.map((req) => (
                     <Card key={req.id} className="border-amber-500/20 bg-amber-500/5">
                        <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                 <span className="font-semibold text-sm">
                                    {req.employee?.full_name || 'Employee'}
                                 </span>
                                 <Badge variant="outline" className="text-xs capitalize">
                                    {req.type.replace('_', ' ')}
                                 </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                 Task: <span className="font-medium text-foreground">{req.task?.title || 'Task'}</span> | Current: {req.current_hours}h → Requested: <span className="font-bold text-foreground">{req.requested_hours}h</span>
                              </p>
                              <p className="text-xs italic bg-background/80 rounded p-2 border">
                                 &ldquo;{req.reason}&rdquo;
                              </p>
                           </div>

                           <div className="flex flex-col gap-2 md:items-end">
                              <Input
                                 placeholder="Review notes (optional)"
                                 className="h-8 text-xs w-full md:w-56"
                                 value={feedbackText[req.id] || ''}
                                 onChange={(e) =>
                                    setFeedbackText((prev) => ({
                                       ...prev,
                                       [req.id]: e.target.value,
                                    }))
                                 }
                              />
                              <div className="flex items-center gap-2">
                                 <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs text-destructive hover:bg-destructive/10"
                                    disabled={reviewMutation.isPending}
                                    onClick={() =>
                                       reviewMutation.mutate({
                                          requestId: req.id,
                                          status: 'rejected',
                                          feedback: feedbackText[req.id],
                                       })
                                    }
                                 >
                                    <XCircle className="h-3.5 w-3.5 mr-1" />
                                    Reject
                                 </Button>
                                 <Button
                                    size="sm"
                                    className="h-8 text-xs gap-1"
                                    disabled={reviewMutation.isPending}
                                    onClick={() =>
                                       reviewMutation.mutate({
                                          requestId: req.id,
                                          status: 'approved',
                                          feedback: feedbackText[req.id],
                                       })
                                    }
                                 >
                                    <Check className="h-3.5 w-3.5" />
                                    Approve
                                 </Button>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </div>

         {/* Projects Overview */}
         <div className="space-y-4">
            <h2 className="text-xl font-semibold">Active Projects Overview</h2>
            {isProjLoading ? (
               <div className="flex h-32 items-center justify-center">
                  <Spinner />
               </div>
            ) : projects.length === 0 ? (
               <Card className="p-8 text-center text-sm text-muted-foreground">
                  No projects currently tracked.
               </Card>
            ) : (
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((proj) => {
                     const projTasks = tasks.filter((t) => t.project_id === proj.id);
                     const completedProjTasks = projTasks.filter((t) => t.status === 'done');
                     const completionRate =
                        projTasks.length > 0
                           ? Math.round((completedProjTasks.length / projTasks.length) * 100)
                           : 0;

                     return (
                        <Card key={proj.id}>
                           <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                 <CardTitle className="text-base">{proj.name}</CardTitle>
                                 <Badge variant="outline" className="text-[10px] capitalize">
                                    {proj.status.replace('_', ' ')}
                                 </Badge>
                              </div>
                              <CardDescription className="text-xs">
                                 {proj.manager?.full_name || 'No lead assigned'}
                              </CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-3 text-xs pt-1">
                              <div>
                                 <div className="flex items-center justify-between text-muted-foreground mb-1">
                                    <span>Task Progress:</span>
                                    <span>
                                       {completedProjTasks.length}/{projTasks.length} ({completionRate}%)
                                    </span>
                                 </div>
                                 <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                    <div
                                       className="h-full bg-primary"
                                       style={{ width: `${completionRate}%` }}
                                    />
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     );
                  })}
               </div>
            )}
         </div>
      </div>
   );
}
