'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   Bell,
   Check,
   CheckCheck,
   ExternalLink,
   Info,
   AlertTriangle,
   CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import {
   getNotificationsAPI,
   markNotificationReadAPI,
   markAllNotificationsReadAPI,
} from '@/features/notifications/api/notificationApis';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationType } from '@/types/notifications';

function getNotificationIcon(type: NotificationType) {
   switch (type) {
      case 'success':
         return <CheckCircle className="size-4 text-emerald-500" />;
      case 'warning':
      case 'approval':
         return <AlertTriangle className="size-4 text-amber-500" />;
      default:
         return <Info className="size-4 text-primary" />;
   }
}

export default function NotificationBell() {
   const { isAuthenticated } = useAuth();
   const queryClient = useQueryClient();
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const { data: notifications = [] } = useQuery({
      queryKey: ['notifications'],
      queryFn: getNotificationsAPI,
      enabled: isAuthenticated,
      refetchInterval: 30000, // Poll every 30s
   });

   const unreadCount = notifications.filter((n) => !n.is_read).length;

   const markReadMutation = useMutation({
      mutationFn: (id: string) => markNotificationReadAPI(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
   });

   const markAllReadMutation = useMutation({
      mutationFn: () => markAllNotificationsReadAPI(),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
   });

   // Close on click outside
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   if (!isAuthenticated) return null;

   return (
      <div ref={dropdownRef} className="relative">
         <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="relative flex size-8 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Notifications"
         >
            <Bell className="size-4" />
            {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
               </span>
            )}
         </button>

         {isOpen && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 sm:w-96 rounded-2xl border bg-card p-3 shadow-xl backdrop-blur-md">
               <div className="flex items-center justify-between border-b pb-2 px-1">
                  <div className="flex items-center gap-1.5">
                     <span className="text-sm font-semibold">
                        Notifications
                     </span>
                     {unreadCount > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                           {unreadCount} new
                        </span>
                     )}
                  </div>

                  {unreadCount > 0 && (
                     <button
                        type="button"
                        onClick={() => markAllReadMutation.mutate()}
                        className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                     >
                        <CheckCheck className="size-3.5" />
                        Mark all read
                     </button>
                  )}
               </div>

               <div className="mt-2 space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                     <p className="p-6 text-center text-xs text-muted-foreground">
                        No notifications yet.
                     </p>
                  ) : (
                     notifications.slice(0, 8).map((n) => (
                        <div
                           key={n.id}
                           className={`group flex items-start gap-2.5 rounded-xl p-2.5 text-xs transition-colors ${
                              n.is_read
                                 ? 'bg-transparent text-muted-foreground hover:bg-muted/50'
                                 : 'bg-primary/5 text-foreground font-medium hover:bg-primary/10'
                           }`}
                        >
                           <div className="mt-0.5 shrink-0">
                              {getNotificationIcon(n.type)}
                           </div>
                           <div className="flex-1 space-y-0.5 min-w-0">
                              <p className="font-semibold leading-tight text-foreground">
                                 {n.title}
                              </p>
                              <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                                 {n.message}
                              </p>
                              <span className="text-[10px] text-muted-foreground/70">
                                 {new Date(n.created_at).toLocaleTimeString(
                                    [],
                                    {
                                       hour: '2-digit',
                                       minute: '2-digit',
                                    },
                                 )}
                              </span>
                           </div>

                           {!n.is_read && (
                              <button
                                 type="button"
                                 onClick={() => markReadMutation.mutate(n.id)}
                                 className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground transition-opacity"
                                 title="Mark as read"
                              >
                                 <Check className="size-3.5" />
                              </button>
                           )}
                        </div>
                     ))
                  )}
               </div>

               <div className="mt-2 border-t pt-2 text-center">
                  <Link
                     href="/more?tab=notifications"
                     onClick={() => setIsOpen(false)}
                     className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                     View all & preferences <ExternalLink className="size-3" />
                  </Link>
               </div>
            </div>
         )}
      </div>
   );
}
