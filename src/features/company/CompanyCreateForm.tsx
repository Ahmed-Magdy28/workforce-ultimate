import { Building2, Clock3, Globe, MapPinned, Users } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { IndustrySelect } from '@/components/ui/industry-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TimezoneSelect } from '@/components/ui/timezone-select';
import { createCompanyAPI } from '@/features/company/api/companyApis';

type CompanyCreateFormValues = {
   name: string;
   industry: string;
   customIndustry: string;
   tagline: string;
   website: string;
   workEmail: string;
   phone: string;
   country: string;
   timezone: string;
   address: string;
   description: string;
};

const companyHighlights = [
   {
      icon: Building2,
      title: 'Clear company identity',
      description:
         'Set the name, industry, and short summary your team will recognize immediately.',
   },
   {
      icon: Users,
      title: 'Ready for team growth',
      description:
         'Capture core contact details now so invites and onboarding stay organized from day one.',
   },
   {
      icon: MapPinned,
      title: 'Useful operating context',
      description:
         'Location and timezone details help future scheduling, HR workflows, and global team setup.',
   },
];

function FieldError({ message }: { message?: string }) {
   if (!message) return null;

   return <p className="text-sm text-destructive">{message}</p>;
}

export default function CompanyCreateForm() {
   const queryClient = useQueryClient();
   const {
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors },
   } = useForm<CompanyCreateFormValues>({
      defaultValues: {
         name: '',
         industry: '',
         customIndustry: '',
         tagline: '',
         website: '',
         workEmail: '',
         phone: '',
         country: '',
         timezone: 'UTC',
         address: '',
         description: '',
      },
   });
   const selectedIndustry = useWatch({
      control,
      name: 'industry',
   });

   const { mutateAsync: createCompany, isPending: isCreatingCompany } =
      useMutation({
         mutationFn: createCompanyAPI,
         onSuccess: async (company) => {
            await queryClient.invalidateQueries({ queryKey: ['user'] });
            await queryClient.invalidateQueries({ queryKey: ['companies'] });
            await queryClient.invalidateQueries({
               queryKey: ['current-company'],
            });
            await queryClient.invalidateQueries({
               queryKey: ['company', company.id],
            });

            toast.success(`${company.name} is ready for your team.`);
            reset();
         },
         onError: (error: Error) => {
            toast.error(error.message);
         },
      });

   async function onSubmit(data: CompanyCreateFormValues) {
      await createCompany({
         name: data.name,
         industry:
            data.industry === 'Other' ? data.customIndustry : data.industry,
         tagline: data.tagline,
         website: data.website,
         workEmail: data.workEmail,
         phone: data.phone,
         country: data.country,
         timezone: data.timezone,
         headquarter: data.address,
         description: data.description,
      });
   }

   return (
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
         <Card className="border-primary/15 bg-linear-to-br from-primary/8 via-background to-background shadow-sm">
            <CardHeader className="space-y-4">
               <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  New workspace
               </div>
               <div className="space-y-2">
                  <CardTitle className="text-2xl leading-tight sm:text-3xl">
                     Create a company your team can grow into.
                  </CardTitle>
                  <CardDescription className="max-w-xl text-sm leading-6 sm:text-base">
                     Start with the essentials now. You can refine policies,
                     departments, and people settings after the workspace is
                     created.
                  </CardDescription>
               </div>
            </CardHeader>

            <CardContent className="space-y-4">
               {companyHighlights.map(({ icon: Icon, title, description }) => (
                  <div
                     key={title}
                     className="rounded-2xl border border-border/70 bg-background/80 p-4"
                  >
                     <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                           <Icon className="size-4" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-sm font-semibold">{title}</p>
                           <p className="text-sm leading-6 text-muted-foreground">
                              {description}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}

               <div className="rounded-2xl border border-dashed border-primary/30 bg-background/70 p-4 text-sm text-muted-foreground">
                  Tip: the creator will be added as the owner employee record
                  automatically when the company is created.
               </div>
            </CardContent>
         </Card>

         <Card className="shadow-sm">
            <CardHeader className="space-y-2 border-b">
               <CardTitle className="text-xl sm:text-2xl">
                  Company profile
               </CardTitle>
               <CardDescription className="text-sm sm:text-base">
                  Fill in the basics for your company. Required fields are kept
                  focused so setup stays quick.
               </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
               <CardContent className="space-y-8 pt-6">
                  <section className="space-y-4">
                     <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Building2 className="size-4 text-primary" />
                        Identity
                     </div>

                     <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                           <Label htmlFor="name">Company name</Label>
                           <Input
                              id="name"
                              placeholder="Acme Operations"
                              disabled={isCreatingCompany}
                              aria-invalid={Boolean(errors.name)}
                              {...register('name', {
                                 required: 'Company name is required',
                                 minLength: {
                                    value: 2,
                                    message:
                                       'Company name should be at least 2 characters',
                                 },
                              })}
                           />
                           <FieldError message={errors.name?.message} />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="industry">Industry</Label>
                           <IndustrySelect
                              id="industry"
                              disabled={isCreatingCompany}
                              aria-invalid={Boolean(errors.industry)}
                              {...register('industry', {
                                 required: 'Industry is required',
                              })}
                           />
                           <FieldError message={errors.industry?.message} />
                        </div>

                        {selectedIndustry === 'Other' ? (
                           <div className="space-y-2">
                              <Label htmlFor="customIndustry">
                                 Custom industry
                              </Label>
                              <Input
                                 id="customIndustry"
                                 placeholder="Write your industry"
                                 disabled={isCreatingCompany}
                                 aria-invalid={Boolean(errors.customIndustry)}
                                 {...register('customIndustry', {
                                    validate: (value) =>
                                       selectedIndustry !== 'Other' ||
                                       value.trim().length > 1 ||
                                       'Please write your industry',
                                 })}
                              />
                              <FieldError
                                 message={errors.customIndustry?.message}
                              />
                           </div>
                        ) : null}

                        <div className="space-y-2">
                           <Label htmlFor="tagline">Tagline</Label>
                           <Input
                              id="tagline"
                              placeholder="Operations clarity for growing teams"
                              disabled={isCreatingCompany}
                              aria-invalid={Boolean(errors.tagline)}
                              {...register('tagline', {
                                 required: 'Tagline is required',
                                 minLength: {
                                    value: 6,
                                    message:
                                       'Tagline should be at least 6 characters',
                                 },
                              })}
                           />
                           <FieldError message={errors.tagline?.message} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                           <Label htmlFor="description">
                              Short description
                           </Label>
                           <Textarea
                              id="description"
                              rows={4}
                              placeholder="Tell your team what this company workspace is for."
                              disabled={isCreatingCompany}
                              aria-invalid={Boolean(errors.description)}
                              {...register('description', {
                                 required: 'A short company description helps',
                                 minLength: {
                                    value: 20,
                                    message:
                                       'Please write at least 20 characters',
                                 },
                              })}
                           />
                           <FieldError message={errors.description?.message} />
                        </div>
                     </div>
                  </section>

                  <section className="space-y-4">
                     <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Globe className="size-4 text-primary" />
                        Contact
                     </div>

                     <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                           <Label htmlFor="website">Website</Label>
                           <Input
                              id="website"
                              type="url"
                              placeholder="https://acme.com"
                              disabled={isCreatingCompany}
                              aria-invalid={Boolean(errors.website)}
                              {...register('website', {
                                 required: 'Website is required',
                                 pattern: {
                                    value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i,
                                    message: 'Enter a valid website URL',
                                 },
                              })}
                           />
                           <FieldError message={errors.website?.message} />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="workEmail">Work email</Label>
                           <Input
                              id="workEmail"
                              type="email"
                              placeholder="hello@acme.com"
                              disabled={isCreatingCompany}
                              aria-invalid={Boolean(errors.workEmail)}
                              {...register('workEmail', {
                                 required: 'Work email is required',
                                 pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Enter a valid email address',
                                 },
                              })}
                           />
                           <FieldError message={errors.workEmail?.message} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                           <Label htmlFor="phone">Phone</Label>
                           <Input
                              id="phone"
                              type="tel"
                              placeholder="+20 100 123 4567"
                              disabled={isCreatingCompany}
                              aria-invalid={Boolean(errors.phone)}
                              {...register('phone', {
                                 required: 'Phone number is required',
                                 minLength: {
                                    value: 8,
                                    message:
                                       'Phone number should be at least 8 digits',
                                 },
                              })}
                           />
                           <FieldError message={errors.phone?.message} />
                        </div>
                     </div>
                  </section>

                  <section className="space-y-4">
                     <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <MapPinned className="size-4 text-primary" />
                        Location
                     </div>

                     <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                           <Label htmlFor="country">Country</Label>
                           <Input
                              id="country"
                              placeholder="Egypt"
                              disabled={isCreatingCompany}
                              aria-invalid={Boolean(errors.country)}
                              {...register('country', {
                                 required: 'Country is required',
                              })}
                           />
                           <FieldError message={errors.country?.message} />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="address">Street address</Label>
                           <Input
                              id="address"
                              placeholder="23 Abu Fadl St, Cairo"
                              disabled={isCreatingCompany}
                              aria-invalid={Boolean(errors.address)}
                              {...register('address', {
                                 required: 'Address is required',
                              })}
                           />
                           <FieldError message={errors.address?.message} />
                        </div>
                     </div>
                  </section>

                  <section className="space-y-4">
                     <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Clock3 className="size-4 text-primary" />
                        Operating defaults
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <TimezoneSelect
                           id="timezone"
                           disabled={isCreatingCompany}
                           aria-invalid={Boolean(errors.timezone)}
                           {...register('timezone', {
                              required: 'Timezone is required',
                           })}
                        />
                        <FieldError message={errors.timezone?.message} />
                     </div>
                  </section>
               </CardContent>

               <CardFooter className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-muted-foreground">
                     We’ll create the company and link your current account as
                     its owner.
                  </p>
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                     <Button
                        type="button"
                        variant="outline"
                        disabled={isCreatingCompany}
                        onClick={() => reset()}
                        className="w-full sm:w-auto"
                     >
                        Clear form
                     </Button>
                     <Button
                        type="submit"
                        disabled={isCreatingCompany}
                        className="w-full sm:w-auto"
                     >
                        {isCreatingCompany ? 'Creating...' : 'Create company'}
                     </Button>
                  </div>
               </CardFooter>
            </form>
         </Card>
      </div>
   );
}
