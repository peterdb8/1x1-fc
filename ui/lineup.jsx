// Lineup Editor — wähle Formation + 11 Spieler auf Positionen
const Lineup = ({ squad, initial, onConfirm, onBack, match }) => {
  const [formation, setFormation] = useState(initial?.formation || "4-3-3");
  const [slots, setSlots] = useState(() => initial?.slots || autoFill(squad, "4-3-3"));
  const [selectedSlot, setSelectedSlot] = useState(null);

  function autoFill(squad, form) {
    const slots = {};
    const used = new Set();
    const formSlots = window.FORMATIONS[form];
    for (const s of formSlots) {
      // finde bestes passendes, noch nicht verwendetes
      const matches = squad
        .filter(p => !used.has(p.n) && fits(p.role, s.role))
        .sort((a, b) => b.rating - a.rating);
      if (matches[0]) { slots[s.id] = matches[0].n; used.add(matches[0].n); }
    }
    return slots;
  }

  function fits(playerRole, slotRole) {
    if (playerRole === slotRole) return true;
    const groups = window.POS_GROUPS;
    const slotGroup = Object.entries(groups).find(([, arr]) => arr.includes(slotRole))?.[0];
    const playerGroup = Object.entries(groups).find(([, arr]) => arr.includes(playerRole))?.[0];
    return slotGroup === playerGroup;
  }

  useEffect(() => {
    if (!initial || initial.formation !== formation) {
      setSlots(autoFill(squad, formation));
    }
  }, [formation]);

  const usedNumbers = new Set(Object.values(slots));
  const bench = squad.filter(p => !usedNumbers.has(p.n));
  const playerByN = Object.fromEntries(squad.map(p => [p.n, p]));

  const assignToSlot = (playerN) => {
    if (!selectedSlot) return;
    // wenn Spieler bereits irgendwo, entfernen
    const next = { ...slots };
    for (const k in next) if (next[k] === playerN) delete next[k];
    next[selectedSlot] = playerN;
    setSlots(next);
    setSelectedSlot(null);
  };

  const swapSlot = (slotId) => {
    if (selectedSlot && selectedSlot !== slotId) {
      const next = { ...slots };
      const a = next[selectedSlot], b = next[slotId];
      next[selectedSlot] = b; next[slotId] = a;
      if (!b) delete next[selectedSlot];
      if (!a) delete next[slotId];
      setSlots(next);
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slotId === selectedSlot ? null : slotId);
    }
  };

  const complete = Object.keys(slots).length === 11;

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "18px 20px 60px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <BigButton variant="ghost" onClick={onBack} style={{ fontSize: 12, padding: "10px 14px" }}>← Zurück</BigButton>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 10, letterSpacing: 2, color: "#DC0817" }}>{match.mdLabel.toUpperCase()}</div>
          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 22, color: "#0A1E3F" }}>FCB {match.home ? "vs" : "@"} {match.opp}</div>
        </div>
        <BigButton variant="primary" onClick={() => onConfirm({ formation, slots })} disabled={!complete}>
          Anpfiff →
        </BigButton>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Feld */}
        <div>
          {/* Formationen */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {Object.keys(window.FORMATIONS).map(f => (
              <button key={f} onClick={() => setFormation(f)}
                style={{
                  background: formation === f ? "#0A1E3F" : "white",
                  color: formation === f ? "white" : "#0A1E3F",
                  border: `2px solid ${formation === f ? "#0A1E3F" : "#EDEFF5"}`,
                  borderRadius: 10, padding: "8px 14px",
                  fontFamily: "'Archivo Black',sans-serif", fontSize: 13, cursor: "pointer",
                }}>{f}</button>
            ))}
          </div>

          <div style={{
            position: "relative",
            background: "linear-gradient(180deg, #2D7A3E 0%, #256A34 100%)",
            borderRadius: 16, aspectRatio: "2 / 3",
            overflow: "hidden", border: "3px solid #0A1E3F",
          }}>
            <FieldLines />
            {window.FORMATIONS[formation].map(slot => {
              const playerN = slots[slot.id];
              const p = playerN ? playerByN[playerN] : null;
              const isSelected = selectedSlot === slot.id;
              return (
                <div key={slot.id}
                  onClick={() => swapSlot(slot.id)}
                  style={{
                    position: "absolute",
                    left: `${slot.x}%`, bottom: `${slot.y}%`,
                    transform: "translate(-50%, 50%)",
                    cursor: "pointer",
                    textAlign: "center",
                  }}>
                  {p ? (
                    <FutCard p={p} selected={isSelected} />
                  ) : (
                    <div style={{
                      width: 50, height: 50, borderRadius: "50%",
                      border: "3px dashed white", opacity: isSelected ? 1 : 0.5,
                      background: isSelected ? "rgba(255,184,0,0.3)" : "rgba(0,0,0,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontFamily: "'Archivo Black',sans-serif", fontSize: 10,
                    }}>{slot.role}</div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 8, fontFamily: "Inter", fontSize: 12, color: "#666", textAlign: "center" }}>
            Klicke auf eine Position, dann auf einen Spieler (oder eine andere Position zum Tauschen).
          </div>
        </div>

        {/* Bench */}
        <div style={{ background: "white", borderRadius: 14, border: "2px solid #EDEFF5", padding: 14 }}>
          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 2, color: "#DC0817", marginBottom: 10 }}>BANK & RESERVE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 640, overflowY: "auto" }}>
            {bench.map(p => {
              const cardUrl = window.cardForPlayer(p.name);
              return (
              <button key={p.n}
                onClick={() => assignToSlot(p.n)}
                disabled={!selectedSlot}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: selectedSlot ? "#FFF3D6" : "#F8F9FB",
                  border: `2px solid ${selectedSlot ? "#FFB800" : "#EDEFF5"}`,
                  borderRadius: 10, padding: "6px 10px",
                  cursor: selectedSlot ? "pointer" : "not-allowed",
                  opacity: selectedSlot ? 1 : 0.7,
                  textAlign: "left",
                }}>
                {cardUrl ? (
                  <img src={cardUrl} alt={p.name} style={{ width: 44, height: 60, objectFit: "contain", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#DC0817", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Archivo Black',sans-serif", fontSize: 13, flexShrink: 0 }}>{p.n}</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 13, color: "#0A1E3F", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 11, color: "#666" }}>{p.pos} · Rating {p.rating}</div>
                </div>
              </button>
            );})}
          </div>
        </div>
      </div>
    </div>
  );
};

const FieldLines = () => (
  <svg viewBox="0 0 100 150" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} preserveAspectRatio="none">
    <rect x="2" y="2" width="96" height="146" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
    <line x1="2" y1="75" x2="98" y2="75" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
    <circle cx="50" cy="75" r="9" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
    <circle cx="50" cy="75" r="0.7" fill="rgba(255,255,255,0.6)" />
    <rect x="25" y="2" width="50" height="16" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
    <rect x="38" y="2" width="24" height="6" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
    <rect x="25" y="132" width="50" height="16" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
    <rect x="38" y="142" width="24" height="6" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
  </svg>
);

const FutCard = ({ p, selected }) => {
  const url = window.cardForPlayer(p.name);
  if (!url) {
    // Fallback: klassischer Kreis mit Nummer
    return (
      <div>
        <div style={{
          width: 50, height: 50, borderRadius: "50%",
          background: selected ? "#FFB800" : "#DC0817",
          border: "3px solid white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Archivo Black',sans-serif", fontSize: 18,
          color: selected ? "#0A1E3F" : "white",
          margin: "0 auto", boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
        }}>{p.n}</div>
        <div style={{ marginTop: 3, fontFamily: "'Archivo Black',sans-serif", fontSize: 9, color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.6)", whiteSpace: "nowrap", letterSpacing: 0.3 }}>
          {p.name.split(" ").slice(-1)[0].toUpperCase()}
        </div>
      </div>
    );
  }
  return (
    <div style={{
      position: "relative",
      filter: selected ? "drop-shadow(0 0 12px #FFB800)" : "drop-shadow(0 3px 6px rgba(0,0,0,0.5))",
      transform: selected ? "scale(1.08)" : "scale(1)",
      transition: "transform 150ms ease",
    }}>
      <img src={url} alt={p.name} style={{ width: 74, height: 102, objectFit: "contain", display: "block" }} />
      {/* Trikot-Nummer-Overlay */}
      <div style={{
        position: "absolute", top: -4, right: -4,
        width: 22, height: 22, borderRadius: "50%",
        background: "#0A1E3F", color: "white",
        border: "2px solid white",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Archivo Black',sans-serif", fontSize: 11,
        boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
      }}>{p.n}</div>
    </div>
  );
};

Object.assign(window, { Lineup, FutCard });
