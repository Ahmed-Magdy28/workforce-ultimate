import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { JSX } from 'react';
import type { RootState } from '../app/store';

export default function ProtectedRoute({
   children,
}: {
   children: JSX.Element;
}) {
   const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
   if (!isAuth) {
      return <Navigate to="/login" replace />;
   }

   return children;
}
