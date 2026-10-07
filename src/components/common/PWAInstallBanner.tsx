'use client';

import { Download, Bell, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';

export default function PWAInstallBanner() {
   const {
      isInstallable,
      isStandalone,
      pushPermission,
      isPushSubscribed,
      installApp,
      subscribeToPush,
   } = usePWA();

   if (isStandalone && pushPermission === 'granted') {
      return null;
   }

   return (
      <Card className="border-primary/20 bg-linear-to-r from-primary/10 via-background to-background shadow-xs">
         <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
               <div className="mt-0.5 rounded-xl bg-primary/15 p-2 text-primary">
                  <Smartphone className="size-5" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-foreground">
                     {isStandalone
                        ? 'Mobile PWA Active'
                        : 'Install Workforce App'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                     {isStandalone
                        ? 'Installed as standalone application with offline support.'
                        : 'Install Workforce Ultimate to your desktop or home screen for faster access & offline support.'}
                  </p>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
               {/* Install Button */}
               {!isStandalone && isInstallable && (
                  <Button
                     size="sm"
                     variant="default"
                     onClick={installApp}
                     className="h-8 gap-1.5 text-xs font-semibold"
                  >
                     <Download className="size-3.5" />
                     Install App
                  </Button>
               )}

               {/* Push Notifications Button */}
               {pushPermission !== 'granted' ? (
                  <Button
                     size="sm"
                     variant="outline"
                     onClick={subscribeToPush}
                     className="h-8 gap-1.5 text-xs font-medium"
                  >
                     <Bell className="size-3.5 text-primary" />
                     Enable Push Notifications
                  </Button>
               ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                     <Check className="size-3" />
                     Push Notifications Active
                  </span>
               )}
            </div>
         </CardContent>
      </Card>
   );
}
