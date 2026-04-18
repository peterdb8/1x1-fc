// Main Menu / Saison-Übersicht (Bracket)
const MainMenu = ({ onStartMatch, seasonState, onReset, difficulty, setDifficulty, onOpenLearn }) => {
  const season = window.CL_SEASON;
  const profile = window.MathEngine.loadProfile();

  const accuracy = profile.totalAttempts > 0 ? Math.round(profile.totalCorrect / profile.totalAttempts * 100) : 0;
  const totalAttempts = profile.totalAttempts;
  const weakest = window.MathEngine.weakestTasks(profile, 3);

  // Durchschnittliche Antwortzeit über alle Aufgaben mit Daten
  let totalMs = 0, totalWithTime = 0;
  Object.values(profile.tasks).forEach(t => {
    if (t.avgMs > 0 && t.attempts > 0) { totalMs += t.avgMs * t.attempts; totalWithTime += t.attempts; }
  });
  const avgMs = totalWithTime > 0 ? Math.round(totalMs / totalWithTime) : 0;
  const avgSec = (avgMs / 1000).toFixed(1);

  // Ziel: < 3 s, 100 %
  const TIME_TARGET_MS = 3000;
  const timeProgress = avgMs === 0 ? 0 : Math.max(0, Math.min(1, TIME_TARGET_MS / avgMs));
  const accProgress = accuracy / 100;
  const timeHit = avgMs > 0 && avgMs < TIME_TARGET_MS;
  const accHit = accuracy >= 100 && totalAttempts > 0;

  const rounds = [
    { key: "Ligaphase", label: "Ligaphase", items: season.slice(0, 8) },
    { key: "Playoff", label: "Playoff", items: season.slice(8, 9) },
    { key: "Achtelfinale", label: "Achtelfinale", items: season.slice(9, 10) },
    { key: "Viertelfinale", label: "Viertelfinale", items: season.slice(10, 11) },
    { key: "Halbfinale", label: "Halbfinale", items: season.slice(11, 12) },
    { key: "Finale", label: "Finale", items: season.slice(12, 13) },
  ];

  const resultFor = (idx) => seasonState.results.find(r => r.idx === idx);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 28px 80px" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0A1E3F 0%, #14295E 100%)",
        borderRadius: 20, padding: "28px 32px", color: "white",
        marginBottom: 28, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -60, top: -60, width: 240, height: 240, borderRadius: "50%", background: "#DC0817", opacity: 0.2 }} />
        <div style={{ position: "absolute", right: 40, bottom: -40, width: 120, height: 120, borderRadius: "50%", background: "#FFB800", opacity: 0.25 }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 3, color: "#FFB800" }}>UEFA CHAMPIONS LEAGUE · 2025/26</div>
            <h1 style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 52, margin: "4px 0 0", letterSpacing: "-1.5px", lineHeight: 1 }}>1×1 FC</h1>
            <div style={{ marginTop: 8, fontFamily: "Inter", fontSize: 15, opacity: 0.85 }}>
              Führe den FC Bayern zum Titel. Bei jedem Torschuss entscheidet eine 1×1-Aufgabe.
            </div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <Stat k="Spiele" v={`${seasonState.results.length}/13`} />
            <Stat k="Aufgaben" v={totalAttempts} />
          </div>
        </div>
      </div>

      {/* 1×1 KPIs */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 2.5, color: "#DC0817", textTransform: "uppercase" }}>Dein 1×1 Scouting-Report</div>
            <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 26, letterSpacing: "-0.8px", color: "#0A1E3F", marginTop: 2 }}>Saisonform</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {totalAttempts === 0 && (
              <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280" }}>Spiele dein erstes Match, um Daten zu sammeln.</div>
            )}
            {onOpenLearn && (
              <button onClick={onOpenLearn} style={{
                background: "#0A1E3F", color: "white", border: "none",
                borderRadius: 10, padding: "10px 16px", cursor: "pointer",
                fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 1.5,
                display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
              }}>
                VOLLER REPORT →
              </button>
            )}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <KpiCard
            eyebrow="Reaktion"
            label="Ø Antwortzeit"
            bigValue={totalAttempts > 0 ? avgSec : "—"}
            unit={totalAttempts > 0 ? "s" : ""}
            target="Ziel: unter 3,0 s"
            progress={timeProgress}
            hit={timeHit}
            accent="#0A4FFF"
            diff={totalAttempts > 0 ? `${timeHit ? "−" : "+"}${Math.abs(avgMs - TIME_TARGET_MS) / 1000 >= 10 ? "10+" : (Math.abs(avgMs - TIME_TARGET_MS) / 1000).toFixed(1)} s` : "—"}
            diffLabel={timeHit ? "unter Ziel" : "über Ziel"}
          />
          <KpiCard
            eyebrow="Treffsicherheit"
            label="Richtige Antworten"
            bigValue={totalAttempts > 0 ? accuracy : "—"}
            unit={totalAttempts > 0 ? "%" : ""}
            target="Ziel: 100 %"
            progress={accProgress}
            hit={accHit}
            accent="#DC0817"
            diff={totalAttempts > 0 ? `${profile.totalCorrect}/${profile.totalAttempts}` : "—"}
            diffLabel="letzte Duelle"
          />
        </div>
      </div>

      {/* Schwierigkeit */}
      <div style={{ background: "white", borderRadius: 18, padding: "18px 22px", marginBottom: 24, border: "2px solid #EDEFF5" }}>
        <SectionHead eyebrow="Vor dem Anpfiff" title="Schwierigkeitsstufe" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { k: "easy", t: "Leicht", s: "Ohne Zeitbegrenzung", color: "#2D7A3E" },
            { k: "medium", t: "Mittel", s: "20 Sekunden pro Aufgabe", color: "#FFB800" },
            { k: "hard", t: "Schwer", s: "3 Sekunden pro Aufgabe", color: "#DC0817" },
          ].map(d => (
            <button key={d.k}
              onClick={() => setDifficulty(d.k)}
              style={{
                background: difficulty === d.k ? d.color : "white",
                color: difficulty === d.k ? "white" : "#0A1E3F",
                border: `3px solid ${difficulty === d.k ? d.color : "#EDEFF5"}`,
                borderRadius: 14, padding: "16px 14px", cursor: "pointer",
                textAlign: "left", transition: "all 0.15s",
              }}>
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 20, letterSpacing: "-0.5px" }}>{d.t}</div>
              <div style={{ fontFamily: "Inter", fontSize: 13, opacity: 0.85, marginTop: 2 }}>{d.s}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Bracket */}
      <SectionHead
        eyebrow="Saison-Plan"
        title="Weg zum Finale"
        right={
          <BigButton variant="ghost" onClick={onReset} style={{ fontSize: 12, padding: "10px 14px" }}>
            Saison zurücksetzen
          </BigButton>
        }
      />

      {rounds.map(group => (
        <div key={group.key} style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 13, letterSpacing: 1.5, color: "#DC0817", textTransform: "uppercase", marginBottom: 8 }}>
            {group.label}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {group.items.map(m => {
              const idx = season.indexOf(m);
              const result = resultFor(idx);
              const isNext = idx === seasonState.currentMatchIdx && !result;
              const isLocked = idx > seasonState.currentMatchIdx;
              return (
                <MatchCard key={idx}
                  match={m}
                  result={result}
                  isNext={isNext}
                  isLocked={isLocked}
                  onClick={() => !isLocked && !result && onStartMatch(idx)}
                />
              );
            })}
          </div>
          {group.key === "Ligaphase" && <LigaphaseTable seasonState={seasonState} />}
        </div>
      ))}

      {/* Adaptive Info */}
      {weakest.length > 0 && (
        <div style={{ background: "white", borderRadius: 18, padding: "18px 22px", marginTop: 24, border: "2px solid #EDEFF5" }}>
          <SectionHead
            eyebrow="Dein Lernprofil"
            title="Das üben wir nochmal"
            right={onOpenLearn && (
              <button onClick={onOpenLearn} style={{
                background: "transparent", color: "#0A1E3F",
                border: "2px solid #EDEFF5", borderRadius: 10,
                padding: "8px 14px", cursor: "pointer",
                fontFamily: "'Archivo Black',sans-serif", fontSize: 10, letterSpacing: 1.5,
              }}>
                ALLE DETAILS →
              </button>
            )}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {weakest.map(w => {
              const [a, b] = w.key.split("x");
              const acc = Math.round(w.accuracy * 100);
              return (
                <div key={w.key} style={{ background: "#FFF3D6", border: "2px solid #FFB800", borderRadius: 12, padding: "10px 14px" }}>
                  <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 22, color: "#0A1E3F" }}>{a} × {b}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 12, color: "#666" }}>{acc}% · {w.avgMs}ms ø</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ k, v }) => (
  <div style={{ textAlign: "right" }}>
    <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 30, color: "white", letterSpacing: "-0.5px", lineHeight: 1 }}>{v}</div>
    <div style={{ fontFamily: "Inter", fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 }}>{k}</div>
  </div>
);

const MatchCard = ({ match, result, isNext, isLocked, onClick }) => {
  const bg = result ? (result.outcome === "W" ? "#E8F5EC" : result.outcome === "D" ? "#FFF8E0" : "#FDEDED")
    : isNext ? "white" : isLocked ? "#F4F5F8" : "white";
  const borderColor = isNext ? "#DC0817" : result ? (result.outcome === "W" ? "#2D7A3E" : result.outcome === "D" ? "#FFB800" : "#DC0817") : "#EDEFF5";
  return (
    <div onClick={onClick}
      style={{
        background: bg,
        border: `3px solid ${borderColor}`,
        borderRadius: 14, padding: "12px 14px",
        cursor: isLocked || result ? "default" : "pointer",
        opacity: isLocked ? 0.5 : 1,
        position: "relative",
        minHeight: 86,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "Inter", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "#999", fontWeight: 700 }}>
          {match.mdLabel}
        </div>
        {isNext && (
          <div style={{ background: "#DC0817", color: "white", fontFamily: "'Archivo Black',sans-serif", fontSize: 9, padding: "3px 8px", borderRadius: 20, letterSpacing: 1 }}>
            NÄCHSTES
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8, background: match.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Archivo Black',sans-serif", fontSize: 13, color: "white", flexShrink: 0,
        }}>{match.oppShort}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 14, color: "#0A1E3F", letterSpacing: "-0.3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {match.home ? "FCB vs " : "@ "}{match.opp}
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 11, color: "#666" }}>
            {result ? `${result.myScore}:${result.oppScore} · ${result.outcome === "W" ? "Sieg" : result.outcome === "D" ? "Remis" : "Niederlage"}` : match.date}
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { MainMenu });

// ============================================================
// LIGAPHASEN-TABELLE (alle 36 Teams, FCB highlighted)
// ============================================================
function LigaphaseTable({ seasonState }) {
  const [expanded, setExpanded] = React.useState(false);
  const rows = React.useMemo(() => window.LeagueTable.computeTable(seasonState), [seasonState]);
  const fcbRow = rows.find(r => r.team.short === "FCB");
  const playedCount = seasonState.results.filter(r => r.idx < 8).length;

  // Zeilen-Slots: Top 8 (Achtelfinale), 9–24 (Playoffs), 25–36 (raus)
  const slotBg = (pos) => {
    if (pos <= 8) return { border: "#2D7A3E", bg: "#E8F5EC" };
    if (pos <= 24) return { border: "#FFB800", bg: "#FFF8E0" };
    return { border: "#EDEFF5", bg: "white" };
  };

  const visibleRows = expanded ? rows : rows.slice(0, Math.max(12, (fcbRow?.position || 1) + 3));

  return (
    <div style={{ marginTop: 16, background: "white", borderRadius: 18, padding: "18px 20px 14px", border: "2px solid #EDEFF5" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 10, letterSpacing: 2.5, color: "#DC0817", textTransform: "uppercase" }}>
            UEFA Champions League · Ligaphase
          </div>
          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 22, letterSpacing: "-0.5px", color: "#0A1E3F", marginTop: 2 }}>
            Tabelle · Spieltag {playedCount}/8
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Legend color="#2D7A3E" label="Achtelfinale (1–8)" />
          <Legend color="#FFB800" label="Playoff (9–24)" />
          <Legend color="#BCC3D1" label="Aus (25–36)" />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 3px", minWidth: 640, fontFamily: "Inter", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#6B7280", textAlign: "left", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>
              <th style={{ width: 36, padding: "0 4px" }}>#</th>
              <th style={{ padding: "0 6px" }}>Verein</th>
              <th style={{ textAlign: "center", width: 34 }}>Sp</th>
              <th style={{ textAlign: "center", width: 28 }}>S</th>
              <th style={{ textAlign: "center", width: 28 }}>U</th>
              <th style={{ textAlign: "center", width: 28 }}>N</th>
              <th style={{ textAlign: "center", width: 58 }}>Tore</th>
              <th style={{ textAlign: "center", width: 44 }}>Diff</th>
              <th style={{ textAlign: "center", width: 40 }}>Pkt</th>
              <th style={{ width: 88, textAlign: "center" }}>Form</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(r => {
              const isFcb = r.team.short === "FCB";
              const { border, bg } = slotBg(r.position);
              return (
                <tr key={r.idx} style={{
                  background: isFcb ? "#DC0817" : bg,
                  color: isFcb ? "white" : "#0A1E3F",
                  fontWeight: isFcb ? 700 : 500,
                }}>
                  <td style={{ padding: "8px 4px 8px 10px", borderRadius: "10px 0 0 10px", fontFamily: "'Archivo Black',sans-serif", fontSize: 14, position: "relative" }}>
                    <div style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: 4, background: isFcb ? "#FFB800" : border, borderRadius: 2 }} />
                    {r.position}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 5,
                        background: r.team.color,
                        color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Archivo Black',sans-serif", fontSize: 9, letterSpacing: 0.3,
                        flexShrink: 0,
                        border: isFcb ? "2px solid white" : "none",
                      }}>{r.team.short}</div>
                      <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 13, letterSpacing: "-0.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.team.name}
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>{r.played}</td>
                  <td style={{ textAlign: "center" }}>{r.w}</td>
                  <td style={{ textAlign: "center" }}>{r.d}</td>
                  <td style={{ textAlign: "center" }}>{r.l}</td>
                  <td style={{ textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{r.gf}:{r.ga}</td>
                  <td style={{ textAlign: "center", fontWeight: 700 }}>{r.gd > 0 ? `+${r.gd}` : r.gd}</td>
                  <td style={{ textAlign: "center", fontFamily: "'Archivo Black',sans-serif", fontSize: 15, padding: "8px 6px" }}>{r.pts}</td>
                  <td style={{ padding: "8px 10px 8px 6px", borderRadius: "0 10px 10px 0" }}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      {Array.from({ length: 5 }).map((_, i) => {
                        const v = r.form[i];
                        const c = v === "W" ? "#2D7A3E" : v === "D" ? "#FFB800" : v === "L" ? "#DC0817" : "rgba(0,0,0,0.08)";
                        return (
                          <div key={i} title={v || "—"} style={{
                            width: 13, height: 13, borderRadius: 3, background: c,
                            border: isFcb && !v ? "1px solid rgba(255,255,255,0.25)" : "none",
                          }} />
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length > visibleRows.length && (
        <button onClick={() => setExpanded(true)} style={{
          marginTop: 10, width: "100%", padding: "10px 14px",
          background: "transparent", border: "2px dashed #EDEFF5", borderRadius: 10,
          fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 1.5,
          color: "#6B7280", cursor: "pointer",
        }}>
          ALLE 36 TEAMS ANZEIGEN (+{rows.length - visibleRows.length})
        </button>
      )}
      {expanded && (
        <button onClick={() => setExpanded(false)} style={{
          marginTop: 10, width: "100%", padding: "10px 14px",
          background: "transparent", border: "2px dashed #EDEFF5", borderRadius: 10,
          fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 1.5,
          color: "#6B7280", cursor: "pointer",
        }}>
          EINKLAPPEN
        </button>
      )}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 4, height: 14, background: color, borderRadius: 2 }} />
      <div style={{ fontFamily: "Inter", fontSize: 10, color: "#6B7280", fontWeight: 600, letterSpacing: 0.3 }}>{label}</div>
    </div>
  );
}

// ============================================================
// KPI Card mit halbrundem Gauge
// ============================================================
function KpiCard({ eyebrow, label, bigValue, unit, target, progress, hit, accent, diff, diffLabel }) {
  // Halbkreis-Gauge, Öffnung nach unten (∩). Progress 0..1
  const size = 240;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = r + stroke / 2; // Basislinie (unten) des Halbkreises
  const svgHeight = cy + stroke / 2 + 6;
  const circumference = Math.PI * r;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));
  const bgColor = "#F4F5F8";
  const gaugeColor = hit ? "#2D7A3E" : accent;

  return (
    <div style={{
      background: "white",
      borderRadius: 20,
      border: `2px solid ${hit ? "#2D7A3E" : "#EDEFF5"}`,
      padding: "22px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle accent shape */}
      <div style={{
        position: "absolute", right: -60, top: -60,
        width: 180, height: 180, borderRadius: "50%",
        background: gaugeColor, opacity: 0.05,
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
        <div>
          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 10, letterSpacing: 2, color: gaugeColor, textTransform: "uppercase" }}>
            {eyebrow}
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280", fontWeight: 500, marginTop: 2 }}>
            {label}
          </div>
        </div>
        {hit && (
          <div style={{
            fontFamily: "'Archivo Black',sans-serif", fontSize: 10, letterSpacing: 1.5,
            background: "#2D7A3E", color: "white", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap",
          }}>✓ ZIEL</div>
        )}
      </div>

      {/* Gauge + Value */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <svg width={size} height={svgHeight} style={{ flexShrink: 0, overflow: "visible" }}>
          {/* BG arc */}
          <path
            d={`M ${stroke/2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke/2} ${cy}`}
            stroke={bgColor} strokeWidth={stroke} fill="none" strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={`M ${stroke/2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke/2} ${cy}`}
            stroke={gaugeColor} strokeWidth={stroke} fill="none" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
          />
          {/* Value inside gauge */}
          <text x={cx} y={cy - 38} textAnchor="middle"
            fontFamily="'Archivo Black', sans-serif"
            fontSize="52"
            fill="#0A1E3F"
            letterSpacing="-2">
            {bigValue}
            <tspan fontSize="26" fill="#6B7280" dx="2">{unit}</tspan>
          </text>
          <text x={cx} y={cy - 14} textAnchor="middle"
            fontFamily="Inter"
            fontSize="12"
            fill="#6B7280"
            fontWeight="600"
            letterSpacing="0.5">
            {target}
          </text>
        </svg>
      </div>

      {/* Footer: diff */}
      <div style={{
        marginTop: 8, paddingTop: 14, borderTop: "1px solid #EDEFF5",
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
      }}>
        <div style={{ fontFamily: "Inter", fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
          {diffLabel}
        </div>
        <div style={{
          fontFamily: "'Archivo Black',sans-serif",
          fontSize: 18,
          letterSpacing: "-0.3px",
          color: hit ? "#2D7A3E" : "#0A1E3F",
        }}>{diff}</div>
      </div>
    </div>
  );
}