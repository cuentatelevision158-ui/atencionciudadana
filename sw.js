// Service worker: deja la app instalable y disponible si se va el internet.
// Primero pide SIEMPRE la versión más nueva a la red (así lo que subes a GitHub se ve de inmediato);
// solo si no hay internet usa la copia guardada. Nunca guarda datos de Supabase.
const VER = 'ac-movil-v2';
const ARCHIVOS = ['./index.html', './config.js', './manifest.webmanifest', './icono.svg', './icono-192.png', './icono-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => Promise.allSettled(ARCHIVOS.map(u => fetch(u, { cache: 'reload' }).then(r => r.ok && c.put(u, r))))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return; // Supabase, CDN y demás: directo a la red
  e.respondWith((async () => {
    const c = await caches.open(VER);
    try {
      const r = await fetch(u.href, { cache: 'no-store' });          // red primero (sin la caché de 10 min de GitHub Pages)
      if (r.ok) c.put(e.request, r.clone());
      return r;
    } catch (err) {
      return (await c.match(e.request, { ignoreSearch: true })) || (await c.match('./index.html'));
    }
  })());
});
