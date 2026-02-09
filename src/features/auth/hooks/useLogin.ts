import { useMutation } from '@tanstack/react-query';
import { loginAPI } from '../api/loginApi';
import toast from 'react-hot-toast';

export const useLogin = () => {
   const { mutate: login, isPending } = useMutation({
      mutationFn: ({ email, password }: { email: string; password: string }) =>
         loginAPI(email, password),
      onSuccess: () => {
         toast.success('Login successful');
      },
      onError: (error: Error) => {
         toast.error(error.message);
      },
   });
   return { login, isPending };
};
