import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

import { store } from './store';
import { queryClient } from './queryClient';
import GlobalEffects from '@/components/common/GlobalEffects';

type Props = {
   children: ReactNode;
};
// Todo: remove ReactQueryDevtools in production
export default function AppProviders({ children }: Props) {
   return (
      <Provider store={store}>
         <QueryClientProvider client={queryClient}>
            <BrowserRouter>
               {/* HelmetProvider for seo */}
               <HelmetProvider>
                  {/* GlobalEffect For Theme and i18 for now  */}
                  <GlobalEffects />
                  {children}
               </HelmetProvider>

               <Toaster position="top-right" />
            </BrowserRouter>

            {/*Todo: remove ReactQueryDevtools in production  */}
            <ReactQueryDevtools initialIsOpen={false} />
         </QueryClientProvider>
      </Provider>
   );
}
