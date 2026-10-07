'use client';

import { useEffect, type ReactNode } from 'react';
import { supabase } from '@/services/supabase';
import { useAppDispatch } from '@/store';
import {
   setSession,
   setRole,
   setInitialized,
   setBackendUnavailable,
} from '@/features/auth/authSlice';
import { mapMetadataToRole } from '@/utils/permissions';
import { useQueryClient } from '@tanstack/react-query';
import { isSupabaseNetworkError } from '@/lib/supabaseError';

type Props = {
   children: ReactNode;
};

export function AuthSessionProvider({ children }: Props) {
   const dispatch = useAppDispatch();
   const queryClient = useQueryClient();

   useEffect(() => {
      let isMounted = true;

      // 1. Initial Session Hydration from Local Storage
      supabase.auth
         .getSession()
         .then(({ data: { session }, error }) => {
            if (!isMounted) return;

            if (error) {
               console.error('Session hydration error:', error);
               if (isSupabaseNetworkError(error)) {
                  dispatch(setBackendUnavailable(true));
               }
               dispatch(setSession(null));
               dispatch(setInitialized(true));
               return;
            }

            dispatch(setBackendUnavailable(false));

            if (session) {
               dispatch(setSession(session));
               const role = mapMetadataToRole(session.user?.user_metadata);
               dispatch(setRole(role));
               queryClient.setQueryData(['user'], session.user);
            } else {
               dispatch(setSession(null));
            }
            dispatch(setInitialized(true));
         })
         .catch((err) => {
            if (!isMounted) return;
            console.error('Failed to get Supabase session:', err);
            if (isSupabaseNetworkError(err)) {
               dispatch(setBackendUnavailable(true));
            }
            dispatch(setSession(null));
            dispatch(setInitialized(true));
         });

      // 2. Real-time Auth State Change Listener
      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
         if (!isMounted) return;

         dispatch(setBackendUnavailable(false));

         if (session) {
            dispatch(setSession(session));
            const role = mapMetadataToRole(session.user?.user_metadata);
            dispatch(setRole(role));
            queryClient.setQueryData(['user'], session.user);
         } else {
            dispatch(setSession(null));
            queryClient.setQueryData(['user'], null);
         }
      });

      return () => {
         isMounted = false;
         subscription.unsubscribe();
      };
   }, [dispatch, queryClient]);

   return <>{children}</>;
}

export default AuthSessionProvider;
