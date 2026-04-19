// Liverpool FC — Premier League 2025/26
// Realistischer Spielplan basierend auf offiziellen Quellen

window.LIVERPOOL_PREMIERLEAGUE = [
  // Hinrunde (Matches 1-19)
  { round: "Matchday 1",  mdLabel: "Matchday 1",  opp: "AFC Bournemouth",    oppShort: "BOU", home: true,  color: "#DA291C", date: "15.08.25" },
  { round: "Matchday 2",  mdLabel: "Matchday 2",  opp: "Newcastle United",   oppShort: "NEW", home: false, color: "#241F20", date: "23.08.25" },
  { round: "Matchday 3",  mdLabel: "Matchday 3",  opp: "Arsenal FC",         oppShort: "ARS", home: false, color: "#EF0107", date: "30.08.25" },
  { round: "Matchday 4",  mdLabel: "Matchday 4",  opp: "Nottingham Forest",  oppShort: "NFO", home: true,  color: "#DD0000", date: "13.09.25" },
  { round: "Matchday 5",  mdLabel: "Matchday 5",  opp: "Everton FC",         oppShort: "EVE", home: true,  color: "#003399", date: "20.09.25" },
  { round: "Matchday 6",  mdLabel: "Matchday 6",  opp: "Brighton & Hove",    oppShort: "BHA", home: false, color: "#0057B8", date: "27.09.25" },
  { round: "Matchday 7",  mdLabel: "Matchday 7",  opp: "Chelsea FC",         oppShort: "CHE", home: true,  color: "#034694", date: "04.10.25" },
  { round: "Matchday 8",  mdLabel: "Matchday 8",  opp: "Manchester United",  oppShort: "MUN", home: true,  color: "#DA291C", date: "18.10.25" },
  { round: "Matchday 9",  mdLabel: "Matchday 9",  opp: "West Ham United",    oppShort: "WHU", home: false, color: "#7A263A", date: "25.10.25" },
  { round: "Matchday 10", mdLabel: "Matchday 10", opp: "Aston Villa",        oppShort: "AVL", home: true,  color: "#95BFE5", date: "01.11.25" },
  { round: "Matchday 11", mdLabel: "Matchday 11", opp: "Manchester City",    oppShort: "MCI", home: false, color: "#6CABDD", date: "08.11.25" },
  { round: "Matchday 12", mdLabel: "Matchday 12", opp: "Southampton FC",     oppShort: "SOU", home: true,  color: "#D71920", date: "22.11.25" },
  { round: "Matchday 13", mdLabel: "Matchday 13", opp: "Crystal Palace",     oppShort: "CRY", home: false, color: "#1B458F", date: "29.11.25" },
  { round: "Matchday 14", mdLabel: "Matchday 14", opp: "Tottenham Hotspur",  oppShort: "TOT", home: true,  color: "#132257", date: "03.12.25" },
  { round: "Matchday 15", mdLabel: "Matchday 15", opp: "Wolverhampton",      oppShort: "WOL", home: false, color: "#FDB913", date: "06.12.25" },
  { round: "Matchday 16", mdLabel: "Matchday 16", opp: "Leeds United",       oppShort: "LEE", home: true,  color: "#FFCD00", date: "13.12.25" },
  { round: "Matchday 17", mdLabel: "Matchday 17", opp: "Fulham FC",          oppShort: "FUL", home: false, color: "#000000", date: "21.12.25" },
  { round: "Matchday 18", mdLabel: "Matchday 18", opp: "Leicester City",     oppShort: "LEI", home: true,  color: "#003090", date: "26.12.25" },
  { round: "Matchday 19", mdLabel: "Matchday 19", opp: "Ipswich Town",       oppShort: "IPS", home: false, color: "#0044AA", date: "28.12.25" },

  // Rückrunde (Matches 20-38)
  { round: "Matchday 20", mdLabel: "Matchday 20", opp: "AFC Bournemouth",    oppShort: "BOU", home: false, color: "#DA291C", date: "10.01.26" },
  { round: "Matchday 21", mdLabel: "Matchday 21", opp: "Newcastle United",   oppShort: "NEW", home: true,  color: "#241F20", date: "17.01.26" },
  { round: "Matchday 22", mdLabel: "Matchday 22", opp: "Arsenal FC",         oppShort: "ARS", home: true,  color: "#EF0107", date: "24.01.26" },
  { round: "Matchday 23", mdLabel: "Matchday 23", opp: "Nottingham Forest",  oppShort: "NFO", home: false, color: "#DD0000", date: "31.01.26" },
  { round: "Matchday 24", mdLabel: "Matchday 24", opp: "Manchester City",    oppShort: "MCI", home: true,  color: "#6CABDD", date: "07.02.26" },
  { round: "Matchday 25", mdLabel: "Matchday 25", opp: "Brighton & Hove",    oppShort: "BHA", home: true,  color: "#0057B8", date: "14.02.26" },
  { round: "Matchday 26", mdLabel: "Matchday 26", opp: "Chelsea FC",         oppShort: "CHE", home: false, color: "#034694", date: "21.02.26" },
  { round: "Matchday 27", mdLabel: "Matchday 27", opp: "West Ham United",    oppShort: "WHU", home: true,  color: "#7A263A", date: "28.02.26" },
  { round: "Matchday 28", mdLabel: "Matchday 28", opp: "Aston Villa",        oppShort: "AVL", home: false, color: "#95BFE5", date: "07.03.26" },
  { round: "Matchday 29", mdLabel: "Matchday 29", opp: "Southampton FC",     oppShort: "SOU", home: false, color: "#D71920", date: "14.03.26" },
  { round: "Matchday 30", mdLabel: "Matchday 30", opp: "Crystal Palace",     oppShort: "CRY", home: true,  color: "#1B458F", date: "21.03.26" },
  { round: "Matchday 31", mdLabel: "Matchday 31", opp: "Tottenham Hotspur",  oppShort: "TOT", home: false, color: "#132257", date: "04.04.26" },
  { round: "Matchday 32", mdLabel: "Matchday 32", opp: "Wolverhampton",      oppShort: "WOL", home: true,  color: "#FDB913", date: "11.04.26" },
  { round: "Matchday 33", mdLabel: "Matchday 33", opp: "Everton FC",         oppShort: "EVE", home: false, color: "#003399", date: "18.04.26" },
  { round: "Matchday 34", mdLabel: "Matchday 34", opp: "Leeds United",       oppShort: "LEE", home: false, color: "#FFCD00", date: "25.04.26" },
  { round: "Matchday 35", mdLabel: "Matchday 35", opp: "Manchester United",  oppShort: "MUN", home: false, color: "#DA291C", date: "02.05.26" },
  { round: "Matchday 36", mdLabel: "Matchday 36", opp: "Fulham FC",          oppShort: "FUL", home: true,  color: "#000000", date: "09.05.26" },
  { round: "Matchday 37", mdLabel: "Matchday 37", opp: "Leicester City",     oppShort: "LEI", home: false, color: "#003090", date: "16.05.26" },
  { round: "Matchday 38", mdLabel: "Matchday 38", opp: "Brentford FC",       oppShort: "BRE", home: true,  color: "#E30613", date: "23.05.26" },
];

window.PREMIERLEAGUE_DIFFICULTY = {
  default: { duels: 4, oppSkill: 0.40 }
};

// Alle Premier League-Teams 2025/26
window.PREMIERLEAGUE_TEAMS = [
  { name: "Liverpool FC",       short: "LIV", color: "#C8102E", skill: 0.90 },
  { name: "Manchester City",    short: "MCI", color: "#6CABDD", skill: 0.92 },
  { name: "Arsenal FC",         short: "ARS", color: "#EF0107", skill: 0.88 },
  { name: "Chelsea FC",         short: "CHE", color: "#034694", skill: 0.85 },
  { name: "Manchester United",  short: "MUN", color: "#DA291C", skill: 0.82 },
  { name: "Tottenham Hotspur",  short: "TOT", color: "#132257", skill: 0.80 },
  { name: "Newcastle United",   short: "NEW", color: "#241F20", skill: 0.78 },
  { name: "Aston Villa",        short: "AVL", color: "#95BFE5", skill: 0.78 },
  { name: "Brighton & Hove",    short: "BHA", color: "#0057B8", skill: 0.76 },
  { name: "West Ham United",    short: "WHU", color: "#7A263A", skill: 0.74 },
  { name: "Crystal Palace",     short: "CRY", color: "#1B458F", skill: 0.72 },
  { name: "Fulham FC",          short: "FUL", color: "#000000", skill: 0.72 },
  { name: "Wolverhampton",      short: "WOL", color: "#FDB913", skill: 0.72 },
  { name: "AFC Bournemouth",    short: "BOU", color: "#DA291C", skill: 0.70 },
  { name: "Nottingham Forest",  short: "NFO", color: "#DD0000", skill: 0.72 },
  { name: "Everton FC",         short: "EVE", color: "#003399", skill: 0.70 },
  { name: "Brentford FC",       short: "BRE", color: "#E30613", skill: 0.72 },
  { name: "Leeds United",       short: "LEE", color: "#FFCD00", skill: 0.74 },
  { name: "Leicester City",     short: "LEI", color: "#003090", skill: 0.70 },
  { name: "Southampton FC",     short: "SOU", color: "#D71920", skill: 0.66 },
  { name: "Ipswich Town",       short: "IPS", color: "#0044AA", skill: 0.64 },
];
