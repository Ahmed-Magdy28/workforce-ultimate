'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Kanban,
   Plus,
   Clock,
   FolderPlus,
   User,
   HelpCircle,
   MessageSquare,
   Paperclip,
} from 'lucide-react';
import toast from 'react-hot-toast';
import TaskCollaborationModal from '@/components/collaboration/TaskCollaborationModal';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import {
   getProjectsAPI,
   createProjectAPI,
} from '@/features/projects/api/projectApis';
import {
   getTasksAPI,
   createTaskAPI,
   updateTaskStatusAPI,
} from '@/features/tasks/api/taskApis';
import {
   logTaskTimeAPI,
   submitTimeModificationRequestAPI,
} from '@/features/time/api/timeApis';
import { getCurrentCompanyEmployeesAPI } from '@/features/company/api/companyApis';
import type { TaskStatus, TaskWithDetails, TaskPriority } from '@/types/task';
import type { ProjectPriority } from '@/types/project';

const STATUS_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
   { id: 'todo', label: 'To Do', color: 'border-slate-500/20 bg-slate-500/5' },
   {
      id: 'in_progress',
      label: 'In Progress',
      color: 'border-blue-500/20 bg-blue-500/5',
   },
   {
      id: 'in_review',
      label: 'In Review',
      color: 'border-amber-500/20 bg-amber-500/5',
   },
   {
      id: 'done',
      label: 'Completed',
      color: 'border-emerald-500/20 bg-emerald-500/5',
   },
];

export default function PlannerPage() {
   const { companyId } = useAuth();
   const { isManagerOrAbove } = useRole();
   const queryClient = useQueryClient();

   const [activeTab, setActiveTab] = useState<'board' | 'projects'>('board');
   const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all');

   // Modals state
   const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
   const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
   const [activeLogTimeTask, setActiveLogTimeTask] = useState<TaskWithDetails | null>(null);
   const [activeModTimeTask, setActiveModTimeTask] = useState<TaskWithDetails | null>(null);
   const [activeCollabTask, setActiveCollabTask] = useState<TaskWithDetails | null>(null);

   // Form states - Project
   const [projectName, setProjectName] = useState('');
   const [projectDesc, setProjectDesc] = useState('');
   const [projectManagerId, setProjectManagerId] = useState('');
   const [projectPriority, setProjectPriority] = useState<ProjectPriority>('medium');
   const [projectBudget, setProjectBudget] = useState(0);

   // Form states - Task
   const [taskTitle, setTaskTitle] = useState('');
   const [taskDesc, setTaskDesc] = useState('');
   const [taskProjectId, setTaskProjectId] = useState('');
   const [taskAssigneeId, setTaskAssigneeId] = useState('');
   const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
   const [taskEstHours, setTaskEstHours] = useState(4);

   // Form states - Time Log
   const [logHours, setLogHours] = useState(1);
   const [logDescription, setLogDescription] = useState('');

   // Form states - Time Mod Request
   const [modType, setModType] = useState<'estimate_change' | 'log_adjustment'>('estimate_change');
   const [modRequestedHours, setModRequestedHours] = useState(0);
   const [modReason, setModReason] = useState('');

   // Queries
   const { data: projects = [], isLoading: isProjectsLoading } = useQuery({
      queryKey: ['projects', companyId],
      queryFn: () => getProjectsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
      queryKey: ['tasks', companyId, selectedProjectFilter],
      queryFn: () =>
         getTasksAPI({
            companyId: companyId || undefined,
            projectId: selectedProjectFilter === 'all' ? undefined : selectedProjectFilter,
         }),
      enabled: Boolean(companyId),
   });

   const { data: employees = [] } = useQuery({
      queryKey: ['company-employees', companyId],
      queryFn: getCurrentCompanyEmployeesAPI,
      enabled: Boolean(companyId),
   });

   // Mutations
   const createProjectMutation = useMutation({
      mutationFn: () =>
         createProjectAPI({
            company_id: companyId!,
            name: projectName,
            description: projectDesc,
            manager_id: projectManagerId || null,
            priority: projectPriority,
            budget: Number(projectBudget),
         }),
      onSuccess: () => {
         toast.success('Project created successfully');
         setIsCreateProjectOpen(false);
         setProjectName('');
         setProjectDesc('');
         queryClient.invalidateQueries({ queryKey: ['projects'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to create project'),
   });

   const createTaskMutation = useMutation({
      mutationFn: () =>
         createTaskAPI({
            company_id: companyId!,
            title: taskTitle,
            description: taskDesc,
            project_id: taskProjectId || null,
            assigned_to: taskAssigneeId || null,
            priority: taskPriority,
            estimated_hours: Number(taskEstHours),
         }),
      onSuccess: () => {
         toast.success('Task created successfully');
         setIsCreateTaskOpen(false);
         setTaskTitle('');
         setTaskDesc('');
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to create task'),
   });

   const updateStatusMutation = useMutation({
      mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
         updateTaskStatusAPI(taskId, status),
      onSuccess: () => {
         toast.success('Task status updated');
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to update task status'),
   });

   const logTimeMutation = useMutation({
      mutationFn: () =>
         logTaskTimeAPI(activeLogTimeTask!.id, Number(logHours), logDescription),
      onSuccess: () => {
         toast.success('Time logged successfully');
         setActiveLogTimeTask(null);
         setLogHours(1);
         setLogDescription('');
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to log time'),
   });

   const modRequestMutation = useMutation({
      mutationFn: () =>
         submitTimeModificationRequestAPI({
            company_id: companyId!,
            task_id: activeModTimeTask!.id,
            requested_hours: Number(modRequestedHours),
            current_hours:
               modType === 'estimate_change'
                  ? activeModTimeTask!.estimated_hours
                  : activeModTimeTask!.logged_hours,
            type: modType,
            reason: modReason,
         }),
      onSuccess: () => {
         toast.success('Modification request submitted to manager');
         setActiveModTimeTask(null);
         setModReason('');
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to submit request'),
   });

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Projects & Task Management
               </h1>
               <p className="mt-1 text-sm text-muted-foreground">
                  Track projects, assign tasks, collaborate across stages, and manage time estimates.
               </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
               {isManagerOrAbove && (
                  <Button
                     variant="outline"
                     onClick={() => setIsCreateProjectOpen(true)}
                     className="gap-2"
                  >
                     <FolderPlus className="h-4 w-4" />
                     New Project
                  </Button>
               )}
               <Button
                  onClick={() => setIsCreateTaskOpen(true)}
                  className="gap-2"
               >
                  <Plus className="h-4 w-4" />
                  New Task
               </Button>
            </div>
         </div>

         {/* Navigation & Filters Bar */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
            <div className="flex items-center gap-2">
               <Button
                  variant={activeTab === 'board' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('board')}
                  className="gap-1.5"
               >
                  <Kanban className="h-4 w-4" />
                  Task Board
               </Button>
               <Button
                  variant={activeTab === 'projects' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('projects')}
                  className="gap-1.5"
               >
                  <FolderPlus className="h-4 w-4" />
                  Projects ({projects.length})
               </Button>
            </div>

            {activeTab === 'board' && (
               <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                     Project Filter:
                  </span>
                  <select
                     value={selectedProjectFilter}
                     onChange={(e) => setSelectedProjectFilter(e.target.value)}
                     className="h-8 rounded-md border border-input bg-background px-2.5 text-xs outline-none"
                  >
                     <option value="all">All Projects</option>
                     {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                           {p.name}
                        </option>
                     ))}
                  </select>
               </div>
            )}
         </div>

         {/* VIEW 1: PROJECTS LIST */}
         {activeTab === 'projects' && (
            <div className="space-y-4">
               {isProjectsLoading ? (
                  <div className="flex h-32 items-center justify-center">
                     <Spinner />
                  </div>
               ) : projects.length === 0 ? (
                  <Card className="p-8 text-center">
                     <FolderPlus className="mx-auto h-12 w-12 text-muted-foreground/50" />
                     <p className="mt-3 text-base font-medium">No projects created yet</p>
                     <p className="text-sm text-muted-foreground">
                        Create projects to organize tasks and track deliverables.
                     </p>
                     <Button
                        onClick={() => setIsCreateProjectOpen(true)}
                        className="mt-4"
                        size="sm"
                     >
                        Create Project
                     </Button>
                  </Card>
               ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                     {projects.map((project) => (
                        <Card key={project.id} className="transition-shadow hover:shadow-md">
                           <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                 <div>
                                    <CardTitle className="text-lg">{project.name}</CardTitle>
                                    <CardDescription className="line-clamp-2 mt-1">
                                       {project.description || 'No description provided'}
                                    </CardDescription>
                                 </div>
                                 <Badge
                                    variant={
                                       project.status === 'active'
                                          ? 'default'
                                          : project.status === 'completed'
                                          ? 'secondary'
                                          : 'outline'
                                    }
                                    className="capitalize text-xs"
                                 >
                                    {project.status.replace('_', ' ')}
                                 </Badge>
                              </div>
                           </CardHeader>
                           <CardContent className="space-y-3 text-xs text-muted-foreground pt-0">
                              <div className="flex items-center justify-between">
                                 <span>Priority:</span>
                                 <span className="font-semibold uppercase text-foreground">
                                    {project.priority}
                                 </span>
                              </div>
                              <div className="flex items-center justify-between">
                                 <span>Lead Manager:</span>
                                 <span className="text-foreground">
                                    {project.manager?.full_name || 'Unassigned'}
                                 </span>
                              </div>
                              {project.budget > 0 && (
                                 <div className="flex items-center justify-between">
                                    <span>Budget:</span>
                                    <span className="font-semibold text-foreground">
                                       ${project.budget.toLocaleString()}
                                    </span>
                                 </div>
                              )}
                              <Button
                                 variant="outline"
                                 size="sm"
                                 className="w-full mt-2"
                                 onClick={() => {
                                    setSelectedProjectFilter(project.id);
                                    setActiveTab('board');
                                 }}
                              >
                                 View Tasks on Board
                              </Button>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* VIEW 2: KANBAN BOARD */}
         {activeTab === 'board' && (
            <div>
               {isTasksLoading ? (
                  <div className="flex h-48 items-center justify-center">
                     <Spinner className="size-8" />
                  </div>
               ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                     {STATUS_COLUMNS.map((column) => {
                        const columnTasks = tasks.filter((t) => t.status === column.id);

                        return (
                           <div
                              key={column.id}
                              className={`flex flex-col rounded-xl border p-3 ${column.color}`}
                           >
                              {/* Column Header */}
                              <div className="mb-3 flex items-center justify-between">
                                 <span className="font-semibold text-sm">
                                    {column.label}
                                 </span>
                                 <Badge variant="secondary" className="text-xs">
                                    {columnTasks.length}
                                 </Badge>
                              </div>

                              {/* Task Cards */}
                              <div className="flex flex-1 flex-col gap-3">
                                 {columnTasks.length === 0 ? (
                                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 p-6 text-center text-xs text-muted-foreground">
                                       No tasks here
                                    </div>
                                 ) : (
                                    columnTasks.map((task) => {
                                       const estHours = task.estimated_hours || 0;
                                       const logHours = task.logged_hours || 0;
                                       const progressPct =
                                          estHours > 0
                                             ? Math.min(100, Math.round((logHours / estHours) * 100))
                                             : 0;

                                       return (
                                          <Card
                                             key={task.id}
                                             className="bg-card shadow-xs transition-shadow hover:shadow-md"
                                          >
                                             <CardContent className="p-3.5 space-y-3">
                                                {/* Project and Priority */}
                                                <div className="flex items-center justify-between gap-1">
                                                   <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[120px]">
                                                      {task.project?.name || 'General Task'}
                                                   </span>
                                                   <span
                                                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                                         task.priority === 'urgent'
                                                            ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                            : task.priority === 'high'
                                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                            : 'bg-muted text-muted-foreground'
                                                      }`}
                                                   >
                                                      {task.priority}
                                                   </span>
                                                </div>

                                                {/* Title & Description */}
                                                <div>
                                                   <h4 className="text-sm font-semibold leading-tight text-foreground">
                                                      {task.title}
                                                   </h4>
                                                   {task.description && (
                                                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                         {task.description}
                                                      </p>
                                                   )}
                                                </div>

                                                {/* Assignee */}
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                   <User className="h-3.5 w-3.5" />
                                                   <span>
                                                      {task.assignee?.full_name || 'Unassigned'}
                                                   </span>
                                                </div>

                                                {/* Time Tracking Progress */}
                                                <div className="rounded-md border bg-muted/30 p-2 space-y-1.5">
                                                   <div className="flex items-center justify-between text-[11px]">
                                                      <span className="flex items-center gap-1 text-muted-foreground">
                                                         <Clock className="h-3 w-3" />
                                                         Time:
                                                      </span>
                                                      <span className="font-medium">
                                                         {logHours}h / {estHours}h
                                                      </span>
                                                   </div>
                                                   <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                                      <div
                                                         className={`h-full transition-all ${
                                                            logHours > estHours
                                                               ? 'bg-red-500'
                                                               : 'bg-primary'
                                                         }`}
                                                         style={{ width: `${progressPct}%` }}
                                                      />
                                                   </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                   {/* Status Changer */}
                                                   <select
                                                      value={task.status}
                                                      onChange={(e) =>
                                                         updateStatusMutation.mutate({
                                                            taskId: task.id,
                                                            status: e.target.value as TaskStatus,
                                                         })
                                                      }
                                                      className="h-6 rounded border bg-background px-1.5 text-[10px] outline-none"
                                                   >
                                                      <option value="todo">To Do</option>
                                                      <option value="in_progress">In Progress</option>
                                                      <option value="in_review">In Review</option>
                                                      <option value="done">Completed</option>
                                                   </select>

                                                   {/* Log Time */}
                                                   <Button
                                                      variant="outline"
                                                      size="sm"
                                                      className="h-6 px-2 text-[10px]"
                                                      onClick={() => {
                                                         setActiveLogTimeTask(task);
                                                         setLogHours(1);
                                                      }}
                                                   >
                                                      + Log Time
                                                   </Button>

                                                   {/* Modify Time Request */}
                                                   <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="h-6 px-1.5 text-[10px] text-muted-foreground"
                                                      title="Request Time Modification"
                                                      onClick={() => {
                                                         setActiveModTimeTask(task);
                                                         setModRequestedHours(task.estimated_hours);
                                                      }}
                                                   >
                                                      Adjust
                                                   </Button>
                                                   {/* Discuss (Attachments & Comments) */}
                                                   <Button
                                                      variant="secondary"
                                                      size="sm"
                                                      className="h-6 px-2 text-[10px] gap-1 ml-auto"
                                                      title="Comments & File Attachments"
                                                      onClick={() => setActiveCollabTask(task)}
                                                   >
                                                      <MessageSquare className="size-3" />
                                                      <Paperclip className="size-2.5" />
                                                      Discuss
                                                   </Button>
                                                </div>
                                             </CardContent>
                                          </Card>
                                       );
                                    })
                                 )}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               )}
            </div>
         )}

         {/* MODAL 1: Create Project */}
         {isCreateProjectOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
               <Card className="w-full max-w-md shadow-xl">
                  <CardHeader>
                     <CardTitle>Create New Project</CardTitle>
                     <CardDescription>
                        Define project parameters, budget, and assign a lead manager.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="projName">Project Name</Label>
                        <Input
                           id="projName"
                           placeholder="e.g. Website Redesign Q3"
                           value={projectName}
                           onChange={(e) => setProjectName(e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="projDesc">Description</Label>
                        <Textarea
                           id="projDesc"
                           rows={3}
                           placeholder="Goals and requirements..."
                           value={projectDesc}
                           onChange={(e) => setProjectDesc(e.target.value)}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                           <Label htmlFor="projPriority">Priority</Label>
                           <select
                              id="projPriority"
                              value={projectPriority}
                              onChange={(e) =>
                                 setProjectPriority(e.target.value as ProjectPriority)
                              }
                              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                           >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="projBudget">Budget ($)</Label>
                           <Input
                              id="projBudget"
                              type="number"
                              value={projectBudget}
                              onChange={(e) => setProjectBudget(Number(e.target.value))}
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="projMgr">Project Manager</Label>
                        <select
                           id="projMgr"
                           value={projectManagerId}
                           onChange={(e) => setProjectManagerId(e.target.value)}
                           className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                        >
                           <option value="">Select manager...</option>
                           {employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                 {emp.full_name} ({emp.role})
                              </option>
                           ))}
                        </select>
                     </div>
                     <div className="flex justify-end gap-2 pt-4">
                        <Button
                           variant="outline"
                           onClick={() => setIsCreateProjectOpen(false)}
                        >
                           Cancel
                        </Button>
                        <Button
                           disabled={!projectName.trim() || createProjectMutation.isPending}
                           onClick={() => createProjectMutation.mutate()}
                        >
                           {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

         {/* MODAL 2: Create Task */}
         {isCreateTaskOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
               <Card className="w-full max-w-md shadow-xl">
                  <CardHeader>
                     <CardTitle>Create New Task</CardTitle>
                     <CardDescription>
                        Assign work to a team member and set estimated hours.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="tTitle">Task Title</Label>
                        <Input
                           id="tTitle"
                           placeholder="e.g. Implement user login API"
                           value={taskTitle}
                           onChange={(e) => setTaskTitle(e.target.value)}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="tDesc">Description (Optional)</Label>
                        <Textarea
                           id="tDesc"
                           rows={2}
                           placeholder="Task specifications..."
                           value={taskDesc}
                           onChange={(e) => setTaskDesc(e.target.value)}
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                           <Label htmlFor="tProj">Project</Label>
                           <select
                              id="tProj"
                              value={taskProjectId}
                              onChange={(e) => setTaskProjectId(e.target.value)}
                              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                           >
                              <option value="">No Project</option>
                              {projects.map((p) => (
                                 <option key={p.id} value={p.id}>
                                    {p.name}
                                 </option>
                              ))}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="tAssignee">Assignee</Label>
                           <select
                              id="tAssignee"
                              value={taskAssigneeId}
                              onChange={(e) => setTaskAssigneeId(e.target.value)}
                              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                           >
                              <option value="">Unassigned</option>
                              {employees.map((emp) => (
                                 <option key={emp.id} value={emp.id}>
                                    {emp.full_name}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                           <Label htmlFor="tPriority">Priority</Label>
                           <select
                              id="tPriority"
                              value={taskPriority}
                              onChange={(e) =>
                                 setTaskPriority(e.target.value as TaskPriority)
                              }
                              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                           >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="tEst">Estimated Hours</Label>
                           <Input
                              id="tEst"
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={taskEstHours}
                              onChange={(e) => setTaskEstHours(Number(e.target.value))}
                           />
                        </div>
                     </div>
                     <div className="flex justify-end gap-2 pt-4">
                        <Button
                           variant="outline"
                           onClick={() => setIsCreateTaskOpen(false)}
                        >
                           Cancel
                        </Button>
                        <Button
                           disabled={!taskTitle.trim() || createTaskMutation.isPending}
                           onClick={() => createTaskMutation.mutate()}
                        >
                           {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

         {/* MODAL 3: Log Time */}
         {activeLogTimeTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
               <Card className="w-full max-w-md shadow-xl">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Log Time on Task
                     </CardTitle>
                     <CardDescription className="font-semibold text-foreground">
                        {activeLogTimeTask.title}
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="lh">Hours Worked</Label>
                        <Input
                           id="lh"
                           type="number"
                           min="0.25"
                           step="0.25"
                           value={logHours}
                           onChange={(e) => setLogHours(Number(e.target.value))}
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="ld">Work Description / Notes (Optional)</Label>
                        <Textarea
                           id="ld"
                           rows={2}
                           placeholder="What was completed during this time?"
                           value={logDescription}
                           onChange={(e) => setLogDescription(e.target.value)}
                        />
                     </div>
                     <div className="flex justify-end gap-2 pt-4">
                        <Button
                           variant="outline"
                           onClick={() => setActiveLogTimeTask(null)}
                        >
                           Cancel
                        </Button>
                        <Button
                           disabled={logHours <= 0 || logTimeMutation.isPending}
                           onClick={() => logTimeMutation.mutate()}
                        >
                           {logTimeMutation.isPending ? 'Logging...' : 'Confirm Log'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

         {/* MODAL 4: Request Time Modification */}
         {activeModTimeTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
               <Card className="w-full max-w-md shadow-xl">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-amber-500" />
                        Request Time Modification
                     </CardTitle>
                     <CardDescription>
                        Task: <span className="font-semibold">{activeModTimeTask.title}</span>
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Modification Type</Label>
                        <div className="grid grid-cols-2 gap-2">
                           <Button
                              type="button"
                              variant={modType === 'estimate_change' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                 setModType('estimate_change');
                                 setModRequestedHours(activeModTimeTask.estimated_hours);
                              }}
                           >
                              Change Estimate
                           </Button>
                           <Button
                              type="button"
                              variant={modType === 'log_adjustment' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                 setModType('log_adjustment');
                                 setModRequestedHours(activeModTimeTask.logged_hours);
                              }}
                           >
                              Adjust Logged Time
                           </Button>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="reqHours">
                           New Requested Hours (Currently{' '}
                           {modType === 'estimate_change'
                              ? activeModTimeTask.estimated_hours
                              : activeModTimeTask.logged_hours}
                           h)
                        </Label>
                        <Input
                           id="reqHours"
                           type="number"
                           min="0"
                           step="0.5"
                           value={modRequestedHours}
                           onChange={(e) => setModRequestedHours(Number(e.target.value))}
                        />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="modReason">Reason for modification request</Label>
                        <Textarea
                           id="modReason"
                           rows={3}
                           placeholder="Explain why the estimate or logged hours need adjustment..."
                           value={modReason}
                           onChange={(e) => setModReason(e.target.value)}
                        />
                     </div>

                     <div className="flex justify-end gap-2 pt-4">
                        <Button
                           variant="outline"
                           onClick={() => setActiveModTimeTask(null)}
                        >
                           Cancel
                        </Button>
                        <Button
                           disabled={!modReason.trim() || modRequestMutation.isPending}
                           onClick={() => modRequestMutation.mutate()}
                        >
                           {modRequestMutation.isPending ? 'Submitting...' : 'Submit to Manager'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}

         {/* Task Collaboration Modal (Attachments & Comments with @Mentions) */}
         {activeCollabTask && (
            <TaskCollaborationModal
               isOpen={Boolean(activeCollabTask)}
               task={activeCollabTask}
               companyId={companyId || undefined}
               employees={employees}
               onClose={() => setActiveCollabTask(null)}
            />
         )}
      </div>
   );
}
