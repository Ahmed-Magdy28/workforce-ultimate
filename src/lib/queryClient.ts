import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         retry: 1,
         refetchOnWindowFocus: false,
         refetchOnReconnect: true,
         staleTime: 1000 * 60 * 2, // 2 minutes
         gcTime: 1000 * 60 * 15, // 15 minutes
      },
   },
});
