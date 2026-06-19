// Service Worker - Uva & Via PWA.
// Offline de verdade: a persona usa o celular na estrada e algumas vinícolas
// têm sinal fraco (achado da pesquisa de campo). App shell em cache.
// Estratégia: navegação network-first (mostra updates), estáticos cache-first.
// Nunca cacheia /api/* (dinâmico) nem outras origens (CDN de fontes/ícones).

const CACHE = 'uvaevia-v2';
const CORE = [
  './', 'index.html', 'style.css', 'manifest.webmanifest', 'icon.svg',
  'js/data.js', 'js/dados-extra.js', 'js/utils.js', 'js/navegacao.js', 'js/destaques.js',
  'js/roteiro.js', 'js/transporte.js', 'js/mapa.js', 'js/reserva.js', 'js/reservas.js',
  'js/comprovante.js', 'js/avaliacoes.js', 'js/disponibilidade.js', 'js/experiencias.js',
  'js/gestao.js', 'js/favoritos.js', 'js/lembrete.js', 'js/roteiros-prontos.js', 'js/init.js',
  'api-client.js', 'auth-ui.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // add individual com catch: um 404 não derruba o install inteiro.
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // CDN de fontes/FA segue normal
  if (url.pathname.includes('/api/')) return;          // API nunca é cacheada

  // Network-first para TUDO (mesma origem): garante que o app sempre carrega a
  // versão mais nova quando online - sem bug de asset velho após deploy - e cai
  // no cache só quando offline. Trade-off de velocidade irrelevante para o porte.
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
