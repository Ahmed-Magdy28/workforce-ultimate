import { BadgeCheck, KeyRound, Users } from 'lucide-react';
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
import {
   joinCompanyWithInvitationAPI,
   validateInvitationAPI,
   type ValidateInvitationResult,
} from '@/features/company/api/companyApis';

type CompanyJoinFormValues = {
   inviteCode: string;
   workEmail: string;
   fullName: string;
};

const joinBenefits = [
   {
      icon: KeyRound,
      title: 'Use the invitation code',
      description:
         'A short code connects teammates to the right company and the intended role.',
   },
   {
      icon: BadgeCheck,
      title: 'Validate before joining',
      description:
         'Check that the code is active, not expired, and still has available uses before access is created.',
   },
   {
      icon: Users,
      title: 'Complete onboarding faster',
      description:
         'Once the code is valid, the join flow can create the employee record and attach the user to the company.',
   },
];

function FieldError({ message }: { message?: string }) {
   if (!message) return null;

   return <p className="text-sm text-destructive">{message}</p>;
}

function InvitationStatusCard({
   invitation,
}: {
   invitation: ValidateInvitationResult | null;
}) {
   if (!invitation) return null;

   return (
      <div
         className={
            invitation.valid
               ? 'rounded-2xl border border-primary/20 bg-primary/5 p-4'
               : 'rounded-2xl border border-destructive/20 bg-destructive/5 p-4'
         }
      >
         <p className="text-sm font-semibold">
            {invitation.valid
               ? 'Invitation is valid'
               : 'Invitation is not valid'}
         </p>
         <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {invitation.valid
               ? `Company ID: ${invitation.company_id} • Role: ${invitation.role}`
               : invitation.message}
         </p>
      </div>
   );
}

export default function CompanyJoinForm() {
   const queryClient = useQueryClient();
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

            toast.success('You joined the company successfully.');
            reset();
         },
         onError: (error: Error) => {
            toast.error(error.message);
         },
      });

   async function handleValidateClick() {
      const inviteCode = getValues('inviteCode');

      if (!inviteCode.trim()) {
         setError('inviteCode', { message: 'Invitation code is required' });
         return;
      }

      clearErrors('inviteCode');
      const result = await validateInvitation(inviteCode);

      if (!result.valid) {
         setError('inviteCode', { message: result.message });
      } else {
         clearErrors('inviteCode');
      }
   }

   async function onSubmit(data: CompanyJoinFormValues) {
      const inviteCode = data.inviteCode.trim();
      const latestValidation = await validateInvitation(inviteCode);

      if (!latestValidation.valid) {
         setError('inviteCode', {
            message: latestValidation.message,
         });
         toast.error(latestValidation.message);
         return;
      }

      await joinCompany(data);
   }

   const isBusy = isValidatingInvitation || isJoiningCompany;

   return (
      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
         <Card className="border-primary/15 bg-linear-to-br from-primary/8 via-background to-background shadow-sm">
            <CardHeader className="space-y-4">
               <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Join by invitation
               </div>
               <div className="space-y-2">
                  <CardTitle className="text-2xl leading-tight sm:text-3xl">
                     Let teammates join with an invitation code.
                  </CardTitle>
                  <CardDescription className="max-w-xl text-sm leading-6 sm:text-base">
                     This flow validates the code first, then creates the
                     employee membership for the logged-in user with the role
                     attached to that invitation.
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

               <div className="rounded-2xl border border-dashed border-primary/30 bg-background/70 p-4 text-sm text-muted-foreground">
                  Tip: the code here maps to your `invitations` table and is
                  validated through the `validate_invitation` database function.
               </div>
            </CardContent>
         </Card>

         <Card className="shadow-sm">
            <CardHeader className="space-y-2 border-b">
               <CardTitle className="text-xl sm:text-2xl">
                  Join workspace
               </CardTitle>
               <CardDescription className="text-sm sm:text-base">
                  Enter the invitation code and your employee details.
               </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
               <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                     <Label htmlFor="joinCode">Invitation code</Label>
                     <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                           id="joinCode"
                           placeholder="a1b2c3d4e5f6"
                           disabled={isBusy}
                           aria-invalid={Boolean(errors.inviteCode)}
                           className="sm:flex-1"
                           {...register('inviteCode', {
                              required: 'Invitation code is required',
                              minLength: {
                                 value: 6,
                                 message:
                                    'Invitation code should be at least 6 characters',
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
                           {isValidatingInvitation
                              ? 'Checking...'
                              : 'Validate code'}
                        </Button>
                     </div>
                     <FieldError message={errors.inviteCode?.message} />
                  </div>

                  <InvitationStatusCard invitation={invitationStatus ?? null} />

                  <div className="grid gap-4 md:grid-cols-2">
                     <div className="space-y-2">
                        <Label htmlFor="joinFullName">Full name</Label>
                        <Input
                           id="joinFullName"
                           placeholder="Mona Ahmed"
                           disabled={isBusy}
                           aria-invalid={Boolean(errors.fullName)}
                           {...register('fullName', {
                              required: 'Full name is required',
                           })}
                        />
                        <FieldError message={errors.fullName?.message} />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="joinEmail">Work email</Label>
                        <Input
                           id="joinEmail"
                           type="email"
                           placeholder="mona@acme.com"
                           disabled={isBusy}
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
                  </div>
               </CardContent>

               <CardFooter className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-muted-foreground">
                     This join flow validates the code, inserts the employee
                     row, and links the current user to the company.
                  </p>
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                     <Button
                        type="button"
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => reset()}
                        className="w-full sm:w-auto"
                     >
                        Clear form
                     </Button>
                     <Button
                        type="submit"
                        disabled={isBusy}
                        className="w-full sm:w-auto"
                     >
                        {isJoiningCompany ? 'Joining...' : 'Join company'}
                     </Button>
                  </div>
               </CardFooter>
            </form>
         </Card>
      </div>
   );
}
