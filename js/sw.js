self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open('cache').then(cache => {
      return cache.addAll([
        `/`,
        `/yearly.html`,
        `/monthly.html`,
        `/item.html`,
        `/styles/general.css`,
        `/styles/yearly.css`,
        `/styles/monthly.css`,
        `/styles/item.css`,
        `/styles/intro.css`,
        `/scripts/item.js`,
        `/scripts/yearly.js`,
        `/scripts/monthly.js`,
        `/img/`
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('cache')
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});
