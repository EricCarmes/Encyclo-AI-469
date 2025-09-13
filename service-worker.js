const CACHE_NAME = "v1";

// ✅ Liste uniquement les fichiers qui existent réellement
const urlsToCache = [
  "./",
  "index.html",
  "manifest.json",
  "Couverture_resized.jpg"
  // Ajoute ici d'autres fichiers UNIQUEMENT s'ils existent dans ton dépôt
];

// 📦 INSTALLATION : mise en cache initiale
self.addEventListener("install", event => {
  console.log("📦 Mise en cache initiale...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error("❌ Échec du cache :", err);
      })
  );
});

// 🧹 ACTIVATION : nettoyage des anciens caches si nécessaire
self.addEventListener("activate", event => {
  console.log("⚙️ Activation du service worker...");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log("🗑️ Suppression du cache :", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// 🌐 FETCH : intercepter les requêtes et répondre depuis le cache
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
