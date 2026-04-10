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
import SecurityPage from '@/pages/Public/SecurityPage';
import SettingsPage from '@/pages/Public/SettingsPage';
import RoadMapPage from '@/pages/Public/RoadMapPage';
import CookiesPage from '@/pages/Public/CookiesPage';
import Company from '@/pages/company/Company';
import Unauthorized from '@/pages/error/Unauthorized';
import AppLayout from '@/components/layout/AppLayout';
import HomePage from '@/pages/app/HomePage';
import PlannerPage from '@/pages/app/PlannerPage';
import TeamsPage from '@/pages/app/TeamsPage';
import MorePage from '@/pages/app/MorePage';
import InvitePage from '@/pages/app/InvitePage';
import UpgradePage from '@/pages/app/UpgradePage';
import HRDashboard from '@/pages/dashboard/HRDashboard';
import PeoplePage from '@/pages/app/PeoplePage';
import AppSettingsPage from '@/pages/app/AppSettingsPage';
import HelpPage from '@/pages/app/HelpPage';

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

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
         </Route>

         <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
               <Route path="/company" element={<Company />} />
               <Route path="/app/home" element={<HomePage />} />
               <Route path="/planner" element={<PlannerPage />} />
               <Route path="/teams" element={<TeamsPage />} />
               <Route path="/more" element={<MorePage />} />
               <Route path="/upgrade" element={<UpgradePage />} />
               <Route path="/invite" element={<InvitePage />} />
               <Route path="/people" element={<PeoplePage />} />
               <Route path="/app/settings" element={<AppSettingsPage />} />
               <Route path="/app/help" element={<HelpPage />} />

               <Route
                  path="/dashboard/employee"
                  element={
                     <RoleGuard allowedRoles={['EMPLOYEE']}>
                        <EmployeeDashboard />
                     </RoleGuard>
                  }
               />

               <Route
                  path="/dashboard/manager"
                  element={
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
                  }
               />

               <Route
                  path="/dashboard/hr"
                  element={
                     <RoleGuard allowedRoles={['HR']}>
                        <HRDashboard />
                     </RoleGuard>
                  }
               />
            </Route>
         </Route>

         {/* Errors */}
         <Route path="/unauthorized" element={<Unauthorized />} />
         <Route path="*" element={<Page404 />} />
      </Routes>
   );
}
