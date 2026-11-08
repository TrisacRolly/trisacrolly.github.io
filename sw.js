const C = 'trisac-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'icon-192.png'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
// rete per prima, così le modifiche arrivano subito; senza rete si usa l'ultima copia salvata
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => { const c = r.clone(); caches.open(C).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./')))
  );
});
