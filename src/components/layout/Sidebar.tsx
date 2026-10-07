'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIDEBAR_ITEMS } from './sidebar.config';
import { useRole } from '@/hooks/useRole';

export default function Sidebar() {
   const pathname = usePathname() ?? '';
   const { canManageInvites } = useRole();

   const items = SIDEBAR_ITEMS.filter(
      (item) => !item.adminOnly || canManageInvites,
   );
   const primaryItems = items.filter((item) => item.section === 'primary');
   const secondaryItems = items.filter((item) => item.section === 'secondary');

   return (
      <aside className="flex min-h-full w-18 flex-col border-r bg-card">
         <nav className="flex flex-1 flex-col justify-between p-2.5">
            <div className="space-y-2">
               {primaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                     pathname === item.path ||
                     (item.path !== '/' && pathname.startsWith(item.path));

                  return (
                     <Link
                        key={item.path}
                        href={item.path}
                        className={[
                           'flex flex-col items-center gap-1.5 rounded-2xl px-1.5 py-3 text-center text-[11px] font-medium transition-colors',
                           isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        ].join(' ')}
                     >
                        <Icon className="size-4" />
                        {item.label}
                     </Link>
                  );
               })}
            </div>

            <div className="space-y-2 border-t pt-3">
               {secondaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                     pathname === item.path ||
                     (item.path !== '/' && pathname.startsWith(item.path));

                  return (
                     <Link
                        key={item.path}
                        href={item.path}
                        className={[
                           'flex flex-col items-center gap-1.5 rounded-2xl px-1.5 py-3 text-center text-[11px] font-medium transition-colors',
                           isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        ].join(' ')}
                     >
                        <Icon className="size-4" />
                        {item.label}
                     </Link>
                  );
               })}
            </div>
         </nav>
      </aside>
   );
}
