// FC Bayern München — UEFA Champions League 2025/26
// Ligaphase-Gegner + realistische K.o.-Runde

window.BAYERN_CL = [
  // Ligaphase
  { round: "Ligaphase",   mdLabel: "Spieltag 1", opp: "Chelsea FC",         oppShort: "CHE", home: true,  color: "#034694", date: "17.09.25" },
  { round: "Ligaphase",   mdLabel: "Spieltag 2", opp: "Pafos FC",           oppShort: "PAF", home: false, color: "#1E4A8C", date: "30.09.25" },
  { round: "Ligaphase",   mdLabel: "Spieltag 3", opp: "Club Brugge",        oppShort: "BRU", home: true,  color: "#0A2A5E", date: "22.10.25" },
  { round: "Ligaphase",   mdLabel: "Spieltag 4", opp: "Paris Saint-Germain",oppShort: "PSG", home: false, color: "#004170", date: "04.11.25" },
  { round: "Ligaphase",   mdLabel: "Spieltag 5", opp: "Arsenal FC",         oppShort: "ARS", home: false, color: "#EF0107", date: "26.11.25" },
  { round: "Ligaphase",   mdLabel: "Spieltag 6", opp: "Sporting CP",        oppShort: "SPO", home: true,  color: "#008057", date: "09.12.25" },
  { round: "Ligaphase",   mdLabel: "Spieltag 7", opp: "Union SG",           oppShort: "USG", home: true,  color: "#F4BE0C", date: "21.01.26" },
  { round: "Ligaphase",   mdLabel: "Spieltag 8", opp: "PSV Eindhoven",      oppShort: "PSV", home: false, color: "#ED1C24", date: "28.01.26" },

  // K.o.-Phase
  { round: "Playoff",       mdLabel: "Playoff",       opp: "FC Kopenhagen",      oppShort: "COP", home: true,  color: "#14689D", date: "17.02.26", twoLeg: true },
  { round: "Achtelfinale",  mdLabel: "Achtelfinale",  opp: "Inter Mailand",      oppShort: "INT", home: true,  color: "#0068A8", date: "10.03.26", twoLeg: true },
  { round: "Viertelfinale", mdLabel: "Viertelfinale", opp: "Real Madrid",        oppShort: "RMA", home: true,  color: "#FEBE10", date: "15.04.26", twoLeg: true },
  { round: "Halbfinale",    mdLabel: "Halbfinale",    opp: "Paris Saint-Germain",oppShort: "PSG", home: true,  color: "#004170", date: "05.05.26", twoLeg: true },
  { round: "Finale",        mdLabel: "Finale",        opp: "Atlético Madrid",    oppShort: "ATM", home: false, color: "#CE3524", date: "30.05.26" },
];

window.BAYERN_CL_DIFFICULTY = {
  "Ligaphase":      { duels: 4, oppSkill: 0.35 },
  "Playoff":        { duels: 5, oppSkill: 0.45 },
  "Achtelfinale":   { duels: 5, oppSkill: 0.55 },
  "Viertelfinale":  { duels: 6, oppSkill: 0.65 },
  "Halbfinale":     { duels: 6, oppSkill: 0.75 },
  "Finale":         { duels: 7, oppSkill: 0.85 },
};
