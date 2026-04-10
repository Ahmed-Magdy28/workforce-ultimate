import { NavLink } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { SIDEBAR_ITEMS } from './sidebar.config';
import { getCurrentUserAPI } from '@/features/auth/api/apiAuth';

function isInviteAllowed(teamRole?: string) {
   return teamRole === 'owner' || teamRole === 'hr';
}

export default function Sidebar() {
   const { data: user } = useQuery({
      queryKey: ['user'],
      queryFn: getCurrentUserAPI,
   });
   const teamRole = String(user?.user_metadata?.teamRole ?? '').toLowerCase();

   const items = SIDEBAR_ITEMS.filter(
      (item) => !item.adminOnly || isInviteAllowed(teamRole),
   );
   const primaryItems = items.filter((item) => item.section === 'primary');
   const secondaryItems = items.filter((item) => item.section === 'secondary');

   return (
      <aside className="flex min-h-full w-18 flex-col border-r bg-card">
         <nav className="flex flex-1 flex-col justify-between p-2.5">
            <div className="space-y-2">
               {primaryItems.map((item) => {
                  const Icon = item.icon;

                  return (
                     <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                           [
                              'flex flex-col items-center gap-1.5 rounded-2xl px-1.5 py-3 text-center text-[11px] font-medium transition-colors',
                              isActive
                                 ? 'bg-primary text-primary-foreground'
                                 : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                           ].join(' ')
                        }
                     >
                        <Icon className="size-4" />
                        {item.label}
                     </NavLink>
                  );
               })}
            </div>

            <div className="space-y-2 border-t pt-3">
               {secondaryItems.map((item) => {
                  const Icon = item.icon;

                  return (
                     <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                           [
                              'flex flex-col items-center gap-1.5 rounded-2xl px-1.5 py-3 text-center text-[11px] font-medium transition-colors',
                              isActive
                                 ? 'bg-primary text-primary-foreground'
                                 : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                           ].join(' ')
                        }
                     >
                        <Icon className="size-4" />
                        {item.label}
                     </NavLink>
                  );
               })}
            </div>
         </nav>
      </aside>
   );
}
