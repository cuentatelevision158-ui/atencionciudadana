// Service worker: deja la app instalable y abre rápido (solo guarda los archivos de la app, NUNCA los datos de Supabase)
const VER = 'ac-movil-v1';
const ARCHIVOS = ['./index.html', './config.js', './manifest.webmanifest', './icono.svg', './icono-192.png', './icono-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VER).then(c => Promise.allSettled(ARCHIVOS.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return; // Supabase, CDN y demás: directo a la red
  // Se sirve lo guardado y se actualiza en segundo plano (la versión nueva se ve en la siguiente apertura)
  e.respondWith(caches.open(VER).then(async c => {
    const guardado = await c.match(e.request, { ignoreSearch: true });
    const red = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => null);
    return guardado || (await red) || (await c.match('./index.html'));
  }));
});
