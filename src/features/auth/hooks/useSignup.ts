import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signUpApi } from '../api/apiAuth';
import { useDispatch } from 'react-redux';
import { setSession } from '../authSlice';
import { formatAuthError } from '@/lib/supabaseError';

export default function useSignUp() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const dispatch = useDispatch();

   const {
      isPending: isSigningUp,
      mutate: signUp,
      error: errorSignUp,
      data: signupData,
   } = useMutation({
      mutationFn: ({
         email,
         password,
         fullName,
      }: {
         email: string;
         password: string;
         fullName: string;
      }) => signUpApi({ email, password, fullName }),
      onSuccess: (data) => {
         if (data?.session) {
            toast.success('Signed up successfully');
            queryClient.setQueryData(['user'], data.user);
            dispatch(setSession(data.session));
            router.replace('/company');
         } else {
            // When Supabase email confirmation is enabled, session is null
            toast.success(
               'Account created! Please check your email to verify your account.',
               { duration: 6000 },
            );
         }
      },
      onError: (error: Error) => {
         toast.error(formatAuthError(error, 'Error signing up, please try again'));
      },
   });

   const needsEmailVerification = Boolean(
      signupData && !signupData.session && signupData.user,
   );

   return {
      isSigningUp,
      signUp,
      errorSignUp,
      needsEmailVerification,
      registeredEmail: signupData?.user?.email,
   };
}
