# 1×1 FC — Technische Dokumentation

## Projektübersicht

**1×1 FC** ist ein browserbasiertes Lernspiel (PWA), das Einmaleins-Training mit Fußball-Gameplay verbindet. Spieler wählen einen von drei Top-Vereinen (FC Bayern München, Liverpool FC, Real Madrid) und führen ihn durch eine komplette Saison in verschiedenen Wettbewerben — jeder Torschuss erfordert das Lösen einer Mathe-Aufgabe.

- **Sprache:** Deutsch (UI, Dokumentation, alle Inhalte)
- **Plattform:** Cross-Platform PWA, optimiert für iPad als Standalone-App
- **Zielgruppe:** Grundschulkinder zum Üben des kleinen Einmaleins

### Spielbare Teams & Wettbewerbe

| Team | Liga | Pokal | Champions League |
|------|------|-------|------------------|
| FC Bayern München | Bundesliga (34 Spiele) | DFB-Pokal (6 Spiele) | CL (13 Spiele) |
| Liverpool FC | Premier League (38 Spiele) | FA Cup (6 Spiele) | CL (13 Spiele) |
| Real Madrid CF | La Liga (38 Spiele) | Copa del Rey (5 Spiele) | CL (13 Spiele) |

---

## Tech Stack

| Komponente | Technologie |
|------------|-------------|
| Frontend | React 18.3.1 (CDN/UMD via unpkg) |
| Transpiler | Babel 7.29.0 (standalone, läuft im Browser) |
| Styling | Inline Styles + CSS (kein Framework) |
| Offline | Service Worker (stale-while-revalidate) |
| Storage | localStorage (Spielstand + Lernprofil) |
| Fonts | Google Fonts (Archivo Black, Inter) |
| Build | **Keiner** — reine statische Dateien |

---

## Projektstruktur

```
1x1-fc/
├── index.html              # PWA Entry Point + App Shell
├── manifest.webmanifest    # PWA Manifest (Icons, Theme)
├── sw.js                   # Service Worker (Caching)
├── README.md               # Deploy-Anleitung
├── CLAUDE.md               # Diese Datei
│
├── assets/
│   ├── cards/              # 21 Spielerkarten (PNG, FUT-Style)
│   ├── icon-192.png        # PWA Icon
│   ├── icon-512.png        # PWA Icon
│   ├── icon-maskable-512.png
│   ├── apple-touch-icon.png
│   └── favicon.png
│
├── data/
│   ├── teams.js            # Team-Definitionen + Wettbewerbe
│   ├── badges.js           # TheSportsDB Wappen-URLs (80+ Teams)
│   ├── squad.js            # FC Bayern Kader (21 Spieler)
│   ├── squad_liverpool.js  # Liverpool FC Kader (22 Spieler)
│   ├── squad_realmadrid.js # Real Madrid Kader (22 Spieler)
│   ├── season.js           # CL 2025/26 Spielplan (Legacy)
│   ├── league_teams.js     # Alle 36 CL Teams + Farben
│   └── seasons/            # Saison-Daten pro Team & Wettbewerb
│       ├── bayern_bundesliga.js
│       ├── bayern_dfbpokal.js
│       ├── bayern_cl.js
│       ├── liverpool_premierleague.js
│       ├── liverpool_facup.js
│       ├── liverpool_cl.js
│       ├── realmadrid_laliga.js
│       ├── realmadrid_copadelrey.js
│       └── realmadrid_cl.js
│
├── engine/
│   ├── math.js             # Adaptiver Lern-Algorithmus
│   ├── season.js           # Saison-Fortschritt (localStorage)
│   └── league_table.js     # Deterministische Tabellen-Simulation
│
└── ui/
    ├── common.jsx          # Shared Components (PlayerChip, BigButton)
    ├── team_select.jsx     # Team-Auswahl Screen (NEU)
    ├── competition_select.jsx # Wettbewerb-Auswahl Screen (NEU)
    ├── menu.jsx            # Hauptmenü + Saison-Übersicht
    ├── lineup.jsx          # Aufstellungs-Auswahl
    ├── duel.jsx            # 1×1 Puzzle-Overlay
    ├── controls.jsx        # Touch Controls + Numpad
    ├── gameplay.jsx        # Match-Engine mit Physik
    └── learn.jsx           # Lernfortschritt-Dashboard
```

---

## Architektur

### App-Routing (index.html)

Die App verwendet einen simplen State-basierten Router:

```javascript
const [screen, setScreen] = useState('teamSelect');
// Screens: 'teamSelect' | 'competitionSelect' | 'menu' | 'lineup' | 'match' | 'learn'

const [selectedTeam, setSelectedTeam] = useState(null);      // 'bayern' | 'liverpool' | 'realmadrid'
const [selectedCompetition, setSelectedCompetition] = useState(null); // 'cl' | 'bundesliga' | etc.
```

**User Flow:**
1. Team-Auswahl (3 Vereine zur Auswahl)
2. Wettbewerb-Auswahl (Liga, Pokal, Champions League)
3. Hauptmenü mit Saison-Fortschritt
4. Aufstellung → Match → Ergebnis

Kein React Router — alles in einer `App`-Komponente mit konditionellem Rendering.

### Datenfluss

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  data/*.js  │────▶│  engine/*.js │────▶│  ui/*.jsx   │
│  (statisch) │     │ (Logik+State)│     │ (Rendering) │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ localStorage │
                    │ (Persistenz) │
                    └─────────────┘
```

---

## Kernmodule

### 1. Lern-Engine (`engine/math.js`)

**Zweck:** Adaptives 1×1-Training mit Schwäche-Erkennung

**localStorage Key:** `mathfc_profile_v1`

**Profil-Struktur:**
```javascript
{
  "3×7": {
    attempts: 12,      // Gesamtversuche
    correct: 9,        // Richtige Antworten
    avgMs: 3200,       // Durchschnittliche Antwortzeit (ms)
    lastWrong: false   // Letzter Versuch falsch?
  },
  // ... für alle 100 Aufgaben (1×1 bis 10×10)
}
```

**Schwäche-Score Algorithmus:**
```javascript
score = (1 - accuracy) * 1.2      // Fehlerquote gewichtet
      + attemptPenalty            // Wenig geübte Aufgaben
      + speedPenalty              // Langsame Antworten
      + lastWrongBonus            // Kürzlich falsch = priorisiert
```

**Wichtige Funktionen:**
- `MathEngine.pickTask(difficulty)` — Wählt nächste Aufgabe nach Schwäche
- `MathEngine.record(a, b, correct, ms)` — Speichert Ergebnis
- `MathEngine.getProfile()` — Lädt komplettes Profil
- `MathEngine.getWeakestTasks(n)` — Top-n Schwächen
- `MathEngine.resetProfile()` — Profil zurücksetzen

### 2. Saison-Engine (`engine/season.js`)

**Zweck:** Spielstand-Persistenz

**localStorage Key:** `mathfc_season_v1`

**Gespeicherte Daten:**
```javascript
{
  teamId: 'bayern',          // Gewähltes Team
  competitionId: 'cl',       // Gewählter Wettbewerb
  currentMatchIdx: 5,        // Aktuelles Spiel (0-based)
  results: [                 // Ergebnisse
    { idx: 0, myScore: 2, oppScore: 1, outcome: 'W' },
    ...
  ],
  lineup: [0,1,3,5,...],     // Ausgewählte Spieler-Indices
  difficulty: 'medium',
  lastSavedAt: 1713456000000
}
```

### 3. Tabellen-Simulator (`engine/league_table.js`)

**Zweck:** Realistische CL-Tabelle simulieren

- Deterministischer RNG (mulberry32) für reproduzierbare Ergebnisse
- Poisson-Verteilung für Tor-Vorhersage basierend auf Team-Stärke
- Unabhängig von Spieler-Ergebnissen (Gegner-Spiele simuliert)

### 4. Match-Engine (`ui/gameplay.jsx`)

**Zweck:** Echtzeit-Fußball-Simulation

**Features:**
- 22 Spieler + Ball in 2D-Raum (0-100 × 0-100)
- Velocity-Vektoren, Beschleunigung, Kollisionserkennung
- Ballbesitz-Logik
- Duel-Trigger bei Spieler/Ball-Kontakt
- 5-Minuten-Spiele mit Halbzeit

**Match-Phasen:**
```javascript
phase: 'kickoff' | 'play' | 'duel' | 'goal' | 'halftime' | 'end'
```

---

## UI-Komponenten

### Globale Komponenten (`ui/common.jsx`)

```javascript
// Spieler-Chip mit Trikotnummer
<PlayerChip player={player} size={48} />

// Großer Button (primär/sekundär)
<BigButton onClick={fn} secondary={false}>TEXT</BigButton>

// Initialen-Avatar
<Initials name="Thomas Müller" size={32} bg="#DC0817" />

// Section Header
<SectionHead title="Aufstellung" />
```

### Screens

| Screen | Datei | Beschreibung |
|--------|-------|--------------|
| TeamSelect | `ui/team_select.jsx` | Team-Auswahl (Bayern, Liverpool, Real) |
| CompetitionSelect | `ui/competition_select.jsx` | Wettbewerb-Auswahl |
| Menu | `ui/menu.jsx` | Hauptmenü, Saison-Bracket, KPI-Dashboard |
| Lineup | `ui/lineup.jsx` | Formation + Spieler-Auswahl |
| Match | `ui/gameplay.jsx` | Echtzeit-Spiel mit Physik |
| Learn | `ui/learn.jsx` | Lernfortschritt-Analytics |

---

## Schwierigkeitsgrade

```javascript
const DIFFICULTIES = {
  easy:   { label: 'Leicht',  time: Infinity, range: [1,5]  },
  medium: { label: 'Mittel',  time: 20000,    range: [1,10] },
  hard:   { label: 'Schwer',  time: 3000,     range: [1,10] }
};
```

- **Leicht:** Nur 1-5er Reihen, unbegrenzte Zeit
- **Mittel:** Alle Reihen, 20 Sekunden pro Aufgabe
- **Schwer:** Alle Reihen, 3 Sekunden pro Aufgabe

---

## Design System

### Farben

```javascript
const COLORS = {
  navy:      '#0A1E3F',  // FCB Blau, Text
  red:       '#DC0817',  // FCB Rot, Akzente
  gold:      '#FFB800',  // Highlights
  lightGray: '#F4F5F8',  // Hintergrund
  green:     '#22C55E',  // Erfolg
  amber:     '#F59E0B',  // Warnung
};
```

### Typografie

- **Headings:** Archivo Black (fett, markant)
- **Body:** Inter (lesbar, modern)
- **Letter-Spacing:** 0.5–3px für Betonung

### Button-Stil

```javascript
{
  border: '3px solid #0A1E3F',
  borderRadius: 12,
  boxShadow: '0 4px 0 #0A1E3F',  // 3D-Effekt
  fontWeight: 800,
  letterSpacing: 1
}
```

---

## PWA & Offline

### Service Worker (`sw.js`)

**Cache-Version:** `1x1fc-v4`

**Strategie:** Stale-While-Revalidate
1. Sofort aus Cache liefern
2. Im Hintergrund aktualisieren
3. Bei nächstem Besuch neue Version

**Gecachte Assets:**
- Alle lokalen Dateien (HTML, JS, JSX, Bilder)
- CDN-Dependencies (React, Babel, Fonts)

**Cache-Busting:** Version in `sw.js` hochzählen:
```javascript
const CACHE = '1x1fc-v4';  // war v3
```

### iOS-Optimierungen

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="viewport" content="..., viewport-fit=cover">
```

---

## Deployment

### GitHub Pages

```bash
# 1. Repo erstellen + pushen
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<user>/1x1-fc.git
git push -u origin main

# 2. GitHub Settings → Pages → Branch: main, Folder: / (root)

# 3. Nach ~1 Min verfügbar unter:
https://<user>.github.io/1x1-fc/
```

### Lokales Testen

```bash
# HTTP-Server (für Service Worker)
python3 -m http.server 8000
# oder
npx http-server -p 8000
```

---

## Entwicklung

### Dateien bearbeiten

Keine Build-Tools nötig — Dateien direkt editieren und Browser refreshen.

### Babel-Transpilation

JSX wird **im Browser** transpiliert via `@babel/standalone`:
```html
<script type="text/babel" src="ui/menu.jsx"></script>
```

### Debug-Modus

In `index.html` gibt es ein `TWEAKS`-Objekt:
```javascript
const TWEAKS = {
  accentColor: '#DC0817',
  showNumpad: true,
  difficultyRange: [1, 10],
  debug: false
};
```

### Neue Screens hinzufügen

1. **JSX erstellen:** `ui/neuer-screen.jsx`
2. **In index.html einbinden:**
   ```html
   <script type="text/babel" src="ui/neuer-screen.jsx"></script>
   ```
3. **Im App-Router registrieren:**
   ```javascript
   {screen === 'neuer-screen' && <NeuerScreen onBack={() => setScreen('menu')} />}
   ```
4. **In sw.js Cache-Liste aufnehmen:**
   ```javascript
   '/ui/neuer-screen.jsx',
   ```
5. **Cache-Version hochzählen**

---

## Datenmodelle

### Spieler (`data/squad.js`)

```javascript
{
  id: 1,
  name: 'Manuel Neuer',
  position: 'GK',        // GK | DEF | MID | FWD
  number: 1,             // Trikotnummer
  rating: 89,            // Gesamtstärke
  pace: 45,
  shooting: 35,
  passing: 88,
  dribbling: 55,
  defending: 35,
  physical: 78,
  cardImage: 'assets/cards/neuer.png'
}
```

### Spiel (`data/season.js`)

```javascript
{
  opponent: 'Real Madrid',
  home: true,               // Heim oder Auswärts
  phase: 'league',          // league | r16 | qf | sf | final
  leg: 1,                   // Hin-/Rückspiel
  date: '2025-09-17'
}
```

### Team (`data/league_teams.js`)

```javascript
{
  name: 'Real Madrid',
  shortName: 'RMA',
  primaryColor: '#FFFFFF',
  secondaryColor: '#00529F',
  skill: 92                 // Für Simulation
}
```

---

## Bekannte Einschränkungen

1. **Kein Build-System:** Babel läuft im Browser — langsamer Start auf schwachen Geräten
2. **Keine Tests:** Manuelles Testen erforderlich
3. **Nur localStorage:** Kein Cloud-Sync, Daten gerätegebunden
4. **Keine i18n:** Nur Deutsch, Texte hardcoded

---

## Häufige Aufgaben

### Spieler hinzufügen
1. Bild in `assets/cards/` ablegen
2. Eintrag in `data/squad.js` hinzufügen
3. Cache-Version in `sw.js` hochzählen

### Neue Saison/Teams
1. `data/season.js` anpassen (Spielplan)
2. `data/league_teams.js` anpassen (Teams)
3. Cache-Version hochzählen

### Lern-Algorithmus anpassen
→ `engine/math.js`, Funktion `pickTask()` und `getWeakestTasks()`

### UI-Farben ändern
→ `index.html`, Konstante `COLORS` im App-Scope

---

## Team-Badges (TheSportsDB)

### Datenquelle

Alle Vereinswappen werden von [TheSportsDB](https://www.thesportsdb.com) geladen.

**CDN-Basis:** `https://r2.thesportsdb.com/images/media/team/badge/`

**Größen-Varianten:**
- Original: `[badge-url].png`
- Klein (250px): `[badge-url].png/small`
- Winzig (50px): `[badge-url].png/tiny`

### Integration (`data/badges.js`)

```javascript
// Badge-URL abrufen
const badgeUrl = window.TEAM_BADGES['FCB'];  // Bayern München

// Mit Größe
const smallBadge = window.getBadgeUrl('FCB', 'small');

// Fallback-sicher
const badge = window.getTeamBadge('XYZ');  // null wenn nicht vorhanden
```

### Verfügbare Teams

| Liga | Anzahl Teams |
|------|-------------|
| Bundesliga | 18 |
| Premier League | 20 |
| La Liga | 20 |
| Champions League | 20+ |
| DFB-Pokal | 3 |
| FA Cup | 1 |
| Copa del Rey | 2 |

### Verwendung in UI

**Team-Auswahl (`ui/team_select.jsx`):**
```javascript
{team.badge ? (
  <img src={team.badge} alt={team.shortName} />
) : (
  <span>{getInitials(team.name)}</span>
)}
```

**Gegner-Wappen (`ui/menu.jsx`):**
```javascript
const oppBadge = window.TEAM_BADGES[match.oppShort];
{oppBadge && <img src={oppBadge} alt={match.opponent} />}
```

---

## Kontakt & Quellen

- **Deployment:** GitHub Pages
- **Fonts:** Google Fonts (Archivo Black, Inter)
- **Icons:** Selbst generiert (FCB-Stil)
- **Badges:** TheSportsDB (thesportsdb.com)
- **React:** unpkg CDN (18.3.1)
