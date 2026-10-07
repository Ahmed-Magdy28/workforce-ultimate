'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
   Building2,
   Globe,
   Sun,
   Moon,
   Save,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { CountrySelect, getCountryFlag } from '@/components/ui/country-select';
import { TimezoneSelect, detectBrowserTimezone } from '@/components/ui/timezone-select';
import { IndustrySelect } from '@/components/ui/industry-select';
import {
   getCurrentUserCompanyAPI,
   updateCompanyAPI,
   type UpdateCompanyInput,
} from '@/features/company/api/companyApis';
import type { Company } from '@/types/apis';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import type { RootState } from '@/store';
import { setTheme } from '@/features/theme/themeSlice';

function WorkspaceProfileForm({
   company,
   canEditWorkspace,
}: {
   company: Company;
   canEditWorkspace: boolean;
}) {
   const queryClient = useQueryClient();

   const [wsName, setWsName] = useState(company.name || '');
   const [wsTagline, setWsTagline] = useState(company.tagline || '');
   const [wsIndustry, setWsIndustry] = useState(company.industry || '');
   const [wsCountry, setWsCountry] = useState(company.country || 'Egypt');
   const [wsTimezone, setWsTimezone] = useState(company.timezone || detectBrowserTimezone());
   const [wsWebsite, setWsWebsite] = useState(company.website || '');
   const [wsEmail, setWsEmail] = useState(company.work_email || '');
   const [wsPhone, setWsPhone] = useState(company.phone || '');
   const [wsAddress, setWsAddress] = useState(company.headquarter || '');
   const [wsDescription, setWsDescription] = useState(company.description || '');

   const updateCompanyMutation = useMutation({
      mutationFn: (updates: UpdateCompanyInput) =>
         updateCompanyAPI(company.id, updates),
      onSuccess: () => {
         toast.success('Workspace settings updated successfully!');
         queryClient.invalidateQueries({ queryKey: ['current-company'] });
         queryClient.invalidateQueries({ queryKey: ['companies'] });
      },
      onError: (err: Error) => toast.error(err.message || 'Failed to update settings'),
   });

   const handleSaveWorkspace = () => {
      updateCompanyMutation.mutate({
         name: wsName,
         tagline: wsTagline,
         industry: wsIndustry,
         country: wsCountry,
         timezone: wsTimezone,
         website: wsWebsite,
         workEmail: wsEmail,
         phone: wsPhone,
         headquarter: wsAddress,
         description: wsDescription,
      });
   };

   return (
      <Card className="shadow-sm">
         <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="size-5 text-primary" />
                  Company & Workspace Profile
               </CardTitle>
               <CardDescription>
                  General organization details and country of origin.
               </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1.5 text-xs">
               <span>{getCountryFlag(wsCountry)}</span>
               <span>{wsCountry}</span>
            </Badge>
         </CardHeader>
         <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
               <div className="space-y-2">
                  <Label htmlFor="ws-name">Workspace Name</Label>
                  <Input
                     id="ws-name"
                     value={wsName}
                     disabled={!canEditWorkspace}
                     onChange={(e) => setWsName(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="ws-tagline">Tagline</Label>
                  <Input
                     id="ws-tagline"
                     placeholder="e.g. Modern workforce platform"
                     value={wsTagline}
                     disabled={!canEditWorkspace}
                     onChange={(e) => setWsTagline(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="ws-industry">Industry</Label>
                  <IndustrySelect
                     id="ws-industry"
                     value={wsIndustry}
                     disabled={!canEditWorkspace}
                     onChange={(e) => setWsIndustry(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="ws-country">Country of origin (with Flag)</Label>
                  <CountrySelect
                     id="ws-country"
                     value={wsCountry}
                     disabled={!canEditWorkspace}
                     onChange={(e) => setWsCountry(e.target.value)}
                  />
               </div>

               <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                     <Label htmlFor="ws-tz">Operating Timezone (Egypt +2, Gulf, Global)</Label>
                     {canEditWorkspace && (
                        <button
                           type="button"
                           onClick={() => {
                              const detected = detectBrowserTimezone();
                              setWsTimezone(detected);
                              toast.success(`Detected browser timezone: ${detected}`);
                           }}
                           className="text-xs text-primary hover:underline font-medium"
                        >
                           Auto-detect from browser
                        </button>
                     )}
                  </div>
                  <TimezoneSelect
                     id="ws-tz"
                     value={wsTimezone}
                     disabled={!canEditWorkspace}
                     onChange={(e) => setWsTimezone(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="ws-website">Website URL</Label>
                  <Input
                     id="ws-website"
                     type="url"
                     value={wsWebsite}
                     disabled={!canEditWorkspace}
                     onChange={(e) => setWsWebsite(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="ws-email">Official Work Email</Label>
                  <Input
                     id="ws-email"
                     type="email"
                     value={wsEmail}
                     disabled={!canEditWorkspace}
                     onChange={(e) => setWsEmail(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="ws-phone">Official Phone</Label>
                  <Input
                     id="ws-phone"
                     value={wsPhone}
                     disabled={!canEditWorkspace}
                     onChange={(e) => setWsPhone(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="ws-addr">Headquarters Address</Label>
                  <Input
                     id="ws-addr"
                     value={wsAddress}
                     disabled={!canEditWorkspace}
                     onChange={(e) => setWsAddress(e.target.value)}
                  />
               </div>

               <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ws-desc">Company Summary / Description</Label>
                  <Textarea
                     id="ws-desc"
                     rows={3}
                     value={wsDescription}
                     disabled={!canEditWorkspace}
                     onChange={(e) => setWsDescription(e.target.value)}
                  />
               </div>
            </div>

            {canEditWorkspace ? (
               <div className="flex justify-end pt-2">
                  <Button
                     onClick={handleSaveWorkspace}
                     disabled={!wsName.trim() || updateCompanyMutation.isPending}
                     className="gap-2"
                  >
                     <Save className="size-4" />
                     {updateCompanyMutation.isPending ? 'Saving...' : 'Save Workspace Changes'}
                  </Button>
               </div>
            ) : (
               <p className="text-xs text-muted-foreground italic">
                  * Only company owners and HR admins can modify workspace details.
               </p>
            )}
         </CardContent>
      </Card>
   );
}

export default function AppSettingsPage() {
   const { i18n } = useTranslation();
   const dispatch = useDispatch();
   const { user } = useAuth();
   const { isOwner, isHR } = useRole();
   const theme = useSelector((state: RootState) => state.theme.theme);

   const { data: company, isLoading: isCompanyLoading } = useQuery({
      queryKey: ['current-company'],
      queryFn: getCurrentUserCompanyAPI,
   });

   const canEditWorkspace = isOwner || isHR;

   if (isCompanyLoading) {
      return (
         <div className="flex h-64 items-center justify-center">
            <Spinner className="size-8" />
         </div>
      );
   }

   return (
      <div className="space-y-8 max-w-5xl">
         {/* Page Header */}
         <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
               Workspace & System Settings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
               Manage workspace identity, localization, appearance, and operating defaults.
            </p>
         </div>

         {/* SECTION 1: WORKSPACE & COMPANY IDENTITY */}
         {company ? (
            <WorkspaceProfileForm
               company={company}
               canEditWorkspace={canEditWorkspace}
            />
         ) : (
            <Card className="p-6 text-center text-sm text-muted-foreground">
               No active company workspace found to configure.
            </Card>
         )}

         {/* SECTION 2: REGIONAL & LANGUAGE SETTINGS */}
         <Card className="shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="size-5 text-primary" />
                  Language & Regional Preferences
               </CardTitle>
               <CardDescription>
                  Switch interface language and layout direction (LTR / RTL).
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                     variant={i18n.language === 'en' ? 'default' : 'outline'}
                     onClick={() => i18n.changeLanguage('en')}
                     className="gap-2"
                  >
                     <span>🇬🇧</span> English (LTR)
                  </Button>
                  <Button
                     variant={i18n.language === 'ar' ? 'default' : 'outline'}
                     onClick={() => i18n.changeLanguage('ar')}
                     className="gap-2"
                  >
                     <span>🇪🇬</span> العربية (RTL)
                  </Button>
               </div>
               <p className="text-xs text-muted-foreground">
                  Current language: <strong className="text-foreground">{i18n.language === 'ar' ? 'العربية' : 'English'}</strong>. Changes take effect across all navigation components and views instantly.
               </p>
            </CardContent>
         </Card>

         {/* SECTION 3: THEME & APPEARANCE */}
         <Card className="shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Sun className="size-5 text-amber-500" />
                  Theme & Visual Appearance
               </CardTitle>
               <CardDescription>
                  Customize the look and contrast of Workforce Ultimate.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-md">
                  <Button
                     type="button"
                     variant={theme === 'light' ? 'default' : 'outline'}
                     onClick={() => dispatch(setTheme('light'))}
                     className="gap-2 justify-start h-12"
                  >
                     <Sun className="size-4" />
                     <span>Light Mode</span>
                  </Button>

                  <Button
                     type="button"
                     variant={theme === 'dark' ? 'default' : 'outline'}
                     onClick={() => dispatch(setTheme('dark'))}
                     className="gap-2 justify-start h-12"
                  >
                     <Moon className="size-4" />
                     <span>Dark Mode</span>
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* SECTION 4: SECURITY & WORKSPACE META */}
         <Card className="shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="size-5 text-emerald-500" />
                  Workspace Plan & Credentials
               </CardTitle>
               <CardDescription>
                  Active tenant metadata, user role, and access rights.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border bg-muted/30 p-3">
                     <span className="font-semibold text-foreground">Current Plan:</span>
                     <p className="mt-1 text-sm font-bold uppercase text-primary">
                        {company?.plan || 'Free'} Tier
                     </p>
                  </div>
                  <div className="rounded-xl border bg-muted/30 p-3">
                     <span className="font-semibold text-foreground">Seat Limit:</span>
                     <p className="mt-1 text-sm font-bold text-foreground">
                        {company?.subscription_limit || 10} Seats
                     </p>
                  </div>
                  <div className="rounded-xl border bg-muted/30 p-3">
                     <span className="font-semibold text-foreground">Your Role:</span>
                     <p className="mt-1 text-sm font-bold text-foreground capitalize">
                        {user?.user_metadata?.teamRole || 'Employee'}
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
