import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Plus, Search } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { getCurrentUserAPI } from '@/features/auth/api/apiAuth';
import { getCurrentCompanyEmployeesAPI } from '@/features/company/api/companyApis';
import type { EmployeeWithTeam } from '@/types/apis';

type PeopleFilter =
   | 'all'
   | 'admins'
   | 'members'
   | 'limited-members'
   | 'guests'
   | 'full-seats'
   | 'guest-seats'
   | 'view-only-seats';

const filterOptions: { value: PeopleFilter; label: string }[] = [
   { value: 'all', label: 'All users' },
   { value: 'admins', label: 'Admins' },
   { value: 'members', label: 'Members' },
   { value: 'limited-members', label: 'Limited members' },
   { value: 'guests', label: 'Guests' },
   { value: 'full-seats', label: 'Full seats' },
   { value: 'guest-seats', label: 'Guest seats' },
   { value: 'view-only-seats', label: 'View only seats' },
];

function isInviteManager(teamRole?: string) {
   return teamRole === 'owner' || teamRole === 'hr';
}

function matchesFilter(employee: EmployeeWithTeam, filter: PeopleFilter) {
   switch (filter) {
      case 'admins':
         return ['owner', 'admin', 'hr'].includes(employee.role);
      case 'members':
         return ['manager', 'employee'].includes(employee.role);
      case 'limited-members':
         return employee.role === 'manager';
      case 'guests':
         return !employee.user_id;
      case 'full-seats':
         return Boolean(employee.user_id);
      case 'guest-seats':
         return !employee.user_id;
      case 'view-only-seats':
         return employee.role === 'employee';
      default:
         return true;
   }
}

function matchesSearch(employee: EmployeeWithTeam, searchTerm: string) {
   const query = searchTerm.trim().toLowerCase();

   if (!query) return true;

   return [
      employee.full_name,
      employee.email ?? '',
      employee.role,
      employee.team?.team_name ?? '',
   ].some((value) => value.toLowerCase().includes(query));
}

function exportPeopleCsv(employees: EmployeeWithTeam[]) {
   const rows = [
      [
         'Name',
         'Email',
         'Role',
         'Last Active',
         'Invited By',
         'Invited On',
         'Teams',
      ],
      ...employees.map((employee) => [
         employee.full_name,
         employee.email ?? '',
         employee.role,
         new Date(employee.updated_at).toLocaleString(),
         employee.role === 'owner' ? 'Self-created' : 'Not tracked yet',
         new Date(employee.created_at).toLocaleDateString(),
         employee.team?.team_name ?? 'No team',
      ]),
   ];

   const csvContent = rows
      .map((row) =>
         row
            .map((value) => `"${String(value).replaceAll('"', '""')}"`)
            .join(','),
      )
      .join('\n');

   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
   const url = URL.createObjectURL(blob);
   const link = document.createElement('a');

   link.href = url;
   link.download = 'company-people.csv';
   link.click();
   URL.revokeObjectURL(url);
}

export default function PeoplePage() {
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedFilter, setSelectedFilter] = useState<PeopleFilter>('all');

   const { data: user } = useQuery({
      queryKey: ['user'],
      queryFn: getCurrentUserAPI,
   });
   const { data: employees, isLoading } = useQuery({
      queryKey: ['company-employees'],
      queryFn: getCurrentCompanyEmployeesAPI,
   });

   if (isLoading) return <Spinner />;

   const teamRole = String(user?.user_metadata?.teamRole ?? '').toLowerCase();
   const canManageInvites = isInviteManager(teamRole);
   const people = employees ?? [];
   const filteredPeople = people.filter(
      (employee) =>
         matchesFilter(employee, selectedFilter) &&
         matchesSearch(employee, searchTerm),
   );

   return (
      <section className="space-y-6">
         <Card className="shadow-sm">
            <CardHeader className="space-y-4">
               <div className="flex items-center justify-between gap-4">
                  <div>
                     <CardTitle className="text-2xl">Manage people</CardTitle>
                     <CardDescription className="mt-1">
                        Keep track of everyone in your company workspace.
                     </CardDescription>
                  </div>

                  {canManageInvites ? (
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => exportPeopleCsv(filteredPeople)}
                     >
                        <Download className="size-4" />
                        Export
                     </Button>
                  ) : null}
               </div>
            </CardHeader>

            <CardContent className="space-y-5">
               <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="relative flex-1">
                     <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                     <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search people by name, email, role, or team"
                        className="pr-36 pl-9"
                     />
                     {canManageInvites ? (
                        <Link
                           to="/invite"
                           className="absolute top-1/2 right-1.5 inline-flex -translate-y-1/2 items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                        >
                           <Plus className="size-4" />
                           Invite people
                        </Link>
                     ) : null}
                  </div>
               </div>

               <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="text-sm font-medium">
                     All users ({people.length})
                  </div>

                  <select
                     value={selectedFilter}
                     onChange={(event) =>
                        setSelectedFilter(event.target.value as PeopleFilter)
                     }
                     className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
                  >
                     {filterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               </div>

               <div className="overflow-hidden rounded-2xl border border-border/70">
                  <div className="overflow-x-auto">
                     <table className="min-w-full border-collapse text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                           <tr>
                              <th className="px-4 py-3 font-medium">Name</th>
                              <th className="px-4 py-3 font-medium">Email</th>
                              <th className="px-4 py-3 font-medium">Role</th>
                              <th className="px-4 py-3 font-medium">
                                 Last active
                              </th>
                              <th className="px-4 py-3 font-medium">
                                 Invited by
                              </th>
                              <th className="px-4 py-3 font-medium">
                                 Invited on
                              </th>
                              <th className="px-4 py-3 font-medium">Teams</th>
                           </tr>
                        </thead>
                        <tbody>
                           {filteredPeople.length ? (
                              filteredPeople.map((employee) => (
                                 <tr
                                    key={employee.id}
                                    className="border-t border-border/70 bg-background"
                                 >
                                    <td className="px-4 py-3 font-medium">
                                       {employee.full_name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                       {employee.email || 'No email'}
                                    </td>
                                    <td className="px-4 py-3 capitalize">
                                       {employee.role}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                       {new Date(
                                          employee.updated_at,
                                       ).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                       {employee.role === 'owner'
                                          ? 'Self-created'
                                          : 'Not tracked yet'}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                       {new Date(
                                          employee.created_at,
                                       ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                       {employee.team?.team_name || 'No team'}
                                    </td>
                                 </tr>
                              ))
                           ) : (
                              <tr>
                                 <td
                                    colSpan={7}
                                    className="px-4 py-8 text-center text-muted-foreground"
                                 >
                                    No people match the current search or filter.
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            </CardContent>
         </Card>
      </section>
   );
}
