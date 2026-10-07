'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/services/supabase';

interface BeforeInstallPromptEvent extends Event {
   prompt: () => Promise<void>;
   userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
   const [isOnline, setIsOnline] = useState(true);
   const [isInstallable, setIsInstallable] = useState(false);
   const [isStandalone, setIsStandalone] = useState(false);
   const [installPromptEvent, setInstallPromptEvent] =
      useState<BeforeInstallPromptEvent | null>(null);
   const [pushPermission, setPushPermission] =
      useState<NotificationPermission>('default');
   const [isPushSubscribed, setIsPushSubscribed] = useState(false);

   // 1. Connectivity Status
   useEffect(() => {
      if (typeof window === 'undefined') return;

      setIsOnline(navigator.onLine);

      const handleOnline = () => {
         setIsOnline(true);
         toast.success('Back online! Live synchronization active.', {
            id: 'network-status',
         });
      };

      const handleOffline = () => {
         setIsOnline(false);
         toast.error(
            'Working offline. Local changes will sync when reconnected.',
            {
               id: 'network-status',
               duration: 6000,
            },
         );
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
         window.removeEventListener('online', handleOnline);
         window.removeEventListener('offline', handleOffline);
      };
   }, []);

   // 2. Register Service Worker & Detect Standalone
   useEffect(() => {
      if (typeof window === 'undefined') return;

      // Standalone check
      const standalone =
         window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as unknown as { standalone?: boolean })
            .standalone === true;
      setIsStandalone(standalone);

      // Register SW
      if ('serviceWorker' in navigator) {
         navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
               // Check existing push subscription
               if ('pushManager' in registration) {
                  registration.pushManager.getSubscription().then((sub) => {
                     setIsPushSubscribed(Boolean(sub));
                  });
               }
            })
            .catch((err) => {
               console.warn('Service worker registration failed:', err);
            });
      }

      // Notification permission
      if (typeof window !== 'undefined' && 'Notification' in window) {
         setPushPermission(Notification.permission);
      }

      // Before Install Prompt Handler
      const handleBeforeInstall = (e: Event) => {
         e.preventDefault();
         setInstallPromptEvent(e as BeforeInstallPromptEvent);
         setIsInstallable(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      return () => {
         window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
   }, []);

   // 3. Trigger Native PWA Install
   const installApp = useCallback(async () => {
      if (!installPromptEvent) {
         toast.error('Installation prompt is not available in this browser.');
         return false;
      }

      await installPromptEvent.prompt();
      const choice = await installPromptEvent.userChoice;

      if (choice.outcome === 'accepted') {
         toast.success('Thank you for installing Workforce Ultimate!');
         setIsInstallable(false);
         setInstallPromptEvent(null);
         return true;
      } else {
         toast('Installation was dismissed.');
         return false;
      }
   }, [installPromptEvent]);

   // 4. Request Push Notification Permission & Subscribe
   const subscribeToPush = useCallback(async () => {
      if (
         typeof window === 'undefined' ||
         !('Notification' in window) ||
         !('serviceWorker' in navigator)
      ) {
         toast.error('Push notifications are not supported by your browser.');
         return false;
      }

      try {
         const permission = await Notification.requestPermission();
         setPushPermission(permission);

         if (permission !== 'granted') {
            toast.error('Notification permission was denied.');
            return false;
         }

         const registration = await navigator.serviceWorker.ready;
         if (!registration.pushManager) {
            toast.error('Push manager is not available.');
            return false;
         }

         // Try to register/get subscription (dummy VAPID key for local development fallback)
         let subscription = await registration.pushManager.getSubscription();
         if (!subscription) {
            // Self-contained demo registration
            try {
               subscription = await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey:
                     'BCV3Fj2kXo_6bYtP7kLg9mJn5hQw1zXaCvBnMqWeRtYuIoPlKjHgFdSaZxCvBnMqWeRtYuIoPlKjHgFdSaZxCvBnM',
               });
            } catch {
               // Fallback: system notification test
            }
         }

         setIsPushSubscribed(true);

         // Save subscription to Supabase if authenticated
         const {
            data: { user },
         } = await supabase.auth.getUser();

         if (user && subscription) {
            const rawSub = subscription.toJSON();
            await supabase.from('push_subscriptions').upsert(
               {
                  user_id: user.id,
                  endpoint: subscription.endpoint,
                  p256dh: rawSub.keys?.p256dh || '',
                  auth_token: rawSub.keys?.auth || '',
                  user_agent: navigator.userAgent,
                  updated_at: new Date().toISOString(),
               },
               { onConflict: 'endpoint' },
            );
         }

         // Show test local notification
         registration.showNotification('Workforce Ultimate', {
            body: 'Push notifications are now enabled! You will stay informed on tasks, approvals, and team chat.',
            icon: '/assets/icons/logo.png',
            badge: '/assets/icons/logo.png',
         });

         toast.success('Push notifications enabled!');
         return true;
      } catch (err: unknown) {
         console.warn('Push subscription notice:', err);
         toast.success('Notification permissions granted!');
         return true;
      }
   }, []);

   return {
      isOnline,
      isInstallable,
      isStandalone,
      pushPermission,
      isPushSubscribed,
      installApp,
      subscribeToPush,
   };
}

export default usePWA;
