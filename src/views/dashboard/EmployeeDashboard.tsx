'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Clock,
   ListTodo,
   AlertCircle,
   ArrowRight,
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
import {
   getTasksAPI,
   updateTaskStatusAPI,
} from '@/features/tasks/api/taskApis';
import {
   logTaskTimeAPI,
   getTimeModificationRequestsAPI,
} from '@/features/time/api/timeApis';
import type { TaskWithDetails, TaskStatus } from '@/types/task';

export default function EmployeeDashboard() {
   const { user, companyId } = useAuth();
   const queryClient = useQueryClient();

   const [activeLogTask, setActiveLogTask] = useState<TaskWithDetails | null>(null);
   const [logHours, setLogHours] = useState(1);
   const [logDesc, setLogDesc] = useState('');

   // Tasks
   const { data: allTasks = [], isLoading: isTasksLoading } = useQuery({
      queryKey: ['tasks', companyId],
      queryFn: () => getTasksAPI({ companyId: companyId || undefined }),
      enabled: Boolean(companyId),
   });

   // Modification requests
   const { data: modRequests = [], isLoading: isReqLoading } = useQuery({
      queryKey: ['time-mod-requests', companyId],
      queryFn: () => getTimeModificationRequestsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   // Filter for current user tasks
   const myTasks = allTasks.filter(
      (t) =>
         t.assignee?.email === user?.email ||
         t.created_by === user?.id,
   );

   const inProgressTasks = myTasks.filter((t) => t.status === 'in_progress');
   const completedTasks = myTasks.filter((t) => t.status === 'done');
   const totalHoursLogged = myTasks.reduce((sum, t) => sum + (t.logged_hours || 0), 0);

   // Mutations
   const statusMutation = useMutation({
      mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
         updateTaskStatusAPI(taskId, status),
      onSuccess: () => {
         toast.success('Task status updated');
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
   });

   const logTimeMutation = useMutation({
      mutationFn: () =>
         logTaskTimeAPI(activeLogTask!.id, Number(logHours), logDesc),
      onSuccess: () => {
         toast.success('Time logged successfully');
         setActiveLogTask(null);
         setLogHours(1);
         setLogDesc('');
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to log time'),
   });

   return (
      <div className="space-y-8">
         {/* Welcome Banner */}
         <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Employee Workspace
               </h1>
               <p className="text-sm text-muted-foreground">
                  Track your assigned deliverables, log work time, and review pending approval requests.
               </p>
            </div>
            <Link href="/planner">
               <Button className="gap-2">
                  <ListTodo className="h-4 w-4" />
                  Open Task Board
               </Button>
            </Link>
         </div>

         {/* 4 Stat Cards */}
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">My Assigned Tasks</CardTitle>
                  <ListTodo className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{myTasks.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                     {completedTasks.length} marked completed
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                     {inProgressTasks.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Currently active tasks</p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Logged Hours</CardTitle>
                  <Clock className="h-4 w-4 text-emerald-500" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                     {totalHoursLogged} hrs
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Recorded across tasks</p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <AlertCircle className="h-4 w-4 text-amber-500" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                     {modRequests.filter((r) => r.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting manager review</p>
               </CardContent>
            </Card>
         </div>

         {/* My Tasks Section */}
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-semibold">My Active Tasks</h2>
               <Link href="/planner" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View all on board <ArrowRight className="h-3 w-3" />
               </Link>
            </div>

            {isTasksLoading ? (
               <div className="flex h-32 items-center justify-center">
                  <Spinner />
               </div>
            ) : myTasks.length === 0 ? (
               <Card className="p-8 text-center text-sm text-muted-foreground">
                  You don't have any assigned tasks right now.
               </Card>
            ) : (
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {myTasks.slice(0, 6).map((task) => (
                     <Card key={task.id} className="flex flex-col justify-between">
                        <CardHeader className="pb-3">
                           <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                 {task.project?.name || 'General Task'}
                              </span>
                              <Badge
                                 variant={task.status === 'done' ? 'secondary' : 'outline'}
                                 className="capitalize text-[10px]"
                              >
                                 {task.status.replace('_', ' ')}
                              </Badge>
                           </div>
                           <CardTitle className="text-base font-semibold mt-1">
                              {task.title}
                           </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 pt-0">
                           <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Hours: {task.logged_hours || 0}h / {task.estimated_hours || 0}h</span>
                              <span className="uppercase font-semibold text-[10px]">
                                 {task.priority}
                              </span>
                           </div>

                           <div className="flex items-center gap-2 pt-2 border-t">
                              <select
                                 value={task.status}
                                 onChange={(e) =>
                                    statusMutation.mutate({
                                       taskId: task.id,
                                       status: e.target.value as TaskStatus,
                                    })
                                 }
                                 className="h-7 flex-1 rounded border bg-background px-2 text-xs outline-none"
                              >
                                 <option value="todo">To Do</option>
                                 <option value="in_progress">In Progress</option>
                                 <option value="in_review">In Review</option>
                                 <option value="done">Completed</option>
                              </select>

                              <Button
                                 size="sm"
                                 variant="outline"
                                 className="h-7 text-xs"
                                 onClick={() => setActiveLogTask(task)}
                              >
                                 + Log Time
                              </Button>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </div>

         {/* Time Modification Requests Table */}
         <div className="space-y-4">
            <h2 className="text-xl font-semibold">My Time Modification Requests</h2>
            {isReqLoading ? (
               <div className="flex h-20 items-center justify-center">
                  <Spinner />
               </div>
            ) : modRequests.length === 0 ? (
               <Card className="p-6 text-center text-sm text-muted-foreground">
                  No time modification requests submitted.
               </Card>
            ) : (
               <Card>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left text-xs">
                        <thead className="border-b bg-muted/40 font-medium text-muted-foreground">
                           <tr>
                              <th className="p-3">Task</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Requested Hours</th>
                              <th className="p-3">Reason</th>
                              <th className="p-3">Status</th>
                              <th className="p-3">Manager Feedback</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y">
                           {modRequests.map((req) => (
                              <tr key={req.id}>
                                 <td className="p-3 font-medium">{req.task?.title || 'Task'}</td>
                                 <td className="p-3 capitalize">{req.type.replace('_', ' ')}</td>
                                 <td className="p-3">{req.requested_hours} hrs</td>
                                 <td className="p-3 text-muted-foreground max-w-xs truncate">
                                    {req.reason}
                                 </td>
                                 <td className="p-3">
                                    <Badge
                                       variant={
                                          req.status === 'approved'
                                             ? 'default'
                                             : req.status === 'rejected'
                                             ? 'destructive'
                                             : 'outline'
                                       }
                                       className="capitalize"
                                    >
                                       {req.status}
                                    </Badge>
                                 </td>
                                 <td className="p-3 text-muted-foreground">
                                    {req.reviewer_feedback || '—'}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </Card>
            )}
         </div>

         {/* Quick Log Time Modal */}
         {activeLogTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
               <Card className="w-full max-w-md shadow-xl">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Log Time
                     </CardTitle>
                     <CardDescription>{activeLogTask.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="el-hours">Hours</Label>
                        <Input
                           id="el-hours"
                           type="number"
                           min="0.25"
                           step="0.25"
                           value={logHours}
                           onChange={(e) => setLogHours(Number(e.target.value))}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="el-notes">Notes</Label>
                        <Textarea
                           id="el-notes"
                           rows={2}
                           placeholder="Completed work..."
                           value={logDesc}
                           onChange={(e) => setLogDesc(e.target.value)}
                        />
                     </div>
                     <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setActiveLogTask(null)}>
                           Cancel
                        </Button>
                        <Button
                           disabled={logHours <= 0 || logTimeMutation.isPending}
                           onClick={() => logTimeMutation.mutate()}
                        >
                           {logTimeMutation.isPending ? 'Logging...' : 'Confirm'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}
      </div>
   );
}
