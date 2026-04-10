import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { loginAPI } from '../api/apiAuth';
import { setSession } from '../authSlice';
import { useDispatch } from 'react-redux';

export default function useLogin() {
   const navigate = useNavigate();
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
         navigate('/company', { replace: true });
      },
      onError: () => {
         toast.error('Provided email or password are incorrect');
      },
   });

   return { isLoggingIn, login, errorLogin };
}
