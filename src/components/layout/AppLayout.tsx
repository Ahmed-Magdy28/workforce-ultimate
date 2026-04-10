import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
   return (
      <div className="min-h-screen bg-muted/30">
         <Navbar />

         <div className="flex min-h-[calc(100vh-3rem)]">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-6">
               <Outlet />
            </main>
         </div>
      </div>
   );
}
