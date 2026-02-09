import type { Role } from '@/types/roles';

export type SidebarItem = {
   label: string; // i18n key
   path: string;
   roles: Role[];
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
   {
      label: 'sidebar.dashboard',
      path: '/dashboard/employee',
      roles: ['EMPLOYEE'],
   },
   {
      label: 'sidebar.dashboard',
      path: '/dashboard/manager',
      roles: ['MANAGER', 'SENIOR_MANAGER', 'REGIONAL_MANAGER', 'HR'],
   },
   {
      label: 'sidebar.projects',
      path: '/projects',
      roles: ['MANAGER', 'SENIOR_MANAGER', 'REGIONAL_MANAGER'],
   },
   {
      label: 'sidebar.tasks',
      path: '/tasks',
      roles: ['EMPLOYEE', 'MANAGER'],
   },
   {
      label: 'sidebar.team',
      path: '/team',
      roles: ['MANAGER', 'HR'],
   },
   {
      label: 'sidebar.hr',
      path: '/hr',
      roles: ['HR'],
   },
];
