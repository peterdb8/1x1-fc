// 1×1 FC — Service Worker
// Offline-first: cache everything on install, serve cache, update in background.

const CACHE = '1x1fc-v15';

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
  'engine/cpu_ai.js',

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

  // Player Cards — Bayern München
  'assets/cards/bayern/Aleksandar_Pavlovic_19789.png',
  'assets/cards/bayern/Alphonso_Davies_21671.png',
  'assets/cards/bayern/Dayot_Upamecano_21306.png',
  'assets/cards/bayern/Harry_Kane_21177.png',
  'assets/cards/bayern/Jamal_Musiala_23643.png',
  'assets/cards/bayern/Jonas_Urbig_2658.png',
  'assets/cards/bayern/Jonathan_Tah_20769.png',
  'assets/cards/bayern/Joshua_Kimmich_23120.png',
  'assets/cards/bayern/Josip_Stanisic_23792.png',
  'assets/cards/bayern/Kim_Min_Jae_23260.png',
  'assets/cards/bayern/Konrad_Laimer_23650.png',
  'assets/cards/bayern/Lennart_Karl_21595.png',
  'assets/cards/bayern/Leon_Goretzka_19326.png',
  'assets/cards/bayern/Leon_Klanac_16897.png',
  'assets/cards/bayern/Luis_Diaz_23159.png',
  'assets/cards/bayern/Manuel_Neuer_23786.png',
  'assets/cards/bayern/Michael_Olise_21139.png',
  'assets/cards/bayern/Raphael_Guerreiro_20805.png',
  'assets/cards/bayern/Serge_Gnabry_23375.png',
  'assets/cards/bayern/Sven_Ulreich_21056.png',
  'assets/cards/bayern/Tom_Bischof_20844.png',

  // Player Cards — Liverpool FC
  'assets/cards/liverpool/Alexander_Isak_89.png',
  'assets/cards/liverpool/Alexis_Mac_Allister_91.png',
  'assets/cards/liverpool/Alisson_89.png',
  'assets/cards/liverpool/Andrew_Robertson_86.png',
  'assets/cards/liverpool/Cody_Gakpo_89.png',
  'assets/cards/liverpool/Conor_Bradley_88.png',
  'assets/cards/liverpool/Curtis_Jones_80.png',
  'assets/cards/liverpool/Dominik_Szoboszlai_90.png',
  'assets/cards/liverpool/Federico_Chiesa_86.png',
  'assets/cards/liverpool/Florian_Wirtz_92.png',
  'assets/cards/liverpool/Freddie_Woodman_71.png',
  'assets/cards/liverpool/Giorgi_Mamardashvili_84.png',
  'assets/cards/liverpool/Giovanni_Leoni_69.png',
  'assets/cards/liverpool/Hugo_Ekitiké_90.png',
  'assets/cards/liverpool/Ibrahima_Konaté_89.png',
  'assets/cards/liverpool/Jeremie_Frimpong_90.png',
  'assets/cards/liverpool/Joe_Gomez_87.png',
  'assets/cards/liverpool/Milos_Kerkez_89.png',
  'assets/cards/liverpool/Mohamed_Salah_93.png',
  'assets/cards/liverpool/Ryan_Gravenberch_92.png',
  'assets/cards/liverpool/Virgil_van_Dijk_95.png',
  'assets/cards/liverpool/Wataru_Endo_84.png',

  // Player Cards — Real Madrid CF
  'assets/cards/realmadrid/Andriy_Lunin_81.png',
  'assets/cards/realmadrid/Antonio_Rudiger_91.png',
  'assets/cards/realmadrid/Arda_Guler_93.png',
  'assets/cards/realmadrid/Aurelien_Tchouameni_92.png',
  'assets/cards/realmadrid/Brahim_90.png',
  'assets/cards/realmadrid/Carvajal_89.png',
  'assets/cards/realmadrid/Dani_Ceballos_81.png',
  'assets/cards/realmadrid/David_Alaba_87.png',
  'assets/cards/realmadrid/Dean_Huijsen_91.png',
  'assets/cards/realmadrid/Eduardo_Camavinga_87.png',
  'assets/cards/realmadrid/Federico_Valverde_91.png',
  'assets/cards/realmadrid/Ferland_Mendy_87.png',
  'assets/cards/realmadrid/Fran_García_79.png',
  'assets/cards/realmadrid/Fran_Gonzalez_63.png',
  'assets/cards/realmadrid/Franco_Mastantuono_89.png',
  'assets/cards/realmadrid/Jude_Bellingham_93.png',
  'assets/cards/realmadrid/Kylian_Mbappe_96.png',
  'assets/cards/realmadrid/Rodrygo_89.png',
  'assets/cards/realmadrid/Thibaut_Courtois_90.png',
  'assets/cards/realmadrid/Trent_Alexander-Arnold_90.png',
  'assets/cards/realmadrid/Vini_Jr._92.png',
  'assets/cards/realmadrid/Éder_Militão_88.png',

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
