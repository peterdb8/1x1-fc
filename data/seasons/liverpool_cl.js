// Liverpool FC — UEFA Champions League 2025/26
// Realistischer Spielplan

window.LIVERPOOL_CL = [
  // Ligaphase
  { round: "Ligaphase",   mdLabel: "Matchday 1", opp: "AC Milan",           oppShort: "MIL", home: true,  color: "#FB090B", date: "16.09.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 2", opp: "Bologna FC",         oppShort: "BOL", home: false, color: "#1A2B5C", date: "01.10.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 3", opp: "RB Leipzig",         oppShort: "RBL", home: true,  color: "#DD0741", date: "22.10.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 4", opp: "Bayer 04 Leverkusen",oppShort: "B04", home: false, color: "#E32221", date: "05.11.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 5", opp: "Real Madrid",        oppShort: "RMA", home: true,  color: "#FEBE10", date: "25.11.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 6", opp: "Girona FC",          oppShort: "GIR", home: false, color: "#CD2534", date: "10.12.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 7", opp: "Lille OSC",          oppShort: "LIL", home: true,  color: "#D81E3B", date: "21.01.26" },
  { round: "Ligaphase",   mdLabel: "Matchday 8", opp: "PSV Eindhoven",      oppShort: "PSV", home: false, color: "#ED1C24", date: "28.01.26" },

  // K.o.-Phase
  { round: "Playoff",       mdLabel: "Playoff",       opp: "Sporting CP",       oppShort: "SPO", home: true,  color: "#008057", date: "18.02.26", twoLeg: true },
  { round: "Achtelfinale",  mdLabel: "Achtelfinale",  opp: "Atlético Madrid",   oppShort: "ATM", home: false, color: "#CE3524", date: "11.03.26", twoLeg: true },
  { round: "Viertelfinale", mdLabel: "Viertelfinale", opp: "FC Barcelona",      oppShort: "BAR", home: true,  color: "#A50044", date: "08.04.26", twoLeg: true },
  { round: "Halbfinale",    mdLabel: "Halbfinale",    opp: "Manchester City",   oppShort: "MCI", home: false, color: "#6CABDD", date: "29.04.26", twoLeg: true },
  { round: "Finale",        mdLabel: "Finale",        opp: "FC Bayern München", oppShort: "FCB", home: false, color: "#DC0817", date: "30.05.26" },
];

window.LIVERPOOL_CL_DIFFICULTY = {
  "Ligaphase":      { duels: 4, oppSkill: 0.40 },
  "Playoff":        { duels: 5, oppSkill: 0.50 },
  "Achtelfinale":   { duels: 5, oppSkill: 0.60 },
  "Viertelfinale":  { duels: 6, oppSkill: 0.70 },
  "Halbfinale":     { duels: 6, oppSkill: 0.80 },
  "Finale":         { duels: 7, oppSkill: 0.85 },
};
