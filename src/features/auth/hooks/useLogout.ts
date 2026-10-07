import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LogOutAPI } from '../api/apiAuth';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../authSlice';
import { formatAuthError } from '@/lib/supabaseError';

export default function useLogout() {
   const router = useRouter();
   const queryClient = useQueryClient();
   const dispatch = useDispatch();

   const {
      isPending: isLoggingOut,
      mutate: logout,
      error: errorLogout,
   } = useMutation({
      mutationFn: () => LogOutAPI(),
      onSuccess: () => {
         toast.success('Signed out successfully');
         dispatch(logoutAction());
         queryClient.removeQueries();
         router.replace('/login');
      },
      onError: (error: Error) => {
         // Even if server call fails (e.g. backend down), clean up local state
         dispatch(logoutAction());
         queryClient.removeQueries();
         router.replace('/login');
         toast.error(formatAuthError(error, 'Error signing out'));
      },
   });

   return { isLoggingOut, logout, errorLogout };
}
