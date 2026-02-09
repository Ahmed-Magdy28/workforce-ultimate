import type { Session } from '@supabase/supabase-js';
import type { Role } from './roles';

export interface AuthState {
   isAuthenticated: boolean;
   role: Role | null;
   userId: string | null;
   session: Session | null;
}
