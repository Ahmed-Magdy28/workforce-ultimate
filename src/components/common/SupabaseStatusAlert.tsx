'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RootState } from '@/store';
import { setBackendUnavailable } from '@/features/auth/authSlice';
import { supabase } from '@/services/supabase';
import { useQueryClient } from '@tanstack/react-query';

const subscribeOnline = (callback: () => void) => {
   if (typeof window === 'undefined') return () => {};
   window.addEventListener('online', callback);
   window.addEventListener('offline', callback);
   return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
   };
};

function useIsOnline() {
   return useSyncExternalStore(
      subscribeOnline,
      () => (typeof navigator !== 'undefined' ? navigator.onLine : true),
      () => true,
   );
}

export default function SupabaseStatusAlert() {
   const isOnline = useIsOnline();
   const backendUnavailable = useSelector(
      (state: RootState) => state.auth.backendUnavailable,
   );
   const dispatch = useDispatch();
   const queryClient = useQueryClient();
   const [isRetrying, setIsRetrying] = useState(false);

   const handleRetry = useCallback(async () => {
      setIsRetrying(true);
      try {
         const { error } = await supabase.auth.getSession();
         if (!error) {
            dispatch(setBackendUnavailable(false));
            queryClient.refetchQueries();
         }
      } catch {
         // Still unavailable
      } finally {
         setIsRetrying(false);
      }
   }, [dispatch, queryClient]);

   // Auto-retry when internet comes back online
   useEffect(() => {
      if (isOnline && backendUnavailable) {
         handleRetry();
      }
   }, [isOnline, backendUnavailable, handleRetry]);

   if (isOnline && !backendUnavailable) {
      return null;
   }

   return (
      <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-900 backdrop-blur dark:text-amber-200">
         <div className="flex items-center gap-2">
            {!isOnline ? (
               <WifiOff className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            ) : (
               <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            )}
            <span>
               {!isOnline
                  ? 'No internet connection detected. Working in offline mode.'
                  : 'Unable to reach the database service. Some features may be temporarily limited.'}
            </span>
         </div>

         <Button
            size="sm"
            variant="outline"
            className="h-7 border-amber-500/40 bg-amber-500/20 px-2.5 text-xs hover:bg-amber-500/30"
            onClick={handleRetry}
            disabled={isRetrying}
         >
            <RefreshCw
               className={`mr-1.5 size-3 ${isRetrying ? 'animate-spin' : ''}`}
            />
            {isRetrying ? 'Checking...' : 'Retry'}
         </Button>
      </div>
   );
}
