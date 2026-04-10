import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { LogOutAPI } from '../api/apiAuth';

export default function useLogout() {
   const navigate = useNavigate();
   const queryClient = useQueryClient();

   const {
      isPending: isLoggingOut,
      mutate: logout,
      error: errorLogout,
   } = useMutation({
      mutationFn: () => LogOutAPI(),
      onSuccess: () => {
         toast.success('Signed out successfully');
         queryClient.removeQueries();
         navigate('/login', { replace: true });
      },
      onError: () => {
         toast.error('Error signing out');
      },
   });

   return { isLoggingOut, logout, errorLogout };
}
