import { PublicLayout } from '@/components/layout/PublicLayout';
import { Outlet } from 'react-router';

export default function PublicRoutes() {
   return (
      <PublicLayout>
         <Outlet />
      </PublicLayout>
   );
}
