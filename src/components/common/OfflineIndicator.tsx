'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export default function OfflineIndicator() {
   const { isOnline } = usePWA();

   if (isOnline) return null;

   return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-700 shadow-xl backdrop-blur-md dark:text-amber-300">
         <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-amber-500" />
         </span>
         <WifiOff className="size-4 text-amber-600 dark:text-amber-400" />
         <span>Offline Mode — Cached pages available</span>
         <button
            type="button"
            onClick={() => window.location.reload()}
            className="ml-1 inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-800 hover:bg-amber-500/30 dark:text-amber-200"
         >
            <RefreshCw className="size-3" />
            Retry
         </button>
      </div>
   );
}
