import type { QueryClient } from '@tanstack/react-query';

export const CACHE_TIERS = {
   METADATA: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
   },
   WORKSPACE: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 20, // 20 minutes
   },
   STANDARD: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
   },
   DYNAMIC: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 5, // 5 minutes
   },
   REALTIME: {
      staleTime: 1000 * 5, // 5 seconds
      gcTime: 1000 * 60 * 2, // 2 minutes
   },
} as const;

/**
 * Invalidate workspace related queries in one coordinated batch
 */
export async function invalidateWorkspaceCaches(
   queryClient: QueryClient,
   companyId?: string,
) {
   const keys = [
      ['company'],
      ['current-company'],
      ['companies'],
      ['company-employees', companyId],
      ['projects', companyId],
      ['tasks', companyId],
      ['chat-channels', companyId],
      ['activity-logs', companyId],
      ['background-jobs', companyId],
   ];

   await Promise.all(
      keys.map((k) => queryClient.invalidateQueries({ queryKey: k })),
   );
}

/**
 * Offline Sync Queue: persist offline action requests to localStorage and replay when back online
 */
interface OfflineQueuedAction {
   id: string;
   type: string;
   payload: Record<string, unknown>;
   timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'workforce_offline_sync_queue';

export function getOfflineQueue(): OfflineQueuedAction[] {
   if (typeof window === 'undefined') return [];
   try {
      const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
   } catch {
      return [];
   }
}

export function queueOfflineAction(
   type: string,
   payload: Record<string, unknown>,
) {
   if (typeof window === 'undefined') return;
   const queue = getOfflineQueue();
   queue.push({
      id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      payload,
      timestamp: Date.now(),
   });
   localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export function clearOfflineQueue() {
   if (typeof window === 'undefined') return;
   localStorage.removeItem(OFFLINE_QUEUE_KEY);
}
