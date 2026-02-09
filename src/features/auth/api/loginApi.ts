import { supabase } from '@/services/supabase';

export const loginAPI = async (email: string, password: string) => {
   const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
   });

   if (error) throw error;
   console.log(data);
   return data;
};
