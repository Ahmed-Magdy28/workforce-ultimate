'use client';

import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import type { RootState } from '@/store';
import { getCurrentUserAPI } from '@/features/auth/api/apiAuth';
import useLogin from '@/features/auth/hooks/useLogin';
import useSignUp from '@/features/auth/hooks/useSignup';
import useLogout from '@/features/auth/hooks/useLogout';

export function useAuth() {
   const {
      isAuthenticated,
      isInitialized,
      role,
      session,
      backendUnavailable,
   } = useSelector((state: RootState) => state.auth);

   const {
      data: user,
      isLoading: isUserLoading,
      error: userError,
      refetch: refetchUser,
   } = useQuery({
      queryKey: ['user'],
      queryFn: getCurrentUserAPI,
      enabled: isAuthenticated,
   });

   const { login, isLoggingIn, errorLogin } = useLogin();
   const { signUp, isSigningUp, errorSignUp } = useSignUp();
   const { logout, isLoggingOut } = useLogout();

   const metadata = user?.user_metadata ?? session?.user?.user_metadata ?? {};
   const fullName = (metadata.fullName as string | undefined) || user?.email || 'User';
   const avatar = (metadata.avatar as string | undefined) || null;
   const companyId =
      (metadata.company as string | undefined) ||
      (metadata.company_id as string | undefined) ||
      null;
   const teamRole = (metadata.teamRole as string | undefined) || null;

   return {
      user: user ?? session?.user ?? null,
      session,
      isAuthenticated,
      isInitialized,
      isLoading: !isInitialized || (isAuthenticated && isUserLoading),
      role,
      backendUnavailable,
      fullName,
      avatar,
      companyId,
      teamRole,
      userError,
      refetchUser,
      login,
      isLoggingIn,
      errorLogin,
      signUp,
      isSigningUp,
      errorSignUp,
      logout,
      isLoggingOut,
   };
}

export default useAuth;

