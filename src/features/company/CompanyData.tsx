import {
   Building2,
   Globe,
   Mail,
   MapPin,
   Phone,
   ShieldCheck,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { getCurrentUserCompanyAPI } from '@/features/company/api/companyApis';

function InfoRow({
   label,
   value,
}: {
   label: string;
   value: string | number | null | undefined;
}) {
   return (
      <div className="flex flex-col gap-1 rounded-2xl border border-border/70 bg-background/70 p-4">
         <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
         </p>
         <p className="text-sm leading-6 text-foreground">
            {value || 'Not provided'}
         </p>
      </div>
   );
}

export default function CompanyData() {
   const { data: company, isLoading } = useQuery({
      queryKey: ['current-company'],
      queryFn: getCurrentUserCompanyAPI,
   });

   if (isLoading) return <Spinner />;

   if (!company) {
      return (
         <Card className="shadow-sm">
            <CardHeader>
               <CardTitle>Company profile unavailable</CardTitle>
               <CardDescription>
                  Your account has a company reference, but the company record
                  could not be loaded yet.
               </CardDescription>
            </CardHeader>
         </Card>
      );
   }

   return (
      <section className="space-y-6">
         <Card className="border-primary/15 bg-linear-to-br from-primary/8 via-background to-background shadow-sm">
            <CardHeader className="space-y-4">
               <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Company overview
               </div>
               <div className="space-y-2">
                  <CardTitle className="text-2xl sm:text-3xl">
                     {company.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-6 sm:text-base">
                     {company.description ||
                        'No company description added yet.'}
                  </CardDescription>
               </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
               <InfoRow label="Industry" value={company.industry} />
               <InfoRow label="Tagline" value={company.tagline} />
               <InfoRow label="Plan" value={company.plan} />
               <InfoRow
                  label="Subscription limit"
                  value={company.subscription_limit}
               />
               <InfoRow label="Timezone" value={company.timezone} />
               <InfoRow
                  label="Status"
                  value={company.is_active ? 'Active' : 'Inactive'}
               />
            </CardContent>
         </Card>

         <div className="grid gap-6 xl:grid-cols-2">
            <Card className="shadow-sm">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                     <Globe className="size-5 text-primary" />
                     Contact details
                  </CardTitle>
               </CardHeader>
               <CardContent className="grid gap-4">
                  <InfoRow label="Website" value={company.website} />
                  <InfoRow label="Work email" value={company.work_email} />
                  <InfoRow label="Phone" value={company.phone} />
               </CardContent>
            </Card>

            <Card className="shadow-sm">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                     <MapPin className="size-5 text-primary" />
                     Location
                  </CardTitle>
               </CardHeader>
               <CardContent className="grid gap-4">
                  <InfoRow label="Country" value={company.country} />
                  <InfoRow label="Address" value={company.headquarter} />
               </CardContent>
            </Card>
         </div>

         <div className="grid gap-6 xl:grid-cols-2">
            <Card className="shadow-sm">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                     <ShieldCheck className="size-5 text-primary" />
                     Workspace metadata
                  </CardTitle>
               </CardHeader>
               <CardContent className="grid gap-4">
                  <InfoRow label="Company ID" value={company.id} />
                  <InfoRow label="Owner ID" value={company.owner_id} />
                  <InfoRow
                     label="Created at"
                     value={new Date(company.created_at).toLocaleString()}
                  />
                  <InfoRow
                     label="Updated at"
                     value={new Date(company.updated_at).toLocaleString()}
                  />
               </CardContent>
            </Card>

            <Card className="shadow-sm">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                     <Building2 className="size-5 text-primary" />
                     Quick summary
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                  <p>
                     Your company has been created and linked to your account.
                  </p>
                  <p>
                     Next step: invite teammates or let them join with an
                     invitation code.
                  </p>
                  <div className="grid gap-3 pt-2">
                     <div className="flex items-center gap-2 rounded-xl border border-border/70 p-3 text-foreground">
                        <Mail className="size-4 text-primary" />
                        {company.work_email || 'Add a work email later'}
                     </div>
                     <div className="flex items-center gap-2 rounded-xl border border-border/70 p-3 text-foreground">
                        <Phone className="size-4 text-primary" />
                        {company.phone || 'Add a phone number later'}
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </section>
   );
}
