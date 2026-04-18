// Touch-Controls für iPad/iPhone/Safari — Modell: EA FC Mobile
// - Linke Bildschirmhälfte: floating virtual joystick
// - Rechte Bildschirmhälfte: kontextuelle Action-Buttons
// - Pitch-Gesten: Tap/Swipe auf dem Spielfeld
//
// API:
//   <TouchControls
//      pitchRef={ref to pitch container}   // für gesture-coords → Feld-Koordinaten
//      possession="attacking"|"defending"
//      ownHalf={bool}                        // Shoot → Clear wenn true
//      onJoystick={({x,y}) => ...}          // Richtung -1..1, jeden Frame
//      onAction={(kind, meta) => ...}       // kind: "pass"|"shoot"|"throughball"|"tackle"|"slide"|"switch"|"sprint_on"|"sprint_off"
//      onPitchTap={({fx,fy}) => ...}        // 0..100 Feld-Koordinaten
//      onPitchSwipe={({fx,fy, power, angle}) => ...}
//   />

const IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

function TouchControls({ pitchRef, possession, ownHalf, onJoystick, onAction, onPitchTap, onPitchSwipe, visible = true }) {
  const [joy, setJoy] = React.useState(null); // {baseX, baseY, thumbX, thumbY}
  const joyIdRef = React.useRef(null);
  const [powerBar, setPowerBar] = React.useState(null); // {kind, t0}
  const [powerValue, setPowerValue] = React.useState(0);

  // Power-Bar Animation
  React.useEffect(() => {
    if (!powerBar) { setPowerValue(0); return; }
    let raf;
    const tick = () => {
      const elapsed = Date.now() - powerBar.t0;
      const p = Math.min(1, elapsed / 900);
      setPowerValue(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [powerBar]);

  if (!IS_TOUCH || !visible) return null;

  // --- Joystick (linke Bildschirmhälfte) ---
  const handleJoyStart = (e) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    joyIdRef.current = t.identifier;
    setJoy({ baseX: t.clientX, baseY: t.clientY, thumbX: t.clientX, thumbY: t.clientY });
  };
  const handleJoyMove = (e) => {
    if (!joy) return;
    for (const t of e.changedTouches) {
      if (t.identifier !== joyIdRef.current) continue;
      const dx = t.clientX - joy.baseX;
      const dy = t.clientY - joy.baseY;
      const R = 60;
      const d = Math.hypot(dx, dy);
      const clampD = Math.min(d, R);
      const nx = d > 0 ? (dx / d) * clampD : 0;
      const ny = d > 0 ? (dy / d) * clampD : 0;
      setJoy({ ...joy, thumbX: joy.baseX + nx, thumbY: joy.baseY + ny });
      // Normalisiertes Output (-1..1)
      const ox = d > 0 ? (dx / d) * (clampD / R) : 0;
      const oy = d > 0 ? (dy / d) * (clampD / R) : 0;
      onJoystick?.({ x: ox, y: oy });
      e.preventDefault();
    }
  };
  const handleJoyEnd = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier !== joyIdRef.current) continue;
      joyIdRef.current = null;
      setJoy(null);
      onJoystick?.({ x: 0, y: 0 });
    }
  };

  // --- Pitch-Gesten ---
  const gestureRef = React.useRef(null);
  const handlePitchStart = (e) => {
    // Ignoriere Touches die auf Buttons/Joystick-Layer landen
    const t = e.changedTouches[0];
    gestureRef.current = {
      id: t.identifier,
      x0: t.clientX, y0: t.clientY,
      t0: Date.now(),
    };
  };
  const handlePitchEnd = (e) => {
    const g = gestureRef.current;
    if (!g) return;
    for (const t of e.changedTouches) {
      if (t.identifier !== g.id) continue;
      const dx = t.clientX - g.x0;
      const dy = t.clientY - g.y0;
      const dt = Date.now() - g.t0;
      const d = Math.hypot(dx, dy);
      // Pitch-Koordinate (0..100) berechnen
      const rect = pitchRef.current?.getBoundingClientRect();
      const fx = rect ? ((t.clientX - rect.left) / rect.width) * 100 : 50;
      const fy = rect ? ((t.clientY - rect.top) / rect.height) * 100 : 50;
      if (dt < 250 && d < 16) {
        onPitchTap?.({ fx, fy });
      } else if (d > 40) {
        const speed = d / Math.max(1, dt); // px/ms
        const power = Math.min(1, speed / 1.4);
        const angle = Math.atan2(dy, dx);
        onPitchSwipe?.({ fx, fy, power, angle, dx, dy });
      }
      gestureRef.current = null;
    }
  };

  // --- Button interactions (tap vs hold+release) ---
  const makeButton = (kind, label, color, opts = {}) => {
    const { power = false, hold = false, size = 72 } = opts;
    const holdRef = React.useRef(null);
    return {
      label, color, size,
      onPointerDown: (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        holdRef.current = { t0: Date.now(), fired: false };
        if (hold) {
          onAction?.(kind + "_on");
        } else if (power) {
          setPowerBar({ kind, t0: Date.now() });
        }
      },
      onPointerUp: (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const h = holdRef.current;
        holdRef.current = null;
        if (!h) return;
        if (hold) {
          onAction?.(kind + "_off");
          return;
        }
        const dt = Date.now() - h.t0;
        if (power) {
          const pv = Math.min(1, dt / 900);
          setPowerBar(null);
          onAction?.(kind, { power: pv });
        } else {
          onAction?.(kind);
        }
      },
      onPointerCancel: (ev) => {
        holdRef.current = null;
        if (hold) onAction?.(kind + "_off");
        if (power) setPowerBar(null);
      },
    };
  };

  // Kontext-abhängige Buttons
  const shootBtn = makeButton(ownHalf ? "clear" : "shoot", ownHalf ? "Klären" : "Schuss", "#DC0817", { power: true });
  const passBtn = makeButton("pass", "Pass", "#2D7A3E", { power: true });
  const throughBtn = makeButton("throughball", "Steil", "#FFB800", { power: true });
  const sprintBtn = makeButton("sprint", "Sprint", "#0A5FD9", { hold: true });

  const switchBtn = makeButton("switch", "Wechsel", "#555");
  const tackleBtn = makeButton("tackle", "Tackle", "#0066CC", { hold: true });
  const slideBtn = makeButton("slide", "Grätsche", "#DC0817");
  const pressBtn = makeButton("press", "Pressing", "#FFB800", { hold: true });

  const cluster = possession === "attacking"
    ? [throughBtn, shootBtn, passBtn, sprintBtn]
    : [switchBtn, slideBtn, tackleBtn, pressBtn];

  return (
    <>
      {/* Linke Hälfte — Joystick-Capture */}
      <div
        onTouchStart={handleJoyStart}
        onTouchMove={handleJoyMove}
        onTouchEnd={handleJoyEnd}
        onTouchCancel={handleJoyEnd}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0, width: "40%",
          zIndex: 40,
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      />

      {/* Rechte Hälfte — Pitch-Gesture-Capture (hinter den Action-Buttons) */}
      <div
        onTouchStart={handlePitchStart}
        onTouchEnd={handlePitchEnd}
        onTouchCancel={handlePitchEnd}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          position: "absolute",
          right: 0, top: 0, bottom: 0, width: "60%",
          zIndex: 40,
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      />

      {/* Joystick-Visual */}
      {joy && (
        <>
          <div style={{
            position: "fixed",
            left: joy.baseX - 60, top: joy.baseY - 60,
            width: 120, height: 120, borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            border: "2px solid rgba(255,255,255,0.35)",
            pointerEvents: "none", zIndex: 45,
          }} />
          <div style={{
            position: "fixed",
            left: joy.thumbX - 30, top: joy.thumbY - 30,
            width: 60, height: 60, borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            pointerEvents: "none", zIndex: 46,
          }} />
        </>
      )}

      {/* Action-Cluster rechts unten */}
      <div style={{
        position: "absolute",
        right: 18, bottom: 22,
        display: "grid",
        gridTemplateColumns: "repeat(2, auto)",
        gridTemplateRows: "repeat(2, auto)",
        gap: 10,
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {/* Layout: 
            [through] [shoot]
            [pass]    [sprint]
           Bei defending:
            [switch]  [slide]
            [tackle]  [press]
        */}
        {cluster.map((b, i) => (
          <TouchBtn key={i} {...b} />
        ))}
      </div>

      {/* Power-Bar (wenn Schuss/Pass gehalten) */}
      {powerBar && (
        <div style={{
          position: "absolute",
          right: 18, bottom: 210,
          width: 160, height: 10,
          background: "rgba(0,0,0,0.6)",
          borderRadius: 6,
          border: "1.5px solid rgba(255,255,255,0.4)",
          overflow: "hidden",
          zIndex: 51,
        }}>
          <div style={{
            width: `${powerValue * 100}%`, height: "100%",
            background: powerValue > 0.85 ? "#DC0817" : powerValue > 0.5 ? "#FFB800" : "#2D7A3E",
            transition: "width 60ms linear",
          }} />
        </div>
      )}
    </>
  );
}

function TouchBtn({ label, color, size = 72, onPointerDown, onPointerUp, onPointerCancel }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button
      onPointerDown={(e) => { setPressed(true); onPointerDown?.(e); }}
      onPointerUp={(e) => { setPressed(false); onPointerUp?.(e); }}
      onPointerCancel={(e) => { setPressed(false); onPointerCancel?.(e); }}
      onPointerLeave={(e) => { if (pressed) { setPressed(false); onPointerCancel?.(e); } }}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: color,
        border: "2.5px solid rgba(255,255,255,0.7)",
        color: "white",
        fontFamily: "'Archivo Black',sans-serif",
        fontSize: 13, letterSpacing: "-0.3px",
        boxShadow: pressed
          ? "inset 0 3px 10px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)"
          : "0 4px 10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
        transform: pressed ? "scale(0.94)" : "scale(1)",
        transition: "transform 80ms",
        touchAction: "none",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
        cursor: "pointer",
      }}
    >{label}</button>
  );
}

window.TouchControls = TouchControls;
window.IS_TOUCH = IS_TOUCH;
