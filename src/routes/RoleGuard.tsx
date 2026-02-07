import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import type { JSX } from 'react';
import type { RootState } from '../app/store';

type Props = {
   allowedRoles: string[];
   children: JSX.Element;
};

export default function RoleGuard({ allowedRoles, children }: Props) {
   const role = useSelector((state: RootState) => state.auth.role);

   if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
   }

   return children;
}
