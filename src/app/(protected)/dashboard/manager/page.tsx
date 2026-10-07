import RoleGuard from '@/components/auth/RoleGuard';
import PageComponent from '@/views/dashboard/ManagerDashboard';

export default function Page() {
   return (
      <RoleGuard allowedRoles={['MANAGER', 'SENIOR_MANAGER', 'REGIONAL_MANAGER', 'HR']}>
         <PageComponent />
      </RoleGuard>
   );
}
