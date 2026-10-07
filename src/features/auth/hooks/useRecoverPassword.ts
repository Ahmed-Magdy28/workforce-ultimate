import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { updateRecoveredPasswordAPI } from '../api/apiAuth';

export default function useRecoverPassword() {
   const router = useRouter();

   const {
      isPending: isUpdatingPassword,
      mutate: recoverPassword,
      error: recoverPasswordError,
   } = useMutation({
      mutationFn: ({ password }: { password: string }) =>
         updateRecoveredPasswordAPI({ password }),
      onSuccess: async () => {
         toast.success('Password updated successfully');
         router.replace('/login');
      },
      onError: (error: Error) => {
         toast.error(`Could not update password: ${error.message}`);
      },
   });

   return {
      isUpdatingPassword,
      recoverPassword,
      recoverPasswordError,
   };
}
