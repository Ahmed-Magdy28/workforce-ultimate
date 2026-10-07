'use client';

import { Button } from '@/components/ui/button';
import FormRow from '@/components/ui/FormRow';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import useSignUp from '@/features/auth/hooks/useSignup';
import { useForm } from 'react-hook-form';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type SignUpFormValues = {
   fullName: string;
   email: string;
   password: string;
   passwordConfirm: string;
};

function SignupForm() {
   const { register, formState, handleSubmit, reset } =
      useForm<SignUpFormValues>();
   const { errors } = formState;
   const { isSigningUp, signUp, needsEmailVerification, registeredEmail } =
      useSignUp();

   function onSubmit(data: SignUpFormValues) {
      signUp(data, {
         onSuccess: () => {
            reset();
         },
      });
   }

   if (needsEmailVerification) {
      return (
         <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
               <Mail className="size-6" />
            </div>
            <div className="space-y-2">
               <h3 className="text-lg font-semibold">Verify your email address</h3>
               <p className="text-sm text-muted-foreground">
                  We have sent a confirmation link to{' '}
                  <span className="font-semibold text-foreground">
                     {registeredEmail}
                  </span>
                  . Please check your inbox and click the link to activate your account.
               </p>
            </div>
            <div className="pt-2">
               <Button asChild className="w-full">
                  <Link href="/login">
                     Go to Sign In
                     <ArrowRight className="ml-2 size-4" />
                  </Link>
               </Button>
            </div>
         </div>
      );
   }

   return (
      <form
         className="space-y-0.5 sm:space-y-2"
         onSubmit={handleSubmit(onSubmit)}
      >
         <FormRow label="Full name" error={errors.fullName?.message}>
            <Input
               type="text"
               id="fullName"
               disabled={isSigningUp}
               {...register('fullName', { required: 'This field is required' })}
            />
         </FormRow>

         <FormRow label="Email address" error={errors.email?.message}>
            <Input
               type="email"
               id="email"
               disabled={isSigningUp}
               {...register('email', {
                  required: 'This field is required',
                  pattern: {
                     value: /\S+@\S+\.\S+/,
                     message: 'Invalid email address',
                  },
               })}
            />
         </FormRow>

         <FormRow
            label="Password (min 8 characters)"
            error={errors.password?.message}
         >
            <Input
               type="password"
               id="password"
               disabled={isSigningUp}
               {...register('password', {
                  required: 'This field is required',
                  minLength: {
                     value: 8,
                     message: 'Password must be at least 8 characters',
                  },
               })}
            />
         </FormRow>

         <FormRow
            label="Repeat password"
            error={errors.passwordConfirm?.message}
         >
            <Input
               type="password"
               id="passwordConfirm"
               disabled={isSigningUp}
               {...register('passwordConfirm', {
                  required: 'This field is required',
                  validate: (value, formValues) =>
                     value === formValues.password || 'Passwords do not match',
               })}
            />
         </FormRow>

         <FormRow>
            <Button
               type="button"
               variant="outline"
               className="w-full sm:w-auto"
               disabled={isSigningUp}
               onClick={() => reset()}
            >
               Cancel
            </Button>
            <Button
               type="submit"
               className="w-full sm:w-auto"
               disabled={isSigningUp}
            >
               {isSigningUp ? <Spinner /> : 'Create new user'}
            </Button>
         </FormRow>
      </form>
   );
}

export default SignupForm;
