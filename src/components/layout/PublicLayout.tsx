'use client';

import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';

export function PublicLayout({ children }: { children?: React.ReactNode }) {
   return (
      <div className="min-h-screen bg-background text-foreground">
         <PublicHeader />
         <main>{children}</main>
         <PublicFooter />
      </div>
   );
}
