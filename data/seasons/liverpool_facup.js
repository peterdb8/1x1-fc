// Liverpool FC — FA Cup 2025/26
// Basierend auf realen Ergebnissen der Saison

window.LIVERPOOL_FACUP = [
  { round: "Third Round",    mdLabel: "3. Runde",      opp: "Barnsley FC",         oppShort: "BAR", home: true,  color: "#D2001C", date: "10.01.26" },
  { round: "Fourth Round",   mdLabel: "4. Runde",      opp: "Brighton & Hove",     oppShort: "BHA", home: true,  color: "#0057B8", date: "14.02.26" },
  { round: "Fifth Round",    mdLabel: "5. Runde",      opp: "Wolverhampton",       oppShort: "WOL", home: false, color: "#FDB913", date: "06.03.26" },
  { round: "Quarter-Final",  mdLabel: "Viertelfinale", opp: "Manchester City",     oppShort: "MCI", home: false, color: "#6CABDD", date: "04.04.26" },
  { round: "Semi-Final",     mdLabel: "Halbfinale",    opp: "Chelsea FC",          oppShort: "CHE", home: false, color: "#034694", date: "25.04.26" },
  { round: "Final",          mdLabel: "Finale",        opp: "Arsenal FC",          oppShort: "ARS", home: false, color: "#EF0107", date: "16.05.26" },
];

window.FACUP_DIFFICULTY = {
  "Third Round":   { duels: 3, oppSkill: 0.25 },
  "Fourth Round":  { duels: 4, oppSkill: 0.45 },
  "Fifth Round":   { duels: 4, oppSkill: 0.50 },
  "Quarter-Final": { duels: 5, oppSkill: 0.70 },
  "Semi-Final":    { duels: 6, oppSkill: 0.75 },
  "Final":         { duels: 7, oppSkill: 0.80 },
};
