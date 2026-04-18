// Zweikampf-Overlay: große 1×1-Aufgabe mit Zahleneingabe
const DuelOverlay = ({ duel, difficulty, onResult }) => {
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(duel.timeLimit);
  const startRef = useRef(Date.now());
  const [status, setStatus] = useState("active"); // active | correct | wrong
  const statusRef = useRef("active");
  useEffect(() => { statusRef.current = status; }, [status]);

  const correctAnswer = duel.a * duel.b;

  useEffect(() => {
    // Globale Tastatur-Eingabe: funktioniert ohne dass das Input-Feld Fokus haben muss.
    // Auf Touch-Geräten ohnehin irrelevant (dort ist der Numpad das Eingabe-Interface).
    if (window.IS_TOUCH) return;
    const onKeyDown = (e) => {
      if (statusRef.current !== "active") return;
      const k = e.key;
      if (/^[0-9]$/.test(k)) {
        e.preventDefault();
        setInput(s => (s + k).slice(0, 3));
      } else if (k === "Backspace") {
        e.preventDefault();
        setInput(s => s.slice(0, -1));
      } else if (k === "Enter") {
        e.preventDefault();
        // submit mit aktuellem input (State-Closure) → wir nehmen die funktionale Form
        setInput(s => { submit(s); return s; });
      }
    };
    window.addEventListener("keydown", onKeyDown, true); // capture: vor anderen Listenern
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  useEffect(() => {
    if (!duel.timeLimit || status !== "active") return;
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = duel.timeLimit - elapsed;
      if (left <= 0) {
        clearInterval(id);
        setStatus("wrong");
        setTimeout(() => onResult(false, duel.timeLimit), 900);
      } else {
        setTimeLeft(left);
      }
    }, 50);
    return () => clearInterval(id);
  }, [status]);

  const submit = (v) => {
    if (status !== "active") return;
    const n = parseInt(v, 10);
    if (isNaN(n)) return;
    const duration = Date.now() - startRef.current;
    if (n === correctAnswer) {
      setStatus("correct");
      setTimeout(() => onResult(true, duration), 700);
    } else {
      setStatus("wrong");
      setTimeout(() => onResult(false, duration), 900);
    }
  };

  const onKey = null; // (ersetzt durch globalen keydown-Listener oben)

  // Multi-digit input auch via Klick-Tastatur
  const press = (val) => {
    if (statusRef.current !== "active") return;
    if (val === "del") { setInput(s => s.slice(0, -1)); return; }
    if (val === "ok") { setInput(s => { submit(s); return s; }); return; }
    setInput(s => (s + val).slice(0, 3));
  };

  const timeProgress = duel.timeLimit ? Math.max(0, timeLeft / duel.timeLimit) : 1;
  const urgent = duel.timeLimit && timeLeft < 1000;

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "rgba(10,30,63,0.96)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 20,
      padding: "20px",
    }}>
      <div style={{
        fontFamily: "'Archivo Black',sans-serif", fontSize: 12, letterSpacing: 4, color: "#FFB800", marginBottom: 6,
      }}>
        ZWEIKAMPF · {duel.hasBall ? "Halte den Ball!" : "Hole den Ball zurück!"}
      </div>

      {/* Timer bar */}
      {duel.timeLimit && (
        <div style={{ width: "min(440px, 80vw)", height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden", marginBottom: 20 }}>
          <div style={{
            height: "100%",
            width: `${timeProgress * 100}%`,
            background: urgent ? "#DC0817" : timeProgress > 0.5 ? "#2D7A3E" : "#FFB800",
            transition: "width 50ms linear, background 0.2s",
          }} />
        </div>
      )}

      {/* Big task */}
      <div style={{
        fontFamily: "'Archivo Black',sans-serif",
        fontSize: "clamp(60px, 12vw, 130px)",
        color: status === "correct" ? "#7EE29A" : status === "wrong" ? "#FF9B9B" : "white",
        letterSpacing: "-3px", lineHeight: 1,
        display: "flex", alignItems: "baseline", gap: 18,
        marginBottom: 14,
        transition: "color 0.2s",
      }}>
        <span>{duel.a}</span>
        <span style={{ color: "#DC0817" }}>×</span>
        <span>{duel.b}</span>
        <span style={{ color: "#FFB800" }}>=</span>
      </div>

      {/* Input display */}
      <div style={{
        width: "min(260px, 70vw)", height: 80,
        background: status === "correct" ? "#2D7A3E" : status === "wrong" ? "#DC0817" : "rgba(255,255,255,0.08)",
        border: `3px solid ${status === "active" ? "#FFB800" : "transparent"}`,
        borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Archivo Black',sans-serif", fontSize: 56, color: "white",
        letterSpacing: "-1px",
        marginBottom: 16,
        transition: "all 0.2s",
      }}>
        {status === "wrong" && input !== String(correctAnswer) ? (
          <span>{input || "?"} → <span style={{ color: "#FFE5E5" }}>{correctAnswer}</span></span>
        ) : (
          <span>{input || "_"}</span>
        )}
      </div>

      {/* Numpad */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 70px)", gap: 8,
        marginBottom: 14,
      }}>
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <NumpadKey key={n} onClick={() => press(String(n))}>{n}</NumpadKey>
        ))}
        <NumpadKey onClick={() => press("del")} color="#555">←</NumpadKey>
        <NumpadKey onClick={() => press("0")}>0</NumpadKey>
        <NumpadKey onClick={() => press("ok")} color="#2D7A3E">OK</NumpadKey>
      </div>

      <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
        Enter = bestätigen
      </div>
    </div>
  );
};

const NumpadKey = ({ children, onClick, color = "rgba(255,255,255,0.12)" }) => (
  <button onClick={onClick} style={{
    height: 60, background: color,
    border: "2px solid rgba(255,255,255,0.15)",
    borderRadius: 12,
    fontFamily: "'Archivo Black',sans-serif", fontSize: 24,
    color: "white", cursor: "pointer",
  }}>{children}</button>
);

Object.assign(window, { DuelOverlay });
