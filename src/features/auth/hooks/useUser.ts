import { useQuery } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';
import { getCurrentUserAPI } from '../api/apiAuth';

export default function useUser() {
   const { isPending: isLoading, data } = useQuery<User | null>({
      queryKey: ['user'],
      queryFn: getCurrentUserAPI,
   });
   const user = data ?? null;

   return {
      isLoading,
      user,
      isAuthenticated: user?.role === 'authenticated',
   };
}
