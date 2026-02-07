import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Role =
   | 'EMPLOYEE'
   | 'MANAGER'
   | 'SENIOR_MANAGER'
   | 'REGIONAL_MANAGER'
   | 'HR';

interface AuthState {
   isAuthenticated: boolean;
   role: Role | null;
   userId: string | null;
}

const initialState: AuthState = {
   isAuthenticated: false,
   role: null,
   userId: null,
};

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      loginSuccess(
         state,
         action: PayloadAction<{ userId: string; role: Role }>,
      ) {
         state.isAuthenticated = true;
         state.userId = action.payload.userId;
         state.role = action.payload.role;
      },
      logout(state) {
         state.isAuthenticated = false;
         state.role = null;
         state.userId = null;
      },
   },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
