'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Users,
   Shield,
   Briefcase,
   Plus,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import {
   getTeamsHierarchyAPI,
   createTeamAPI,
   updateTeamLeadAPI,
} from '@/features/company/api/teamHierarchyApis';
import { getCurrentCompanyEmployeesAPI } from '@/features/company/api/companyApis';

export default function TeamsPage() {
   const { companyId } = useAuth();
   const { isManagerOrAbove, isOwner, isHR } = useRole();
   const queryClient = useQueryClient();

   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [teamName, setTeamName] = useState('');
   const [selectedLeadId, setSelectedLeadId] = useState('');

   const {
      data: teams = [],
      isLoading: isTeamsLoading,
      error: teamsError,
   } = useQuery({
      queryKey: ['teams-hierarchy', companyId],
      queryFn: () => getTeamsHierarchyAPI(companyId || undefined),
      enabled: Boolean(companyId),
   });

   const { data: employees = [] } = useQuery({
      queryKey: ['company-employees', companyId],
      queryFn: getCurrentCompanyEmployeesAPI,
      enabled: Boolean(companyId),
   });

   const createTeamMutation = useMutation({
      mutationFn: () =>
         createTeamAPI(teamName, selectedLeadId || null, companyId || undefined),
      onSuccess: () => {
         toast.success('Team created successfully');
         setIsCreateModalOpen(false);
         setTeamName('');
         setSelectedLeadId('');
         queryClient.invalidateQueries({ queryKey: ['teams-hierarchy'] });
      },
      onError: (err: Error) => {
         toast.error(err.message || 'Failed to create team');
      },
   });

   const updateLeadMutation = useMutation({
      mutationFn: ({
         teamId,
         leadId,
      }: {
         teamId: string;
         leadId: string | null;
      }) => updateTeamLeadAPI(teamId, leadId),
      onSuccess: () => {
         toast.success('Team lead updated');
         queryClient.invalidateQueries({ queryKey: ['teams-hierarchy'] });
      },
      onError: (err: Error) => {
         toast.error(err.message || 'Failed to update team lead');
      },
   });

   const canManageTeams = isOwner || isHR || isManagerOrAbove;

   return (
      <div className="space-y-8">
         {/* Top Header */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Company Hierarchy & Teams
               </h1>
               <p className="mt-1 text-sm text-muted-foreground">
                  5-Role organizational structure and functional teams management.
               </p>
            </div>

            {canManageTeams && (
               <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-2"
               >
                  <Plus className="h-4 w-4" />
                  Create Team
               </Button>
            )}
         </div>

         {/* 5-Tier Hierarchy Overview Card */}
         <Card className="border-primary/20 bg-linear-to-r from-primary/5 via-card to-card">
            <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Shield className="h-5 w-5 text-primary" />
                  5-Tier Role Hierarchy & Reporting Flow
               </CardTitle>
               <CardDescription>
                  Access levels, governance and responsibility tiers across your organization.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-5">
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-center">
                     <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Tier 1: Owner
                     </div>
                     <p className="mt-1 text-xs text-muted-foreground">
                        Full administrative & billing control
                     </p>
                  </div>
                  <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-center">
                     <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Tier 2: HR
                     </div>
                     <p className="mt-1 text-xs text-muted-foreground">
                        People ops, invites & join approvals
                     </p>
                  </div>
                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-center">
                     <div className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        Tier 3: Regional Mgr
                     </div>
                     <p className="mt-1 text-xs text-muted-foreground">
                        Multi-team oversight & strategy
                     </p>
                  </div>
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                     <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Tier 4: Manager / Lead
                     </div>
                     <p className="mt-1 text-xs text-muted-foreground">
                        Projects, task delegation & time approvals
                     </p>
                  </div>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
                     <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Tier 5: Employee
                     </div>
                     <p className="mt-1 text-xs text-muted-foreground">
                        Task execution & time logging
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Teams Section */}
         <div>
            <div className="mb-4 flex items-center justify-between">
               <h2 className="text-xl font-semibold">Functional Teams</h2>
               <span className="text-sm text-muted-foreground">
                  {teams.length} {teams.length === 1 ? 'team' : 'teams'} configured
               </span>
            </div>

            {isTeamsLoading ? (
               <div className="flex h-40 items-center justify-center">
                  <Spinner className="size-8" />
               </div>
            ) : teamsError ? (
               <Card className="p-6 text-center text-sm text-destructive">
                  Failed to load teams. Make sure the database migration has been executed.
               </Card>
            ) : teams.length === 0 ? (
               <Card className="flex flex-col items-center justify-center p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-3 text-base font-medium">No teams yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                     Create your first team to organize employees and delegate leadership.
                  </p>
                  {canManageTeams && (
                     <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-4 gap-2"
                        size="sm"
                     >
                        <Plus className="h-4 w-4" />
                        Create First Team
                     </Button>
                  )}
               </Card>
            ) : (
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {teams.map((team) => (
                     <Card
                        key={team.id}
                        className="flex flex-col justify-between border transition-shadow hover:shadow-md"
                     >
                        <CardHeader className="pb-3">
                           <div className="flex items-start justify-between gap-2">
                              <div>
                                 <CardTitle className="text-lg font-bold">
                                    {team.team_name}
                                 </CardTitle>
                                 <CardDescription className="mt-1 flex items-center gap-1.5 text-xs">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    {team.members_count || 0}{' '}
                                    {team.members_count === 1 ? 'Member' : 'Members'}
                                 </CardDescription>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                 Active
                              </Badge>
                           </div>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-1">
                           {/* Team Lead */}
                           <div className="rounded-lg border bg-muted/40 p-3">
                              <div className="text-xs font-semibold text-muted-foreground">
                                 Team Lead
                              </div>
                              <div className="mt-1 flex items-center justify-between">
                                 {team.lead ? (
                                    <div className="flex items-center gap-2">
                                       <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                          {team.lead.full_name.charAt(0)}
                                       </div>
                                       <div>
                                          <div className="text-sm font-medium">
                                             {team.lead.full_name}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                             {team.lead.email}
                                          </div>
                                       </div>
                                    </div>
                                 ) : (
                                    <span className="text-xs italic text-muted-foreground">
                                       No team lead assigned
                                    </span>
                                 )}

                                 {canManageTeams && (
                                    <select
                                       value={team.team_lead_id || ''}
                                       onChange={(e) =>
                                          updateLeadMutation.mutate({
                                             teamId: team.id,
                                             leadId: e.target.value || null,
                                          })
                                       }
                                       className="h-7 rounded border bg-background px-2 text-xs outline-none"
                                    >
                                       <option value="">(Change Lead)</option>
                                       {employees.map((emp) => (
                                          <option key={emp.id} value={emp.id}>
                                             {emp.full_name}
                                          </option>
                                       ))}
                                    </select>
                                 )}
                              </div>
                           </div>

                           {/* Members Chips */}
                           <div>
                              <div className="mb-2 text-xs font-semibold text-muted-foreground">
                                 Assigned Members ({team.members?.length || 0})
                              </div>
                              {team.members && team.members.length > 0 ? (
                                 <div className="flex flex-wrap gap-1.5">
                                    {team.members.map((member) => (
                                       <span
                                          key={member.id}
                                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                                       >
                                          <span className="font-medium">
                                             {member.full_name}
                                          </span>
                                          <span className="text-[10px] text-muted-foreground">
                                             ({member.role})
                                          </span>
                                       </span>
                                    ))}
                                 </div>
                              ) : (
                                 <p className="text-xs text-muted-foreground">
                                    No members in this team yet.
                                 </p>
                              )}
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </div>

         {/* Create Team Dialog */}
         {isCreateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
               <Card className="w-full max-w-md shadow-xl">
                  <CardHeader>
                     <CardTitle>Create New Team</CardTitle>
                     <CardDescription>
                        Add a new department or functional team to your company.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input
                           id="teamName"
                           placeholder="e.g. Engineering, Marketing, Operations"
                           value={teamName}
                           onChange={(e) => setTeamName(e.target.value)}
                        />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="leadSelect">Team Lead (Optional)</Label>
                        <select
                           id="leadSelect"
                           value={selectedLeadId}
                           onChange={(e) => setSelectedLeadId(e.target.value)}
                           className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                           <option value="">Select a team lead...</option>
                           {employees.map((emp) => (
                              <option key={emp.id} value={emp.id}>
                                 {emp.full_name} ({emp.role})
                              </option>
                           ))}
                        </select>
                     </div>

                     <div className="flex justify-end gap-2 pt-4">
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => setIsCreateModalOpen(false)}
                        >
                           Cancel
                        </Button>
                        <Button
                           type="button"
                           disabled={!teamName.trim() || createTeamMutation.isPending}
                           onClick={() => createTeamMutation.mutate()}
                        >
                           {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </div>
         )}
      </div>
   );
}
