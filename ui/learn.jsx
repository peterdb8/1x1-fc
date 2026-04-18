// Lernfortschritt — detaillierte Auswertung des 1×1-Profils
const LearnProgress = ({ onBack }) => {
  const profile = window.MathEngine.loadProfile();
  const rowStats = window.MathEngine.rowStats(profile);
  const totalAttempts = profile.totalAttempts;
  const totalCorrect = profile.totalCorrect;
  const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

  // Durchschnittszeit gewichtet
  let totalMs = 0, totalWithTime = 0;
  Object.values(profile.tasks).forEach(t => {
    if (t.avgMs > 0 && t.attempts > 0) { totalMs += t.avgMs * t.attempts; totalWithTime += t.attempts; }
  });
  const avgMs = totalWithTime > 0 ? Math.round(totalMs / totalWithTime) : 0;

  // Alle geübten Aufgaben flatten + sortieren
  const all = Object.entries(profile.tasks)
    .map(([key, t]) => ({ key, ...t, accuracy: t.attempts > 0 ? t.correct / t.attempts : 0 }))
    .filter(t => t.attempts > 0);
  const practicedCount = all.length;
  const masteredCount = all.filter(t => t.accuracy >= 0.9 && t.attempts >= 3).length;

  // Schnellste / Langsamste (nur mit min. 2 Versuchen)
  const byTime = all.filter(t => t.attempts >= 2 && t.avgMs > 0).sort((a, b) => a.avgMs - b.avgMs);
  const fastest = byTime.slice(0, 5);
  const slowest = [...byTime].reverse().slice(0, 5);

  // Schwächste (Engine hat dafür schon eine Logik)
  const weakest = window.MathEngine.weakestTasks(profile, 8);

  // Häufigste Fehler: attempts - correct absteigend
  const mostMistakes = [...all]
    .map(t => ({ ...t, wrong: t.attempts - t.correct }))
    .filter(t => t.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 6);

  const empty = totalAttempts === 0;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
        <BigButton variant="ghost" onClick={onBack} style={{ fontSize: 12, padding: "10px 14px" }}>← Zurück</BigButton>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 10, letterSpacing: 2.5, color: "#DC0817" }}>DEIN 1×1 · SCOUTING-REPORT</div>
          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 30, color: "#0A1E3F", letterSpacing: "-0.8px", marginTop: 2 }}>Lernfortschritt</div>
        </div>
        <div style={{ width: 120 }} />{/* spacer für Symmetrie */}
      </div>

      {empty ? (
        <EmptyState />
      ) : (
        <>
          {/* Top-KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
            <NumberCard big={totalAttempts} label="Aufgaben gelöst" accent="#0A1E3F" />
            <NumberCard big={totalCorrect} label="davon richtig" accent="#2D7A3E"
              small={totalAttempts > 0 ? `${Math.round(accuracy * 100)} %` : null} />
            <NumberCard big={totalAttempts - totalCorrect} label="Fehler" accent="#DC0817"
              small={totalAttempts > 0 ? `${Math.round((1 - accuracy) * 100)} %` : null} />
            <NumberCard big={avgMs > 0 ? (avgMs / 1000).toFixed(1) : "—"} unit="s" label="Ø Antwortzeit" accent="#0A4FFF" />
            <NumberCard big={masteredCount} label={`von ${practicedCount} gemeistert`} accent="#FFB800"
              small="≥ 90 %, min. 3 Versuche" />
          </div>

          {/* Pro Reihe */}
          <Section title="Leistung pro Reihe" eyebrow="1er bis 10er" sub="Wie sicher bist du in jeder Multiplikationsreihe?">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
              {rowStats.map(r => <RowCard key={r.row} row={r} />)}
            </div>
          </Section>

          {/* Heatmap */}
          <Section title="Trefferquoten-Heatmap" eyebrow="100 Aufgaben-Matrix" sub="Jede Kachel = eine Aufgabe. Grün = stark, Rot = üben. Grau = noch nie gespielt.">
            <Heatmap profile={profile} />
          </Section>

          {/* Schwächen / Fehler-Hotspots */}
          {weakest.length > 0 && (
            <Section title="Das üben wir nochmal" eyebrow="Priorität des Trainers" sub="Adaptive Empfehlung — diese Aufgaben werden im nächsten Match häufiger kommen.">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {weakest.map(w => <TaskPill key={w.key} task={w} variant="weak" />)}
              </div>
            </Section>
          )}

          {mostMistakes.length > 0 && (
            <Section title="Häufigste Fehler" eyebrow="Fehlermuster" sub="Aufgaben mit den meisten falschen Antworten insgesamt.">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {mostMistakes.map(t => <TaskPill key={t.key} task={t} variant="mistake" />)}
              </div>
            </Section>
          )}

          {/* Schnellste + Langsamste side-by-side */}
          {(fastest.length > 0 || slowest.length > 0) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginTop: 24 }}>
              {fastest.length > 0 && (
                <Section title="Blitz-Reaktion" eyebrow="Top 5" sub="Deine schnellsten Aufgaben (Ø-Zeit).">
                  <TaskList tasks={fastest} showTime color="#2D7A3E" />
                </Section>
              )}
              {slowest.length > 0 && (
                <Section title="Grübeln" eyebrow="Langsamste 5" sub="Hier verlierst du Zeit — mehr Routine hilft.">
                  <TaskList tasks={slowest} showTime color="#FFB800" />
                </Section>
              )}
            </div>
          )}

          {/* Reset */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <button onClick={() => {
              if (confirm("Lernprofil wirklich komplett zurücksetzen? Die Saison bleibt erhalten.")) {
                window.MathEngine.reset();
                location.reload();
              }
            }} style={{
              background: "transparent", color: "#6B7280",
              border: "2px dashed #BCC3D1", borderRadius: 10,
              padding: "10px 20px", cursor: "pointer",
              fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 1.5,
            }}>
              LERNPROFIL ZURÜCKSETZEN
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────

const Section = ({ title, eyebrow, sub, children }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 10, letterSpacing: 2.5, color: "#DC0817", textTransform: "uppercase" }}>{eyebrow}</div>
      <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 22, letterSpacing: "-0.5px", color: "#0A1E3F", marginTop: 2 }}>{title}</div>
      {sub && <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280", marginTop: 4 }}>{sub}</div>}
    </div>
    {children}
  </div>
);

const NumberCard = ({ big, unit, label, small, accent }) => (
  <div style={{
    background: "white", borderRadius: 16, padding: "18px 18px",
    border: "2px solid #EDEFF5",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", right: -30, top: -30, width: 90, height: 90, borderRadius: "50%", background: accent, opacity: 0.08 }} />
    <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 44, color: "#0A1E3F", letterSpacing: "-1.5px", lineHeight: 1 }}>
      {big}
      {unit && <span style={{ fontSize: 22, color: "#6B7280", marginLeft: 2 }}>{unit}</span>}
    </div>
    <div style={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280", fontWeight: 600, marginTop: 6 }}>{label}</div>
    {small && <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 11, color: accent, marginTop: 4, letterSpacing: 0.5 }}>{small}</div>}
  </div>
);

const RowCard = ({ row }) => {
  const pct = row.accuracy === null ? null : Math.round(row.accuracy * 100);
  const color = pct === null ? "#BCC3D1" : pct >= 90 ? "#2D7A3E" : pct >= 70 ? "#FFB800" : "#DC0817";
  const bg = pct === null ? "#F4F5F8" : pct >= 90 ? "#E8F5EC" : pct >= 70 ? "#FFF8E0" : "#FDEDED";
  return (
    <div style={{
      background: bg, border: `2px solid ${pct === null ? "#EDEFF5" : color}`,
      borderRadius: 12, padding: "12px 10px", textAlign: "center",
    }}>
      <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 24, color: "#0A1E3F", letterSpacing: "-0.5px" }}>{row.row}×</div>
      <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 20, color, marginTop: 2, letterSpacing: "-0.3px" }}>
        {pct === null ? "—" : `${pct}%`}
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 11, color: "#6B7280", marginTop: 4 }}>
        {row.attempts === 0 ? "nicht geübt" : `${row.correct}/${row.attempts}`}
      </div>
      {row.avgMs && (
        <div style={{ fontFamily: "Inter", fontSize: 10, color: "#6B7280", marginTop: 2 }}>
          ø {(row.avgMs / 1000).toFixed(1)}s
        </div>
      )}
    </div>
  );
};

const Heatmap = ({ profile }) => {
  // 10×10 Grid — Zeilen a = 1..10, Spalten b = 1..10
  const cell = (a, b) => {
    const t = profile.tasks[`${a}x${b}`];
    const att = t?.attempts || 0;
    if (att === 0) return { bg: "#F4F5F8", color: "#BCC3D1", border: "#EDEFF5" };
    const acc = t.correct / att;
    if (acc >= 0.9) return { bg: "#2D7A3E", color: "white", border: "#1F5A2C" };
    if (acc >= 0.7) return { bg: "#7EBB55", color: "white", border: "#66A042" };
    if (acc >= 0.5) return { bg: "#FFB800", color: "#0A1E3F", border: "#E0A000" };
    return { bg: "#DC0817", color: "white", border: "#A00610" };
  };

  return (
    <div>
      <div style={{ display: "inline-block", background: "white", borderRadius: 12, padding: 12, border: "2px solid #EDEFF5" }}>
        <table style={{ borderCollapse: "separate", borderSpacing: 3 }}>
          <thead>
            <tr>
              <th style={{ width: 28, height: 28 }} />
              {Array.from({ length: 10 }, (_, i) => (
                <th key={i} style={{
                  width: 32, height: 22,
                  fontFamily: "'Archivo Black',sans-serif", fontSize: 11, color: "#6B7280",
                }}>×{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(a => (
              <tr key={a}>
                <td style={{
                  width: 28, height: 32, textAlign: "center",
                  fontFamily: "'Archivo Black',sans-serif", fontSize: 11, color: "#6B7280",
                }}>{a}</td>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(b => {
                  const t = profile.tasks[`${a}x${b}`];
                  const { bg, color, border } = cell(a, b);
                  const tip = t?.attempts > 0
                    ? `${a}×${b}=${a*b} · ${t.correct}/${t.attempts} richtig · ø ${(t.avgMs/1000).toFixed(1)}s`
                    : `${a}×${b}=${a*b} · noch nicht geübt`;
                  return (
                    <td key={b} title={tip} style={{
                      width: 32, height: 32,
                      background: bg, color,
                      border: `1.5px solid ${border}`,
                      borderRadius: 6, textAlign: "center",
                      fontFamily: "'Archivo Black',sans-serif", fontSize: 11,
                      letterSpacing: "-0.3px",
                    }}>
                      {a * b}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legende */}
      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        <LegendDot color="#2D7A3E" label="≥ 90 %" />
        <LegendDot color="#7EBB55" label="70–89 %" />
        <LegendDot color="#FFB800" label="50–69 %" />
        <LegendDot color="#DC0817" label="< 50 %" />
        <LegendDot color="#F4F5F8" label="noch nicht geübt" border="#EDEFF5" />
      </div>
    </div>
  );
};

const LegendDot = ({ color, label, border }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ width: 14, height: 14, borderRadius: 3, background: color, border: `1.5px solid ${border || color}` }} />
    <div style={{ fontFamily: "Inter", fontSize: 11, color: "#6B7280", fontWeight: 600 }}>{label}</div>
  </div>
);

const TaskPill = ({ task, variant }) => {
  const [a, b] = task.key.split("x");
  const acc = Math.round(task.accuracy * 100);
  const bg = variant === "weak" ? "#FFF3D6" : variant === "mistake" ? "#FDEDED" : "#F4F5F8";
  const border = variant === "weak" ? "#FFB800" : variant === "mistake" ? "#DC0817" : "#EDEFF5";
  return (
    <div style={{
      background: bg, border: `2px solid ${border}`, borderRadius: 12, padding: "10px 14px",
      minWidth: 110,
    }}>
      <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 22, color: "#0A1E3F", letterSpacing: "-0.5px" }}>{a} × {b}</div>
      <div style={{ fontFamily: "Inter", fontSize: 12, color: "#6B7280", marginTop: 2 }}>
        = {a * b}
        {variant === "mistake" && task.wrong !== undefined
          ? ` · ${task.wrong} Fehler`
          : ` · ${acc}%`}
        {task.avgMs ? ` · ${(task.avgMs / 1000).toFixed(1)}s` : ""}
      </div>
    </div>
  );
};

const TaskList = ({ tasks, showTime, color }) => (
  <div style={{ background: "white", borderRadius: 14, border: "2px solid #EDEFF5", overflow: "hidden" }}>
    {tasks.map((t, i) => {
      const [a, b] = t.key.split("x");
      return (
        <div key={t.key} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 14px",
          borderTop: i === 0 ? "none" : "1px solid #EDEFF5",
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: color, color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Archivo Black',sans-serif", fontSize: 12,
          }}>{i + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 16, color: "#0A1E3F", letterSpacing: "-0.3px" }}>
              {a} × {b} = {a * b}
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 11, color: "#6B7280" }}>
              {t.correct}/{t.attempts} richtig
            </div>
          </div>
          {showTime && t.avgMs > 0 && (
            <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 16, color, letterSpacing: "-0.3px" }}>
              {(t.avgMs / 1000).toFixed(1)}s
            </div>
          )}
        </div>
      );
    })}
  </div>
);

const EmptyState = () => (
  <div style={{
    background: "white", borderRadius: 20, border: "2px dashed #EDEFF5",
    padding: "48px 24px", textAlign: "center",
  }}>
    <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 48, color: "#BCC3D1", letterSpacing: "-1px" }}>0</div>
    <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 18, color: "#0A1E3F", marginTop: 8 }}>Noch keine Daten</div>
    <div style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280", marginTop: 6, maxWidth: 400, margin: "6px auto 0" }}>
      Spiele dein erstes Match — mit jeder beantworteten 1×1-Aufgabe füllt sich dieser Report mit deinen Stärken und Schwächen.
    </div>
  </div>
);

Object.assign(window, { LearnProgress });
