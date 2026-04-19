// Alle spielbaren Teams mit Metadaten
window.TEAMS = {
  bayern: {
    id: 'bayern',
    name: 'FC Bayern München',
    shortName: 'Bayern',
    short: 'FCB',
    country: 'de',
    league: 'Bundesliga',
    cup: 'DFB-Pokal',
    colors: { primary: '#DC0817', secondary: '#0A1E3F', accent: '#FFFFFF' },
    badge: 'https://r2.thesportsdb.com/images/media/team/badge/01ogkh1716960412.png',
    stadium: 'Allianz Arena',
    city: 'München'
  },
  liverpool: {
    id: 'liverpool',
    name: 'Liverpool FC',
    shortName: 'Liverpool',
    short: 'LIV',
    country: 'en',
    league: 'Premier League',
    cup: 'FA Cup',
    colors: { primary: '#C8102E', secondary: '#FFFFFF', accent: '#00B2A9' },
    badge: 'https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png',
    stadium: 'Anfield',
    city: 'Liverpool'
  },
  realmadrid: {
    id: 'realmadrid',
    name: 'Real Madrid CF',
    shortName: 'Real Madrid',
    short: 'RMA',
    country: 'es',
    league: 'La Liga',
    cup: 'Copa del Rey',
    colors: { primary: '#FEBE10', secondary: '#00529F', accent: '#FFFFFF' },
    badge: 'https://r2.thesportsdb.com/images/media/team/badge/vwvwrw1473502969.png',
    stadium: 'Santiago Bernabéu',
    city: 'Madrid'
  }
};

// Wettbewerbs-Definitionen
window.COMPETITIONS = {
  cl: {
    id: 'cl',
    name: 'UEFA Champions League',
    shortName: 'Champions League',
    type: 'international',
    icon: '🏆'
  },
  bundesliga: {
    id: 'bundesliga',
    name: 'Bundesliga',
    shortName: 'Bundesliga',
    type: 'league',
    country: 'de',
    icon: '⚽'
  },
  premierleague: {
    id: 'premierleague',
    name: 'Premier League',
    shortName: 'Premier League',
    type: 'league',
    country: 'en',
    icon: '⚽'
  },
  laliga: {
    id: 'laliga',
    name: 'La Liga',
    shortName: 'La Liga',
    type: 'league',
    country: 'es',
    icon: '⚽'
  },
  dfbpokal: {
    id: 'dfbpokal',
    name: 'DFB-Pokal',
    shortName: 'DFB-Pokal',
    type: 'cup',
    country: 'de',
    icon: '🏆'
  },
  facup: {
    id: 'facup',
    name: 'FA Cup',
    shortName: 'FA Cup',
    type: 'cup',
    country: 'en',
    icon: '🏆'
  },
  copadelrey: {
    id: 'copadelrey',
    name: 'Copa del Rey',
    shortName: 'Copa del Rey',
    type: 'cup',
    country: 'es',
    icon: '🏆'
  }
};

// Welche Wettbewerbe sind für welches Team verfügbar
window.TEAM_COMPETITIONS = {
  bayern: ['cl', 'bundesliga', 'dfbpokal'],
  liverpool: ['cl', 'premierleague', 'facup'],
  realmadrid: ['cl', 'laliga', 'copadelrey']
};
