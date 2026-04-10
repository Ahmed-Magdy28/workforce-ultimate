import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useQuery } from '@tanstack/react-query';
import { getCurrentUserAPI } from '@/features/auth/api/apiAuth';
import { Spinner } from '@/components/ui/spinner';

export default function ProtectedRoute() {
   const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
   const user = useQuery({
      queryKey: ['user'],
      queryFn: getCurrentUserAPI,
      enabled: isAuth,
   });
   if (user.isLoading) return <Spinner />;

   // If not authenticated or user data is not available, redirect to login
   if (!isAuth) return <Navigate to="/login" replace />;

   // If authenticated and user data is available, redirect to manga page (or any other page)

   return <Outlet />;
}
