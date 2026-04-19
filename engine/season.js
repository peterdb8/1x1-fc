// Season-Progress Storage
window.SeasonStore = (function() {
  const KEY = "mathfc_season_v1";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      return JSON.parse(raw);
    } catch { return empty(); }
  }

  function empty() {
    return {
      teamId: null,            // 'bayern' | 'liverpool' | 'realmadrid'
      competitionId: null,     // 'cl' | 'bundesliga' | 'premierleague' | etc.
      currentMatchIdx: 0,      // nächstes zu spielendes Spiel
      results: [],             // { idx, myScore, oppScore, outcome: "W"|"D"|"L" }
      lineup: [],              // Array of player indices
      difficulty: "medium",    // "easy" | "medium" | "hard"
      lastSavedAt: Date.now(),
    };
  }

  function save(state) {
    state.lastSavedAt = Date.now();
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function reset() {
    localStorage.removeItem(KEY);
  }

  return { load, save, reset, empty };
})();
