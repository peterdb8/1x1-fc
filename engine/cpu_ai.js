// CPU-KI für 1×1 FC — Vereinfachte Version basierend auf EA FC-Konzepten
// Zwei Schichten: Team Intent (2 Hz) + Player Actions (10 Hz)
// Mathe-Duelle bleiben zentral, KI steuert nur Bewegung & Entscheidungen

window.CpuAI = (function() {
  'use strict';

  // ============================================================
  // TEAM INTENTS — Globale Teamabsicht, wechselt alle 0.5-2 Sek
  // ============================================================
  const INTENTS = {
    BUILD_UP: 'build_up',           // Ruhiger Spielaufbau
    DIRECT_ATTACK: 'direct_attack', // Schneller Angriff
    COUNTER: 'counter',             // Konter nach Ballgewinn
    HIGH_PRESS: 'high_press',       // Hohes Pressing
    DEFEND_DEEP: 'defend_deep',     // Tief verteidigen
    PROTECT_LEAD: 'protect_lead',   // Führung verwalten
  };

  // ============================================================
  // ARCHETYPES — Unterschiedliche Gegner-Persönlichkeiten
  // Werden anhand von oppSkill ausgewählt
  // ============================================================
  const ARCHETYPES = {
    // Schwache Teams (oppSkill < 0.35): Defensiv, warten ab
    defensive: {
      name: 'Defensiv',
      lineHeight: 0.30,        // Tief stehen (0 = eigenes Tor, 1 = Mittellinie+)
      pressIntensity: 0.25,    // Wenig Pressing
      passRisk: 0.20,          // Sichere Pässe
      shotPatience: 0.80,      // Warten auf gute Chancen
      counterSpeed: 0.60,      // Langsame Konter
      supportDistance: 0.70,   // Enge Abstände
    },
    // Mittlere Teams (oppSkill 0.35-0.65): Ausgewogen
    balanced: {
      name: 'Ausgewogen',
      lineHeight: 0.50,
      pressIntensity: 0.50,
      passRisk: 0.45,
      shotPatience: 0.55,
      counterSpeed: 0.75,
      supportDistance: 0.55,
    },
    // Starke Teams (oppSkill 0.65-0.80): Offensiv, mutig
    offensive: {
      name: 'Offensiv',
      lineHeight: 0.65,
      pressIntensity: 0.70,
      passRisk: 0.60,
      shotPatience: 0.40,
      counterSpeed: 0.85,
      supportDistance: 0.45,
    },
    // Elite Teams (oppSkill > 0.80): Dominant, hohes Pressing
    dominant: {
      name: 'Dominant',
      lineHeight: 0.75,
      pressIntensity: 0.85,
      passRisk: 0.70,
      shotPatience: 0.30,      // Schießen schnell
      counterSpeed: 0.95,
      supportDistance: 0.35,
    },
  };

  // ============================================================
  // TEAM BRAIN — Zustand des CPU-Teams
  // ============================================================
  function createTeamBrain(oppSkill = 0.5) {
    const archetype = selectArchetype(oppSkill);
    return {
      intent: INTENTS.BUILD_UP,
      intentStartedAt: 0,
      archetype: archetype,
      params: { ...ARCHETYPES[archetype] },
      oppSkill: oppSkill,
      lastTurnoverAt: 0,
      hasBall: false,
      scoreDiff: 0,           // positiv = CPU führt
      matchMinute: 0,
    };
  }

  function selectArchetype(oppSkill) {
    if (oppSkill < 0.35) return 'defensive';
    if (oppSkill < 0.65) return 'balanced';
    if (oppSkill < 0.80) return 'offensive';
    return 'dominant';
  }

  // ============================================================
  // INTENT TRANSITIONS — Wann wechselt die Teamabsicht?
  // ============================================================
  function updateIntent(brain, ctx) {
    const { weHaveBall, ballX, timeNow, scoreDiff, matchMinute } = ctx;
    const minIntentDuration = 1500; // Mindestens 1.5 Sek pro Intent

    if (timeNow - brain.intentStartedAt < minIntentDuration) return;

    const oldIntent = brain.intent;
    let newIntent = oldIntent;

    // --- Konter-Logik ---
    if (weHaveBall && timeNow - brain.lastTurnoverAt < 4000 && ballX > 40) {
      // Gerade Ball gewonnen und noch im Spielaufbau
      newIntent = INTENTS.COUNTER;
    }
    // --- Führung verwalten (letzte 25% des Spiels) ---
    else if (scoreDiff > 0 && matchMinute > 3.75) { // 3:45 von 5:00
      newIntent = INTENTS.PROTECT_LEAD;
    }
    // --- Hohes Pressing wenn wir hinten liegen ---
    else if (scoreDiff < 0 && matchMinute > 3 && !weHaveBall) {
      newIntent = INTENTS.HIGH_PRESS;
    }
    // --- Mit Ball: Angriff je nach Position ---
    else if (weHaveBall) {
      if (ballX < 35) {
        newIntent = INTENTS.BUILD_UP;
      } else if (ballX > 70) {
        newIntent = INTENTS.DIRECT_ATTACK;
      } else {
        // Mitteldrittel: abhängig von Archetyp
        newIntent = brain.params.passRisk > 0.5 ? INTENTS.DIRECT_ATTACK : INTENTS.BUILD_UP;
      }
    }
    // --- Ohne Ball: Pressing oder Verteidigen ---
    else {
      if (ballX > 60 && brain.params.pressIntensity > 0.5) {
        newIntent = INTENTS.HIGH_PRESS;
      } else {
        newIntent = INTENTS.DEFEND_DEEP;
      }
    }

    if (newIntent !== oldIntent) {
      brain.intent = newIntent;
      brain.intentStartedAt = timeNow;
    }
  }

  // ============================================================
  // PLAYER ACTIONS — Entscheidung pro Spieler
  // ============================================================

  // Rollen-basierte Prioritäten
  const ROLE_BEHAVIOR = {
    GK: { stayHome: 0.95, pressRange: 0, supportAttack: 0 },
    CB: { stayHome: 0.70, pressRange: 15, supportAttack: 0.15 },
    LB: { stayHome: 0.50, pressRange: 20, supportAttack: 0.35 },
    RB: { stayHome: 0.50, pressRange: 20, supportAttack: 0.35 },
    CDM: { stayHome: 0.55, pressRange: 25, supportAttack: 0.30 },
    CM: { stayHome: 0.40, pressRange: 30, supportAttack: 0.50 },
    LM: { stayHome: 0.35, pressRange: 25, supportAttack: 0.60 },
    RM: { stayHome: 0.35, pressRange: 25, supportAttack: 0.60 },
    CAM: { stayHome: 0.25, pressRange: 30, supportAttack: 0.75 },
    LW: { stayHome: 0.20, pressRange: 20, supportAttack: 0.80 },
    RW: { stayHome: 0.20, pressRange: 20, supportAttack: 0.80 },
    ST: { stayHome: 0.15, pressRange: 35, supportAttack: 0.90 },
  };

  function getPlayerTarget(player, brain, ctx) {
    const { ballPos, ownerPos, weHaveBall, players, dt } = ctx;
    const role = ROLE_BEHAVIOR[player.role] || ROLE_BEHAVIOR.CM;
    const params = brain.params;

    // Basis: Home-Position
    let target = { x: player.home.x, y: player.home.y };
    let speed = 11; // Basis-Geschwindigkeit

    // === MIT BALL (CPU hat Ball) ===
    if (weHaveBall) {
      if (player.hasBall) {
        // Dieser Spieler hat den Ball → Dribbeln/Passen wird separat gehandhabt
        return { target: { x: 10, y: 50 }, speed: 10, action: 'dribble' };
      }

      // Unterstützungslauf basierend auf Intent
      const supportBonus = role.supportAttack * (1 - params.supportDistance);

      if (brain.intent === INTENTS.COUNTER) {
        // Konter: Schnell nach vorne
        const pushX = Math.max(5, player.home.x - 30 * supportBonus);
        target = { x: pushX, y: player.home.y + (Math.random() - 0.5) * 15 };
        speed = 13 * params.counterSpeed;
      } else if (brain.intent === INTENTS.DIRECT_ATTACK) {
        // Angriff: Stark aufrücken
        const pushX = Math.max(8, player.home.x - 25 * supportBonus);
        target = biasToward(player.home, { x: pushX, y: player.home.y }, 0.7);
        speed = 12;
      } else if (brain.intent === INTENTS.BUILD_UP) {
        // Aufbau: Leicht aufrücken, Anspielstationen bieten
        const pushX = Math.max(15, player.home.x - 12 * supportBonus);
        target = biasToward({ x: pushX, y: player.home.y }, ballPos, 0.2);
        speed = 10;
      } else if (brain.intent === INTENTS.PROTECT_LEAD) {
        // Ball halten: Weniger aufrücken
        target = biasToward(player.home, ballPos, 0.15);
        speed = 9;
      }
    }
    // === OHNE BALL (Spieler hat Ball) ===
    else {
      if (brain.intent === INTENTS.HIGH_PRESS) {
        // Hohes Pressing: Mehrere Spieler jagen den Ball
        const distToBall = dist(player, ballPos);
        const isPressCandidate = distToBall < role.pressRange + 15 * params.pressIntensity;

        if (isPressCandidate && role.pressRange > 0) {
          // Direkt auf Ballbesitzer
          target = ownerPos || ballPos;
          speed = 12 + 2 * params.pressIntensity;
        } else {
          // Passwege zustellen: Position zwischen Ballbesitzer und eigenem Tor
          const cutX = Math.max(player.home.x, (ballPos.x + player.home.x) / 2);
          target = { x: cutX, y: player.home.y * 0.7 + ballPos.y * 0.3 };
          speed = 10;
        }
      } else if (brain.intent === INTENTS.DEFEND_DEEP) {
        // Tief verteidigen: Formation halten, leicht zum Ball orientieren
        const lineX = 100 - params.lineHeight * 35; // Je höher lineHeight, desto weiter vorne
        const adjustedHome = {
          x: Math.max(player.home.x, lineX - (100 - player.home.x) * 0.3),
          y: player.home.y
        };
        target = biasToward(adjustedHome, ballPos, 0.25 * params.pressIntensity);
        speed = 10;
      } else {
        // Standard: Zwischen Home und Ball
        target = biasToward(player.home, ballPos, 0.3);
        speed = 10;
      }
    }

    return { target, speed, action: 'move' };
  }

  // ============================================================
  // PASS-ENTSCHEIDUNG — Wann passt die CPU?
  // ============================================================
  function shouldPass(player, brain, ctx) {
    const { players, ballPos, timeNow, lastPassAt } = ctx;

    // Cooldown
    if (timeNow - lastPassAt < 1800) return null;

    // Zufallskomponente basierend auf passRisk
    const baseChance = 0.012 + brain.params.passRisk * 0.015; // 1.2% - 2.7% pro Frame
    if (Math.random() > baseChance) return null;

    // Finde besten Passempfänger
    const teammates = players.filter(p => p.team === 'opp' && p.id !== player.id && p.role !== 'GK');

    // Sortiere nach Progressivität (näher am Spielertor = besser)
    const sorted = teammates
      .map(t => ({
        player: t,
        progressValue: (player.x - t.x) + (brain.intent === INTENTS.COUNTER ? 20 : 0),
        distance: dist(player, t),
      }))
      .filter(t => t.distance > 8 && t.distance < 40) // Nicht zu nah, nicht zu weit
      .sort((a, b) => b.progressValue - a.progressValue);

    if (sorted.length === 0) return null;

    // Wähle aus Top 3 mit Gewichtung
    const candidates = sorted.slice(0, 3);
    const totalWeight = candidates.reduce((s, c) => s + Math.max(1, c.progressValue + 10), 0);
    let r = Math.random() * totalWeight;

    for (const c of candidates) {
      r -= Math.max(1, c.progressValue + 10);
      if (r <= 0) return c.player;
    }

    return candidates[0]?.player || null;
  }

  // ============================================================
  // SCHUSS-ENTSCHEIDUNG — Wann schießt die CPU?
  // ============================================================
  function shouldShoot(player, brain, ctx) {
    const { timeNow, lastShotAt, matchMinute } = ctx;

    // Cooldown
    if (timeNow - lastShotAt < 5000) return false;

    // Position: Muss nah am gegnerischen Tor sein (x < 22)
    const distanceToGoal = player.x;
    if (distanceToGoal > 22) return false;

    // Winkel: Muss halbwegs zentral sein
    const yFromCenter = Math.abs(player.y - 50);
    if (yFromCenter > 25) return false;

    // Basis-Wahrscheinlichkeit basierend auf Position
    let shootProb = 0;

    if (distanceToGoal < 10) {
      // Im Strafraum: Hohe Chance
      shootProb = 0.08 - yFromCenter * 0.002;
    } else if (distanceToGoal < 16) {
      // Nahe Strafraum
      shootProb = 0.04 - yFromCenter * 0.001;
    } else {
      // Fernschuss
      shootProb = 0.015 * brain.params.passRisk; // Nur riskante Teams schießen von weit
    }

    // Geduld-Modifikator
    shootProb *= (1.2 - brain.params.shotPatience);

    // Druck wenn hinten (letzte Minute)
    if (brain.scoreDiff < 0 && matchMinute > 4) {
      shootProb *= 1.5;
    }

    return Math.random() < shootProb;
  }

  // ============================================================
  // PRESSING-TRIGGER — Wer presst?
  // ============================================================
  function getPressingPlayers(brain, ctx) {
    const { players, ballPos, ownerPos } = ctx;
    const oppPlayers = players.filter(p => p.team === 'opp' && p.role !== 'GK');

    // Anzahl Presser basierend auf Intensität
    const maxPressers = Math.floor(1 + brain.params.pressIntensity * 2.5); // 1-3 Spieler

    // Sortiere nach Distanz zum Ball
    const sorted = oppPlayers
      .map(p => ({ player: p, dist: dist(p, ballPos) }))
      .sort((a, b) => a.dist - b.dist);

    // Gib die nächsten N Spieler zurück
    return sorted.slice(0, maxPressers).map(s => s.player.id);
  }

  // ============================================================
  // HILFSFUNKTIONEN
  // ============================================================
  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function biasToward(home, target, weight) {
    return {
      x: home.x * (1 - weight) + target.x * weight,
      y: home.y * (1 - weight) + target.y * weight,
    };
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  return {
    INTENTS,
    ARCHETYPES,
    createTeamBrain,
    updateIntent,
    getPlayerTarget,
    shouldPass,
    shouldShoot,
    getPressingPlayers,
    selectArchetype,
  };
})();
