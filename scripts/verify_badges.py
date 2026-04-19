#!/usr/bin/env python3
"""One-off: resolve TEAM_BADGES URLs via TheSportsDB searchteams API + HTTP check."""
import json
import re
import subprocess
import sys
import time
import urllib.parse

BADGES_PATH = "data/badges.js"
API = "https://www.thesportsdb.com/api/v1/json/3/searchteams.php"

# Extra Versuche wenn die erste Suche leer/falsch ist
ALT_NAMES = {
    "SGE": ["Eintracht Frankfurt"],
    "B04": ["Bayer Leverkusen"],
    "M05": ["Mainz", "Mainz 05", "FSV Mainz"],
    "BMG": ["Borussia Mönchengladbach", "Borussia Monchengladbach"],
    "SCF": ["Freiburg"],
    "FCA": ["FC Augsburg"],
    "BOC": ["VfL Bochum"],
    "FCH": ["FC Heidenheim", "Heidenheim"],
    "WOB": ["Wolfsburg", "VfL Wolfsburg"],
    "TSG": ["Hoffenheim", "TSG Hoffenheim"],
    "KSV": ["Holstein Kiel"],
    "HSV": ["Hamburg", "Hamburger SV"],
    "SVW": ["Werder Bremen"],
    "VFB": ["Stuttgart", "VfB Stuttgart"],
    "FCU": ["Union Berlin"],
    "RBL": ["RB Leipzig"],
    "BVB": ["Borussia Dortmund"],
    "DSC": ["Arminia Bielefeld"],
    "D98": ["Darmstadt 98"],
    "S04": ["Schalke"],
    "FCN": ["Nurnberg", "Nürnberg"],
    "KSC": ["Karlsruher SC"],
    "F95": ["Fortuna Dusseldorf", "Düsseldorf"],
    "STP": ["St Pauli", "St. Pauli"],
    "EBS": ["Eintracht Braunschweig"],
    "WIE": ["Wehen Wiesbaden"],
    "KOE": ["FC Koln", "Köln"],
    "NAP": ["Napoli"],
    "INT": ["Inter Milan"],
    "MIL": ["AC Milan"],
    "ATA": ["Atalanta"],
    "JUV": ["Juventus"],
    "OM": ["Marseille", "Olympique Marseille"],
    "MON": ["AS Monaco"],
    "LIL": ["Lille OSC"],
    "GS": ["Galatasaray"],
    "SLA": ["Slavia Prague"],
    "COP": ["FC Copenhagen", "Kobenhavn"],
    "OLY": ["Olympiakos"],
    "BOD": ["Bodo Glimt"],
    "PAF": ["Pafos"],
    "QAR": ["Qarabag"],
    "SAL": ["Red Bull Salzburg"],
    "SB29": ["Brest"],
    "FEY": ["Feyenoord"],
    "SHK": ["Shakhtar"],
    "DKY": ["Dynamo Kyiv", "Dynamo Kiev"],
    "YB": ["Young Boys"],
    "STE": ["FCSB", "Steaua Bucharest"],
    "SPA": ["Sparta Prague"],
    "STU": ["Sturm Graz"],
    "FEN": ["Fenerbahce"],
    "BES": ["Besiktas"],
    "RAN": ["Rangers"],
    "CEL_SCO": ["Celtic"],
    "BOL": ["Bologna"],
    "VCF": ["Valencia"],
    "MLL": ["Mallorca"],
    "RSO": ["Real Sociedad"],
    "VIL": ["Villarreal"],
    "BET": ["Real Betis"],
    "GIR": ["Girona"],
    "GET": ["Getafe"],
    "LPA": ["Las Palmas"],
    "ALA": ["Alaves"],
    "ESP": ["Espanyol"],
    "LEV": ["Levante"],
    "VLL": ["Real Valladolid"],
    "OVI": ["Real Oviedo"],
    "SEV": ["Sevilla"],
    "RAY": ["Rayo Vallecano"],
    "OSA": ["Osasuna"],
    "ATH": ["Athletic Bilbao"],
    "BIL": ["Athletic Bilbao"],
    "ATM": ["Atletico Madrid"],
    "BAR": ["Barcelona"],
    "NFO": ["Nottingham Forest"],
    "WHU": ["West Ham United", "West Ham"],
    "BHA": ["Brighton and Hove Albion", "Brighton Hove Albion", "Brighton"],
    "MCI": ["Manchester City"],
    "MUN": ["Manchester United"],
    "NEW": ["Newcastle"],
    "AVL": ["Aston Villa"],
    "CRY": ["Crystal Palace"],
    "WOL": ["Wolverhampton"],
    "BOU": ["Bournemouth"],
    "LEE": ["Leeds United"],
    "LEI": ["Leicester"],
    "SOU": ["Southampton"],
    "IPS": ["Ipswich"],
    "EVE": ["Everton"],
    "BRE": ["Brentford"],
    "FUL": ["Fulham"],
    "TOT": ["Tottenham"],
    "ARS": ["Arsenal"],
    "CHE": ["Chelsea"],
    "SHU": ["Sheffield United"],
    "SHW": ["Sheffield Wednesday"],
    "WBA": ["West Bromwich"],
    "MID": ["Middlesbrough"],
    "BUR": ["Burnley"],
    "NOR": ["Norwich"],
    "QPR": ["Queens Park Rangers"],
    "STK": ["Stoke City"],
    "HUL": ["Hull City"],
    "DER": ["Derby County"],
    "BAR_ENG": ["Barnsley"],
    "TAL": ["Talavera"],
    "ALB": ["Albacete"],
    "TEN": ["Tenerife"],
    "ZAR": ["Zaragoza"],
    "ELC": ["Elche"],
    "CAD": ["Cadiz"],
    "LEG": ["Leganes"],
    "GRA": ["Granada"],
    "SPO": ["Sporting CP"],
    "SPL": ["Sporting CP"],
    "BEN": ["Benfica"],
    "BRU": ["Club Brugge"],
    "USG": ["Union Saint-Gilloise"],
    "PSV": ["PSV Eindhoven"],
    "AJX": ["Ajax"],
    "PSG": ["Paris Saint-Germain"],
    "FCB": ["Bayern Munich"],
    "LIV": ["Liverpool"],
    "RMA": ["Real Madrid"],
    "CEL": ["Celta Vigo"],
}


def curl_json(url: str):
    out = subprocess.check_output(["curl", "-sS", "--max-time", "25", url], text=True)
    return json.loads(out)


def http_code(url: str) -> int:
    try:
        out = subprocess.check_output(
            ["curl", "-sS", "-o", "/dev/null", "-w", "%{http_code}", "-L", "--max-time", "25", url],
            text=True,
        )
        return int(out.strip())
    except Exception:
        return 0


def search_badge(team_key: str, comment: str) -> str | None:
    base = comment.split("(")[0].strip()
    raw_queries = []
    if team_key in ALT_NAMES:
        raw_queries.extend(ALT_NAMES[team_key])
    raw_queries.append(base)
    queries = []
    seen_q = set()
    for q in raw_queries:
        q = (q or "").strip()
        if q and q not in seen_q:
            seen_q.add(q)
            queries.append(q)
    for q in queries:
        url = API + "?t=" + urllib.parse.quote(q)
        try:
            data = curl_json(url)
        except Exception:
            time.sleep(0.2)
            continue
        teams = data.get("teams") or []
        if not teams:
            time.sleep(0.35)
            continue
        for team in teams:
            sp = team.get("strSport")
            if sp and sp != "Soccer":
                continue
            badge = team.get("strBadge")
            if not badge:
                continue
            if http_code(badge) == 200:
                return badge
        time.sleep(0.35)
    return None


def main():
    text = open(BADGES_PATH, encoding="utf-8").read()
    pat = re.compile(
        r'^\s*"(?P<key>[^"]+)":\s*"(?P<url>https://r2\.thesportsdb\.com[^"]+)",\s*//\s*(?P<comment>.*)$',
        re.MULTILINE,
    )
    rows = list(pat.finditer(text))
    if not rows:
        print("No matches", file=sys.stderr)
        sys.exit(1)

    key_to_badge: dict[str, str] = {}
    for m in rows:
        key, old_url, comment = m.group("key"), m.group("url"), m.group("comment")
        code = http_code(old_url)
        if code == 200:
            key_to_badge[key] = old_url
            print(f"OK  {key}", flush=True)
            continue
        print(f"404 {key} -> lookup…", flush=True)
        nb = search_badge(key, comment)
        if not nb:
            print(f"FAIL {key} ({comment!r})", file=sys.stderr)
            sys.exit(1)
        key_to_badge[key] = nb
        time.sleep(0.28)

    out_lines = []
    for m in rows:
        key, comment = m.group("key"), m.group("comment")
        url = key_to_badge[key]
        out_lines.append(f'  "{key}": "{url}", // {comment}')

    block = "window.TEAM_BADGES = {\n" + "\n".join(out_lines) + "\n};"
    if "window.TEAM_BADGES = {" not in text:
        sys.exit(1)
    new_text = re.sub(
        r"window\.TEAM_BADGES = \{[\s\S]*?\n\};",
        block,
        text,
        count=1,
    )
    open(BADGES_PATH, "w", encoding="utf-8").write(new_text)
    print("Wrote", BADGES_PATH)


if __name__ == "__main__":
    main()
