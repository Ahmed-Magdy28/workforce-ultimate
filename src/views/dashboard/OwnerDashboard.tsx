'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Edit3,
   Eye,
   Clock3,
   Save,
   X,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { CountrySelect, getCountryFlag } from '@/components/ui/country-select';
import { TimezoneSelect, detectBrowserTimezone } from '@/components/ui/timezone-select';
import { IndustrySelect } from '@/components/ui/industry-select';
import {
   getCurrentUserCompanyAPI,
   updateCompanyAPI,
   type UpdateCompanyInput,
} from '@/features/company/api/companyApis';
import type { Company } from '@/types/apis';
import HRDashboard from './HRDashboard';
import ManagerDashboard from './ManagerDashboard';
import EmployeeDashboard from './EmployeeDashboard';

type DashboardView = 'owner' | 'manager' | 'employee';

function EditCompanyModal({
   company,
   onClose,
}: {
   company: Company;
   onClose: () => void;
}) {
   const queryClient = useQueryClient();

   const [editName, setEditName] = useState(company.name || '');
   const [editTagline, setEditTagline] = useState(company.tagline || '');
   const [editIndustry, setEditIndustry] = useState(company.industry || '');
   const [editCountry, setEditCountry] = useState(company.country || 'Egypt');
   const [editTimezone, setEditTimezone] = useState(company.timezone || detectBrowserTimezone());
   const [editAddress, setEditAddress] = useState(company.headquarter || '');
   const [editWebsite, setEditWebsite] = useState(company.website || '');
   const [editWorkEmail, setEditWorkEmail] = useState(company.work_email || '');
   const [editPhone, setEditPhone] = useState(company.phone || '');
   const [editDescription, setEditDescription] = useState(company.description || '');

   const updateMutation = useMutation({
      mutationFn: (updates: UpdateCompanyInput) =>
         updateCompanyAPI(company.id, updates),
      onSuccess: () => {
         toast.success('Company profile updated successfully!');
         onClose();
         queryClient.invalidateQueries({ queryKey: ['current-company'] });
         queryClient.invalidateQueries({ queryKey: ['companies'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to update company'),
   });

   const handleSave = () => {
      updateMutation.mutate({
         name: editName,
         tagline: editTagline,
         industry: editIndustry,
         country: editCountry,
         timezone: editTimezone,
         headquarter: editAddress,
         website: editWebsite,
         workEmail: editWorkEmail,
         phone: editPhone,
         description: editDescription,
      });
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
         <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
               <div>
                  <CardTitle className="text-xl">Modify Company Details</CardTitle>
                  <CardDescription>
                     Update brand identity, country of origin, timezone, and contact info.
                  </CardDescription>
               </div>
               <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
               >
                  <X className="size-5" />
               </button>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                     <Label htmlFor="c-name">Company Name</Label>
                     <Input
                        id="c-name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="c-tagline">Tagline</Label>
                     <Input
                        id="c-tagline"
                        placeholder="e.g. Empowering modern workforce"
                        value={editTagline}
                        onChange={(e) => setEditTagline(e.target.value)}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="c-industry">Industry</Label>
                     <IndustrySelect
                        id="c-industry"
                        value={editIndustry}
                        onChange={(e) => setEditIndustry(e.target.value)}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="c-country">Country of origin (with Flag)</Label>
                     <CountrySelect
                        id="c-country"
                        value={editCountry}
                        onChange={(e) => setEditCountry(e.target.value)}
                     />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="c-tz">Timezone (Egypt +2, Gulf, Global)</Label>
                        <button
                           type="button"
                           onClick={() => {
                              const detected = detectBrowserTimezone();
                              setEditTimezone(detected);
                              toast.success(`Detected browser timezone: ${detected}`);
                           }}
                           className="text-xs text-primary hover:underline font-medium"
                        >
                           Auto-detect from browser
                        </button>
                     </div>
                     <TimezoneSelect
                        id="c-tz"
                        value={editTimezone}
                        onChange={(e) => setEditTimezone(e.target.value)}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="c-website">Website</Label>
                     <Input
                        id="c-website"
                        type="url"
                        value={editWebsite}
                        onChange={(e) => setEditWebsite(e.target.value)}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="c-email">Work Email</Label>
                     <Input
                        id="c-email"
                        type="email"
                        value={editWorkEmail}
                        onChange={(e) => setEditWorkEmail(e.target.value)}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="c-phone">Phone</Label>
                     <Input
                        id="c-phone"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="c-addr">Headquarters Address</Label>
                     <Input
                        id="c-addr"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                     />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                     <Label htmlFor="c-desc">Description</Label>
                     <Textarea
                        id="c-desc"
                        rows={3}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                     />
                  </div>
               </div>

               <div className="flex justify-end gap-2 border-t pt-4">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onClose}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="button"
                     disabled={!editName.trim() || updateMutation.isPending}
                     onClick={handleSave}
                     className="gap-2"
                  >
                     <Save className="size-4" />
                     {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

export default function OwnerDashboard() {
   const [activeView, setActiveView] = useState<DashboardView>('owner');
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

   const { data: company, isLoading: isCompanyLoading } = useQuery({
      queryKey: ['current-company'],
      queryFn: getCurrentUserCompanyAPI,
   });

   if (isCompanyLoading) {
      return (
         <div className="flex h-64 items-center justify-center">
            <Spinner className="size-8" />
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Top Bar with Role View Switcher & Edit Company Button */}
         <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-primary text-xs">
                     👑 Workspace Owner
                  </Badge>
                  <h2 className="text-lg font-bold">{company?.name || 'Company'}</h2>
                  <span className="text-sm">{getCountryFlag(company?.country)}</span>
               </div>
               <p className="text-xs text-muted-foreground">
                  As the owner, you can edit company details and preview any role&apos;s dashboard below.
               </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
               {/* Dashboard Role Switcher */}
               <div className="flex items-center rounded-lg border bg-muted/40 p-1">
                  <button
                     type="button"
                     onClick={() => setActiveView('owner')}
                     className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                        activeView === 'owner'
                           ? 'bg-background shadow-xs text-foreground'
                           : 'text-muted-foreground hover:text-foreground'
                     }`}
                  >
                     Executive View
                  </button>
                  <button
                     type="button"
                     onClick={() => setActiveView('manager')}
                     className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                        activeView === 'manager'
                           ? 'bg-background shadow-xs text-foreground'
                           : 'text-muted-foreground hover:text-foreground'
                     }`}
                  >
                     Manager View
                  </button>
                  <button
                     type="button"
                     onClick={() => setActiveView('employee')}
                     className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                        activeView === 'employee'
                           ? 'bg-background shadow-xs text-foreground'
                           : 'text-muted-foreground hover:text-foreground'
                     }`}
                  >
                     Employee View
                  </button>
               </div>

               {/* Edit Company Content Button */}
               <Button
                  onClick={() => setIsEditModalOpen(true)}
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
               >
                  <Edit3 className="size-3.5" />
                  Edit Company Content
               </Button>
            </div>
         </div>

         {/* RENDER ACTIVE VIEW */}
         {activeView === 'owner' && (
            <div className="space-y-6">
               {/* Company Summary Banner */}
               {company && (
                  <Card className="border-primary/15 bg-linear-to-br from-primary/5 via-background to-background shadow-xs">
                     <CardContent className="p-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                           <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                 Country & Flag
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-bold text-foreground">
                                 <span className="text-xl">{getCountryFlag(company.country)}</span>
                                 <span>{company.country || 'Not set'}</span>
                              </p>
                           </div>

                           <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                 Operating Timezone
                              </p>
                              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                 <Clock3 className="size-3.5 text-primary" />
                                 <span>{company.timezone || 'UTC'}</span>
                              </p>
                           </div>

                           <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                 Industry
                              </p>
                              <p className="mt-1 text-xs font-semibold text-foreground">
                                 {company.industry || 'General'}
                              </p>
                           </div>

                           <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                 Subscription Plan
                              </p>
                              <p className="mt-1 text-xs font-semibold uppercase text-primary">
                                 {company.plan || 'Free'} ({company.subscription_limit} seats)
                              </p>
                           </div>
                        </div>

                        {company.description && (
                           <p className="mt-4 border-t pt-3 text-xs text-muted-foreground leading-relaxed">
                              &ldquo;{company.description}&rdquo;
                           </p>
                        )}
                     </CardContent>
                  </Card>
               )}

               {/* Standard HR Executive View */}
               <HRDashboard />
            </div>
         )}

         {activeView === 'manager' && (
            <div className="space-y-4">
               <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-3 text-xs text-purple-700 dark:text-purple-300 flex items-center gap-2">
                  <Eye className="size-4 shrink-0" />
                  <span>
                     <strong>Manager View Preview:</strong> Viewing team projects, task pipelines, and time modification approval requests as experienced by a Manager.
                  </span>
               </div>
               <ManagerDashboard />
            </div>
         )}

         {activeView === 'employee' && (
            <div className="space-y-4">
               <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Eye className="size-4 shrink-0" />
                  <span>
                     <strong>Employee View Preview:</strong> Viewing personal deliverables, active tasks, logged hours, and request trackers as experienced by an Employee.
                  </span>
               </div>
               <EmployeeDashboard />
            </div>
         )}

         {/* MODAL: EDIT COMPANY CONTENT */}
         {isEditModalOpen && company && (
            <EditCompanyModal
               company={company}
               onClose={() => setIsEditModalOpen(false)}
            />
         )}
      </div>
   );
}

