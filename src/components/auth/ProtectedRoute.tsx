'use client';

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUserAPI } from '@/features/auth/api/apiAuth';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
   children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
   const router = useRouter();
   const { isAuthenticated, isInitialized } = useSelector(
      (state: RootState) => state.auth,
   );

   const { isLoading: isUserLoading } = useQuery({
      queryKey: ['user'],
      queryFn: getCurrentUserAPI,
      enabled: isInitialized && isAuthenticated,
   });

   useEffect(() => {
      if (isInitialized && !isAuthenticated) {
         router.replace('/login');
      }
   }, [isAuthenticated, isInitialized, router]);

   // Wait for session hydration from local storage
   if (!isInitialized || (isAuthenticated && isUserLoading)) {
      return (
         <div className="flex min-h-screen items-center justify-center">
            <Spinner />
         </div>
      );
   }

   if (!isAuthenticated) return null;

   return <>{children}</>;
}
