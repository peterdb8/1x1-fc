// Adaptive 1×1 Lern-Engine
// Speichert pro Aufgabe (a×b): versuche, richtig, ø-zeit, letzte-aktion
// Wählt Aufgaben bevorzugt aus, die noch nicht gut sitzen.

window.MathEngine = (function() {
  const STORAGE_KEY = "mathfc_profile_v1";

  function loadProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyProfile();
      return JSON.parse(raw);
    } catch { return emptyProfile(); }
  }

  function emptyProfile() {
    const tasks = {};
    for (let a = 1; a <= 10; a++) {
      for (let b = 1; b <= 10; b++) {
        tasks[`${a}x${b}`] = { attempts: 0, correct: 0, avgMs: 0, lastCorrect: null };
      }
    }
    return { tasks, totalAttempts: 0, totalCorrect: 0 };
  }

  function saveProfile(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  // Schwäche-Score: höher = schwächer = häufiger auswählen
  // Faktoren: niedrige Trefferquote, langsame Antwort, wenige Versuche (unsicher), letzter Fehler
  function weaknessScore(task) {
    const acc = task.attempts === 0 ? 0.5 : task.correct / task.attempts;
    const attemptPenalty = Math.max(0, 5 - task.attempts) * 0.08; // noch unsicher → leicht erhöhen
    const accPenalty = (1 - acc) * 1.2;
    const speedPenalty = task.avgMs > 0 ? Math.min(0.6, (task.avgMs - 2000) / 10000) : 0;
    const lastWrongBonus = task.lastCorrect === false ? 0.4 : 0;
    return Math.max(0.05, accPenalty + attemptPenalty + speedPenalty + lastWrongBonus);
  }

  // Wähle nächste Aufgabe nach gewichteter Wahrscheinlichkeit
  function nextTask(profile, opts = {}) {
    const minFactor = opts.minFactor ?? 1;
    const maxFactor = opts.maxFactor ?? 10;
    const candidates = [];
    for (let a = minFactor; a <= maxFactor; a++) {
      for (let b = minFactor; b <= maxFactor; b++) {
        const key = `${a}x${b}`;
        const t = profile.tasks[key] || { attempts: 0, correct: 0, avgMs: 0, lastCorrect: null };
        candidates.push({ a, b, key, task: t, weight: weaknessScore(t) });
      }
    }
    // stochastische Auswahl
    const total = candidates.reduce((s, c) => s + c.weight, 0);
    let r = Math.random() * total;
    for (const c of candidates) {
      r -= c.weight;
      if (r <= 0) return { a: c.a, b: c.b };
    }
    const last = candidates[candidates.length - 1];
    return { a: last.a, b: last.b };
  }

  function recordAnswer(profile, a, b, correct, durationMs) {
    const key = `${a}x${b}`;
    const t = profile.tasks[key] || { attempts: 0, correct: 0, avgMs: 0, lastCorrect: null };
    t.attempts += 1;
    if (correct) t.correct += 1;
    // fortlaufender Mittelwert der Zeit
    t.avgMs = t.attempts === 1 ? durationMs : Math.round((t.avgMs * (t.attempts - 1) + durationMs) / t.attempts);
    t.lastCorrect = correct;
    profile.tasks[key] = t;
    profile.totalAttempts += 1;
    if (correct) profile.totalCorrect += 1;
    saveProfile(profile);
    return profile;
  }

  // Analyse: pro Reihe (1er-10er) Trefferquote
  function rowStats(profile) {
    const rows = [];
    for (let a = 1; a <= 10; a++) {
      let att = 0, cor = 0, totalMs = 0, withTime = 0;
      for (let b = 1; b <= 10; b++) {
        const t = profile.tasks[`${a}x${b}`];
        att += t.attempts;
        cor += t.correct;
        if (t.avgMs > 0) { totalMs += t.avgMs * t.attempts; withTime += t.attempts; }
      }
      rows.push({
        row: a,
        attempts: att,
        correct: cor,
        accuracy: att === 0 ? null : cor / att,
        avgMs: withTime === 0 ? null : Math.round(totalMs / withTime),
      });
    }
    return rows;
  }

  // Fehler-Muster: schwächste 5 Aufgaben
  function weakestTasks(profile, n = 5) {
    const all = [];
    for (const key in profile.tasks) {
      const t = profile.tasks[key];
      if (t.attempts >= 1) {
        all.push({ key, ...t, accuracy: t.correct / t.attempts });
      }
    }
    all.sort((x, y) => {
      // erst Accuracy, dann Geschwindigkeit
      if (x.accuracy !== y.accuracy) return x.accuracy - y.accuracy;
      return y.avgMs - x.avgMs;
    });
    return all.slice(0, n);
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { loadProfile, saveProfile, nextTask, recordAnswer, rowStats, weakestTasks, reset };
})();
