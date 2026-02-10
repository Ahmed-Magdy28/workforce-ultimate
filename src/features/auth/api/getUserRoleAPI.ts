import { supabase } from '@/services/supabase';

export const getUserRoleAPI = async (userId: string) => {
   const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

   if (error) throw error;
   return data.role;
};
