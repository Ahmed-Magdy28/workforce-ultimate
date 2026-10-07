'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Users,
   UserPlus,
   Briefcase,
   Check,
   XCircle,
   Copy,
   Plus,
   Building,
   Award,
   Trash2,
   Power,
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
import { getCurrentCompanyEmployeesAPI } from '@/features/company/api/companyApis';
import {
   getTeamsHierarchyAPI,
   getCompanyJoinRequestsAPI,
   reviewCompanyJoinRequestAPI,
   getCompanyInvitationsAPI,
   createCompanyInviteAPI,
   toggleInvitationActiveAPI,
   deleteInvitationAPI,
} from '@/features/company/api/teamHierarchyApis';
import { getProjectsAPI } from '@/features/projects/api/projectApis';
import {
   getHRActionsAPI,
   createHRActionAPI,
   updateHRActionStatusAPI,
} from '@/features/collaboration/api/collaborationApis';
import type { EmployeeRole } from '@/types/apis';
import type { HRActionType, HRActionSeverity, HRActionStatus } from '@/types/collaboration';

export default function HRDashboard() {
   const { companyId } = useAuth();
   const queryClient = useQueryClient();

   // Form states for join request approvals
   const [selectedRole, setSelectedRole] = useState<Record<string, EmployeeRole>>({});
   const [selectedTeam, setSelectedTeam] = useState<Record<string, string>>({});

   // Quick Invite Generator
   const [inviteRole, setInviteRole] = useState<EmployeeRole>('employee');
   const [inviteMaxUses, setInviteMaxUses] = useState(5);

   // HR Actions (Bonuses & Warnings) State
   const [isNewActionOpen, setIsNewActionOpen] = useState(false);
   const [actionType, setActionType] = useState<HRActionType>('bonus');
   const [actionTitle, setActionTitle] = useState('');
   const [actionEmployeeId, setActionEmployeeId] = useState('');
   const [actionAmount, setActionAmount] = useState(500);
   const [actionReason, setActionReason] = useState('');
   const [actionSeverity, setActionSeverity] = useState<HRActionSeverity>('standard');
   const [actionFilter, setActionFilter] = useState<string>('all');

   // Queries
   const { data: employees = [] } = useQuery({
      queryKey: ['company-employees', companyId],
      queryFn: getCurrentCompanyEmployeesAPI,
      enabled: Boolean(companyId),
   });

   const { data: teams = [] } = useQuery({
      queryKey: ['teams-hierarchy', companyId],
      queryFn: () => getTeamsHierarchyAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: joinRequests = [], isLoading: isJoinLoading } = useQuery({
      queryKey: ['join-requests', companyId],
      queryFn: () => getCompanyJoinRequestsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: invitations = [] } = useQuery({
      queryKey: ['company-invitations', companyId],
      queryFn: () => getCompanyInvitationsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: projects = [] } = useQuery({
      queryKey: ['projects', companyId],
      queryFn: () => getProjectsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: hrActions = [], isLoading: isHRActionsLoading } = useQuery({
      queryKey: ['hr-actions', companyId],
      queryFn: () => getHRActionsAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const pendingJoinRequests = joinRequests.filter((r) => r.status === 'pending');
   const currentEmployee = employees[0];

   // Review join request mutation
   const reviewJoinMutation = useMutation({
      mutationFn: ({
         requestId,
         status,
         role,
         teamId,
      }: {
         requestId: string;
         status: 'approved' | 'rejected';
         role?: EmployeeRole;
         teamId?: string | null;
      }) => reviewCompanyJoinRequestAPI(requestId, status, role, teamId),
      onSuccess: (_, vars) => {
         toast.success(
            `Join request ${vars.status === 'approved' ? 'approved' : 'rejected'}`,
         );
         queryClient.invalidateQueries({ queryKey: ['join-requests'] });
         queryClient.invalidateQueries({ queryKey: ['company-employees'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to review request'),
   });

   // Create invite mutation
   const createInviteMutation = useMutation({
      mutationFn: () =>
         createCompanyInviteAPI(companyId!, inviteRole, inviteMaxUses),
      onSuccess: (newInvite) => {
         toast.success(`Invite code created: ${newInvite.code}`);
         queryClient.invalidateQueries({ queryKey: ['company-invitations'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to create invite'),
   });

   // Deactivate / Stop invitation mutation
   const toggleInviteActiveMutation = useMutation({
      mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
         toggleInvitationActiveAPI(id, isActive),
      onSuccess: (_, vars) => {
         toast.success(
            vars.isActive ? 'Invitation code re-activated' : 'Invitation code stopped / revoked',
         );
         queryClient.invalidateQueries({ queryKey: ['company-invitations'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to update invitation status'),
   });

   // Delete invitation mutation
   const deleteInviteMutation = useMutation({
      mutationFn: (id: string) => deleteInvitationAPI(id),
      onSuccess: () => {
         toast.success('Invitation code deleted permanently');
         queryClient.invalidateQueries({ queryKey: ['company-invitations'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to delete invitation'),
   });

   // Create HR Action (Bonus / Warning) mutation
   const createHRActionMutation = useMutation({
      mutationFn: () =>
         createHRActionAPI({
            companyId: companyId!,
            employeeId: actionEmployeeId,
            issuerId: currentEmployee?.id || actionEmployeeId,
            type: actionType,
            title: actionTitle,
            amount: actionType === 'bonus' ? Number(actionAmount) : 0,
            reason: actionReason,
            severity: actionSeverity,
         }),
      onSuccess: () => {
         toast.success(`HR ${actionType} recorded successfully`);
         setIsNewActionOpen(false);
         setActionTitle('');
         setActionReason('');
         queryClient.invalidateQueries({ queryKey: ['hr-actions'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to record HR action'),
   });

   // Update HR Action status mutation
   const updateActionStatusMutation = useMutation({
      mutationFn: ({
         actionId,
         status,
      }: {
         actionId: string;
         status: HRActionStatus;
      }) => updateHRActionStatusAPI(actionId, status),
      onSuccess: () => {
         toast.success('Action status updated');
         queryClient.invalidateQueries({ queryKey: ['hr-actions'] });
      },
   });

   const filteredHRActions = hrActions.filter((a) =>
      actionFilter === 'all' ? true : a.type === actionFilter,
   );

   const copyInviteCode = (code: string) => {
      navigator.clipboard.writeText(code);
      toast.success(`Copied invite code: ${code}`);
   };

   return (
      <div className="space-y-8">
         {/* Top Header */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  HR & Organization Dashboard
               </h1>
               <p className="text-sm text-muted-foreground">
                  Headcount governance, employee onboarding, bonuses, disciplinary warnings, and departmental structure.
               </p>
            </div>
            <div className="flex items-center gap-2">
               <Link href="/invite">
                  <Button className="gap-2">
                     <UserPlus className="h-4 w-4" />
                     Send New Invite
                  </Button>
               </Link>
            </div>
         </div>

         {/* 4 Stat Cards */}
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Headcount</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{employees.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active team members</p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Departments & Teams</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{teams.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Functional team units</p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{projects.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Under leadership</p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Join Requests</CardTitle>
                  <UserPlus className="h-4 w-4 text-amber-500" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                     {pendingJoinRequests.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Candidates awaiting onboarding</p>
               </CardContent>
            </Card>
         </div>

         {/* HR ACTIONS: BONUSES, WARNINGS & RECOGNITIONS */}
         <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                     <Award className="size-5 text-amber-500" />
                     Personnel Actions: Bonuses, Recognitions & Warnings
                  </h2>
                  <p className="text-xs text-muted-foreground">
                     Incentivize top contributors and document disciplinary actions transparently.
                  </p>
               </div>
               <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-lg border bg-card p-1 text-xs">
                     <button
                        type="button"
                        onClick={() => setActionFilter('all')}
                        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                           actionFilter === 'all'
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                        }`}
                     >
                        All ({hrActions.length})
                     </button>
                     <button
                        type="button"
                        onClick={() => setActionFilter('bonus')}
                        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                           actionFilter === 'bonus'
                              ? 'bg-emerald-600 text-white'
                              : 'text-muted-foreground hover:text-foreground'
                        }`}
                     >
                        Bonuses ({hrActions.filter((a) => a.type === 'bonus').length})
                     </button>
                     <button
                        type="button"
                        onClick={() => setActionFilter('warning')}
                        className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                           actionFilter === 'warning'
                              ? 'bg-rose-600 text-white'
                              : 'text-muted-foreground hover:text-foreground'
                        }`}
                     >
                        Warnings ({hrActions.filter((a) => a.type === 'warning').length})
                     </button>
                  </div>
                  <Button
                     onClick={() => {
                        setActionEmployeeId(employees[0]?.id || '');
                        setIsNewActionOpen(true);
                     }}
                     className="gap-1.5"
                  >
                     <Plus className="size-4" />
                     Issue Action
                  </Button>
               </div>
            </div>

            {isHRActionsLoading ? (
               <div className="flex h-32 items-center justify-center">
                  <Spinner />
               </div>
            ) : filteredHRActions.length === 0 ? (
               <Card className="p-8 text-center text-sm text-muted-foreground">
                  No personnel actions recorded under this filter. Reward or issue notices to keep teams aligned.
               </Card>
            ) : (
               <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {filteredHRActions.map((act) => {
                     const isBonus = act.type === 'bonus';
                     const isWarning = act.type === 'warning';

                     return (
                        <Card
                           key={act.id}
                           className={`transition-all ${
                              isBonus
                                 ? 'border-emerald-500/30 bg-emerald-500/5'
                                 : isWarning
                                 ? 'border-rose-500/30 bg-rose-500/5'
                                 : 'border-blue-500/30 bg-blue-500/5'
                           }`}
                        >
                           <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-2">
                                 <Badge
                                    className={`capitalize text-[10px] ${
                                       isBonus
                                          ? 'bg-emerald-600 text-white'
                                          : isWarning
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-blue-600 text-white'
                                    }`}
                                 >
                                    {act.type}
                                    {isBonus && act.amount > 0 ? ` • +$${act.amount}` : ''}
                                 </Badge>
                                 <Badge variant="outline" className="text-[10px] capitalize">
                                    {act.status}
                                 </Badge>
                              </div>
                              <CardTitle className="text-base pt-1">{act.title}</CardTitle>
                              <CardDescription className="text-xs">
                                 Recipient: <span className="font-semibold text-foreground">{act.employee?.full_name || 'Employee'}</span>
                              </CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-3 pt-0 text-xs">
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                 {act.reason}
                              </p>
                              <div className="flex items-center justify-between border-t pt-2 text-[11px] text-muted-foreground">
                                 <span>Issued: {new Date(act.created_at).toLocaleDateString()}</span>
                                 <div className="flex items-center gap-1">
                                    {act.status === 'active' && (
                                       <button
                                          type="button"
                                          onClick={() =>
                                             updateActionStatusMutation.mutate({
                                                actionId: act.id,
                                                status: 'resolved',
                                             })
                                          }
                                          className="text-primary hover:underline font-medium"
                                       >
                                          Mark Resolved
                                       </button>
                                    )}
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     );
                  })}
               </div>
            )}
         </div>

         {/* PENDING JOIN REQUESTS (USER-COMPANY LINKING) */}
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-semibold">
                  Pending Join Requests & Approvals ({pendingJoinRequests.length})
               </h2>
            </div>

            {isJoinLoading ? (
               <div className="flex h-32 items-center justify-center">
                  <Spinner />
               </div>
            ) : pendingJoinRequests.length === 0 ? (
               <Card className="p-8 text-center text-sm text-muted-foreground">
                  No pending join requests. Send invitation codes to onboard new members.
               </Card>
            ) : (
               <div className="space-y-3">
                  {pendingJoinRequests.map((req) => (
                     <Card key={req.id} className="border-amber-500/20 bg-amber-500/5">
                        <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                 <span className="font-semibold text-sm">
                                    {req.full_name}
                                 </span>
                                 <span className="text-xs text-muted-foreground">
                                    ({req.email})
                                 </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                 Desired Role: <span className="font-medium capitalize text-foreground">{req.desired_role}</span> | Requested: {new Date(req.created_at).toLocaleDateString()}
                              </p>
                           </div>

                           <div className="flex flex-wrap items-center gap-2">
                              {/* Role Selector */}
                              <select
                                 value={selectedRole[req.id] || 'employee'}
                                 onChange={(e) =>
                                    setSelectedRole((prev) => ({
                                       ...prev,
                                       [req.id]: e.target.value as EmployeeRole,
                                    }))
                                 }
                                 className="h-8 rounded border bg-background px-2 text-xs outline-none"
                              >
                                 <option value="employee">Employee</option>
                                 <option value="manager">Manager</option>
                                 <option value="senior_manager">Senior Manager</option>
                                 <option value="regional_manager">Regional Manager</option>
                                 <option value="hr">HR</option>
                                 <option value="admin">Admin</option>
                              </select>

                              {/* Team Selector */}
                              <select
                                 value={selectedTeam[req.id] || ''}
                                 onChange={(e) =>
                                    setSelectedTeam((prev) => ({
                                       ...prev,
                                       [req.id]: e.target.value,
                                    }))
                                 }
                                 className="h-8 rounded border bg-background px-2 text-xs outline-none"
                              >
                                 <option value="">No Team Assigned</option>
                                 {teams.map((t) => (
                                    <option key={t.id} value={t.id}>
                                       {t.team_name}
                                    </option>
                                 ))}
                              </select>

                              {/* Approve Button */}
                              <Button
                                 size="sm"
                                 className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                 disabled={reviewJoinMutation.isPending}
                                 onClick={() =>
                                    reviewJoinMutation.mutate({
                                       requestId: req.id,
                                       status: 'approved',
                                       role: selectedRole[req.id] || 'employee',
                                       teamId: selectedTeam[req.id] || null,
                                    })
                                 }
                              >
                                 <Check className="h-3.5 w-3.5" />
                                 Approve & Onboard
                              </Button>

                              {/* Reject Button */}
                              <Button
                                 size="sm"
                                 variant="outline"
                                 className="h-8 gap-1 text-rose-600 hover:text-rose-700"
                                 disabled={reviewJoinMutation.isPending}
                                 onClick={() =>
                                    reviewJoinMutation.mutate({
                                       requestId: req.id,
                                       status: 'rejected',
                                    })
                                 }
                              >
                                 <XCircle className="h-3.5 w-3.5" />
                                 Reject
                              </Button>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </div>

         {/* ACTIVE INVITATIONS & QUICK GENERATOR */}
         <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Quick Generator */}
            <Card className="lg:col-span-1">
               <CardHeader>
                  <CardTitle className="text-base">Generate Quick Invite Code</CardTitle>
                  <CardDescription className="text-xs">
                     Create a multi-use invite code with pre-assigned permissions.
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="inv-role" className="text-xs">Assigned Role</Label>
                     <select
                        id="inv-role"
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as EmployeeRole)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs outline-none"
                     >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="senior_manager">Senior Manager</option>
                        <option value="regional_manager">Regional Manager</option>
                        <option value="hr">HR</option>
                        <option value="admin">Admin</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="inv-uses" className="text-xs">Max Redemptions</Label>
                     <Input
                        id="inv-uses"
                        type="number"
                        min="1"
                        max="100"
                        value={inviteMaxUses}
                        onChange={(e) => setInviteMaxUses(Number(e.target.value))}
                        className="h-9 text-xs"
                     />
                  </div>

                  <Button
                     className="w-full gap-2"
                     disabled={createInviteMutation.isPending}
                     onClick={() => createInviteMutation.mutate()}
                  >
                     <Plus className="h-4 w-4" />
                     {createInviteMutation.isPending ? 'Generating...' : 'Generate Invite Code'}
                  </Button>
               </CardContent>
            </Card>

            {/* Existing Invitations List */}
            <Card className="lg:col-span-2">
               <CardHeader>
                  <CardTitle className="text-base">Active Workspace Invitation Codes</CardTitle>
                  <CardDescription className="text-xs">
                     Share these codes with team candidates to bypass application forms.
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  {invitations.length === 0 ? (
                     <p className="text-xs text-muted-foreground py-4 text-center">
                        No active invitation codes. Generate one to share with candidates.
                     </p>
                  ) : (
                     <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {invitations.map((inv) => (
                           <div
                              key={inv.id}
                              className={`flex flex-col gap-2 rounded-xl border p-3 text-xs sm:flex-row sm:items-center sm:justify-between transition-colors ${
                                 inv.is_active
                                    ? 'bg-muted/30 border-border/80'
                                    : 'bg-destructive/5 border-destructive/20 opacity-75'
                              }`}
                           >
                              <div className="space-y-1">
                                 <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold tracking-wider text-primary text-sm">
                                       {inv.code}
                                    </span>
                                    <Badge variant="outline" className="capitalize text-[10px]">
                                       {inv.role}
                                    </Badge>
                                    <Badge
                                       className={`text-[10px] capitalize ${
                                          inv.is_active
                                             ? 'bg-emerald-600 text-white'
                                             : 'bg-rose-600 text-white'
                                       }`}
                                    >
                                       {inv.is_active ? 'Active' : 'Stopped'}
                                    </Badge>
                                 </div>
                                 <p className="text-[11px] text-muted-foreground">
                                    Used: {inv.used_count}/{inv.max_uses} | Expires:{' '}
                                    {new Date(inv.expires_at).toLocaleDateString()}
                                 </p>
                              </div>

                              <div className="flex items-center gap-1.5 self-end sm:self-center">
                                 {/* Copy Code */}
                                 <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-xs gap-1"
                                    onClick={() => copyInviteCode(inv.code)}
                                    title="Copy code"
                                 >
                                    <Copy className="h-3.5 w-3.5" />
                                    Copy
                                 </Button>

                                 {/* Stop / Re-activate Toggle */}
                                 <Button
                                    size="sm"
                                    variant={inv.is_active ? 'outline' : 'secondary'}
                                    className={`h-7 px-2.5 text-xs gap-1 ${
                                       inv.is_active
                                          ? 'text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                                          : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                    }`}
                                    disabled={toggleInviteActiveMutation.isPending}
                                    onClick={() =>
                                       toggleInviteActiveMutation.mutate({
                                          id: inv.id,
                                          isActive: !inv.is_active,
                                       })
                                    }
                                    title={inv.is_active ? 'Stop/Revoke this invitation code' : 'Reactivate this code'}
                                 >
                                    <Power className="h-3 w-3" />
                                    {inv.is_active ? 'Stop Code' : 'Activate'}
                                 </Button>

                                 {/* Permanent Delete */}
                                 <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                    disabled={deleteInviteMutation.isPending}
                                    onClick={() => {
                                       if (confirm(`Delete invitation code ${inv.code} permanently?`)) {
                                          deleteInviteMutation.mutate(inv.id);
                                       }
                                    }}
                                    title="Delete code permanently"
                                 >
                                    <Trash2 className="h-3.5 w-3.5" />
                                 </Button>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>

         {/* Teams Structure Overview */}
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-semibold">Teams & Department Structure</h2>
               <Link href="/teams" className="text-xs text-primary hover:underline">
                  View Full Hierarchy →
               </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {teams.map((t) => (
                  <Card key={t.id}>
                     <CardHeader className="pb-2">
                        <CardTitle className="text-base">{t.team_name}</CardTitle>
                        <CardDescription className="text-xs">
                           Lead: {t.lead?.full_name || 'Unassigned'}
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="text-xs text-muted-foreground pt-0">
                        <p>{t.members_count || 0} assigned employees</p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>

         {/* MODAL: Record HR Action */}
         {isNewActionOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
               <Card className="w-full max-w-md shadow-2xl">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Award className="size-5 text-amber-500" />
                        Record HR Action
                     </CardTitle>
                     <CardDescription>
                        Issue an incentive bonus, spot award, or disciplinary notice to an employee.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-3 gap-2">
                        {(['bonus', 'warning', 'recognition'] as HRActionType[]).map((t) => (
                           <button
                              key={t}
                              type="button"
                              onClick={() => setActionType(t)}
                              className={`rounded-lg border p-2 text-center text-xs font-semibold capitalize transition-all ${
                                 actionType === t
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border text-muted-foreground hover:bg-muted'
                              }`}
                           >
                              {t}
                           </button>
                        ))}
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="hr-emp">Select Employee</Label>
                        <select
                           id="hr-emp"
                           value={actionEmployeeId}
                           onChange={(e) => setActionEmployeeId(e.target.value)}
                           className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs outline-none"
                        >
                           {employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                 {emp.full_name} ({emp.email || emp.role})
                              </option>
                           ))}
                        </select>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="hr-title">Action Title / Headline</Label>
                        <Input
                           id="hr-title"
                           placeholder={
                              actionType === 'bonus'
                                 ? 'e.g. Q3 Top Performer Spot Bonus'
                                 : 'e.g. Unscheduled Absence Warning'
                           }
                           value={actionTitle}
                           onChange={(e) => setActionTitle(e.target.value)}
                        />
                     </div>

                     {actionType === 'bonus' && (
                        <div className="space-y-2">
                           <Label htmlFor="hr-amount">Bonus Amount ($ USD)</Label>
                           <Input
                              id="hr-amount"
                              type="number"
                              min="0"
                              step="50"
                              value={actionAmount}
                              onChange={(e) => setActionAmount(Number(e.target.value))}
                           />
                        </div>
                     )}

                     {actionType === 'warning' && (
                        <div className="space-y-2">
                           <Label htmlFor="hr-sev">Severity Level</Label>
                           <select
                              id="hr-sev"
                              value={actionSeverity}
                              onChange={(e) => setActionSeverity(e.target.value as HRActionSeverity)}
                              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs outline-none"
                           >
                              <option value="low">Low - Informal Discussion</option>
                              <option value="standard">Standard - Written Notice</option>
                              <option value="high">High - Escalated Warning</option>
                              <option value="critical">Critical - Final PIP / Disciplinary</option>
                           </select>
                        </div>
                     )}

                     <div className="space-y-2">
                        <Label htmlFor="hr-reason">Detailed Justification & Record</Label>
                        <Textarea
                           id="hr-reason"
                           rows={3}
                           placeholder="Provide comprehensive context, measurable outcomes, or incident details..."
                           value={actionReason}
                           onChange={(e) => setActionReason(e.target.value)}
                        />
                     </div>

                     <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setIsNewActionOpen(false)}>
                           Cancel
                        </Button>
                        <Button
                           disabled={
                              !actionTitle.trim() ||
                              !actionReason.trim() ||
                              !actionEmployeeId ||
                              createHRActionMutation.isPending
                           }
                           onClick={() => createHRActionMutation.mutate()}
                        >
                           {createHRActionMutation.isPending ? 'Recording...' : 'Record Action'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}
      </div>
   );
}
