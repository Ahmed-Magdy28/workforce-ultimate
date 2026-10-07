'use client';

import { useState } from 'react';
import {
   AlertCircle,
   BadgeCheck,
   CheckCircle2,
   ChevronDown,
   ChevronUp,
   KeyRound,
   ShieldCheck,
   UserCheck,
   Users,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useUser from '@/features/auth/hooks/useUser';
import {
   joinCompanyWithInvitationAPI,
   validateInvitationAPI,
   type ValidateInvitationResult,
} from '@/features/company/api/companyApis';

type CompanyJoinFormValues = {
   inviteCode: string;
   workEmail?: string;
   fullName?: string;
};

const joinBenefits = [
   {
      icon: KeyRound,
      title: 'Use your invitation code',
      description:
         'Your administrator or HR provides a unique code that links you directly to the workspace.',
   },
   {
      icon: BadgeCheck,
      title: 'Pre-assigned role & team',
      description:
         'Each code has an intended role (HR, Employee, Manager) already configured by your organization.',
   },
   {
      icon: Users,
      title: 'Instant workspace access',
      description:
         'Join in one click using your active account without needing manual approval or re-entering details.',
   },
];

function FieldError({ message }: { message?: string }) {
   if (!message) return null;
   return <p className="text-xs text-destructive mt-1 font-medium">{message}</p>;
}

function InvitationStatusCard({
   invitation,
}: {
   invitation: ValidateInvitationResult | null;
}) {
   if (!invitation) return null;

   if (invitation.valid) {
      return (
         <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 transition-all">
            <div className="flex items-start gap-3">
               <div className="mt-0.5 rounded-xl bg-emerald-500/20 p-2 text-emerald-600">
                  <CheckCircle2 className="size-4" />
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                        Valid invitation code
                     </p>
                     <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        {invitation.role ?? 'Member'}
                     </span>
                  </div>
                  <p className="text-sm text-emerald-800/90 dark:text-emerald-300/90">
                     Company:{' '}
                     <strong>
                        {invitation.company_name || 'Verified Organization'}
                     </strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                     Click &quot;Join workspace&quot; below to finish onboarding immediately.
                  </p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 transition-all">
         <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-xl bg-destructive/20 p-2 text-destructive">
               <AlertCircle className="size-4" />
            </div>
            <div className="space-y-1">
               <p className="text-sm font-semibold text-destructive">
                  Invalid invitation code
               </p>
               <p className="text-sm leading-relaxed text-destructive/90">
                  {invitation.message}
               </p>
               {invitation.message.toLowerCase().includes('not found') && (
                  <p className="text-xs text-muted-foreground pt-1">
                     Make sure the code matches the workspace invitation exactly.
                  </p>
               )}
            </div>
         </div>
      </div>
   );
}

export default function CompanyJoinForm() {
   const queryClient = useQueryClient();
   const { user, isLoading: isUserLoading } = useUser();
   const [showCustomDetails, setShowCustomDetails] = useState(false);

   const userMeta = user?.user_metadata;
   const defaultName =
      (userMeta?.fullName as string | undefined) ||
      (userMeta?.full_name as string | undefined) ||
      (user?.email ? user.email.split('@')[0] : 'Team Member');
   const defaultEmail = user?.email || '';

   const {
      register,
      handleSubmit,
      getValues,
      reset,
      setError,
      clearErrors,
      formState: { errors },
   } = useForm<CompanyJoinFormValues>({
      defaultValues: {
         inviteCode: '',
         workEmail: '',
         fullName: '',
      },
   });

   const {
      mutateAsync: validateInvitation,
      data: invitationStatus,
      isPending: isValidatingInvitation,
   } = useMutation({
      mutationFn: validateInvitationAPI,
      onError: (error: Error) => {
         toast.error(error.message);
      },
   });

   const { mutateAsync: joinCompany, isPending: isJoiningCompany } =
      useMutation({
         mutationFn: joinCompanyWithInvitationAPI,
         onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['user'] });
            await queryClient.invalidateQueries({ queryKey: ['companies'] });
            await queryClient.invalidateQueries({
               queryKey: ['current-company'],
            });
            await queryClient.invalidateQueries({ queryKey: ['company'] });

            toast.success('Successfully joined the workspace!');
            reset();
         },
         onError: (error: Error) => {
            toast.error(error.message);
         },
      });

   async function handleValidateClick() {
      const inviteCode = getValues('inviteCode');

      if (!inviteCode?.trim()) {
         setError('inviteCode', { message: 'Please enter an invitation code' });
         return;
      }

      clearErrors('inviteCode');
      const result = await validateInvitation(inviteCode.trim());

      if (!result.valid) {
         setError('inviteCode', { message: result.message });
      } else {
         clearErrors('inviteCode');
         toast.success(`Valid code for ${result.company_name || 'workspace'} (${result.role})`);
      }
   }

   async function onSubmit(data: CompanyJoinFormValues) {
      const cleanCode = data.inviteCode?.trim();

      if (!cleanCode) {
         setError('inviteCode', { message: 'Please enter an invitation code' });
         return;
      }

      // 1. Validate if not already validated or if code differs
      let validation = invitationStatus;
      if (!validation || !validation.valid) {
         validation = await validateInvitation(cleanCode);
      }

      if (!validation.valid) {
         setError('inviteCode', {
            message: validation.message,
         });
         toast.error(validation.message);
         return;
      }

      // 2. Perform join with authenticated user fallback
      await joinCompany({
         inviteCode: cleanCode,
         fullName: data.fullName?.trim() || defaultName,
         workEmail: data.workEmail?.trim() || defaultEmail,
      });
   }

   const isBusy = isValidatingInvitation || isJoiningCompany || isUserLoading;

   return (
      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
         {/* Informational Card */}
         <Card className="border-primary/15 bg-linear-to-br from-primary/8 via-background to-background shadow-sm">
            <CardHeader className="space-y-4">
               <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  <ShieldCheck className="size-3.5" />
                  Invitation Access
               </div>
               <div className="space-y-2">
                  <CardTitle className="text-2xl leading-tight sm:text-3xl">
                     Connect directly to your team.
                  </CardTitle>
                  <CardDescription className="max-w-xl text-sm leading-6 sm:text-base">
                     Paste your workspace invitation code to join your company.
                     Your account profile is automatically linked to your employee record.
                  </CardDescription>
               </div>
            </CardHeader>

            <CardContent className="space-y-4">
               {joinBenefits.map(({ icon: Icon, title, description }) => (
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

               <div className="rounded-2xl border border-dashed border-primary/30 bg-background/70 p-4 text-xs leading-5 text-muted-foreground">
                  Logged in with your work email? No extra verification steps required. Enter the code and click <strong>Join workspace</strong>.
               </div>
            </CardContent>
         </Card>

         {/* Join Form Card */}
         <Card className="shadow-sm">
            <CardHeader className="space-y-2 border-b">
               <CardTitle className="text-xl sm:text-2xl">
                  Join workspace
               </CardTitle>
               <CardDescription className="text-sm sm:text-base">
                  Enter the invitation code to connect to your organization.
               </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
               <CardContent className="space-y-6 pt-6">
                  {/* Current Authenticated User Identity */}
                  <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                     <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 font-bold text-sm text-primary">
                        {defaultName.slice(0, 2).toUpperCase()}
                     </div>
                     <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                           <p className="text-sm font-semibold truncate text-foreground">
                              {defaultName}
                           </p>
                           <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              <UserCheck className="size-3" />
                              Signed In
                           </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                           {defaultEmail || 'Authenticated User'}
                        </p>
                     </div>
                  </div>

                  {/* Invitation Code Input */}
                  <div className="space-y-2">
                     <Label htmlFor="joinCode" className="text-sm font-medium">
                        Invitation code <span className="text-destructive">*</span>
                     </Label>
                     <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                           id="joinCode"
                           placeholder="e.g. 413623b1ea03"
                           disabled={isBusy}
                           autoComplete="off"
                           aria-invalid={Boolean(errors.inviteCode)}
                           className="font-mono tracking-wider sm:flex-1"
                           {...register('inviteCode', {
                              required: 'Invitation code is required',
                              minLength: {
                                 value: 4,
                                 message: 'Invitation code is too short',
                              },
                           })}
                        />
                        <Button
                           type="button"
                           variant="outline"
                           disabled={isBusy}
                           onClick={handleValidateClick}
                           className="sm:w-auto"
                        >
                           {isValidatingInvitation ? 'Checking...' : 'Validate code'}
                        </Button>
                     </div>
                     <FieldError message={errors.inviteCode?.message} />
                  </div>

                  {/* Status Banner */}
                  <InvitationStatusCard invitation={invitationStatus ?? null} />

                  {/* Optional Custom Profile Override */}
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                     <button
                        type="button"
                        onClick={() => setShowCustomDetails((prev) => !prev)}
                        className="flex w-full items-center justify-between text-left text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                     >
                        <span>Customize profile details for this workspace (optional)</span>
                        {showCustomDetails ? (
                           <ChevronUp className="size-3.5" />
                        ) : (
                           <ChevronDown className="size-3.5" />
                        )}
                     </button>

                     {showCustomDetails && (
                        <div className="mt-4 grid gap-4 pt-2 border-t border-border/40 md:grid-cols-2">
                           <div className="space-y-1.5">
                              <Label htmlFor="joinFullName" className="text-xs">
                                 Display name
                              </Label>
                              <Input
                                 id="joinFullName"
                                 placeholder={defaultName}
                                 disabled={isBusy}
                                 {...register('fullName')}
                              />
                           </div>

                           <div className="space-y-1.5">
                              <Label htmlFor="joinEmail" className="text-xs">
                                 Work email
                              </Label>
                              <Input
                                 id="joinEmail"
                                 type="email"
                                 placeholder={defaultEmail}
                                 disabled={isBusy}
                                 {...register('workEmail')}
                              />
                           </div>
                        </div>
                     )}
                  </div>
               </CardContent>

               <CardFooter className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-muted-foreground">
                     Joining connects your account directly to the workspace with the pre-assigned role.
                  </p>
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                     <Button
                        type="button"
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => reset()}
                        className="w-full sm:w-auto"
                     >
                        Clear
                     </Button>
                     <Button
                        type="submit"
                        disabled={isBusy}
                        className="w-full sm:w-auto"
                     >
                        {isJoiningCompany ? 'Joining workspace...' : 'Join workspace'}
                     </Button>
                  </div>
               </CardFooter>
            </form>
         </Card>
      </div>
   );
}
