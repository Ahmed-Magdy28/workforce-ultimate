import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

import { store } from './store';
import { queryClient } from './queryClient';

type Props = {
   children: ReactNode;
};

export default function AppProviders({ children }: Props) {
   return (
      <Provider store={store}>
         <QueryClientProvider client={queryClient}>
            <BrowserRouter>
               <HelmetProvider>{children}</HelmetProvider>
               <Toaster position="top-right" />
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </Provider>
   );
}
