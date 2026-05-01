// BibleFunLand Homeschool Hub — Service Worker
// Handles offline caching, background sync, and push notifications

const CACHE_VERSION = 'build-1777656708888-03085aeb';
const STATIC_CACHE = `bfl-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `bfl-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `bfl-images-${CACHE_VERSION}`;

// Pages to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/browse',
  '/generate',
  '/pricing',
  '/about',
  '/offline',
  '/manifest.json',
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing BibleFunLand Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        // Don't fail install if some assets aren't available yet
        console.warn('[SW] Some static assets failed to cache:', err);
      });
    })
  );
  // Activate immediately without waiting for old SW to finish
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// Allow the client to trigger activation of waiting SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Fetch Strategy ───────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, chrome-extension, and Clerk auth requests
  if (
    request.method !== 'GET' ||
    url.protocol === 'chrome-extension:' ||
    url.hostname.includes('clerk') ||
    url.hostname.includes('stripe') ||
    url.pathname.startsWith('/api/stripe') ||
    url.pathname.startsWith('/api/clerk')
  ) {
    return;
  }

  // API routes — Network first, fall back to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Images — Cache first, fall back to network
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico)$/)
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Static assets (JS, CSS, fonts) — Cache first
  if (
    url.pathname.match(/\.(js|css|woff|woff2|ttf)$/) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML pages — Stale while revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// ── Cache Strategies ─────────────────────────────────────────────────────────

// Network first — try network, fall back to cache, then offline page
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // For API failures, return a JSON error
    if (request.url.includes('/api/')) {
      return new Response(JSON.stringify({ error: 'You are offline', offline: true }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return caches.match('/offline') || new Response('Offline', { status: 503 });
  }
}

// Cache first — serve from cache, update in background
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('Asset unavailable offline', { status: 503 });
  }
}

// Stale while revalidate — serve cache immediately, update in background
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cached || caches.match('/offline'));

  return cached || fetchPromise;
}

// ── Push Notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'BibleFunLand', body: event.data.text() };
  }

  const options = {
    body: data.body || 'You have a new notification from BibleFunLand.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    image: data.image || null,
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
    },
    actions: data.actions || [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    tag: data.tag || 'bfl-notification',
    renotify: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'BibleFunLand', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(urlToOpen);
          return;
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// ── Background Sync ──────────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-packs') {
    event.waitUntil(syncPacks());
  }
});

async function syncPacks() {
  try {
    // Re-fetch and cache the latest packs when back online
    const response = await fetch('/api/packs?limit=20');
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put('/api/packs?limit=20', response);
      console.log('[SW] Background sync: packs updated');
    }
  } catch (err) {
    console.warn('[SW] Background sync failed:', err);
  }
}
