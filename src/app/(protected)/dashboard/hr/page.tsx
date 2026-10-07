import RoleGuard from '@/components/auth/RoleGuard';
import PageComponent from '@/views/dashboard/HRDashboard';

export default function Page() {
   return (
      <RoleGuard allowedRoles={['HR']}>
         <PageComponent />
      </RoleGuard>
   );
}
