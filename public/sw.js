// Workforce Ultimate — Progressive Web App Service Worker (v1)

const CACHE_NAME = 'workforce-cache-v1';
const STATIC_ASSETS = ['/', '/manifest.webmanifest', '/assets/icons/logo.png'];

// Install: Cache static shell assets
self.addEventListener('install', (event) => {
   event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
         return cache.addAll(STATIC_ASSETS).catch((err) => {
            console.warn('Pre-cache warning:', err);
         });
      }),
   );
   self.skipWaiting();
});

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
   event.waitUntil(
      caches.keys().then((keys) => {
         return Promise.all(
            keys.map((key) => {
               if (key !== CACHE_NAME) {
                  return caches.delete(key);
               }
            }),
         );
      }),
   );
   self.clients.claim();
});

// Fetch: Network-first for dynamic navigation, Cache-first for static assets
self.addEventListener('fetch', (event) => {
   const url = new URL(event.request.url);

   // Skip non-GET requests and Supabase / API requests from caching
   if (
      event.request.method !== 'GET' ||
      url.pathname.startsWith('/api/') ||
      url.hostname.includes('supabase.co')
   ) {
      return;
   }

   // Static assets (images, fonts, scripts): Cache First with background refresh
   if (
      url.pathname.startsWith('/assets/') ||
      url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|woff2|woff)$/)
   ) {
      event.respondWith(
         caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((networkRes) => {
               if (networkRes && networkRes.status === 200) {
                  const resClone = networkRes.clone();
                  caches
                     .open(CACHE_NAME)
                     .then((cache) => cache.put(event.request, resClone));
               }
               return networkRes;
            });
         }),
      );
      return;
   }

   // HTML Page Navigation: Network First, Fallback to Cache
   if (event.request.mode === 'navigate') {
      event.respondWith(
         fetch(event.request)
            .then((networkRes) => {
               if (networkRes && networkRes.status === 200) {
                  const resClone = networkRes.clone();
                  caches
                     .open(CACHE_NAME)
                     .then((cache) => cache.put(event.request, resClone));
               }
               return networkRes;
            })
            .catch(async () => {
               const cached = await caches.match(event.request);
               if (cached) return cached;
               const rootCached = await caches.match('/');
               return (
                  rootCached ||
                  new Response('Offline: Please reconnect to the internet.', {
                     headers: { 'Content-Type': 'text/plain' },
                  })
               );
            }),
      );
   }
});

// Push: Handle incoming Web Push notifications
self.addEventListener('push', (event) => {
   let data = {};
   try {
      data = event.data ? event.data.json() : {};
   } catch {
      data = {
         body: event.data
            ? event.data.text()
            : 'New update from Workforce Ultimate',
      };
   }

   const title = data.title || 'Workforce Ultimate';
   const options = {
      body:
         data.body || 'You have new notifications waiting in your workspace.',
      icon: data.icon || '/assets/icons/logo.png',
      badge: '/assets/icons/logo.png',
      vibrate: [100, 50, 100],
      data: {
         url: data.url || '/more',
      },
      actions: [
         { action: 'open', title: 'Open Workspace' },
         { action: 'dismiss', title: 'Dismiss' },
      ],
   };

   event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click: Navigate to target URL
self.addEventListener('notificationclick', (event) => {
   event.notification.close();

   if (event.action === 'dismiss') {
      return;
   }

   const targetUrl = event.notification.data?.url || '/';

   event.waitUntil(
      clients
         .matchAll({ type: 'window', includeUncontrolled: true })
         .then((clientList) => {
            for (const client of clientList) {
               if (
                  client.url.includes(self.location.origin) &&
                  'focus' in client
               ) {
                  client.navigate(targetUrl);
                  return client.focus();
               }
            }
            if (clients.openWindow) {
               return clients.openWindow(targetUrl);
            }
         }),
   );
});
