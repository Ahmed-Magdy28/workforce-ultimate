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
import AboutPage from '@/pages/Public/AboutPage';
import CareerPage from '@/pages/Public/CareerPage';
import BlogPage from '@/pages/Public/BlogPage';
import ContactPage from '@/pages/Public/ContactPage';
import DocsPage from '@/pages/Public/DocsPage';
import APIPage from '@/pages/Public/APIPage';
import SupportPage from '@/pages/Public/SupportPage';
import CommunityPage from '@/pages/Public/CommunityPage';
import PrivacyPage from '@/pages/Public/PrivacyPage';
import TermsPage from '@/pages/Public/TermsPage';
import CookiesPage from '@/pages/Public/CookiesPage.';
import SecurityPage from '@/pages/Public/SecurityPage';
import SettingsPage from '@/pages/Public/SettingsPage';
import RoadMapPage from '@/pages/Public/RoadMapPage';

export default function AppRoutes() {
   return (
      <Routes>
         {/* Public */}
         <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/roadmap" element={<RoadMapPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareerPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/api" element={<APIPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/settings" element={<SettingsPage />} />

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
