'use client';

import { useSelector } from 'react-redux';
import type { ReactNode } from 'react';
import type { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';

type Props = {
   allowedRoles: string[];
   children: ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: Props) {
   const router = useRouter();
   const { role, isInitialized } = useSelector((state: RootState) => state.auth);

   const isAllowed = Boolean(
      role && (allowedRoles.includes(role) || role === 'OWNER'),
   );

   useEffect(() => {
      if (isInitialized && !isAllowed) {
         router.replace('/unauthorized');
      }
   }, [isInitialized, isAllowed, router]);

   if (!isInitialized) {
      return (
         <div className="flex min-h-[50vh] items-center justify-center">
            <Spinner />
         </div>
      );
   }

   if (!isAllowed) {
      return null;
   }

   return <>{children}</>;
}
