import {
   CalendarDays,
   Crown,
   FolderKanban,
   Home,
   MoreHorizontal,
   Users,
} from 'lucide-react';

export type AppSidebarItem = {
   label: string;
   path: string;
   icon: typeof Home;
   section: 'primary' | 'secondary';
   adminOnly?: boolean;
};

export const SIDEBAR_ITEMS: AppSidebarItem[] = [
   {
      label: 'Home',
      path: '/app/home',
      icon: Home,
      section: 'primary',
   },
   {
      label: 'Planner',
      path: '/planner',
      icon: CalendarDays,
      section: 'primary',
   },
   {
      label: 'Teams',
      path: '/teams',
      icon: Users,
      section: 'primary',
   },
   {
      label: 'More',
      path: '/more',
      icon: MoreHorizontal,
      section: 'primary',
   },
   {
      label: 'Invite',
      path: '/invite',
      icon: FolderKanban,
      section: 'secondary',
      adminOnly: true,
   },
   {
      label: 'Upgrade',
      path: '/upgrade',
      icon: Crown,
      section: 'secondary',
   },
];
