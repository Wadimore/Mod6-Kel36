importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.core.clientsClaim();

// Precaching dengan Workbox
if (Array.isArray(self.__WB_MANIFEST)) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
} else {
  console.warn('Warning: `self.__WB_MANIFEST` is not available or not an array.');
}

// Cache untuk gambar menggunakan strategi StaleWhileRevalidate
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

// Cache untuk hasil pencarian dinamis
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/auto-complete'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'search-results',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1, // Hanya simpan hasil pencarian terbaru
        maxAgeSeconds: 24 * 60 * 60, // Cache selama 1 hari
      }),
    ],
  })
);

// Cache statis untuk asset yang sering digunakan
const CACHE_NAME = "kelompok36w-cache-v1";
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json',
  '/static/js/bundle.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Mengambil data dari cache jika offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) return response;
        return fetch(event.request)
          .then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              // Simpan data API dinamis ke cache
              if (event.request.url.includes('/auto-complete')) {
                cache.put(event.request, fetchResponse.clone());
              }
              return fetchResponse;
            });
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
