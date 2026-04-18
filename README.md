# 1×1 FC — Champions League 2025/26

Ein browserbasiertes Fußball-Lernspiel: Führe den FC Bayern durch eine komplette Saison. Bei jedem Torschuss entscheidet eine 1×1-Aufgabe.

Läuft als **PWA** — nach der Installation auf dem iPad-Homescreen auch offline spielbar.

---

## 🚀 Auf GitHub Pages deployen

1. **Repo erstellen**
   ```bash
   # In diesem Ordner
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<DEIN-USER>/1x1-fc.git
   git push -u origin main
   ```

2. **GitHub Pages aktivieren**
   - Repo öffnen → **Settings** → **Pages**
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)`
   - Save

3. **Warten (~1 Min)** — Pages gibt dir danach eine URL:
   `https://<dein-user>.github.io/1x1-fc/`

---

## 📱 Auf dem iPad installieren

1. URL in **Safari** öffnen (kein anderer Browser!)
2. **Teilen-Button** (Quadrat mit Pfeil) antippen
3. **Zum Home-Bildschirm** wählen
4. Icon erscheint auf dem iPad-Homescreen
5. Antippen → startet im Vollbild, ohne Browser-Chrome

Nach dem ersten Laden ist das Spiel **offline spielbar** (Service Worker cached alle Assets).

---

## 🗂 Projekt-Struktur

```
index.html            ← App-Entry (ex "1x1 FC.html")
manifest.webmanifest  ← PWA-Manifest
sw.js                 ← Service Worker (Offline-Cache)
assets/
  cards/              ← FUT-Spielerkarten (21 PNGs)
  icon-*.png          ← App-Icons
data/
  squad.js            ← FC-Bayern-Kader
  season.js           ← Saisonplan
  league_teams.js     ← Gegner (CL-Ligaphase)
engine/
  math.js, season.js, league_table.js
ui/
  common.jsx, menu.jsx, lineup.jsx,
  duel.jsx, controls.jsx, gameplay.jsx
```

---

## 🔄 Updates deployen

```bash
git add .
git commit -m "…"
git push
```

Der Service Worker holt neue Versionen beim nächsten Start automatisch. Bei größeren Änderungen die Version in `sw.js` bumpen (`CACHE = '1x1fc-v1'` → `v2`), damit der alte Cache verworfen wird.

---

## 🛠 Lokal testen

Einfach `index.html` in Safari öffnen — **oder** wegen des Service Workers besser über einen lokalen Server:

```bash
# Python
python3 -m http.server 8000

# Node
npx http-server -p 8000
```

Dann `http://localhost:8000`.
