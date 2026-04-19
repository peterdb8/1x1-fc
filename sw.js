// 1×1 FC — Service Worker
// Offline-first: cache everything on install, serve cache, update in background.

const CACHE = '1x1fc-v6';

// Alle App-Shell-Assets + Karten + CDN-Abhängigkeiten
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',

  // Data & engine
  'data/teams.js',
  'data/squad.js',
  'data/squad_liverpool.js',
  'data/squad_realmadrid.js',
  'data/season.js',
  'data/league_teams.js',
  'data/badges.js',
  // Bayern seasons
  'data/seasons/bayern_bundesliga.js',
  'data/seasons/bayern_dfbpokal.js',
  'data/seasons/bayern_cl.js',
  // Liverpool seasons
  'data/seasons/liverpool_premierleague.js',
  'data/seasons/liverpool_facup.js',
  'data/seasons/liverpool_cl.js',
  // Real Madrid seasons
  'data/seasons/realmadrid_laliga.js',
  'data/seasons/realmadrid_copadelrey.js',
  'data/seasons/realmadrid_cl.js',
  'engine/math.js',
  'engine/season.js',
  'engine/league_table.js',

  // UI
  'ui/common.jsx',
  'ui/team_select.jsx',
  'ui/competition_select.jsx',
  'ui/menu.jsx',
  'ui/lineup.jsx',
  'ui/duel.jsx',
  'ui/controls.jsx',
  'ui/gameplay.jsx',
  'ui/learn.jsx',

  // Icons
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/icon-maskable-512.png',
  'assets/apple-touch-icon.png',
  'assets/favicon.png',

  // Player Cards
  'assets/cards/Aleksandar_Pavlovic_19789.png',
  'assets/cards/Alphonso_Davies_21671.png',
  'assets/cards/Dayot_Upamecano_21306.png',
  'assets/cards/Harry_Kane_21177.png',
  'assets/cards/Jamal_Musiala_23643.png',
  'assets/cards/Jonas_Urbig_2658.png',
  'assets/cards/Jonathan_Tah_20769.png',
  'assets/cards/Joshua_Kimmich_23120.png',
  'assets/cards/Josip_Stanisic_23792.png',
  'assets/cards/Kim_Min_Jae_23260.png',
  'assets/cards/Konrad_Laimer_23650.png',
  'assets/cards/Lennart_Karl_21595.png',
  'assets/cards/Leon_Goretzka_19326.png',
  'assets/cards/Leon_Klanac_16897.png',
  'assets/cards/Luis_Diaz_23159.png',
  'assets/cards/Manuel_Neuer_23786.png',
  'assets/cards/Michael_Olise_21139.png',
  'assets/cards/Raphael_Guerreiro_20805.png',
  'assets/cards/Serge_Gnabry_23375.png',
  'assets/cards/Sven_Ulreich_21056.png',
  'assets/cards/Tom_Bischof_20844.png',

  // CDN (React + Babel) — damit auch offline spielbar
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Fehler einzelner Assets sollen die Installation nicht abbrechen (CDN kann variieren)
      Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('SW: cache miss', url, err))
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Stale-while-revalidate für alles
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  e.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req).then((res) => {
        // Nur erfolgreiche, nicht-opaque Antworten cachen
        if (res && res.status === 200 && res.type !== 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);

      return cached || networkFetch;
    })
  );
});
