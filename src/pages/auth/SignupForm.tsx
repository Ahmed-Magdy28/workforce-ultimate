import { Button } from '@/components/ui/button';
import FormRow from '@/components/ui/FormRow';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import useSignUp from '@/features/auth/hooks/useSignup';
import { useForm } from 'react-hook-form';

// Email regex: /\S+@\S+\.\S+/

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
   const { isSigningUp, signUp } = useSignUp();
   function onSubmit(data: SignUpFormValues) {
      signUp(data, {
         onSuccess: () => {
            reset();
         },
      });
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
               defaultValue={'ahmed'}
               disabled={isSigningUp}
               {...register('fullName', { required: 'This field is required' })}
            />
         </FormRow>

         <FormRow label="Email address" error={errors.email?.message}>
            <Input
               type="email"
               id="email"
               defaultValue={'test@gmail.com'}
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
               defaultValue={'123456789'}
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
               defaultValue={'123456789'}
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
