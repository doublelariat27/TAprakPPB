export async function GET() {
  const swCode = `
    const CACHE_NAME = 'lombaschedulepwa-v1';
    const urlsToCache = [
      '/',
      '/offline.html',
    ];

    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          return cache.addAll(urlsToCache).catch(() => {
            console.log('[SW] Some assets failed to cache, continuing...');
          });
        })
      );
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== CACHE_NAME) {
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
      self.clients.claim();
    });

    self.addEventListener('fetch', (event) => {
      if (event.request.method !== 'GET') return;

      // Cache-first for images
      if (event.request.url.includes('supabase') && event.request.destination === 'image') {
        event.respondWith(
          caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
              return response;
            });
          })
        );
        return;
      }

      // Network-first for API calls
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return response;
          })
          .catch(() => {
            return caches.match(event.request);
          })
      );
    });
  `

  return new Response(swCode, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
    },
  })
}
