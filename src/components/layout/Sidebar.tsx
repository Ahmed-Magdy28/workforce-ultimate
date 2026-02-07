import { NavLink } from 'react-router';

export default function Sidebar() {
   return (
      <aside className="w-64 bg-white border-r">
         <div className="p-4 font-bold text-lg">Workforce</div>

         <nav className="flex flex-col gap-2 p-4">
            <NavLink to="/dashboard/employee">Dashboard</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/tasks">Tasks</NavLink>
         </nav>
      </aside>
   );
}
