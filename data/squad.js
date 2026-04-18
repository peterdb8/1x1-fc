// FUT Ultimate Team Karten — lokale Assets (Original-Uploads)
window.PLAYER_CARDS = {
  "Jamal Musiala":        "assets/cards/Jamal_Musiala_23643.png",
  "Harry Kane":           "assets/cards/Harry_Kane_21177.png",
  "Manuel Neuer":         "assets/cards/Manuel_Neuer_23786.png",
  "Lennart Karl":         "assets/cards/Lennart_Karl_21595.png",
  "Kim Min-jae":          "assets/cards/Kim_Min_Jae_23260.png",
  "Josip Stanišić":       "assets/cards/Josip_Stanisic_23792.png",
  "Luis Díaz":            "assets/cards/Luis_Diaz_23159.png",
  "Konrad Laimer":        "assets/cards/Konrad_Laimer_23650.png",
  "Michael Olise":        "assets/cards/Michael_Olise_21139.png",
  "Serge Gnabry":         "assets/cards/Serge_Gnabry_23375.png",
  "Joshua Kimmich":       "assets/cards/Joshua_Kimmich_23120.png",
  "Tom Bischof":          "assets/cards/Tom_Bischof_20844.png",
  "Alphonso Davies":      "assets/cards/Alphonso_Davies_21671.png",
  "Dayot Upamecano":      "assets/cards/Dayot_Upamecano_21306.png",
  "Aleksandar Pavlović":  "assets/cards/Aleksandar_Pavlovic_19789.png",
  "Jonathan Tah":         "assets/cards/Jonathan_Tah_20769.png",
  "Raphaël Guerreiro":    "assets/cards/Raphael_Guerreiro_20805.png",
  "Sven Ulreich":         "assets/cards/Sven_Ulreich_21056.png",
  "Leon Goretzka":        "assets/cards/Leon_Goretzka_19326.png",
  "Jonas Urbig":          "assets/cards/Jonas_Urbig_2658.png",
  "Leon Klanac":          "assets/cards/Leon_Klanac_16897.png",
};
window.cardForPlayer = (name) => window.PLAYER_CARDS[name] || null;

// FC Bayern Kader 2025/26 — realistische Trikotnummern
window.BAYERN_SQUAD = [
  // Torhüter
  { n: 1,  name: "Manuel Neuer",       pos: "TW", role: "GK",  c: "🇩🇪", age: 40, rating: 88 },
  { n: 18, name: "Jonas Urbig",        pos: "TW", role: "GK",  c: "🇩🇪", age: 22, rating: 76 },
  { n: 26, name: "Sven Ulreich",       pos: "TW", role: "GK",  c: "🇩🇪", age: 37, rating: 74 },

  // Abwehr
  { n: 2,  name: "Dayot Upamecano",    pos: "IV", role: "CB",  c: "🇫🇷", age: 27, rating: 86 },
  { n: 3,  name: "Kim Min-jae",        pos: "IV", role: "CB",  c: "🇰🇷", age: 29, rating: 84 },
  { n: 4,  name: "Jonathan Tah",       pos: "IV", role: "CB",  c: "🇩🇪", age: 30, rating: 85 },
  { n: 5,  name: "Hiroki Ito",         pos: "IV", role: "CB",  c: "🇯🇵", age: 26, rating: 80 },
  { n: 22, name: "Raphaël Guerreiro",  pos: "LV", role: "LB",  c: "🇵🇹", age: 32, rating: 82 },
  { n: 19, name: "Alphonso Davies",    pos: "LV", role: "LB",  c: "🇨🇦", age: 25, rating: 86 },
  { n: 23, name: "Sacha Boey",         pos: "RV", role: "RB",  c: "🇫🇷", age: 25, rating: 78 },
  { n: 44, name: "Josip Stanišić",     pos: "RV", role: "RB",  c: "🇭🇷", age: 26, rating: 80 },
  { n: 40, name: "Konrad Laimer",      pos: "RV", role: "RB",  c: "🇦🇹", age: 28, rating: 82 },

  // Mittelfeld
  { n: 6,  name: "Joshua Kimmich",     pos: "DM", role: "CDM", c: "🇩🇪", age: 31, rating: 88 },
  { n: 8,  name: "Leon Goretzka",      pos: "ZM", role: "CM",  c: "🇩🇪", age: 31, rating: 82 },
  { n: 24, name: "Aleksandar Pavlović",pos: "ZM", role: "CM",  c: "🇩🇪", age: 21, rating: 81 },
  { n: 45, name: "Tom Bischof",        pos: "ZM", role: "CM",  c: "🇩🇪", age: 20, rating: 75 },

  // Offensive / Flügel
  { n: 7,  name: "Serge Gnabry",       pos: "RA", role: "RW",  c: "🇩🇪", age: 30, rating: 84 },
  { n: 10, name: "Jamal Musiala",      pos: "OM", role: "CAM", c: "🇩🇪", age: 23, rating: 88 },
  { n: 11, name: "Michael Olise",      pos: "RA", role: "RW",  c: "🇫🇷", age: 24, rating: 87 },
  { n: 14, name: "Luis Díaz",          pos: "LA", role: "LW",  c: "🇨🇴", age: 29, rating: 86 },
  { n: 17, name: "Nicolas Jackson",    pos: "ST", role: "ST",  c: "🇸🇳", age: 24, rating: 81 },
  { n: 42, name: "Lennart Karl",       pos: "RA", role: "RW",  c: "🇩🇪", age: 17, rating: 76 },

  // Sturm
  { n: 9,  name: "Harry Kane",         pos: "ST", role: "ST",  c: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 32, rating: 91 },
];

// Positions-Gruppen für Aufstellung
window.POS_GROUPS = {
  GK:  ["GK"],
  DEF: ["CB", "LB", "RB"],
  MID: ["CDM", "CM", "CAM"],
  ATT: ["LW", "RW", "ST"],
};

// Formationen: x,y in Prozent (0=oben eigenes Tor, 100=unten gegnerisches)
window.FORMATIONS = {
  "4-3-3": [
    { id: "GK",  role: "GK",  x: 50, y: 10 },
    { id: "LB",  role: "LB",  x: 15, y: 30 },
    { id: "LCB", role: "CB",  x: 36, y: 25 },
    { id: "RCB", role: "CB",  x: 64, y: 25 },
    { id: "RB",  role: "RB",  x: 85, y: 30 },
    { id: "LCM", role: "CM",  x: 30, y: 50 },
    { id: "CDM", role: "CDM", x: 50, y: 45 },
    { id: "RCM", role: "CM",  x: 70, y: 50 },
    { id: "LW",  role: "LW",  x: 18, y: 75 },
    { id: "ST",  role: "ST",  x: 50, y: 80 },
    { id: "RW",  role: "RW",  x: 82, y: 75 },
  ],
  "4-2-3-1": [
    { id: "GK",  role: "GK",  x: 50, y: 10 },
    { id: "LB",  role: "LB",  x: 15, y: 30 },
    { id: "LCB", role: "CB",  x: 36, y: 25 },
    { id: "RCB", role: "CB",  x: 64, y: 25 },
    { id: "RB",  role: "RB",  x: 85, y: 30 },
    { id: "LDM", role: "CDM", x: 36, y: 45 },
    { id: "RDM", role: "CDM", x: 64, y: 45 },
    { id: "LM",  role: "LW",  x: 20, y: 65 },
    { id: "CAM", role: "CAM", x: 50, y: 65 },
    { id: "RM",  role: "RW",  x: 80, y: 65 },
    { id: "ST",  role: "ST",  x: 50, y: 82 },
  ],
  "4-4-2": [
    { id: "GK",  role: "GK",  x: 50, y: 10 },
    { id: "LB",  role: "LB",  x: 15, y: 30 },
    { id: "LCB", role: "CB",  x: 36, y: 25 },
    { id: "RCB", role: "CB",  x: 64, y: 25 },
    { id: "RB",  role: "RB",  x: 85, y: 30 },
    { id: "LM",  role: "CM",  x: 18, y: 55 },
    { id: "LCM", role: "CM",  x: 40, y: 50 },
    { id: "RCM", role: "CM",  x: 60, y: 50 },
    { id: "RM",  role: "CM",  x: 82, y: 55 },
    { id: "LST", role: "ST",  x: 38, y: 80 },
    { id: "RST", role: "ST",  x: 62, y: 80 },
  ],
};
