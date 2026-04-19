// FC Bayern München — DFB-Pokal 2025/26
// Basierend auf realen Ergebnissen der Saison

window.BAYERN_DFBPOKAL = [
  { round: "1. Runde",      mdLabel: "1. Runde",      opp: "SV Wehen Wiesbaden", oppShort: "WIE", home: false, color: "#E30613", date: "27.08.25" },
  { round: "2. Runde",      mdLabel: "2. Runde",      opp: "1. FC Köln",         oppShort: "KOE", home: false, color: "#ED1C24", date: "29.10.25" },
  { round: "Achtelfinale",  mdLabel: "Achtelfinale",  opp: "1. FC Union Berlin", oppShort: "FCU", home: false, color: "#EB1923", date: "03.12.25" },
  { round: "Viertelfinale", mdLabel: "Viertelfinale", opp: "RB Leipzig",         oppShort: "RBL", home: true,  color: "#DD0741", date: "11.02.26" },
  { round: "Halbfinale",    mdLabel: "Halbfinale",    opp: "Bayer 04 Leverkusen",oppShort: "B04", home: false, color: "#E32221", date: "21.04.26" },
  { round: "Finale",        mdLabel: "Finale",        opp: "Arminia Bielefeld",  oppShort: "DSC", home: false, color: "#004D9D", date: "23.05.26" },
];

window.DFBPOKAL_DIFFICULTY = {
  "1. Runde":      { duels: 3, oppSkill: 0.25 },
  "2. Runde":      { duels: 4, oppSkill: 0.35 },
  "Achtelfinale":  { duels: 4, oppSkill: 0.45 },
  "Viertelfinale": { duels: 5, oppSkill: 0.55 },
  "Halbfinale":    { duels: 6, oppSkill: 0.70 },
  "Finale":        { duels: 7, oppSkill: 0.65 },
};
