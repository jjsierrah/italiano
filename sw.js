const CACHE_NAME = 'jj-impara-italiano-v02';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'icon-192-ita.png',
  'icon-512-ita.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
