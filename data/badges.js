// Team Badges von TheSportsDB (strBadge, CDN: …/images/media/team/badge/)
// Größen: URL + /small (250px) oder /tiny (50px)
// AKTUALISIERT: 2025-04-19 - Alle URLs verifiziert gegen TheSportsDB API
//
// Abdeckung nach Wettbewerb (Saisondaten unter data/seasons/):
//   Bundesliga, Premier League, La Liga, DFB-Pokal, FA Cup, Copa del Rey, Champions League (+ CL-Ligatabelle league_teams.js)
//
// Kurzcodes mit Namenskollisionen (bitte in Spielplänen getrennt halten):
//   BAR = FC Barcelona  |  BAR_ENG = Barnsley FC (England)
//   CEL = RC Celta Vigo  |  CEL_SCO = Celtic Glasgow
//   BRE = Brentford FC   |  SB29 = Stade Brest 29 (Frankreich)
//   BIL = Athletic Bilbao (Alias wie in CL_LEAGUE_TEAMS; gleiches Wappen wie ATH)
//   SPL = Sporting CP (Alias für „Sport Lissabon" in CL_LEAGUE_TEAMS; gleiches Wappen wie SPO)

window.TEAM_BADGES = {
  // === Spielbare Teams ===
  "FCB": "https://r2.thesportsdb.com/images/media/team/badge/01ogkh1716960412.png", // Bayern München
  "LIV": "https://r2.thesportsdb.com/images/media/team/badge/kfaher1737969724.png", // Liverpool
  "RMA": "https://r2.thesportsdb.com/images/media/team/badge/vwvwrw1473502969.png", // Real Madrid

  // === Bundesliga ===
  "RBL": "https://r2.thesportsdb.com/images/media/team/badge/zjgapo1594244951.png", // RB Leipzig
  "FCA": "https://r2.thesportsdb.com/images/media/team/badge/xqyyvq1473453233.png", // FC Augsburg
  "SCF": "https://r2.thesportsdb.com/images/media/team/badge/urwtup1473453288.png", // SC Freiburg (AKTUALISIERT)
  "HSV": "https://r2.thesportsdb.com/images/media/team/badge/tvtppt1473453296.png", // Hamburger SV (AKTUALISIERT)
  "SVW": "https://r2.thesportsdb.com/images/media/team/badge/tkvqan1716960454.png", // Werder Bremen
  "SGE": "https://r2.thesportsdb.com/images/media/team/badge/rurwpy1473453269.png", // Eintracht Frankfurt
  "BVB": "https://r2.thesportsdb.com/images/media/team/badge/tqo8ge1716960353.png", // Borussia Dortmund
  "BOC": "https://r2.thesportsdb.com/images/media/team/badge/kag3jy1599821108.png", // VfL Bochum
  "B04": "https://r2.thesportsdb.com/images/media/team/badge/3x9k851726760113.png", // Bayer Leverkusen
  "FCU": "https://r2.thesportsdb.com/images/media/team/badge/q0o5001599679795.png", // Union Berlin
  "VFB": "https://r2.thesportsdb.com/images/media/team/badge/yppyux1473454085.png", // VfB Stuttgart (AKTUALISIERT)
  "BMG": "https://r2.thesportsdb.com/images/media/team/badge/sysurw1473453380.png", // Borussia M'gladbach (AKTUALISIERT)
  "FCH": "https://r2.thesportsdb.com/images/media/team/badge/lbj7g01608236988.png", // 1. FC Heidenheim (AKTUALISIERT)
  "M05": "https://r2.thesportsdb.com/images/media/team/badge/fhm9v51552134916.png", // 1. FSV Mainz 05 (AKTUALISIERT)
  "WOB": "https://r2.thesportsdb.com/images/media/team/badge/07kp421599680274.png", // VfL Wolfsburg (AKTUALISIERT)
  "TSG": "https://r2.thesportsdb.com/images/media/team/badge/9hwvb21621593919.png", // TSG Hoffenheim (AKTUALISIERT)
  "KSV": "https://r2.thesportsdb.com/images/media/team/badge/1fpmgs1514394524.png", // Holstein Kiel (AKTUALISIERT)

  // === Premier League ===
  "MCI": "https://r2.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png", // Manchester City
  "ARS": "https://r2.thesportsdb.com/images/media/team/badge/uyhbfe1612467038.png", // Arsenal
  "CHE": "https://r2.thesportsdb.com/images/media/team/badge/yvwvtu1448813215.png", // Chelsea
  "MUN": "https://r2.thesportsdb.com/images/media/team/badge/xzqdr11517660252.png", // Manchester United
  "TOT": "https://r2.thesportsdb.com/images/media/team/badge/dfyfhl1604094109.png", // Tottenham
  "NEW": "https://r2.thesportsdb.com/images/media/team/badge/lhwuiz1621593302.png", // Newcastle
  "AVL": "https://r2.thesportsdb.com/images/media/team/badge/jykrpv1717309891.png", // Aston Villa
  "BHA": "https://r2.thesportsdb.com/images/media/team/badge/ywypts1448810904.png", // Brighton (AKTUALISIERT)
  "WHU": "https://r2.thesportsdb.com/images/media/team/badge/yutyxs1467459956.png", // West Ham
  "CRY": "https://r2.thesportsdb.com/images/media/team/badge/ia6i3m1656014992.png", // Crystal Palace
  "FUL": "https://r2.thesportsdb.com/images/media/team/badge/xwwvyt1448811086.png", // Fulham (AKTUALISIERT)
  "WOL": "https://r2.thesportsdb.com/images/media/team/badge/u9qr031621593327.png", // Wolverhampton (AKTUALISIERT)
  "BOU": "https://r2.thesportsdb.com/images/media/team/badge/y08nak1534071116.png", // Bournemouth (AKTUALISIERT)
  "NFO": "https://r2.thesportsdb.com/images/media/team/badge/bk4qjs1546440351.png", // Nottingham Forest (AKTUALISIERT)
  "EVE": "https://r2.thesportsdb.com/images/media/team/badge/eqayrf1523184794.png", // Everton (AKTUALISIERT)
  "BRE": "https://r2.thesportsdb.com/images/media/team/badge/grv1aw1546453779.png", // Brentford (AKTUALISIERT)
  "LEE": "https://r2.thesportsdb.com/images/media/team/badge/jcgrml1756649030.png", // Leeds United (AKTUALISIERT)
  "LEI": "https://r2.thesportsdb.com/images/media/team/badge/xtxwtu1448813356.png", // Leicester City (AKTUALISIERT)
  "SOU": "https://r2.thesportsdb.com/images/media/team/badge/ggqtd01621593274.png", // Southampton (AKTUALISIERT)
  "IPS": "https://r2.thesportsdb.com/images/media/team/badge/mdj1ey1634670785.png", // Ipswich Town (AKTUALISIERT)

  // === La Liga ===
  "BAR": "https://r2.thesportsdb.com/images/media/team/badge/wq9sir1639406443.png", // Barcelona
  "ATM": "https://r2.thesportsdb.com/images/media/team/badge/0ulh3q1719984315.png", // Atlético Madrid
  "ATH": "https://r2.thesportsdb.com/images/media/team/badge/68w7fe1639408210.png", // Athletic Bilbao
  "BIL": "https://r2.thesportsdb.com/images/media/team/badge/68w7fe1639408210.png", // Athletic Bilbao (Alias CL-Tabelle)
  "RSO": "https://r2.thesportsdb.com/images/media/team/badge/vptvpr1473502986.png", // Real Sociedad
  "VIL": "https://r2.thesportsdb.com/images/media/team/badge/vrypqy1473503073.png", // Villarreal
  "BET": "https://r2.thesportsdb.com/images/media/team/badge/2oqulv1663245386.png", // Real Betis
  "GIR": "https://r2.thesportsdb.com/images/media/team/badge/kfu7zu1659897499.png", // Girona (AKTUALISIERT)
  "VCF": "https://r2.thesportsdb.com/images/media/team/badge/dm8l6o1655594864.png", // Valencia
  "CEL": "https://r2.thesportsdb.com/images/media/team/badge/xfjtku1690436219.png", // Celta Vigo (AKTUALISIERT)
  "OSA": "https://r2.thesportsdb.com/images/media/team/badge/rvspvt1473502960.png", // Osasuna (AKTUALISIERT)
  "RAY": "https://r2.thesportsdb.com/images/media/team/badge/nzhu941655595465.png", // Rayo Vallecano (AKTUALISIERT)
  "MLL": "https://r2.thesportsdb.com/images/media/team/badge/ssptsx1473503730.png", // Mallorca (AKTUALISIERT)
  "GET": "https://r2.thesportsdb.com/images/media/team/badge/eyh2891655594452.png", // Getafe (AKTUALISIERT)
  "LPA": "https://r2.thesportsdb.com/images/media/team/badge/mmhyb11616443601.png", // Las Palmas (AKTUALISIERT)
  "ALA": "https://r2.thesportsdb.com/images/media/team/badge/mfn99h1734673842.png", // Alavés (AKTUALISIERT)
  "ESP": "https://r2.thesportsdb.com/images/media/team/badge/867nzz1681703222.png", // Espanyol (AKTUALISIERT)
  "LEV": "https://r2.thesportsdb.com/images/media/team/badge/xwtxsx1473503739.png", // Levante (AKTUALISIERT)
  "VLL": "https://r2.thesportsdb.com/images/media/team/badge/bnhu8b1719983736.png", // Real Valladolid (AKTUALISIERT)
  "OVI": "https://r2.thesportsdb.com/images/media/team/badge/k8cskf1633719920.png", // Real Oviedo
  "SEV": "https://r2.thesportsdb.com/images/media/team/badge/vpsqqx1473502977.png", // Sevilla

  // === Champions League (internationale Teams) ===
  "PSG": "https://r2.thesportsdb.com/images/media/team/badge/rwqrrq1473504808.png", // Paris Saint-Germain
  "INT": "https://r2.thesportsdb.com/images/media/team/badge/ryhu6d1617113103.png", // Inter Mailand (AKTUALISIERT)
  "MIL": "https://r2.thesportsdb.com/images/media/team/badge/wvspur1448806617.png", // AC Milan (AKTUALISIERT)
  "JUV": "https://r2.thesportsdb.com/images/media/team/badge/uxf0gr1742983727.png", // Juventus (AKTUALISIERT)
  "NAP": "https://r2.thesportsdb.com/images/media/team/badge/l8qyxv1742982541.png", // SSC Neapel (AKTUALISIERT)
  "ATA": "https://r2.thesportsdb.com/images/media/team/badge/lrvxg71534873930.png", // Atalanta (AKTUALISIERT)
  "BEN": "https://r2.thesportsdb.com/images/media/team/badge/0pywy21662316682.png", // Benfica (AKTUALISIERT)
  "SPO": "https://r2.thesportsdb.com/images/media/team/badge/ohj6ih1628855978.png", // Sporting CP (AKTUALISIERT)
  "SPL": "https://r2.thesportsdb.com/images/media/team/badge/ohj6ih1628855978.png", // Sporting CP (Alias CL-Tabelle)
  "PSV": "https://r2.thesportsdb.com/images/media/team/badge/xfsz6i1721297428.png", // PSV Eindhoven (AKTUALISIERT)
  "AJX": "https://r2.thesportsdb.com/images/media/team/badge/zg9tii1755495289.png", // Ajax (AKTUALISIERT)
  "BRU": "https://r2.thesportsdb.com/images/media/team/badge/mz8y0q1771129880.png", // Club Brugge (AKTUALISIERT)
  "USG": "https://r2.thesportsdb.com/images/media/team/badge/ljszp41654601742.png", // Union SG (AKTUALISIERT)
  "GS":  "https://r2.thesportsdb.com/images/media/team/badge/io7jk21767941298.png", // Galatasaray (AKTUALISIERT)
  "SLA": "https://r2.thesportsdb.com/images/media/team/badge/l7kl4n1759252139.png", // Slavia Prag (AKTUALISIERT)
  "COP": "https://r2.thesportsdb.com/images/media/team/badge/styqtr1473535513.png", // FC Kopenhagen (AKTUALISIERT)
  "OLY": "https://r2.thesportsdb.com/images/media/team/badge/xckasq1721291508.png", // Olympiakos (AKTUALISIERT)
  "MON": "https://r2.thesportsdb.com/images/media/team/badge/exjf5l1678808044.png", // AS Monaco (AKTUALISIERT)
  "LIL": "https://r2.thesportsdb.com/images/media/team/badge/2giize1534005340.png", // Lille (AKTUALISIERT)
  "OM":  "https://r2.thesportsdb.com/images/media/team/badge/uutsyt1473504764.png", // Olympique Marseille (AKTUALISIERT)
  "BOD": "https://r2.thesportsdb.com/images/media/team/badge/uqpwwx1449165943.png", // Bodø/Glimt (AKTUALISIERT)
  "PAF": "https://r2.thesportsdb.com/images/media/team/badge/xom9xf1579036010.png", // Pafos FC (AKTUALISIERT)
  "QAR": "https://r2.thesportsdb.com/images/media/team/badge/f9h2by1725001244.png", // Qarabag (AKTUALISIERT)
  "SAL": "https://r2.thesportsdb.com/images/media/team/badge/xy1m6m1576416143.png", // RB Salzburg (AKTUALISIERT)
  "CEL_SCO": "https://r2.thesportsdb.com/images/media/team/badge/3uv1641758780002.png", // Celtic FC (Schottland)
  "BOL": "https://r2.thesportsdb.com/images/media/team/badge/2qi1u31655592366.png", // Bologna (AKTUALISIERT)
  "SB29": "https://r2.thesportsdb.com/images/media/team/badge/z69be41598797026.png", // Stade Brest (AKTUALISIERT)
  "FEY": "https://r2.thesportsdb.com/images/media/team/badge/uturtx1473534803.png", // Feyenoord
  "SHK": "https://r2.thesportsdb.com/images/media/team/badge/sqrxsr1421791799.png", // Shakhtar Donetsk (AKTUALISIERT)
  "DKY": "https://r2.thesportsdb.com/images/media/team/badge/stxrpx1447696362.png", // Dynamo Kyiv (AKTUALISIERT)
  "YB":  "https://r2.thesportsdb.com/images/media/team/badge/9mxdoo1534784569.png", // Young Boys Bern (AKTUALISIERT)
  "STE": "https://r2.thesportsdb.com/images/media/team/badge/123g021759420850.png", // FCSB / Steaua (AKTUALISIERT)
  "SPA": "https://r2.thesportsdb.com/images/media/team/badge/j00qct1718287150.png", // Sparta Prag (AKTUALISIERT)
  "STU": "https://r2.thesportsdb.com/images/media/team/badge/ppg0j71578585847.png", // Sturm Graz (AKTUALISIERT)
  "FEN": "https://r2.thesportsdb.com/images/media/team/badge/twxxvs1448199691.png", // Fenerbahce (AKTUALISIERT)
  "BES": "https://r2.thesportsdb.com/images/media/team/badge/cg07mt1679455607.png", // Besiktas (AKTUALISIERT)
  "RAN": "https://r2.thesportsdb.com/images/media/team/badge/ti24j61614290048.png", // Rangers FC (AKTUALISIERT)

  // === DFB-Pokal Teams ===
  "WIE": "https://r2.thesportsdb.com/images/media/team/badge/8clib21565194003.png", // SV Wehen Wiesbaden (AKTUALISIERT)
  "KOE": "https://r2.thesportsdb.com/images/media/team/badge/2j1sc91566049407.png", // 1. FC Köln (AKTUALISIERT)
  "DSC": "https://r2.thesportsdb.com/images/media/team/badge/xrrwpx1447591964.png", // Arminia Bielefeld (AKTUALISIERT)
  "S04": "https://r2.thesportsdb.com/images/media/team/badge/hnci291621593978.png", // Schalke 04 (AKTUALISIERT)
  "D98": "https://r2.thesportsdb.com/images/media/team/badge/5f3dyd1608236981.png", // SV Darmstadt 98 (AKTUALISIERT)
  "FCN": "https://r2.thesportsdb.com/images/media/team/badge/wtj8rd1659904028.png", // 1. FC Nürnberg (AKTUALISIERT)
  "KSC": "https://r2.thesportsdb.com/images/media/team/badge/l784ls1696006504.png", // Karlsruher SC (AKTUALISIERT)
  "HAN": "https://r2.thesportsdb.com/images/media/team/badge/tqpqqv1473454148.png", // Hannover 96 (AKTUALISIERT)
  "F95": "https://r2.thesportsdb.com/images/media/team/badge/rsruww1473454140.png", // Fortuna Düsseldorf (AKTUALISIERT)
  "STP": "https://r2.thesportsdb.com/images/media/team/badge/5qupxa1608237013.png", // FC St. Pauli
  "EBS": "https://r2.thesportsdb.com/images/media/team/badge/lrrq0z1599820707.png", // Eintracht Braunschweig (AKTUALISIERT)

  // === FA Cup Teams ===
  "BAR_ENG": "https://r2.thesportsdb.com/images/media/team/badge/xvxsuv1447437855.png", // Barnsley FC
  "SHU": "https://r2.thesportsdb.com/images/media/team/badge/w7f8pj1672950689.png", // Sheffield United (AKTUALISIERT)
  "SHW": "https://r2.thesportsdb.com/images/media/team/badge/lonnw91601721029.png", // Sheffield Wednesday (AKTUALISIERT)
  "WBA": "https://r2.thesportsdb.com/images/media/team/badge/rsvuxw1448813527.png", // West Brom (AKTUALISIERT)
  "MID": "https://r2.thesportsdb.com/images/media/team/badge/9xcx0p1770828600.png", // Middlesbrough (AKTUALISIERT)
  "BUR": "https://r2.thesportsdb.com/images/media/team/badge/ql7nl31686893820.png", // Burnley (AKTUALISIERT)
  "NOR": "https://r2.thesportsdb.com/images/media/team/badge/pabczm1679951464.png", // Norwich City (AKTUALISIERT)
  "QPR": "https://r2.thesportsdb.com/images/media/team/badge/l4qscx1601721022.png", // QPR (AKTUALISIERT)
  "STK": "https://r2.thesportsdb.com/images/media/team/badge/d16frn1678807158.png", // Stoke City (AKTUALISIERT)
  "HUL": "https://r2.thesportsdb.com/images/media/team/badge/fbqqda1601726113.png", // Hull City (AKTUALISIERT)
  "DER": "https://r2.thesportsdb.com/images/media/team/badge/jioo4z1557155744.png", // Derby County (AKTUALISIERT)

  // === Copa del Rey Teams ===
  "TAL": "https://r2.thesportsdb.com/images/media/team/badge/bqvskt1690612476.png", // CF Talavera (AKTUALISIERT)
  "ALB": "https://r2.thesportsdb.com/images/media/team/badge/17oqja1616436316.png", // Albacete (AKTUALISIERT)
  "TEN": "https://r2.thesportsdb.com/images/media/team/badge/utuqys1420503958.png", // CD Tenerife (AKTUALISIERT)
  "ZAR": "https://r2.thesportsdb.com/images/media/team/badge/sxpwxs1473503702.png", // Real Zaragoza (AKTUALISIERT)
  "ELC": "https://r2.thesportsdb.com/images/media/team/badge/e4vaw51655594332.png", // Elche CF (AKTUALISIERT)
  "CAD": "https://r2.thesportsdb.com/images/media/team/badge/e2phzp1639408503.png", // Cádiz CF (AKTUALISIERT)
  "LEG": "https://r2.thesportsdb.com/images/media/team/badge/tm0adr1616443898.png", // CD Leganés (AKTUALISIERT)
  "GRA": "https://r2.thesportsdb.com/images/media/team/badge/f9iss11677472689.png", // Granada CF (AKTUALISIERT)
};

// Helper: Badge-URL mit optionaler Größe
window.getBadgeUrl = function(teamShort, size = null) {
  const badge = window.TEAM_BADGES[teamShort];
  if (!badge) return null;
  if (!size) return badge;
  // Größen: /small (250px), /tiny (50px)
  return badge + '/' + size;
};

// Helper: Badge oder Fallback (Initialen-Circle)
window.getTeamBadge = function(teamShort) {
  return window.TEAM_BADGES[teamShort] || null;
};
