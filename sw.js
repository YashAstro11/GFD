// StudyFlow / Love Space Offline Service Worker
const CACHE_NAME = 'studyflow-cache-v1.1';
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/peerjs.min.js',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('Pre-caching assets warning:', err);
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);

    // Never cache API calls (Vercel serverless / Telegram / file proxy)
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // Only cache GET requests
    if (req.method !== 'GET') {
        return;
    }

    // Network-First with Cache Fallback for HTML, CSS, JS, Fonts & Assets
    event.respondWith(
        fetch(req)
            .then((networkRes) => {
                if (networkRes && networkRes.status === 200) {
                    const resClone = networkRes.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(req, resClone);
                    });
                }
                return networkRes;
            })
            .catch(async () => {
                // Device is offline or server unreachable - serve from cache!
                const cachedRes = await caches.match(req);
                if (cachedRes) {
                    return cachedRes;
                }
                // Fallback for navigation requests
                if (req.mode === 'navigate') {
                    const fallbackHtml = await caches.match('/index.html');
                    if (fallbackHtml) return fallbackHtml;
                }
                return new Response('Offline: Content not cached yet.', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: { 'Content-Type': 'text/plain' }
                });
            })
    );
});
