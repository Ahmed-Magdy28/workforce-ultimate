import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Session } from '@supabase/supabase-js';
import type { Role } from '@/types/roles';
import { AuthInitialState } from '@/lib/utils';

const authSlice = createSlice({
   name: 'auth',
   initialState: AuthInitialState,
   reducers: {
      setSession(state, action: PayloadAction<Session | null>) {
         state.session = action.payload;

         if (action.payload) {
            state.isAuthenticated = true;
            state.userId = action.payload.user.id;
         } else {
            state.isAuthenticated = false;
            state.userId = null;
            state.role = null;
         }
      },

      setRole(state, action: PayloadAction<Role>) {
         state.role = action.payload;
      },

      logout(state) {
         state.session = null;
         state.isAuthenticated = false;
         state.userId = null;
         state.role = null;
      },
   },
});

export const { setSession, setRole, logout } = authSlice.actions;
export default authSlice.reducer;
