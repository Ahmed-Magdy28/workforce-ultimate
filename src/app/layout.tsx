import type { Metadata } from 'next';
import '@/styles/globals.css';
import AppProviders from '@/providers/AppProviders';

export const metadata: Metadata = {
   title: 'Workforce Ultimate',
   description:
      'Empowering teams with intelligent workforce management solutions.',
   icons: {
      icon: '/assets/icons/logo.png',
   },
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body>
            <AppProviders>{children}</AppProviders>
         </body>
      </html>
   );
}
