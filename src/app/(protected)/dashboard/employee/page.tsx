import RoleGuard from '@/components/auth/RoleGuard';
import PageComponent from '@/views/dashboard/EmployeeDashboard';

export default function Page() {
   return (
      <RoleGuard allowedRoles={['EMPLOYEE']}>
         <PageComponent />
      </RoleGuard>
   );
}
