import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import LandingPage from '@/pages/Public/LandingPage';

export default function RootRedirect() {
   const { isAuthenticated, role } = useSelector(
      (state: RootState) => state.auth,
   );

   if (!isAuthenticated && role !== 'GUEST') {
      return <Navigate to="/login" replace />;
   }
   if (role === 'GUEST') {
      return <LandingPage />;
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

   return <Navigate to="/home" replace />;
}
