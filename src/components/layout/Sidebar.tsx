import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SIDEBAR_ITEMS } from './sidebar.config';
import type { RootState } from '@/app/store';

export default function Sidebar() {
   const { t } = useTranslation();
   const role = useSelector((state: RootState) => state.auth.role);

   const items = SIDEBAR_ITEMS.filter(
      (item) => role && item.roles.includes(role),
   );

   return (
      <aside className="w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-700">
         <div className="p-4 text-lg font-bold dark:text-white">Workforce</div>

         <nav className="flex flex-col gap-1 p-2">
            {items.map((item) => (
               <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                     `
              px-4 py-2 rounded-md text-sm
              ${
                 isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `
                  }
               >
                  {t(item.label)}
               </NavLink>
            ))}
         </nav>
      </aside>
   );
}
