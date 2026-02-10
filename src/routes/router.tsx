import { Route, Routes } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '@/pages/Public/LandingPage';
import LoginPage from '@/pages/auth/Login';
import Signup from '@/pages/auth/SignUp';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import EmployeeDashboard from '@/pages/dashboard/EmployeeDashboard';
import RoleGuard from './RoleGuard';
import ManagerDashboard from '@/pages/dashboard/ManagerDashboard';
import Page404 from '@/pages/error/Page404';
import { PublicLayout } from '@/components/layout/PublicLayout';
import About from '@/pages/Public/AboutPage';
import Careers from '@/pages/Public/CareersPage';
import Blog from '@/pages/Public/BlogPage';
import Contact from '@/pages/Public/ContactPage';
import Docs from '@/pages/Public/DocsPage';
import API from '@/pages/Public/APIPage';
import SupportPage from '@/pages/Public/SupportPage';

export default function AppRoutes() {
   return (
      <Routes>
         {/* Public */}
         <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/" element={<About />} />
            <Route path="/" element={<Careers />} />
            <Route path="/" element={<Blog />} />
            <Route path="/" element={<Contact />} />
            <Route path="/" element={<Docs />} />
            <Route path="/" element={<API />} />
            <Route path="/" element={<SupportPage />} />
            <Route path="/" element={<LandingPage />} />

            <Route>
               <Route path="/login" element={<LoginPage />} />
               <Route path="/signup" element={<Signup />} />
               <Route path="/forgotpassword" element={<ForgotPassword />} />
            </Route>
         </Route>

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

         {/* Errors */}
         {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
         <Route path="*" element={<Page404 />} />
      </Routes>
   );
}
