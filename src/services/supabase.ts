import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
   process.env.NEXT_PUBLIC_SUPABASE_URL ||
   process.env.VITE_SUPABASE_URL ||
   'https://zzlytejrzhskondoiirw.supabase.co';
const supabaseAnonKey =
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
   process.env.VITE_SUPABASE_ANON_KEY ||
   'sb_publishable_FWtRLqcs_cJPP_Ty690khQ_dRRCDuuD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
