import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';

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
               {children}
               <Toaster position="top-right" />
            </BrowserRouter>
         </QueryClientProvider>
      </Provider>
   );
}
