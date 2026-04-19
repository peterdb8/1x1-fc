// FC Bayern München — Bundesliga 2025/26
// Realistischer Spielplan basierend auf offiziellen Quellen

window.BAYERN_BUNDESLIGA = [
  // Hinrunde
  { round: "Spieltag 1",  mdLabel: "1. Spieltag",  opp: "RB Leipzig",          oppShort: "RBL", home: true,  color: "#DD0741", date: "22.08.25" },
  { round: "Spieltag 2",  mdLabel: "2. Spieltag",  opp: "FC Augsburg",         oppShort: "FCA", home: false, color: "#BA3733", date: "30.08.25" },
  { round: "Spieltag 3",  mdLabel: "3. Spieltag",  opp: "SC Freiburg",         oppShort: "SCF", home: true,  color: "#000000", date: "13.09.25" },
  { round: "Spieltag 4",  mdLabel: "4. Spieltag",  opp: "Hamburger SV",        oppShort: "HSV", home: true,  color: "#0A3D79", date: "20.09.25" },
  { round: "Spieltag 5",  mdLabel: "5. Spieltag",  opp: "Werder Bremen",       oppShort: "SVW", home: false, color: "#1D9053", date: "27.09.25" },
  { round: "Spieltag 6",  mdLabel: "6. Spieltag",  opp: "Eintracht Frankfurt", oppShort: "SGE", home: true,  color: "#E1000F", date: "04.10.25" },
  { round: "Spieltag 7",  mdLabel: "7. Spieltag",  opp: "Borussia Dortmund",   oppShort: "BVB", home: true,  color: "#FDE100", date: "18.10.25" },
  { round: "Spieltag 8",  mdLabel: "8. Spieltag",  opp: "VfL Bochum",          oppShort: "BOC", home: false, color: "#005BA0", date: "25.10.25" },
  { round: "Spieltag 9",  mdLabel: "9. Spieltag",  opp: "Bayer 04 Leverkusen", oppShort: "B04", home: true,  color: "#E32221", date: "01.11.25" },
  { round: "Spieltag 10", mdLabel: "10. Spieltag", opp: "Union Berlin",        oppShort: "FCU", home: false, color: "#EB1923", date: "08.11.25" },
  { round: "Spieltag 11", mdLabel: "11. Spieltag", opp: "VfB Stuttgart",       oppShort: "VFB", home: true,  color: "#E32219", date: "22.11.25" },
  { round: "Spieltag 12", mdLabel: "12. Spieltag", opp: "Borussia M'gladbach", oppShort: "BMG", home: false, color: "#000000", date: "29.11.25" },
  { round: "Spieltag 13", mdLabel: "13. Spieltag", opp: "1. FC Heidenheim",    oppShort: "FCH", home: true,  color: "#E30613", date: "06.12.25" },
  { round: "Spieltag 14", mdLabel: "14. Spieltag", opp: "1. FSV Mainz 05",     oppShort: "M05", home: false, color: "#C3141E", date: "13.12.25" },
  { round: "Spieltag 15", mdLabel: "15. Spieltag", opp: "VfL Wolfsburg",       oppShort: "WOB", home: true,  color: "#65B32E", date: "20.12.25" },
  { round: "Spieltag 16", mdLabel: "16. Spieltag", opp: "TSG Hoffenheim",      oppShort: "TSG", home: false, color: "#1961B5", date: "10.01.26" },
  { round: "Spieltag 17", mdLabel: "17. Spieltag", opp: "Holstein Kiel",       oppShort: "KSV", home: true,  color: "#003D7E", date: "17.01.26" },

  // Rückrunde
  { round: "Spieltag 18", mdLabel: "18. Spieltag", opp: "RB Leipzig",          oppShort: "RBL", home: false, color: "#DD0741", date: "24.01.26" },
  { round: "Spieltag 19", mdLabel: "19. Spieltag", opp: "FC Augsburg",         oppShort: "FCA", home: true,  color: "#BA3733", date: "31.01.26" },
  { round: "Spieltag 20", mdLabel: "20. Spieltag", opp: "SC Freiburg",         oppShort: "SCF", home: false, color: "#000000", date: "07.02.26" },
  { round: "Spieltag 21", mdLabel: "21. Spieltag", opp: "Hamburger SV",        oppShort: "HSV", home: false, color: "#0A3D79", date: "14.02.26" },
  { round: "Spieltag 22", mdLabel: "22. Spieltag", opp: "Werder Bremen",       oppShort: "SVW", home: true,  color: "#1D9053", date: "21.02.26" },
  { round: "Spieltag 23", mdLabel: "23. Spieltag", opp: "Eintracht Frankfurt", oppShort: "SGE", home: false, color: "#E1000F", date: "28.02.26" },
  { round: "Spieltag 24", mdLabel: "24. Spieltag", opp: "Borussia Dortmund",   oppShort: "BVB", home: false, color: "#FDE100", date: "07.03.26" },
  { round: "Spieltag 25", mdLabel: "25. Spieltag", opp: "VfL Bochum",          oppShort: "BOC", home: true,  color: "#005BA0", date: "14.03.26" },
  { round: "Spieltag 26", mdLabel: "26. Spieltag", opp: "Bayer 04 Leverkusen", oppShort: "B04", home: false, color: "#E32221", date: "21.03.26" },
  { round: "Spieltag 27", mdLabel: "27. Spieltag", opp: "Union Berlin",        oppShort: "FCU", home: true,  color: "#EB1923", date: "04.04.26" },
  { round: "Spieltag 28", mdLabel: "28. Spieltag", opp: "VfB Stuttgart",       oppShort: "VFB", home: false, color: "#E32219", date: "11.04.26" },
  { round: "Spieltag 29", mdLabel: "29. Spieltag", opp: "Borussia M'gladbach", oppShort: "BMG", home: true,  color: "#000000", date: "18.04.26" },
  { round: "Spieltag 30", mdLabel: "30. Spieltag", opp: "1. FC Heidenheim",    oppShort: "FCH", home: false, color: "#E30613", date: "25.04.26" },
  { round: "Spieltag 31", mdLabel: "31. Spieltag", opp: "1. FSV Mainz 05",     oppShort: "M05", home: true,  color: "#C3141E", date: "02.05.26" },
  { round: "Spieltag 32", mdLabel: "32. Spieltag", opp: "VfL Wolfsburg",       oppShort: "WOB", home: false, color: "#65B32E", date: "09.05.26" },
  { round: "Spieltag 33", mdLabel: "33. Spieltag", opp: "TSG Hoffenheim",      oppShort: "TSG", home: true,  color: "#1961B5", date: "16.05.26" },
  { round: "Spieltag 34", mdLabel: "34. Spieltag", opp: "Holstein Kiel",       oppShort: "KSV", home: false, color: "#003D7E", date: "23.05.26" },
];

window.BUNDESLIGA_DIFFICULTY = {
  default: { duels: 4, oppSkill: 0.35 }
};

// Alle Bundesliga-Teams 2025/26
window.BUNDESLIGA_TEAMS = [
  { name: "FC Bayern München",   short: "FCB", color: "#DC0817", skill: 0.92 },
  { name: "Bayer 04 Leverkusen", short: "B04", color: "#E32221", skill: 0.88 },
  { name: "Borussia Dortmund",   short: "BVB", color: "#FDE100", skill: 0.85 },
  { name: "RB Leipzig",          short: "RBL", color: "#DD0741", skill: 0.84 },
  { name: "VfB Stuttgart",       short: "VFB", color: "#E32219", skill: 0.82 },
  { name: "Eintracht Frankfurt", short: "SGE", color: "#E1000F", skill: 0.80 },
  { name: "SC Freiburg",         short: "SCF", color: "#000000", skill: 0.76 },
  { name: "Werder Bremen",       short: "SVW", color: "#1D9053", skill: 0.74 },
  { name: "1. FSV Mainz 05",     short: "M05", color: "#C3141E", skill: 0.72 },
  { name: "Borussia M'gladbach", short: "BMG", color: "#000000", skill: 0.74 },
  { name: "VfL Wolfsburg",       short: "WOB", color: "#65B32E", skill: 0.72 },
  { name: "Union Berlin",        short: "FCU", color: "#EB1923", skill: 0.70 },
  { name: "FC Augsburg",         short: "FCA", color: "#BA3733", skill: 0.68 },
  { name: "TSG Hoffenheim",      short: "TSG", color: "#1961B5", skill: 0.70 },
  { name: "VfL Bochum",          short: "BOC", color: "#005BA0", skill: 0.64 },
  { name: "1. FC Heidenheim",    short: "FCH", color: "#E30613", skill: 0.66 },
  { name: "Holstein Kiel",       short: "KSV", color: "#003D7E", skill: 0.62 },
  { name: "Hamburger SV",        short: "HSV", color: "#0A3D79", skill: 0.72 },
];
