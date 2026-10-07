import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { requestPasswordResetAPI } from '../api/apiAuth';

export default function useRequestPasswordReset() {
   const {
      isPending: isSendingResetEmail,
      mutate: requestPasswordReset,
      error: requestPasswordResetError,
   } = useMutation({
      mutationFn: ({
         email,
         redirectTo,
      }: {
         email: string;
         redirectTo: string;
      }) => requestPasswordResetAPI({ email, redirectTo }),
      onSuccess: () => {
         toast.success('Password reset link sent');
      },
      onError: (error: Error) => {
         toast.error(`Could not send reset email: ${error.message}`);
      },
   });

   return {
      isSendingResetEmail,
      requestPasswordReset,
      requestPasswordResetError,
   };
}
