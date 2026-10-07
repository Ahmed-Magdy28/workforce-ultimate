import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { loginAPI } from '../api/apiAuth';
import { setSession, setRole } from '../authSlice';
import { useDispatch } from 'react-redux';
import { mapMetadataToRole } from '@/utils/permissions';
import { formatAuthError } from '@/lib/supabaseError';

export default function useLogin() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const dispatch = useDispatch();

   const {
      isPending: isLoggingIn,
      mutate: login,
      error: errorLogin,
   } = useMutation({
      mutationFn: ({ email, password }: { email: string; password: string }) =>
         loginAPI({ email, password }),
      onSuccess: (user) => {
         toast.success('Signed in successfully');
         queryClient.setQueryData(['user'], user.user);
         dispatch(setSession(user.session));
         const role = mapMetadataToRole(user.user?.user_metadata);
         dispatch(setRole(role));
         router.replace('/company');
      },
      onError: (error: Error) => {
         toast.error(
            formatAuthError(error, 'Provided email or password are incorrect'),
         );
      },
   });

   return { isLoggingIn, login, errorLogin };
}
