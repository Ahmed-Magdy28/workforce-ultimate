import type { AuthState } from '@/types/auth';
import type { Role } from '@/types/roles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRole } from '../authSlice';
import { getUserRoleAPI } from '../api/getUserRoleAPI';

export const useUserRole = () => {
   const dispatch = useDispatch();
   const userId = useSelector(
      (state: { auth: AuthState }) => state.auth.userId,
   );

   useEffect(() => {
      if (!userId) return;

      getUserRoleAPI(userId).then((role: Role) => {
         dispatch(setRole(role));
      });
   }, [userId, dispatch]);
};
