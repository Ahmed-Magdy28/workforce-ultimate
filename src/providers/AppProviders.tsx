'use client';

import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { store } from '@/store';
import { queryClient } from '@/lib/queryClient';
import '@/lib/i18n';
import GlobalEffects from '@/components/common/GlobalEffects';
import AuthSessionProvider from './AuthSessionProvider';
import SupabaseStatusAlert from '@/components/common/SupabaseStatusAlert';
import GlobalErrorBoundary from '@/components/common/GlobalErrorBoundary';
import OfflineIndicator from '@/components/common/OfflineIndicator';

type Props = {
   children: ReactNode;
};

export default function AppProviders({ children }: Props) {
   return (
      <GlobalErrorBoundary>
         <Provider store={store}>
            <QueryClientProvider client={queryClient}>
               <AuthSessionProvider>
                  <GlobalEffects />
                  <SupabaseStatusAlert />
                  <OfflineIndicator />
                  {children}
                  <Toaster position="top-right" />
                  <ReactQueryDevtools initialIsOpen={false} />
               </AuthSessionProvider>
            </QueryClientProvider>
         </Provider>
      </GlobalErrorBoundary>
   );
}
