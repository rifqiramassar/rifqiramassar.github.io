// const CACHE_NAME = "football-v1";
// var urlsToCache = [
//   "/",
//   "/nav.html",
//   "/index.html",
//   "/standings.html", -
//   "/pages/competitions.html", -
//   "/pages/detail.html", *
//   "/pages/contact.html",
//   "/pages/saved.html", -
//   "/pages/serial.html", *
//   "/css/materialize.css", 
//   "/css/style.css",
//   "/js/materialize.js",
//   "/js/api.js", 
//   "/js/nav.js",
//   "/js/db.js",
//   "/js/idb.js",
//   "/js/jquery-2.1.1.min.js",
//   "/js/custom.js",
//   "/icon-512x512.png",
//   "/icon-192x192.png",
//   "/manifest.json",
//   "https://fonts.googleapis.com/icon?family=Material+Icons",
//   "https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js"
// ];

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([{
    url: '/',
    revision: '1'
  },
  {
    url: '/index.html',
    revision: '1'
  },
  {
    url: '/pages/saved.html',
    revision: '1'
  },
  {
    url: '/pages/competitions.html',
    revision: '1'
  },
  {
    url: '/pages/contact.html',
    revision: '1'
  },
  {
    url: '/standings.html',
    revision: '1'
  },
  {
    url: '/nav.html',
    revision: '1'
  },
  {
    url: '/css/materialize.css',
    revision: '1'
  },
  {
    url: '/css/style.css',
    revision: '1'
  },
  {
    url: '/js/jquery-2.1.1.min.js',
    revision: '1'
  },
  {
    url: '/js/idb.js',
    revision: '1'
  },
  {
    url: '/js/db.js',
    revision: '1'
  },
  {
    url: '/js/script.js',
    revision: '1'
  },
  {
    url: '/js/nav.js',
    revision: '1'
  },
  {
    url: '/js/api.js',
    revision: '1'
  },
  {
    url: '/js/materialize.js',
    revision: '1'
  },
  {
    url: '/icon-512x512.png',
    revision: '1'
  },
  {
    url: '/icon-192x192.png',
    revision: '1'
  },
  {
    url: '/manifest.json',
    revision: '1'
  },
], {
  ignoreURLParametersMatching: [/.*/]
});


workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
  }),
);

// Menyimpan cache dari CSS Google Fonts
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/icon\?family=Material+Icons/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Menyimpan cache dari CSS Google Fonts
workbox.routing.registerRoute(
  /^https:\/\/unpkg\.com\/snarkdown@1.0.2\/dist\/snarkdown.umd.js/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'snarkdown',
  })
);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'api-football-data.org',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
      }),
    ],
  })
)



// self.addEventListener("install", function (event) {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(function (cache) {
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// self.addEventListener("fetch", function (event) {
//   var base_url = "https://api.football-data.org/";

//   if (event.request.url.indexOf(base_url) > -1) {
//     event.respondWith(
//       caches.open(CACHE_NAME).then(function (cache) {
//         return fetch(event.request).then(function (response) {
//           cache.put(event.request.url, response.clone());
//           return response;
//         });
//       })
//     );
//   } else {
//     event.respondWith(
//       caches
//       .match(event.request, {
//         ignoreSearch: true
//       })
//       .then(function (response) {
//         return response || fetch(event.request);
//       })
//     );
//   }
// });

// self.addEventListener("activate", function (event) {
//   event.waitUntil(
//     caches.keys().then(function (cacheNames) {
//       return Promise.all(
//         cacheNames.map(function (cacheName) {
//           if (cacheName != CACHE_NAME) {
//             console.log("ServiceWorker: cache " + cacheName + " dihapus");
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

self.addEventListener('push', function (event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});