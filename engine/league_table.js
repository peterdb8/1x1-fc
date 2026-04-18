// Berechnet die komplette Ligaphasen-Tabelle (alle 36 Teams).
// FCB-Ergebnisse stammen aus SeasonStore, alle anderen werden deterministisch simuliert.
window.LeagueTable = (function() {

  // Deterministischer Zufall (mulberry32)
  function rng(seed) {
    return function() {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // Skill-Diff → (myGoals, oppGoals); Skill in 0..1
  function simulate(homeSkill, awaySkill, rand) {
    const diff = homeSkill - awaySkill + 0.08; // leichter Heimvorteil
    const base = 1.35 + diff * 1.2;
    const hg = poisson(Math.max(0.2, base), rand);
    const ag = poisson(Math.max(0.2, 1.35 - diff * 1.0 - 0.08), rand);
    return { hg, ag };
  }
  function poisson(lambda, rand) {
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= rand(); } while (p > L);
    return Math.min(6, k - 1);
  }

  // Paarungen für alle 8 Spieltage der Ligaphase.
  // Vereinfachung: die 8 FCB-Gegner sind fest (aus data/season.js), der Rest wird deterministisch gematcht.
  // Ligaphase: jedes Team spielt 8 Partien, 4 Heim / 4 Auswärts. Wir generieren pro Spieltag 18 Paarungen.
  function buildSchedule() {
    const teams = window.CL_LEAGUE_TEAMS;
    const season = window.CL_SEASON;
    const fcbIdx = teams.findIndex(t => t.short === "FCB");

    // FCB-Matches pro Spieltag (aus season.js)
    const fcbMatches = season.filter(m => m.round === "Ligaphase").map((m, i) => {
      const oppIdx = teams.findIndex(t => t.short === m.oppShort);
      return { md: i, fcbIdx, oppIdx, fcbHome: m.home };
    });

    // Für jeden Spieltag: füge FCB-Paarung hinzu; restliche 34 Teams deterministisch runden-weise paaren
    const matchdays = [];
    const rand = rng(0xFCB7F00D);
    for (let md = 0; md < 8; md++) {
      const used = new Set([fcbIdx, fcbMatches[md].oppIdx]);
      const pool = [];
      for (let i = 0; i < teams.length; i++) if (!used.has(i)) pool.push(i);
      // Shuffle Pool (deterministisch pro md)
      const r2 = rng(0xABCDEF00 + md);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(r2() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      const fixtures = [];
      // FCB-Match
      const fm = fcbMatches[md];
      fixtures.push(fm.fcbHome
        ? { homeIdx: fm.fcbIdx, awayIdx: fm.oppIdx, isFCB: true, md }
        : { homeIdx: fm.oppIdx, awayIdx: fm.fcbIdx, isFCB: true, md }
      );
      for (let i = 0; i < pool.length; i += 2) {
        fixtures.push({ homeIdx: pool[i], awayIdx: pool[i + 1], isFCB: false, md });
      }
      matchdays.push(fixtures);
    }
    return matchdays;
  }

  // Berechne alle Ergebnisse. FCB-Matches aus SeasonStore, Rest deterministisch.
  function computeTable(seasonState) {
    const teams = window.CL_LEAGUE_TEAMS;
    const schedule = buildSchedule();
    const fcbIdx = teams.findIndex(t => t.short === "FCB");

    // Init Stats
    const rows = teams.map((t, i) => ({
      idx: i, team: t,
      played: 0, w: 0, d: 0, l: 0,
      gf: 0, ga: 0, gd: 0, pts: 0,
      form: [], // W/D/L letzte 5
    }));

    // Wie viele FCB-Ligaphase-Spiele wurden gespielt?
    const playedLigaphase = seasonState.results.filter(r => r.idx < 8).length;

    for (let md = 0; md < 8; md++) {
      const rand = rng(0xC0FFEE + md * 7919);
      for (const fx of schedule[md]) {
        let hg, ag;
        if (fx.isFCB) {
          // FCB-Match: nur einbeziehen, wenn tatsächlich gespielt
          const fcbResult = seasonState.results.find(r => r.idx === md);
          if (!fcbResult) continue;
          const fcbIsHome = fx.homeIdx === fcbIdx;
          hg = fcbIsHome ? fcbResult.myScore : fcbResult.oppScore;
          ag = fcbIsHome ? fcbResult.oppScore : fcbResult.myScore;
        } else {
          // Nicht-FCB-Match: deterministisch simulieren, aber nur bis zum aktuellen Spieltag
          if (md >= playedLigaphase) continue;
          const sim = simulate(teams[fx.homeIdx].skill, teams[fx.awayIdx].skill, rand);
          hg = sim.hg; ag = sim.ag;
        }
        // Stats updaten
        const h = rows[fx.homeIdx], a = rows[fx.awayIdx];
        h.played++; a.played++;
        h.gf += hg; h.ga += ag; a.gf += ag; a.ga += hg;
        if (hg > ag) { h.w++; a.l++; h.pts += 3; h.form.push("W"); a.form.push("L"); }
        else if (hg < ag) { a.w++; h.l++; a.pts += 3; h.form.push("L"); a.form.push("W"); }
        else { h.d++; a.d++; h.pts++; a.pts++; h.form.push("D"); a.form.push("D"); }
      }
    }
    rows.forEach(r => { r.gd = r.gf - r.ga; r.form = r.form.slice(-5); });
    // Sortieren: Punkte → Tordiff → Tore
    rows.sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
    rows.forEach((r, i) => r.position = i + 1);
    return rows;
  }

  return { computeTable };
})();
