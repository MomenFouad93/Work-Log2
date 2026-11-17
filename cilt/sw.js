/* Offline cache: app shell + machine pictures. Network first, cache fallback. */
const V = "cilt-v2";
importScripts("data/images.js");
const CORE = (self.CILT_IMGS || []).concat(["./", "index.html", "js/lib.js", "js/app.js", "js/i18n_ar.js", "data/machines.js", "manifest.webmanifest", "icon-192.png", "icon-512.png"]);
self.addEventListener("install", e => e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
});
