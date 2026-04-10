import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserAPI } from '../api/apiAuth';

export default function useUpdateUser() {
   const queryClient = useQueryClient();

   const {
      isPending: isUpdating,
      mutate: updateUser,
      error: errorUpdating,
   } = useMutation({
      mutationFn: ({
         fullName,
         password,
         avatar,
      }: {
         fullName?: string;
         password?: string;
         avatar?: File | null;
      }) => updateUserAPI({ fullName, password, avatar }),
      onSuccess: () => {
         toast.success('User  successfully Edited');
         queryClient.invalidateQueries({ queryKey: ['user'] });
      },
      onError: () => {
         toast.error('Failed to Update user ');
         console.error(errorUpdating?.message);
      },
   });

   return { isUpdating, updateUser, errorUpdating };
}
