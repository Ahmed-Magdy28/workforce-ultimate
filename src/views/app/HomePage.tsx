'use client';

import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import EmployeeDashboard from '@/views/dashboard/EmployeeDashboard';
import ManagerDashboard from '@/views/dashboard/ManagerDashboard';
import HRDashboard from '@/views/dashboard/HRDashboard';
import OwnerDashboard from '@/views/dashboard/OwnerDashboard';
import { Spinner } from '@/components/ui/spinner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
   const { role, isOwner, isHR, isManagerOrAbove, isEmployee } = useRole();
   const { companyId, isLoading } = useAuth();

   if (isLoading) {
      return (
         <div className="flex h-64 items-center justify-center">
            <Spinner className="size-8" />
         </div>
      );
   }


   // If user has not created or joined a company yet
   if (!companyId) {
      return (
         <div className="mx-auto max-w-2xl space-y-6 py-8">
            <Card className="border-primary/20 bg-linear-to-br from-primary/5 via-background to-background text-center p-6 sm:p-10">
               <Building2 className="mx-auto h-16 w-16 text-primary/70" />
               <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl sm:text-3xl">
                     Welcome to Workforce Ultimate
                  </CardTitle>
                  <CardDescription className="text-base">
                     To get started with tasks, teams, and your role-based dashboard, create a company workspace or join an existing one using an invite code.
                  </CardDescription>
               </CardHeader>
               <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center pt-4">
                  <Link href="/company">
                     <Button size="lg" className="gap-2 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                        Create a Company
                     </Button>
                  </Link>
                  <Link href="/company?tab=join">
                     <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                        <Users className="h-4 w-4" />
                        Join with Invite Code
                     </Button>
                  </Link>
               </CardContent>
            </Card>
         </div>
      );
   }

   // 1. Employee Dashboard
   if (isEmployee || role === 'EMPLOYEE') {
      return <EmployeeDashboard />;
   }

   // 2. Manager / Senior Manager / Regional Manager Dashboard
   if (
      role === 'MANAGER' ||
      role === 'SENIOR_MANAGER' ||
      role === 'REGIONAL_MANAGER'
   ) {
      return <ManagerDashboard />;
   }

   // 3. Owner Dashboard
   if (isOwner || role === 'OWNER') {
      return <OwnerDashboard />;
   }

   // 4. HR Dashboard
   if (isHR || role === 'HR') {
      return <HRDashboard />;
   }

   // Fallback for other roles or manager tier
   if (isManagerOrAbove) {
      return <ManagerDashboard />;
   }

   return <EmployeeDashboard />;
}

