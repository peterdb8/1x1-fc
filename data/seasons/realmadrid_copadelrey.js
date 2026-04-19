// Real Madrid CF — Copa del Rey 2025/26
// Basierend auf realen Ergebnissen der Saison
// Hinweis: Real Madrid ist im Achtelfinale gegen Albacete ausgeschieden

window.REALMADRID_COPADELREY = [
  { round: "Runde der 32", mdLabel: "Runde der 32", opp: "CF Talavera",    oppShort: "TAL", home: false, color: "#1B4D3E", date: "17.12.25" },
  { round: "Achtelfinale", mdLabel: "Achtelfinale", opp: "Albacete BP",    oppShort: "ALB", home: false, color: "#FFFFFF", date: "14.01.26" },
  // Fiktiv weiter für das Spiel (als ob Real weiterkommt)
  { round: "Viertelfinale", mdLabel: "Viertelfinale", opp: "Real Sociedad", oppShort: "RSO", home: true,  color: "#0067B1", date: "05.02.26" },
  { round: "Halbfinale",    mdLabel: "Halbfinale",    opp: "FC Barcelona",  oppShort: "BAR", home: true,  color: "#A50044", date: "04.03.26", twoLeg: true },
  { round: "Finale",        mdLabel: "Finale",        opp: "Athletic Bilbao",oppShort: "ATH", home: false, color: "#EE2523", date: "18.04.26" },
];

window.COPADELREY_DIFFICULTY = {
  "Runde der 32":  { duels: 3, oppSkill: 0.20 },
  "Achtelfinale":  { duels: 4, oppSkill: 0.35 },
  "Viertelfinale": { duels: 5, oppSkill: 0.55 },
  "Halbfinale":    { duels: 6, oppSkill: 0.75 },
  "Finale":        { duels: 7, oppSkill: 0.80 },
};
