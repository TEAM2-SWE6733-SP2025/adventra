const CACHE_NAME = "adventra-cache-v3";
const urlsToCache = [
  "/",
  "/about",
  "/profile",
  "/manifest.json",
  "/icons/logo192.png",
  "/icons/logo512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.match(/\.(?:png|jpg|jpeg|svg|webp|gif|ico|css)$/)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      })
    );
  } else if (requestUrl.pathname.includes("/about") || requestUrl.pathname.includes("/profile")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request))
    );
  } else if (requestUrl.origin !== location.origin) {
    if (requestUrl.pathname.match(/\.(?:png|jpg|jpeg|svg|webp|gif)$/)) {
      event.respondWith(
        caches.match(event.request).then((response) => {
          return (
            response ||
            fetch(event.request).then((networkResponse) => {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            })
          );
        })
      );
    }
  } else {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  }
});
