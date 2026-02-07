import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

type Props = {
   children: ReactNode;
};

export default function AppLayout({ children }: Props) {
   return (
      <div className="flex h-screen bg-gray-100">
         <Sidebar />

         <div className="flex flex-col flex-1">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
         </div>
      </div>
   );
}
