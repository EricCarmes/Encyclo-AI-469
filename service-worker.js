const CACHE_NAME = "Smartbook-v2"; // bump pour forcer la mise à jour
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./Smartbook.html",
  "./lecteur.html",
  "./manifest.json",
  "./logo-icon-192.png",
  "./logo-icon-512.png",
  "./Couverture_resized.jpg",
  "./PLANCHE-1a.jpg",
  "./Logo_resized.jpg",
  "./lecteur.js",
  "./style.css"
];

// 📦 INSTALLATION : mise en cache initiale (robuste aux fichiers manquants)
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        URLS_TO_CACHE.map(async (url) => {
          try { await cache.add(url); }
          catch (e) { console.warn("[SW] Skip cache (missing?):", url, e); }
        })
      );
    })()
  );
  self.skipWaiting();
});

// 🧹 ACTIVATION : nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// 🌍 FETCH : cache d’abord, sinon réseau
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
