// ============================================================
//  SERVICE WORKER — Happy Birthday, Amma
//  Caches all pages and assets for offline use.
// ============================================================

const CACHE_NAME = 'amma-bday-v3';

const PRECACHE = [
  '/',
  '/index.html',
  '/lobby.html',
  '/memories.html',
  '/questions.html',
  '/videos.html',
  '/cake.html',
  '/photobooth.html',
  '/photo-haul.html',
  '/party-corner.html',
  '/dares.html',
  '/kids-challenge.html',
  '/appa.html',
  '/letter.html',
  '/hug.html',
  '/jd.html',
  '/kolam.html',
  '/garland.html',
  '/time-capsule.html',
  '/wish-sky.html',
  '/then-now.html',
  '/share-card.html',
  '/numbers.html',
  '/answers.html',
  '/manifest.json',
  '/js/config.js',
  '/js/main.js',
  '/css/theme.css',
  '/css/animations.css',
];

// ── Install: precache shell ─────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        PRECACHE.map(url => cache.add(url).catch(() => {/* ignore missing */}))
      );
    })
  );
  self.skipWaiting();
});

// ── Activate: purge old caches ──────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: cache-first for same-origin, network-first for video/audio ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET or cross-origin (e.g. Google Sheets webhook)
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // For large media files — network-first, cache on success
  const isMedia = /\.(mp4|mp3|wav|ogg|webm)$/i.test(url.pathname);
  if (isMedia) {
    event.respondWith(
      fetch(event.request)
        .then(resp => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return resp;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        if (resp && resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return resp;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});
