// Service Worker：アプリ本体をキャッシュしてオフラインでも使えるようにする
const VERSION = 'eiken3-passport-v1';
const CORE = [
  './', './index.html', './manifest.webmanifest', './css/style.css',
  './js/app.js', './js/store.js', './js/srs.js', './js/sound.js', './js/fx.js', './js/ui.js', './js/game.js',
  './js/mascot.js', './js/speech.js', './js/pad.js', './js/letters.js', './js/recognizer.js', './js/spell.js',
  './js/kv.js', './js/ai.js', './js/prompts.js', './js/wcheck.js', './js/scenes.js', './js/bank.js',
  './js/predict.js', './js/question.js',
  './js/screens/home.js', './js/screens/words.js', './js/screens/wordplay.js', './js/screens/drill.js',
  './js/screens/quiz.js', './js/screens/grammar.js', './js/screens/listen.js', './js/screens/write.js',
  './js/screens/interview.js', './js/screens/exam.js', './js/screens/stats.js', './js/screens/settings.js',
  './data/words.js', './data/reading.js', './data/listening.js', './data/writing.js', './data/grammar.js', './data/interview.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION && k !== 'fonts').map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return; // 手書き認識・AI（POST）はそのまま
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(staleWhileRevalidate(req, 'fonts'));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(networkFirst(req));
});

async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  try {
    const res = await Promise.race([
      fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3500)),
    ]);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') return cache.match('./index.html');
    throw new Error('offline');
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const net = fetch(req).then((res) => {
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  }).catch(() => hit);
  return hit || net;
}
