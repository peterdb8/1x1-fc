// In-Match Gameplay: Top-Down Feld mit echter Bewegung & Ball-Physik
// Alle 22 Spieler bewegen sich. Kontakt mit Gegner (oder Gegner mit Ball) löst 1×1-Zweikampf aus.
// Koordinaten: x = 0..100 (horizontal), y = 0..100 (vertikal, 0 = eigenes Tor links, 100 = gegnerisches rechts)

const MATCH_DURATION_MS = 5 * 60 * 1000; // 5 Min simulierte Spielzeit
const DUEL_TIME = { easy: null, medium: 20000, hard: 3000 };

// Helper
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const norm = (v) => { const l = Math.hypot(v.x, v.y) || 1; return { x: v.x / l, y: v.y / l }; };

// Farbkollisions-Erkennung: Prüft ob zwei Hex-Farben zu ähnlich sind
const hexToHsl = (hex) => {
  const r = parseInt(hex.slice(1,3), 16) / 255;
  const g = parseInt(hex.slice(3,5), 16) / 255;
  const b = parseInt(hex.slice(5,7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const colorsTooSimilar = (color1, color2) => {
  if (!color1 || !color2) return false;
  try {
    const hsl1 = hexToHsl(color1);
    const hsl2 = hexToHsl(color2);
    const hueDiff = Math.min(Math.abs(hsl1.h - hsl2.h), 360 - Math.abs(hsl1.h - hsl2.h));
    // Farben sind zu ähnlich wenn: gleicher Farbton UND ähnliche Helligkeit
    return hueDiff < 30 && Math.abs(hsl1.l - hsl2.l) < 25;
  } catch { return false; }
};

// Gibt eine Alternativfarbe zurück, die nicht mit der Teamfarbe kollidiert
const getContrastColor = (oppColor, teamColor) => {
  if (!colorsTooSimilar(oppColor, teamColor)) return oppColor;
  // Alternativfarben für häufige Kollisionen
  const alternatives = {
    // Rot-Kollisionen → Weiß oder Dunkelblau
    red: "#FFFFFF",
    // Blau-Kollisionen → Weiß
    blue: "#FFFFFF",
    // Allgemeiner Fallback
    default: "#1A1A1A"
  };
  const hsl = hexToHsl(oppColor);
  if (hsl.h < 30 || hsl.h > 330) return alternatives.red; // Rot-Töne
  if (hsl.h > 180 && hsl.h < 260) return alternatives.blue; // Blau-Töne
  return alternatives.default;
};

const Gameplay = ({ match, lineup, squad, team, difficulty, difficultyConfig, onEnd, onBackToMenu }) => {
  const playerByN = Object.fromEntries(squad.map(p => [p.n, p]));
  const formSlots = window.FORMATIONS[lineup.formation];

  // Team-Farben mit Kollisionsvermeidung
  const myColor = team?.colors?.primary || "#DC0817";
  const oppColorRaw = match.color || "#333333";
  const oppColor = getContrastColor(oppColorRaw, myColor);

  // Team badges
  const myBadge = team?.badge || null;
  const myShort = team?.short || "FCB";
  const oppBadge = window.TEAM_BADGES?.[match.oppShort] || null;

  // --- CPU-KI: TeamBrain mit oppSkill aus Match-Daten ---
  // oppSkill aus difficultyConfig extrahieren (basierend auf match.round)
  const roundDifficulty = difficultyConfig?.[match.round] || difficultyConfig?.default || {};
  const oppSkill = roundDifficulty.oppSkill || 0.5;
  const cpuBrainRef = useRef(window.CpuAI ? window.CpuAI.createTeamBrain(oppSkill) : null);
  const lastIntentUpdateRef = useRef(0);
  const oppLastPassRef_AI = useRef(0);
  const oppLastShotRef_AI = useRef(0);

  // --- Game state (React) ---
  const [phase, setPhase] = useState("kickoff"); // kickoff | play | duel | halftime | ended
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MATCH_DURATION_MS);
  const [duel, setDuel] = useState(null);
  const [toast, setToast] = useState(null);
  const [commentary, setCommentary] = useState("Anpfiff! Viel Erfolg!");
  const [duelsWon, setDuelsWon] = useState(0);
  const [duelsTotal, setDuelsTotal] = useState(0);
  const [halftime, setHalftime] = useState(false);

  // --- Game state (refs — für die Sim-Loop, kein Re-render nötig) ---
  const profileRef = useRef(window.MathEngine.loadProfile());
  const keysRef = useRef(new Set());
  const phaseRef = useRef(phase);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  const pitchRef = useRef(null);
  const touchJoyRef = useRef({ x: 0, y: 0 });
  const sprintRef = useRef(false);
  // Refs für Werte die in step() gebraucht werden
  const timeLeftRef = useRef(timeLeft);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  const myScoreRef = useRef(myScore);
  useEffect(() => { myScoreRef.current = myScore; }, [myScore]);
  const oppScoreRef = useRef(oppScore);
  useEffect(() => { oppScoreRef.current = oppScore; }, [oppScore]);

  useEffect(() => {
    document.body.classList.add("in-match");
    return () => document.body.classList.remove("in-match");
  }, []);

  // Orientierung: "home" (wir schiessen nach rechts) ist Konvention
  // myPlayers = 11 Spieler unseres Teams, mit .slotId als Formations-Anker
  // Ihr Heim-Spot ist (slot.x, 100-slot.y*?) – wir bauen horizontales Feld:
  //   Feld-x = slot.y (0 = eigenes Tor links, 100 = Gegnertor rechts)
  //   Feld-y = slot.x (links/rechts auf Feld)
  // Das entspricht unserer alten Lineup-Anzeige, gedreht.

  const myInit = useMemo(() => formSlots.map(s => ({
    id: s.id,
    team: "my",
    role: s.role,
    n: lineup.slots[s.id],
    home: { x: s.y * 0.48, y: s.x }, // x ∈ [0..48] (eigene Hälfte)
    x: s.y * 0.48,
    y: s.x,
    vx: 0, vy: 0,
  })), [lineup, formSlots]);

  const oppInit = useMemo(() => formSlots.map((s, i) => ({
    id: "opp-" + i,
    team: "opp",
    role: s.role,
    n: null,
    home: { x: 100 - s.y * 0.48, y: 100 - s.x },
    x: 100 - s.y * 0.48,
    y: 100 - s.x,
    vx: 0, vy: 0,
  })), [formSlots]);

  const playersRef = useRef([...myInit, ...oppInit]);
  const ballRef = useRef({ x: 50, y: 50, vx: 0, vy: 0, ownerId: null });
  const activeIdRef = useRef(null);

  // Initial: finde Stürmer und gib ihm den Ball
  useEffect(() => {
    const stSlot = formSlots.find(s => s.role === "ST" || s.role === "CAM") || formSlots[10];
    const stId = stSlot.id;
    const p = playersRef.current.find(pp => pp.id === stId);
    if (p) {
      activeIdRef.current = stId;
      ballRef.current = { x: p.x, y: p.y, vx: 0, vy: 0, ownerId: stId };
    }
  }, []);

  // Tick-State für visuelles Update
  const [, setTick] = useState(0);

  // --- Timer (Match-Clock) ---
  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        const nt = t - 100;
        if (nt <= MATCH_DURATION_MS / 2 && !halftime) {
          setHalftime(true);
          setPhase("halftime");
          return nt;
        }
        if (nt <= 0) { setPhase("ended"); return 0; }
        return nt;
      });
    }, 100);
    return () => clearInterval(id);
  }, [phase, halftime]);

  // --- Keyboard ---
  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase();
      keysRef.current.add(k);
      if (phaseRef.current !== "play") return;
      if (k === " " || k === "enter") { e.preventDefault(); doAction("pass"); }
      if (k === "q") doAction("shoot");
      if (k === "e") doAction("throughball");
      if (k === "f") doAction("switch");
      if (k === "x") doAction("tackle");
    };
    const up = (e) => keysRef.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // --- Main Sim Loop ---
  useEffect(() => {
    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(50, now - last) / 1000; // sec, cap gegen Hänger
      last = now;
      if (phaseRef.current === "play") step(dt);
      setTick(t => (t + 1) % 1000000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  function step(dt) {
    const players = playersRef.current;
    const ball = ballRef.current;
    const keys = keysRef.current;
    const now = Date.now();

    // 1) Active Player Input (WASD/Pfeile)
    const active = players.find(p => p.id === activeIdRef.current);
    const PLAYER_SPEED = 14; // % pro sek
    const MATE_SPEED = 10;

    if (active) {
      let ix = 0, iy = 0;
      if (keys.has("d") || keys.has("arrowright")) ix += 1;
      if (keys.has("a") || keys.has("arrowleft"))  ix -= 1;
      if (keys.has("s") || keys.has("arrowdown"))  iy += 1;
      if (keys.has("w") || keys.has("arrowup"))    iy -= 1;
      // Touch-Joystick override
      const j = touchJoyRef.current;
      if (Math.abs(j.x) > 0.05 || Math.abs(j.y) > 0.05) { ix = j.x; iy = j.y; }
      const sprint = sprintRef.current ? 1.35 : 1;
      if (ix || iy) {
        const n = norm({ x: ix, y: iy });
        active.vx = n.x * PLAYER_SPEED * sprint;
        active.vy = n.y * PLAYER_SPEED * sprint;
      } else {
        active.vx *= 0.4; active.vy *= 0.4;
      }
    }

    // 2) AI für alle anderen Spieler
    const owner = players.find(p => p.id === ball.ownerId);
    const weHaveBall = owner && owner.team === "my";
    const cpuHasBall = owner && owner.team === "opp";
    const brain = cpuBrainRef.current;

    // --- CPU TeamBrain Intent Update (alle 500ms) ---
    if (brain && now - lastIntentUpdateRef.current > 500) {
      lastIntentUpdateRef.current = now;
      const currentTimeLeft = timeLeftRef.current;
      const currentMyScore = myScoreRef.current;
      const currentOppScore = oppScoreRef.current;
      const matchMinute = (MATCH_DURATION_MS - currentTimeLeft) / 60000; // 0-5
      brain.hasBall = cpuHasBall;
      brain.scoreDiff = currentOppScore - currentMyScore; // positiv = CPU führt
      brain.matchMinute = matchMinute;

      if (cpuHasBall && now - brain.lastTurnoverAt > 100) {
        // Erster Frame mit Ball nach Ballgewinn
        if (!brain.hasBall) brain.lastTurnoverAt = now;
      }

      window.CpuAI.updateIntent(brain, {
        weHaveBall: cpuHasBall,
        ballX: ball.x,
        timeNow: now,
        scoreDiff: brain.scoreDiff,
        matchMinute: matchMinute,
      });
    }

    // --- Pressing-Spieler ermitteln (für koordiniertes Pressing) ---
    const pressingIds = brain ? window.CpuAI.getPressingPlayers(brain, {
      players, ballPos: ball, ownerPos: owner,
    }) : [];

    for (const p of players) {
      if (p === active) continue;

      let target = { x: p.home.x, y: p.home.y };
      let speed = p.team === "my" ? MATE_SPEED : 11;

      if (p.team === "opp" && brain) {
        // === CPU-KI mit TeamBrain ===
        const params = brain.params;
        const OPP_BASE_SPEED = 10 + params.pressIntensity * 3; // 10-13

        if (ball.ownerId === p.id) {
          // --- Ballbesitzer: Dribbeln + Pass/Schuss-Entscheidung ---
          p.hasBall = true;

          // Schuss-Check
          if (!oppShotCooldown() && !postDuelCooldown()) {
            const shouldShoot = window.CpuAI.shouldShoot(p, brain, {
              timeNow: now,
              lastShotAt: oppLastShotRef_AI.current,
              matchMinute: brain.matchMinute,
            });
            if (shouldShoot) {
              oppLastShotRef_AI.current = now;
              tryOpponentShot(p);
              continue;
            }
          }

          // Pass-Check
          const passTarget = window.CpuAI.shouldPass(p, brain, {
            players,
            ballPos: ball,
            timeNow: now,
            lastPassAt: oppLastPassRef_AI.current,
          });
          if (passTarget) {
            oppLastPassRef_AI.current = now;
            ball.ownerId = passTarget.id;
            setCommentary(brain.intent === 'counter' ? "Schneller Konter!" : "Gegner kombiniert…");
          }

          // Dribbel-Ziel basierend auf Intent
          if (brain.intent === 'counter') {
            // Schneller Konter: direkt aufs Tor
            target = { x: 5, y: 50 };
            speed = OPP_BASE_SPEED * 1.15 * params.counterSpeed;
          } else if (brain.intent === 'build_up') {
            // Aufbau: langsamer, mehr Richtung Mitte
            const yBias = p.y < 50 ? 55 : 45;
            target = { x: Math.max(15, p.x - 10), y: yBias };
            speed = OPP_BASE_SPEED * 0.85;
          } else if (brain.intent === 'protect_lead') {
            // Führung verwalten: Ball halten
            target = { x: Math.max(40, p.x - 5), y: p.y };
            speed = OPP_BASE_SPEED * 0.7;
          } else {
            // Standard: Richtung Tor
            target = { x: 10, y: 50 };
            speed = OPP_BASE_SPEED * 0.95;
          }
        } else {
          p.hasBall = false;

          if (ball.ownerId === null) {
            // --- Loser Ball: Nächster jagt ---
            const nearestOpp = nearestOf(players.filter(x => x.team === "opp"), ball);
            if (nearestOpp && nearestOpp.id === p.id) {
              target = ball;
              speed = OPP_BASE_SPEED * 1.1;
            } else {
              target = biasToward(p.home, ball, 0.25);
            }
          } else if (weHaveBall) {
            // --- Defensiv: Pressen oder Formation halten ---
            const isPressing = pressingIds.includes(p.id);

            if (isPressing && owner) {
              // Direktes Pressing auf Ballbesitzer
              target = { x: owner.x, y: owner.y };
              speed = OPP_BASE_SPEED * (1 + params.pressIntensity * 0.25);
              if (brain.intent === 'high_press') {
                speed *= 1.15;
              }
            } else {
              // Formation halten, Passwege zustellen
              const lineX = 100 - params.lineHeight * 40; // Defensive Linie
              const formationX = Math.max(p.home.x, lineX - (100 - p.home.x) * 0.4);
              const adjustedHome = { x: formationX, y: p.home.y };

              // Leicht zum Ball orientieren
              target = biasToward(adjustedHome, ball, 0.2 * params.pressIntensity);
              speed = OPP_BASE_SPEED * 0.9;
            }
          } else {
            // --- CPU hat Ball (aber nicht dieser Spieler): Unterstützung ---
            const role = p.role;
            const isAttacker = role === "ST" || role === "LW" || role === "RW" || role === "CAM";
            const isMidfielder = role === "CM" || role === "CDM" || role === "LM" || role === "RM";

            if (brain.intent === 'counter') {
              // Konter: Schnell nach vorne
              const pushX = isAttacker ? Math.max(5, p.home.x - 35) :
                           isMidfielder ? Math.max(15, p.home.x - 25) :
                           Math.max(25, p.home.x - 15);
              target = { x: pushX, y: p.home.y + (Math.random() - 0.5) * 10 };
              speed = OPP_BASE_SPEED * params.counterSpeed;
            } else if (brain.intent === 'direct_attack') {
              // Angriff: Stark aufrücken
              const pushX = isAttacker ? Math.max(8, p.home.x - 30) :
                           isMidfielder ? Math.max(20, p.home.x - 20) :
                           Math.max(30, p.home.x - 12);
              target = biasToward({ x: pushX, y: p.home.y }, ball, 0.15);
              speed = OPP_BASE_SPEED;
            } else if (brain.intent === 'protect_lead') {
              // Führung verwalten: Wenig aufrücken
              target = biasToward(p.home, ball, 0.1);
              speed = OPP_BASE_SPEED * 0.8;
            } else {
              // Aufbau: Moderat aufrücken, Anspielstationen bieten
              const pushX = isAttacker ? Math.max(15, p.home.x - 20) :
                           isMidfielder ? Math.max(25, p.home.x - 12) :
                           p.home.x;
              target = biasToward({ x: pushX, y: p.home.y }, ball, 0.15);
              speed = OPP_BASE_SPEED * 0.9;
            }
          }
        }
      } else if (p.team === "opp") {
        // Fallback wenn kein CpuAI geladen (alte Logik)
        const OPP_SPEED = 11;
        if (ball.ownerId === p.id) {
          target = { x: 10, y: 50 };
          speed = OPP_SPEED * 0.95;
        } else if (weHaveBall && owner) {
          const nearestOpp = nearestOf(players.filter(x => x.team === "opp"), owner);
          if (nearestOpp && nearestOpp.id === p.id) {
            target = { x: owner.x, y: owner.y };
            speed = OPP_SPEED * 1.15;
          } else {
            target = biasToward(p.home, ball, 0.3);
          }
        } else {
          target = biasToward(p.home, ball, 0.25);
        }
      } else {
        // --- Mitspieler (eigenes Team) ---
        if (weHaveBall) {
          // Mit Ball: AUFRÜCKEN — Angreifer/Mittelfeld stark nach vorne
          const isKeeper = p.role === "GK";
          const isDef = p.role === "CB" || p.role === "LB" || p.role === "RB";
          const pushAmount = isKeeper ? 0 : isDef ? 15 : 35;
          const push = { x: Math.min(95, p.home.x + pushAmount), y: p.home.y };
          target = biasToward(push, ball, 0.1);
        } else {
          // Ohne Ball: Jäger + Rest in Formation
          const isKeeper = p.role === "GK";
          const nearestMate = nearestOf(players.filter(x => x.team === "my" && x.id !== activeIdRef.current && x.role !== "GK"), ball);
          if (!isKeeper && nearestMate && nearestMate.id === p.id) {
            target = ball;
            speed = MATE_SPEED * 1.15;
          } else {
            target = biasToward(p.home, ball, 0.2);
          }
        }
      }

      // Bewege zum Ziel
      const dx = target.x - p.x, dy = target.y - p.y;
      const d = Math.hypot(dx, dy);
      if (d > 0.3) {
        const n = { x: dx / d, y: dy / d };
        p.vx = n.x * speed;
        p.vy = n.y * speed;
      } else { p.vx *= 0.2; p.vy *= 0.2; }
    }

    // 3) Bewege alle Spieler
    for (const p of players) {
      p.x = clamp(p.x + p.vx * dt, 2, 98);
      p.y = clamp(p.y + p.vy * dt, 3, 97);
    }

    // 4) Ball-Physik
    if (ball.ownerId) {
      const o = players.find(pp => pp.id === ball.ownerId);
      if (o) {
        // Ball "klebt" leicht vor dem Dribbler
        const dir = o.team === "my" ? 1 : -1;
        ball.x = o.x + dir * 1.6;
        ball.y = o.y;
        ball.vx = 0; ball.vy = 0;
      }
    } else {
      // Frei: bewegen + Reibung
      ball.x = clamp(ball.x + ball.vx * dt, 0, 100);
      ball.y = clamp(ball.y + ball.vy * dt, 0, 100);
      ball.vx *= 0.93;
      ball.vy *= 0.93;
      if (Math.hypot(ball.vx, ball.vy) < 1) { ball.vx = 0; ball.vy = 0; }
      // Pickup: wenn Spieler den Ball erreicht
      const pickupDist = 1.8;
      let best = null, bestD = Infinity;
      for (const p of players) {
        const d = dist(p, ball);
        if (d < pickupDist && d < bestD) { best = p; bestD = d; }
      }
      if (best) {
        ball.ownerId = best.id;
        if (best.team === "my") {
          activeIdRef.current = best.id;
          setCommentary(`Ball für ${playerByN[best.n]?.name.split(" ").slice(-1)[0] || "uns"}.`);
        } else {
          setCommentary("Gegner am Ball!");
        }
      }
      // Tor-Check: linke Seite (unser Tor) x<=0, Mitte
      if (ball.x <= 1 && ball.y > 38 && ball.y < 62) {
        concedeGoal();
      } else if (ball.x >= 99 && ball.y > 38 && ball.y < 62) {
        scoreGoal();
      }
    }

    // 5) Zweikampf-Mechanik (best-practice: Jockey + Timing + Separation)
    //    - Contact dispossesses NICHT automatisch. Stattdessen:
    //    - Dribbler wird langsamer wenn Gegner dicht ist (shielding)
    //    - Dispossession-immunity: wer Ball verloren hat, kann 1.5s nicht zurück-tacklen
    //    - Separation-push: nach Kontakt werden die Spieler auseinander geschoben
    if (ball.ownerId) {
      const o = players.find(pp => pp.id === ball.ownerId);
      if (o) {
        const opponents = players.filter(pp => pp.team !== o.team);
        for (const opp of opponents) {
          const d = dist(opp, o);
          // Dispo-immunity check
          if (dispoImmuneRef.current.get(opp.id) > Date.now()) continue;
          if (d < 1.4) {
            // Shoulder-challenge: winrate basiert auf Rolle (Verteidiger gewinnt öfter)
            // UND nur wenn opp SCHNELLER auf Ball zuläuft (approach vector)
            const approachDot = (o.x - opp.x) * opp.vx + (o.y - opp.y) * opp.vy;
            const isDefender = opp.role === "CB" || opp.role === "LB" || opp.role === "RB";
            const baseWin = isDefender ? 0.55 : 0.40;
            if (approachDot > 0 && Math.random() < baseWin * dt * 4) {
              // Ballgewinn!
              ball.ownerId = opp.id;
              // Loser bekommt Dispo-immunity (kann 1.5s nicht zurück-tacklen)
              dispoImmuneRef.current.set(o.id, Date.now() + 1500);
              // Separation: push loser away from winner
              const sx = o.x - opp.x, sy = o.y - opp.y;
              const sd = Math.hypot(sx, sy) || 1;
              o.x += (sx / sd) * 2.5;
              o.y += (sy / sd) * 2.5;
              if (opp.team === "my") {
                activeIdRef.current = opp.id;
                setCommentary("Ballgewinn!");
              } else {
                setCommentary("Gegner erobert den Ball.");
              }
              break;
            } else {
              // Kontakt ohne Ballgewinn: Anti-Stick push (damit sie sich nicht verhaken)
              const sx = opp.x - o.x, sy = opp.y - o.y;
              const sd = Math.hypot(sx, sy) || 1;
              const push = 0.08;
              opp.x += (sx / sd) * push;
              opp.y += (sy / sd) * push;
              o.x -= (sx / sd) * push;
              o.y -= (sy / sd) * push;
            }
          }
        }
      }
    }

    // 6) Gegner-KI: wenn Gegner den Ball hat und sehr nah am eigenen Tor ist → Schuss
    if (ball.ownerId && !postDuelCooldown()) {
      const o = players.find(pp => pp.id === ball.ownerId);
      if (o && o.team === "opp" && o.x < 18 && Math.abs(o.y - 50) < 20 && !oppShotCooldown()) {
        tryOpponentShot(o);
      }
    }
  }

  const postDuelEndRef = useRef(0);
  function postDuelCooldown() { return Date.now() - postDuelEndRef.current < 8000; }
  const dispoImmuneRef = useRef(new Map());

  const oppShotCooldownRef = useRef(0);
  function oppShotCooldown() { return Date.now() - oppShotCooldownRef.current < 6000; }
  function tryOpponentShot(shooter) {
    oppShotCooldownRef.current = Date.now();
    // Ball "parken" — Duell entscheidet. Nicht live fliegen lassen.
    const ball = ballRef.current;
    ball.vx = 0; ball.vy = 0;
    ball.ownerId = shooter.id; // bleibt beim Schützen bis Duell entschieden
    setCommentary("Der Gegner zieht ab — Neuer muss rechnen!");
    triggerDuel(false, "oppShot");
  }

  function nearestOf(arr, target) {
    let best = null, bd = Infinity;
    for (const p of arr) { const d = dist(p, target); if (d < bd) { bd = d; best = p; } }
    return best;
  }
  function biasToward(home, ball, w) {
    return { x: home.x * (1 - w) + ball.x * w, y: home.y * (1 - w) + ball.y * w };
  }

  // --- Actions ---
  function doAction(kind) {
    const ball = ballRef.current;
    const active = playersRef.current.find(p => p.id === activeIdRef.current);
    if (!active) return;

    if (kind === "switch") {
      // Zum nächsten eigenen Spieler (der am nächsten beim Ball ist)
      const mates = playersRef.current.filter(p => p.team === "my" && p.id !== active.id);
      const nearest = nearestOf(mates, ball);
      if (nearest) { activeIdRef.current = nearest.id; }
      return;
    }

    const weHaveBall = ball.ownerId === active.id || (active.team === "my" && playersRef.current.find(p => p.id === ball.ownerId)?.team === "my");

    if (kind === "tackle") {
      if (weHaveBall) return;
      const owner = playersRef.current.find(p => p.id === ball.ownerId);
      if (owner && owner.team === "opp" && dist(owner, active) < 6) {
        // Direkt erobern (ohne Duell)
        ball.ownerId = active.id;
        activeIdRef.current = active.id;
        setCommentary("Grätsche! Ballgewinn!");
      }
      return;
    }

    if (!weHaveBall) return;

    const owner = playersRef.current.find(p => p.id === ball.ownerId);
    if (!owner || owner.team !== "my") return;

    if (kind === "pass") {
      // Pass zum nächsten Mitspieler in Spielrichtung
      const mates = playersRef.current.filter(p => p.team === "my" && p.id !== owner.id && p.role !== "GK");
      const targets = mates.filter(m => m.x > owner.x - 5); // nicht rückwärts
      const target = nearestOf(targets.length ? targets : mates, owner);
      if (target) kickBall(target, 42);
    } else if (kind === "throughball") {
      // Steilpass: vor den Stürmer
      const mates = playersRef.current.filter(p => p.team === "my" && (p.role === "ST" || p.role === "LW" || p.role === "RW" || p.role === "CAM"));
      const target = mates.reduce((a, b) => (b.x > (a?.x ?? -1) ? b : a), null) || nearestOf(mates, owner);
      if (target) {
        // ziel vor den Stürmer
        const t = { x: Math.min(95, target.x + 8), y: target.y };
        kickBallToPoint(t, 55);
      }
    } else if (kind === "shoot") {
      // Schuss aufs Tor → Ball "parken" bis Duell entscheidet
      ball.vx = 0; ball.vy = 0;
      ball.ownerId = owner.id;
      triggerDuel(true, "shot");
    }
  }

  function kickBall(target, speed) {
    const ball = ballRef.current;
    const dir = norm({ x: target.x - ball.x, y: target.y - ball.y });
    ball.vx = dir.x * speed;
    ball.vy = dir.y * speed;
    ball.ownerId = null;
    setCommentary("Pass!");
  }
  function kickBallToPoint(target, speed) {
    kickBall(target, speed);
  }

  // --- Duel ---
  const duelCooldownRef = useRef(0);
  function triggerDuel(weHaveBall, source = "contact") {
    if (phaseRef.current !== "play") return;
    if (Date.now() - duelCooldownRef.current < 800) return;
    duelCooldownRef.current = Date.now();
    const t = window.MathEngine.nextTask(profileRef.current);
    const timeLimit = DUEL_TIME[difficulty];
    setDuel({ a: t.a, b: t.b, startedAt: Date.now(), timeLimit, hasBall: weHaveBall, source });
    setPhase("duel");
    setCommentary(weHaveBall ? (source === "shot" ? "Abschluss! Torwart rechnet…" : "Zweikampf — halte den Ball!") : "Grätsche — hole den Ball!");
  }

  function onDuelResult(correct, durationMs) {
    profileRef.current = window.MathEngine.recordAnswer(profileRef.current, duel.a, duel.b, correct, durationMs);
    setDuelsTotal(n => n + 1);
    if (correct) setDuelsWon(n => n + 1);
    postDuelEndRef.current = Date.now();

    const ball = ballRef.current;
    const players = playersRef.current;

    if (duel.source === "shot") {
      if (correct) {
        setMyScore(s => s + 1);
        setCommentary(`TOR! ${duel.a}×${duel.b}=${duel.a*duel.b} — der Keeper war machtlos!`);
        celebrateGoal("my", `${duel.a} × ${duel.b} = ${duel.a*duel.b}`);
      } else {
        const gk = players.find(p => p.team === "opp" && p.role === "GK") || players.find(p => p.team === "opp");
        ball.ownerId = gk.id; ball.vx = 0; ball.vy = 0;
        setToast({ text: `✗ Parade · ${duel.a}×${duel.b}=${duel.a*duel.b}`, color: "#DC0817" });
        setCommentary(`${duel.a}×${duel.b}=${duel.a*duel.b}. Torwart hat den Ball.`);
      }
    } else if (duel.source === "oppShot") {
      if (correct) {
        // Neuer hält!
        const gk = players.find(p => p.team === "my" && p.role === "GK") || players.find(p => p.team === "my");
        ball.ownerId = gk.id; ball.vx = 0; ball.vy = 0;
        activeIdRef.current = gk.id;
        setToast({ text: `✓ Parade! ${duel.a}×${duel.b}=${duel.a*duel.b}`, color: "#2D7A3E" });
        setCommentary(`${duel.a}×${duel.b}=${duel.a*duel.b}. Neuer hält!`);
      } else {
        setOppScore(s => s + 1);
        setCommentary(`${duel.a}×${duel.b}=${duel.a*duel.b}. Gegentor!`);
        celebrateGoal("opp", `${duel.a} × ${duel.b} = ${duel.a*duel.b}`);
      }
    }

    setDuel(null);
    // Nur zurück zu "play" wenn keine Celebration läuft
    setTimeout(() => {
      if (phaseRef.current !== "celebration") setPhase("play");
    }, 0);
    setTimeout(() => setToast(null), 1400);
  }

  // --- Tor-Celebration ---
  const [goalCelebration, setGoalCelebration] = useState(null); // { scorer: "my"|"opp", scorerName, text }
  function celebrateGoal(scorer, text) {
    // Anstoß-Ablauf: Pause → Anpfiff
    setGoalCelebration({ scorer, text });
    setPhase("celebration");
    setTimeout(() => {
      resetAfterGoal(scorer);
      setGoalCelebration(null);
      setPhase("play");
    }, 3200);
  }
  function scoreGoal() {
    setMyScore(s => s + 1);
    setCommentary("TOR für Bayern!");
    celebrateGoal("my", "TOR!");
  }
  function concedeGoal() {
    setOppScore(s => s + 1);
    setCommentary("Gegentor. Weiter kämpfen!");
    celebrateGoal("opp", "Gegentor");
  }
  function resetAfterGoal(scorer) {
    const players = playersRef.current;
    // Alle zurück zu home
    for (const p of players) {
      p.x = p.home.x; p.y = p.home.y; p.vx = 0; p.vy = 0;
    }
    const ball = ballRef.current;
    ball.x = 50; ball.y = 50; ball.vx = 0; ball.vy = 0;
    // Anstoß für Gegentor-verteidigenden: wir haben Anstoß nach Gegentor
    const startTeam = scorer === "my" ? "opp" : "my";
    const team = players.filter(p => p.team === startTeam);
    const starter = team.find(p => p.role === "ST" || p.role === "CAM") || team[team.length - 1];
    if (starter) { ball.ownerId = starter.id; if (startTeam === "my") activeIdRef.current = starter.id; }
  }

  // --- Overlays ---
  const kickoffStart = () => {
    // Alle auf Startposition
    const players = playersRef.current;
    for (const p of players) { p.x = p.home.x; p.y = p.home.y; p.vx = 0; p.vy = 0; }
    const ball = ballRef.current;
    ball.x = 50; ball.y = 50; ball.vx = 0; ball.vy = 0;
    // Anstoß Bayern
    const stSlot = formSlots.find(s => s.role === "ST") || formSlots[10];
    activeIdRef.current = stSlot.id;
    ball.ownerId = stSlot.id;
    setPhase("play");
    setCommentary("Der Ball rollt!");
  };
  const continueFromHalftime = () => { kickoffStart(); };

  useEffect(() => {
    if (phase === "ended") {
      setCommentary(myScore > oppScore ? "SIEG!" : myScore === oppScore ? "Unentschieden." : "Niederlage. Kopf hoch!");
    }
  }, [phase, myScore, oppScore]);

  // --- Render ---
  const players = playersRef.current;
  const ball = ballRef.current;
  const activeId = activeIdRef.current;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0A1E3F", overflow: "hidden" }}>
      {/* PITCH — full viewport */}
      <div ref={pitchRef} style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #2D7A3E 0%, #256A34 100%)",
        overflow: "hidden",
      }}>
          <PitchLinesHoriz />
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 10%, transparent 10% 20%)", pointerEvents: "none" }} />

          {/* Tore */}
          <div style={{ position: "absolute", left: 0, top: "42%", width: "1.2%", height: "16%", background: "rgba(255,255,255,0.85)", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", right: 0, top: "42%", width: "1.2%", height: "16%", background: "rgba(255,255,255,0.85)", borderRadius: "0 2px 2px 0" }} />

          {/* Spieler */}
          {players.map(p => {
            const isActive = p.id === activeId;
            const isOpp = p.team === "opp";
            const color = isOpp ? oppColor : myColor;
            const size = isActive ? 30 : 24;
            const label = isOpp ? "" : (playerByN[p.n]?.n ?? "");
            return (
              <div key={p.id} style={{
                position: "absolute",
                left: `${p.x}%`, top: `${p.y}%`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}>
                <div style={{
                  width: size, height: size, borderRadius: "50%",
                  background: color,
                  border: `${isActive ? 3 : 2}px solid ${isActive ? "#FFB800" : "white"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Archivo Black',sans-serif", fontSize: isActive ? 11 : 9, color: "white",
                  boxShadow: isActive ? "0 0 0 4px rgba(255,184,0,0.35), 0 2px 6px rgba(0,0,0,0.5)" : "0 2px 4px rgba(0,0,0,0.4)",
                }}>{label}</div>
                {isActive && !isOpp && (
                  <div style={{ textAlign: "center", fontFamily: "'Archivo Black',sans-serif", fontSize: 9, color: "white", marginTop: 2, textShadow: "0 1px 2px rgba(0,0,0,0.8)", whiteSpace: "nowrap", pointerEvents: "none" }}>
                    {playerByN[p.n]?.name.split(" ").slice(-1)[0].toUpperCase()}
                  </div>
                )}
              </div>
            );
          })}

          {/* Ball */}
          <div style={{
            position: "absolute",
            left: `${ball.x}%`, top: `${ball.y}%`,
            transform: "translate(-50%, -50%)",
            width: 12, height: 12, borderRadius: "50%",
            background: "white", border: "2px solid #0A1E3F",
            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            zIndex: 5,
          }} />

          {/* TV-Style Scoreboard oben links (nur Desktop) */}
          {!window.IS_TOUCH && (phase === "play" || phase === "duel") && (
            <div style={{
              position: "absolute", top: 12, left: 12, zIndex: 20,
              display: "flex", alignItems: "center", gap: 0,
              background: "rgba(10,30,63,0.92)", borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}>
              {/* Eigenes Team */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: myColor }}>
                <ScoreboardBadge url={myBadge} name={myShort} />
                <span style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 14, color: "white" }}>{myShort}</span>
              </div>
              {/* Spielstand */}
              <div style={{
                padding: "6px 14px", background: "rgba(0,0,0,0.6)",
                fontFamily: "'Archivo Black',sans-serif", fontSize: 18, color: "white",
                minWidth: 60, textAlign: "center",
              }}>
                {myScore} : {oppScore}
              </div>
              {/* Gegner */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: oppColor }}>
                <span style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 14, color: "white" }}>{match.oppShort}</span>
                <ScoreboardBadge url={oppBadge} name={match.oppShort} />
              </div>
              {/* Zeit */}
              <div style={{
                padding: "6px 10px", background: "rgba(0,0,0,0.8)",
                fontFamily: "Inter", fontWeight: 700, fontSize: 13, color: "#FFB800",
              }}>
                {formatTime(timeLeft)}
              </div>
            </div>
          )}

          {phase === "kickoff" && (
            <Overlay>
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 3, color: "#FFB800" }}>{match.mdLabel.toUpperCase()}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "16px 0 8px" }}>
                <TeamBadge name={myShort} color={myColor} badgeUrl={myBadge} />
                <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 32, color: "white" }}>{match.home ? "vs" : "@"}</div>
                <TeamBadge name={match.oppShort} color={oppColor} badgeUrl={oppBadge} />
              </div>
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 18, color: "rgba(255,255,255,0.8)", marginBottom: 12 }}>{myShort} vs {match.opp}</div>
              <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 18, textAlign: "center", maxWidth: 520 }}>
                {window.IS_TOUCH
                  ? "Joystick links zum Bewegen · rechte Buttons für Aktionen · Tippen/Wischen auf dem Feld für Pass & Schuss"
                  : "WASD / Pfeile · Leertaste = Pass · Q = Schuss · E = Steilpass · X = Grätsche · F = Spielerwechsel"}
              </div>
              <BigButton variant="gold" onClick={kickoffStart}>Anpfiff</BigButton>
            </Overlay>
          )}
          {phase === "halftime" && (
            <Overlay>
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 3, color: "#FFB800" }}>HALBZEIT</div>
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 52, color: "white", margin: "8px 0 14px" }}>{myScore} : {oppScore}</div>
              <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>Zweikämpfe: <b style={{ color: "white" }}>{duelsWon}/{duelsTotal}</b></div>
              <BigButton variant="gold" onClick={continueFromHalftime}>Zweite Halbzeit</BigButton>
            </Overlay>
          )}
          {phase === "ended" && (
            <Overlay>
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 3, color: "#FFB800" }}>ABPFIFF</div>
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 22, color: "white", marginTop: 4 }}>
                {myScore > oppScore ? "🏆 SIEG" : myScore === oppScore ? "UNENTSCHIEDEN" : "NIEDERLAGE"}
              </div>
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 56, color: "white", margin: "4px 0 12px" }}>{myScore} : {oppScore}</div>
              <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 18 }}>
                Zweikämpfe: <b style={{ color: "white" }}>{duelsWon}/{duelsTotal}</b> ({duelsTotal > 0 ? Math.round(duelsWon/duelsTotal*100) : 0}%)
              </div>
              <BigButton variant="gold" onClick={() => onEnd({ myScore, oppScore })}>Weiter →</BigButton>
            </Overlay>
          )}

          {duel && <DuelOverlay duel={duel} difficulty={difficulty} onResult={onDuelResult} />}

          {toast && (
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: toast.color, color: "white",
              fontFamily: "'Archivo Black',sans-serif", fontSize: 26,
              padding: "12px 26px", borderRadius: 14,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              animation: "pop 0.2s ease-out",
              pointerEvents: "none", letterSpacing: "-0.5px",
              zIndex: 15,
            }}>{toast.text}</div>
          )}

          {goalCelebration && <GoalCelebration data={goalCelebration} />}

          {phase === "play" && window.TouchControls && (
            <window.TouchControls
              pitchRef={pitchRef}
              possession={(() => {
                const ball = ballRef.current;
                const o = playersRef.current.find(p => p.id === ball.ownerId);
                return o && o.team === "my" ? "attacking" : "defending";
              })()}
              ownHalf={(() => {
                const active = playersRef.current.find(p => p.id === activeIdRef.current);
                return active ? active.x < 50 : false;
              })()}
              onJoystick={({ x, y }) => { touchJoyRef.current = { x, y }; }}
              onAction={(kind, meta) => {
                if (kind === "sprint_on") { sprintRef.current = true; return; }
                if (kind === "sprint_off") { sprintRef.current = false; return; }
                if (kind === "tackle_on" || kind === "press_on") { doAction("tackle"); return; }
                if (kind === "tackle_off" || kind === "press_off") return;
                if (kind === "slide") { doAction("tackle"); return; }
                if (kind === "clear") { doAction("pass"); return; }
                doAction(kind);
              }}
              onPitchTap={({ fx, fy }) => {
                const ball = ballRef.current;
                const players = playersRef.current;
                const owner = players.find(p => p.id === ball.ownerId);
                const weHaveBall = owner && owner.team === "my";
                // Finde Spieler unter dem Tap
                let hit = null, bd = 4;
                for (const p of players) {
                  const d = Math.hypot(p.x - fx, p.y - fy);
                  if (d < bd) { bd = d; hit = p; }
                }
                if (!weHaveBall) {
                  // Defensive: Tap auf Gegner mit Ball → tackle; sonst → Spielerwechsel auf nächsten Eigenen
                  if (hit && hit.team === "opp" && hit.id === ball.ownerId) {
                    doAction("tackle");
                  } else if (hit && hit.team === "my") {
                    activeIdRef.current = hit.id;
                  } else {
                    doAction("switch");
                  }
                  return;
                }
                // Offensive: Tap auf Mitspieler → Pass zu ihm. Auf Raum → Steilpass zum Punkt.
                if (hit && hit.team === "my" && hit.id !== owner.id) {
                  kickBall(hit, 42);
                } else {
                  kickBallToPoint({ x: fx, y: fy }, 50);
                }
              }}
              onPitchSwipe={({ fx, fy, power, angle, dx, dy }) => {
                const ball = ballRef.current;
                const players = playersRef.current;
                const owner = players.find(p => p.id === ball.ownerId);
                const weHaveBall = owner && owner.team === "my";
                if (weHaveBall) {
                  // Swipe Richtung rechts (gegnerisches Tor) → Schuss; sonst Pass in Richtung
                  if (dx > 0 && Math.abs(dx) > Math.abs(dy)) {
                    doAction("shoot");
                  } else {
                    kickBallToPoint({ x: fx, y: fy }, 45 + power * 25);
                  }
                } else {
                  doAction("tackle");
                }
              }}
            />
          )}

          {/* FLOATING HUD TOP (Touch/Mobile) — zentriert wie EA FC Mobile */}
          {window.IS_TOUCH && (
            <div style={{
              position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: 10, zIndex: 12,
              background: "rgba(6,15,34,0.85)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
              padding: "8px 14px", borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
              color: "white",
            }}>
              <TeamBadge name={myShort} color={myColor} small badgeUrl={myBadge} />
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 20, letterSpacing: "-0.5px", minWidth: 68, textAlign: "center" }}>
                {myScore}<span style={{ opacity: 0.5, margin: "0 6px" }}>:</span>{oppScore}
              </div>
              <TeamBadge name={match.oppShort} color={oppColor} small badgeUrl={oppBadge} />
              <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.18)" }} />
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 14, letterSpacing: "-0.3px", color: "#FFB800", minWidth: 48, textAlign: "center" }}>
                {formatTime(MATCH_DURATION_MS - timeLeft)}'
              </div>
            </div>
          )}

          {/* Menü-Button: oben rechts (neben TV-Scoreboard auf Desktop, oben links auf Touch) */}
          <button onClick={onBackToMenu} style={{
            position: "absolute", top: 12, right: window.IS_TOUCH ? "auto" : 12, left: window.IS_TOUCH ? 10 : "auto", zIndex: 21,
            width: 38, height: 38, borderRadius: "50%",
            background: "rgba(6,15,34,0.85)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
          }} aria-label="Zurück zum Menü">←</button>

          {/* Kommentar-Toast unter dem HUD */}
          {commentary && (
            <div style={{
              position: "absolute", top: 62, left: "50%", transform: "translateX(-50%)",
              padding: "6px 14px", borderRadius: 999,
              background: "rgba(6,15,34,0.65)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              color: "rgba(255,255,255,0.9)", fontFamily: "Inter", fontSize: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              maxWidth: "70vw", textAlign: "center",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              pointerEvents: "none", zIndex: 11,
            }}>{commentary}</div>
          )}

          {/* Desktop-Action-Bar als Overlay unten rechts (nur ohne Touch) */}
          {!window.IS_TOUCH && phase === "play" && (
            <div style={{
              position: "absolute", bottom: 14, right: 14, zIndex: 12,
              display: "flex", gap: 6, flexWrap: "wrap",
              padding: 8, borderRadius: 14,
              background: "rgba(6,15,34,0.75)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            }}>
              <ActionBtn label="Pass" keyHint="␣" onClick={() => doAction("pass")} color="#2D7A3E" />
              <ActionBtn label="Schuss" keyHint="Q" onClick={() => doAction("shoot")} color="#DC0817" />
              <ActionBtn label="Steil" keyHint="E" onClick={() => doAction("throughball")} color="#FFB800" fg="#0A1E3F" />
              <ActionBtn label="Grätsche" keyHint="X" onClick={() => doAction("tackle")} color="#0066CC" />
              <ActionBtn label="Wechsel" keyHint="F" onClick={() => doAction("switch")} color="#555" />
            </div>
          )}
      </div>

      <style>{`
        @keyframes pop { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; } 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

// Badge mit Fallback bei 404
const ScoreboardBadge = ({ url, name }) => {
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: 4,
        background: "rgba(255,255,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Archivo Black',sans-serif", fontSize: 8, color: "white",
      }}>{name?.slice(0,2)}</div>
    );
  }
  return (
    <img
      src={url}
      alt={name}
      onError={() => setFailed(true)}
      style={{ width: 20, height: 20, objectFit: "contain" }}
    />
  );
};

const TeamBadge = ({ name, color, small, badgeUrl }) => {
  const [failed, setFailed] = useState(false);
  const size = small ? 26 : 32;
  const imgUrl = badgeUrl || (window.TEAM_BADGES && window.TEAM_BADGES[name]);
  const hasBadge = imgUrl && !failed;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {hasBadge ? (
        <img
          src={imgUrl}
          alt={name}
          onError={() => setFailed(true)}
          style={{
            width: size,
            height: size,
            objectFit: "contain",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
      ) : (
        <div style={{
          width: size, height: size, borderRadius: small ? 6 : 8,
          background: color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Archivo Black',sans-serif", fontSize: small ? 9 : 11,
          color: "white", border: "2px solid rgba(255,255,255,0.3)",
        }}>{name}</div>
      )}
    </div>
  );
};

const ActionBtn = ({ label, keyHint, onClick, color, fg = "white" }) => (
  <button onClick={onClick} style={{
    background: color, color: fg,
    border: "2px solid rgba(255,255,255,0.15)", borderRadius: 10,
    padding: "7px 11px", cursor: "pointer",
    fontFamily: "'Archivo Black',sans-serif", fontSize: 11,
    letterSpacing: 0.5,
    display: "flex", alignItems: "center", gap: 6,
  }}>
    {label}
    <span style={{ background: "rgba(0,0,0,0.25)", padding: "1px 5px", borderRadius: 4, fontSize: 9, fontFamily: "Inter", fontWeight: 700 }}>{keyHint}</span>
  </button>
);

const Overlay = ({ children }) => (
  <div style={{
    position: "absolute", inset: 0,
    background: "rgba(10,30,63,0.92)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    zIndex: 10, padding: 20,
  }}>{children}</div>
);

const PitchLinesHoriz = () => (
  <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} preserveAspectRatio="none">
    <rect x="1" y="1" width="98" height="98" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.3" />
    <line x1="50" y1="1" x2="50" y2="99" stroke="rgba(255,255,255,0.6)" strokeWidth="0.3" />
    <circle cx="50" cy="50" r="9" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.3" />
    <circle cx="50" cy="50" r="0.7" fill="rgba(255,255,255,0.7)" />
    <rect x="1" y="30" width="14" height="40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.3" />
    <rect x="1" y="40" width="5" height="20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.3" />
    <rect x="85" y="30" width="14" height="40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.3" />
    <rect x="94" y="40" width="5" height="20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.3" />
  </svg>
);

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const mm = Math.floor(total / 60).toString().padStart(2, "0");
  const ss = (total % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

// ============================================================
// TOR-CELEBRATION (EA FC Mobile-inspiriert)
// ============================================================
function GoalCelebration({ data }) {
  const { scorer, text } = data;
  const isMy = scorer === "my";
  const mainColor = isMy ? "#DC0817" : "#1A1A1A";
  const accentColor = isMy ? "#FFD700" : "#FFFFFF";

  // Konfetti-Partikel
  const particles = React.useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      color: [mainColor, accentColor, "#FFFFFF", "#FFD700"][i % 4],
      size: 6 + Math.random() * 8,
      rot: Math.random() * 360,
    }));
  }, [scorer]);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 20, pointerEvents: "none",
      overflow: "hidden",
    }}>
      {/* Dunkler Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 100%)",
        animation: "celebFade 0.3s ease-out",
      }} />

      {/* Konfetti */}
      {isMy && particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.left}%`, top: "-10%",
          width: p.size, height: p.size * 0.6,
          background: p.color,
          borderRadius: 2,
          animation: `celebConfetti ${p.duration}s ${p.delay}s ease-in forwards`,
          transform: `rotate(${p.rot}deg)`,
        }} />
      ))}

      {/* Haupt-Banner */}
      <div style={{
        position: "relative",
        textAlign: "center",
        animation: "celebBannerIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      }}>
        {/* Leuchtender Ring hinter dem TOR-Text */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500, height: 500,
          background: `radial-gradient(circle, ${mainColor}66 0%, transparent 60%)`,
          animation: "celebPulse 1.2s ease-in-out infinite",
        }} />

        {/* GOOOAL Text */}
        <div style={{
          position: "relative",
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: isMy ? 120 : 80,
          color: "white",
          letterSpacing: "-4px",
          lineHeight: 0.9,
          textShadow: `0 0 30px ${mainColor}, 0 0 60px ${mainColor}88, 0 6px 0 rgba(0,0,0,0.4)`,
          WebkitTextStroke: `3px ${mainColor}`,
        }}>
          {isMy ? "GOOOAL!" : "GEGENTOR"}
        </div>

        {/* Untertext: Mathe-Aufgabe */}
        <div style={{
          position: "relative",
          marginTop: 20,
          display: "inline-block",
          padding: "10px 26px",
          background: mainColor,
          color: accentColor,
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 32,
          letterSpacing: "-0.5px",
          borderRadius: 10,
          border: `3px solid ${accentColor}`,
          boxShadow: `0 8px 30px rgba(0,0,0,0.6)`,
          animation: "celebSubIn 0.6s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}>
          {text}
        </div>
      </div>

      <style>{`
        @keyframes celebFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes celebBannerIn {
          0% { transform: scale(0.2) rotate(-8deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(2deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes celebSubIn {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes celebPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes celebConfetti {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { Gameplay });
