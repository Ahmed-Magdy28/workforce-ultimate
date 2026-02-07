import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

export default function RootRedirect() {
   const { isAuthenticated, role } = useSelector(
      (state: RootState) => state.auth,
   );

   if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
   }

   if (role === 'EMPLOYEE') {
      return <Navigate to="/dashboard/employee" replace />;
   }

   if (
      role === 'MANAGER' ||
      role === 'SENIOR_MANAGER' ||
      role === 'REGIONAL_MANAGER' ||
      role === 'HR'
   ) {
      return <Navigate to="/dashboard/manager" replace />;
   }

   return <Navigate to="/login" replace />;
}
