import { supabase } from '@/lib/supabase';

export const getUserRoleAPI = async (userId: string) => {
   const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

   if (error) throw error;
   return data.role;
};
