// StudyFlow / Love Space Offline Service Worker (v2.6)
const CACHE_NAME = 'studyflow-cache-v2.6';
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/peerjs.min.js',
    '/lame.min.js',
    '/manifest.json',
    '/stickers/cats/cat_mochi_hug.gif',
    '/stickers/cats/cat_love_hearts.gif',
    '/stickers/cats/cat_cuddle.gif',
    '/stickers/cats/cat_heart_eyes.gif',
    '/stickers/cats/cat_peck_kiss.gif',
    '/stickers/cats/cat_cheek_kiss.gif',
    '/stickers/cats/cat_cute_roll.gif',
    '/stickers/cats/cat_happy_dance.gif',
    '/stickers/love/love_blowing_kiss.gif',
    '/stickers/love/love_you_forever.gif',
    '/stickers/love/love_warm_cuddle.gif',
    '/stickers/love/love_heart_pop.gif',
    '/stickers/love/love_sparkle.gif',
    '/stickers/love/love_couple_blanket.gif',
    '/stickers/bears/bear_hug.gif',
    '/stickers/bears/bear_pouty.gif',
    '/stickers/bears/bear_cuddle.gif',
    '/stickers/bears/bear_dance.gif'
];

// Install: Cache critical assets individually so failure of one does not break the rest
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            for (const asset of PRECACHE_ASSETS) {
                try {
                    await cache.add(asset);
                } catch (err) {
                    console.warn('Pre-cache asset warning for:', asset, err.message);
                }
            }
        })
    );
});

// Activate: Delete old caches and take control of all clients immediately
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

// Fetch: Autonomous Offline Routing
self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);

    // 1. NEVER cache serverless API routes (Telegram / verify / schedule / photos)
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // 2. Only intercept same-origin requests! Let external third-party requests pass through naturally to avoid ERR_FAILED
    if (url.origin !== self.location.origin) {
        return;
    }

    // 3. Only intercept GET requests
    if (req.method !== 'GET') {
        return;
    }

    // 4. Navigation Requests (Address bar typing: gfd-eta.vercel.app, reloads, page navigation)
    if (req.mode === 'navigate' || req.destination === 'document') {
        event.respondWith(
            fetch(req)
                .then((networkRes) => {
                    if (networkRes && networkRes.status === 200) {
                        const resClone = networkRes.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put('/index.html', resClone.clone());
                            cache.put('/', resClone);
                        });
                    }
                    return networkRes;
                })
                .catch(async () => {
                    // Device is OFFLINE: Serve cached index.html
                    const cachedHtml = await caches.match('/index.html') 
                                    || await caches.match('/')
                                    || await caches.match(req, { ignoreSearch: true });
                    if (cachedHtml) {
                        return cachedHtml;
                    }
                    return new Response(
                        '<!DOCTYPE html><html><body style="font-family:sans-serif; text-align:center; padding:3rem 1rem;"><h2>StudyFlow Offline</h2><p>Please open the website once with internet enabled to download offline resources.</p></body></html>',
                        { status: 503, headers: { 'Content-Type': 'text/html' } }
                    );
                })
        );
        return;
    }

    // 5. Static Assets (CSS, JS, Fonts, Local Stickers, Icons)
    // Stale-While-Revalidate: Return cached version immediately (works 100% offline), update in background if online
    event.respondWith(
        caches.match(req, { ignoreSearch: true }).then((cachedRes) => {
            if (cachedRes) {
                // Fetch update in background if online
                fetch(req).then((networkRes) => {
                    if (networkRes && networkRes.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes));
                    }
                }).catch(() => {});
                return cachedRes;
            }

            // Not yet in cache - fetch from network and store in cache
            return fetch(req).then((networkRes) => {
                if (networkRes && networkRes.status === 200) {
                    const resClone = networkRes.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
                }
                return networkRes;
            }).catch(async () => {
                // Offline fallback for script/style/stickers
                const fallback = await caches.match(req, { ignoreSearch: true });
                if (fallback) return fallback;
                return new Response('', { status: 408, statusText: 'Request timed out or offline' });
            });
        })
    );
});
