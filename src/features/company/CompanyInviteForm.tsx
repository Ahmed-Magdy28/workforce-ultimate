import { MailPlus, ShieldCheck, UserRoundPlus } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

type CompanyInviteFormValues = {
   fullName: string;
   email: string;
   role: string;
   department: string;
   expiresIn: string;
   note: string;
};

const inviteBenefits = [
   {
      icon: MailPlus,
      title: 'Send clean invitations',
      description:
         'Invite teammates with the right role and a short note so they know exactly why they were added.',
   },
   {
      icon: ShieldCheck,
      title: 'Control access early',
      description:
         'Set the intended role before they join to keep your workspace onboarding organized.',
   },
   {
      icon: UserRoundPlus,
      title: 'Make onboarding human',
      description:
         'A personal note gives new teammates enough context before they accept the invite.',
   },
];

function FieldError({ message }: { message?: string }) {
   if (!message) return null;

   return <p className="text-sm text-destructive">{message}</p>;
}

export default function CompanyInviteForm() {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
   } = useForm<CompanyInviteFormValues>({
      defaultValues: {
         fullName: '',
         email: '',
         role: 'EMPLOYEE',
         department: '',
         expiresIn: '7',
         note: '',
      },
   });

   async function onSubmit(data: CompanyInviteFormValues) {
      await Promise.resolve(data);
      toast.success('Invitation prepared locally. API hookup can come next.');
      reset();
   }

   return (
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
         <Card className="border-primary/15 bg-linear-to-br from-primary/8 via-background to-background shadow-sm">
            <CardHeader className="space-y-4">
               <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Team invite
               </div>
               <div className="space-y-2">
                  <CardTitle className="text-2xl leading-tight sm:text-3xl">
                     Invite people into the workspace with the right context.
                  </CardTitle>
                  <CardDescription className="max-w-xl text-sm leading-6 sm:text-base">
                     Choose who should join, what role they need, and include a
                     short note that makes the invite feel intentional.
                  </CardDescription>
               </div>
            </CardHeader>

            <CardContent className="space-y-4">
               {inviteBenefits.map(({ icon: Icon, title, description }) => (
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
                  Tip: keep invite roles conservative at first. You can always
                  promote access later.
               </div>
            </CardContent>
         </Card>

         <Card className="shadow-sm">
            <CardHeader className="space-y-2 border-b">
               <CardTitle className="text-xl sm:text-2xl">
                  Send invitation
               </CardTitle>
               <CardDescription className="text-sm sm:text-base">
                  Add the teammate details below and prepare an invitation.
               </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
               <CardContent className="space-y-8 pt-6">
                  <section className="space-y-4">
                     <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                           <Label htmlFor="inviteFullName">Full name</Label>
                           <Input
                              id="inviteFullName"
                              placeholder="Mona Ahmed"
                              disabled={isSubmitting}
                              aria-invalid={Boolean(errors.fullName)}
                              {...register('fullName', {
                                 required: 'Full name is required',
                              })}
                           />
                           <FieldError message={errors.fullName?.message} />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="inviteEmail">Email</Label>
                           <Input
                              id="inviteEmail"
                              type="email"
                              placeholder="mona@acme.com"
                              disabled={isSubmitting}
                              aria-invalid={Boolean(errors.email)}
                              {...register('email', {
                                 required: 'Email is required',
                                 pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Enter a valid email address',
                                 },
                              })}
                           />
                           <FieldError message={errors.email?.message} />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="inviteRole">Role</Label>
                           <select
                              id="inviteRole"
                              disabled={isSubmitting}
                              className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                              {...register('role', {
                                 required: 'Role is required',
                              })}
                           >
                              <option value="EMPLOYEE">Employee</option>
                              <option value="MANAGER">Manager</option>
                              <option value="SENIOR_MANAGER">
                                 Senior manager
                              </option>
                              <option value="HR">HR</option>
                           </select>
                           <FieldError message={errors.role?.message} />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="inviteDepartment">Department</Label>
                           <Input
                              id="inviteDepartment"
                              placeholder="Operations"
                              disabled={isSubmitting}
                              aria-invalid={Boolean(errors.department)}
                              {...register('department', {
                                 required: 'Department is required',
                              })}
                           />
                           <FieldError message={errors.department?.message} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                           <Label htmlFor="inviteExpiresIn">
                              Invite expires in
                           </Label>
                           <select
                              id="inviteExpiresIn"
                              disabled={isSubmitting}
                              className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                              {...register('expiresIn', {
                                 required: 'Expiry is required',
                              })}
                           >
                              <option value="1">1 day</option>
                              <option value="3">3 days</option>
                              <option value="7">7 days</option>
                              <option value="14">14 days</option>
                           </select>
                           <FieldError message={errors.expiresIn?.message} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                           <Label htmlFor="inviteNote">Personal note</Label>
                           <Textarea
                              id="inviteNote"
                              rows={4}
                              placeholder="Welcome aboard. You’ll join the Operations team and get access to your dashboard after acceptance."
                              disabled={isSubmitting}
                              aria-invalid={Boolean(errors.note)}
                              {...register('note', {
                                 required: 'A short note is required',
                                 minLength: {
                                    value: 15,
                                    message:
                                       'Please write at least 15 characters',
                                 },
                              })}
                           />
                           <FieldError message={errors.note?.message} />
                        </div>
                     </div>
                  </section>
               </CardContent>

               <CardFooter className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-muted-foreground">
                     Invites can be edited later once your backend flow is
                     wired.
                  </p>
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                     <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => reset()}
                        className="w-full sm:w-auto"
                     >
                        Clear form
                     </Button>
                     <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                     >
                        {isSubmitting ? 'Preparing...' : 'Prepare invite'}
                     </Button>
                  </div>
               </CardFooter>
            </form>
         </Card>
      </div>
   );
}
