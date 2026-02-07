import { Routes, Route } from 'react-router';

import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';
import RootRedirect from './RootRedirect';
import EmployeeDashboard from '../pages/dashboard/EmployeeDashboard';
import Login from '../pages/auth/Login';
import ManagerDashboard from '../pages/dashboard/ManagerDashboard';
import Page404 from '../pages/error/Page404';
import Signup from '@/pages/auth/SignUp';

export default function AppRoutes() {
   return (
      <Routes>
         {/* Root */}
         <Route path="/" element={<RootRedirect />} />

         {/* Auth */}
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />

         {/* Employee */}
         <Route
            path="/dashboard/employee"
            element={
               <ProtectedRoute>
                  <RoleGuard allowedRoles={['EMPLOYEE']}>
                     <EmployeeDashboard />
                  </RoleGuard>
               </ProtectedRoute>
            }
         />

         {/* Manager */}
         <Route
            path="/dashboard/manager"
            element={
               <ProtectedRoute>
                  <RoleGuard
                     allowedRoles={[
                        'MANAGER',
                        'SENIOR_MANAGER',
                        'REGIONAL_MANAGER',
                        'HR',
                     ]}
                  >
                     <ManagerDashboard />
                  </RoleGuard>
               </ProtectedRoute>
            }
         />

         {/* Fallback */}
         <Route path="*" element={<Page404 />} />
      </Routes>
   );
}
