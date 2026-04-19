// Real Madrid CF — UEFA Champions League 2025/26
// Realistischer Spielplan

window.REALMADRID_CL = [
  // Ligaphase
  { round: "Ligaphase",   mdLabel: "Matchday 1", opp: "VfB Stuttgart",      oppShort: "VFB", home: true,  color: "#E32219", date: "17.09.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 2", opp: "Lille OSC",          oppShort: "LIL", home: false, color: "#D81E3B", date: "01.10.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 3", opp: "Borussia Dortmund",  oppShort: "BVB", home: true,  color: "#FDE100", date: "21.10.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 4", opp: "AC Milan",           oppShort: "MIL", home: false, color: "#FB090B", date: "04.11.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 5", opp: "Liverpool FC",       oppShort: "LIV", home: false, color: "#C8102E", date: "25.11.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 6", opp: "Atalanta Bergamo",   oppShort: "ATA", home: true,  color: "#1E71B8", date: "09.12.25" },
  { round: "Ligaphase",   mdLabel: "Matchday 7", opp: "RB Salzburg",        oppShort: "SAL", home: false, color: "#ED1C24", date: "20.01.26" },
  { round: "Ligaphase",   mdLabel: "Matchday 8", opp: "Stade Brest",        oppShort: "BRE", home: true,  color: "#E30613", date: "28.01.26" },

  // K.o.-Phase
  { round: "Playoff",       mdLabel: "Playoff",       opp: "Celtic FC",          oppShort: "CEL", home: true,  color: "#009E60", date: "18.02.26", twoLeg: true },
  { round: "Achtelfinale",  mdLabel: "Achtelfinale",  opp: "Manchester City",    oppShort: "MCI", home: false, color: "#6CABDD", date: "10.03.26", twoLeg: true },
  { round: "Viertelfinale", mdLabel: "Viertelfinale", opp: "FC Bayern München",  oppShort: "FCB", home: false, color: "#DC0817", date: "07.04.26", twoLeg: true },
  { round: "Halbfinale",    mdLabel: "Halbfinale",    opp: "Arsenal FC",         oppShort: "ARS", home: true,  color: "#EF0107", date: "28.04.26", twoLeg: true },
  { round: "Finale",        mdLabel: "Finale",        opp: "Paris Saint-Germain",oppShort: "PSG", home: false, color: "#004170", date: "30.05.26" },
];

window.REALMADRID_CL_DIFFICULTY = {
  "Ligaphase":      { duels: 4, oppSkill: 0.40 },
  "Playoff":        { duels: 5, oppSkill: 0.45 },
  "Achtelfinale":   { duels: 5, oppSkill: 0.65 },
  "Viertelfinale":  { duels: 6, oppSkill: 0.70 },
  "Halbfinale":     { duels: 6, oppSkill: 0.75 },
  "Finale":         { duels: 7, oppSkill: 0.90 },
};
