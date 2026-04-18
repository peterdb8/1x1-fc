// Shared UI helpers
const { useState, useEffect, useRef, useMemo, useCallback } = React;

window.cx = (...xs) => xs.filter(Boolean).join(" ");

// Icon-frei: wir nutzen Glyphen / Initialen / Formen für ein eigenständiges Look&Feel
window.Initials = function Initials({ name, size = 40, bg = "#DC0817", fg = "white" }) {
  const parts = name.split(" ").filter(Boolean);
  const initials = parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return React.createElement("div", {
    style: {
      width: size, height: size, borderRadius: "50%",
      background: bg, color: fg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Archivo Black', sans-serif",
      fontSize: size * 0.38, letterSpacing: "0.5px",
      border: `2px solid rgba(255,255,255,0.15)`,
    }
  }, initials);
};

// Bayern-Player-Kreis mit Trikotnummer
window.PlayerChip = function PlayerChip({ player, active, onClick, size = 56 }) {
  return React.createElement("button", {
    onClick,
    style: {
      width: size, height: size, borderRadius: "50%",
      background: active ? "#FFB800" : "#DC0817",
      color: active ? "#0A1E3F" : "white",
      border: active ? "3px solid #0A1E3F" : "3px solid rgba(255,255,255,0.2)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      cursor: "pointer",
      fontFamily: "'Archivo Black', sans-serif",
      lineHeight: 1,
      padding: 0,
      transition: "transform 0.12s, background 0.12s",
      boxShadow: active ? "0 6px 16px rgba(255,184,0,0.35)" : "0 3px 8px rgba(0,0,0,0.25)",
    },
  }, React.createElement("span", { style: { fontSize: size * 0.42 } }, player.n));
};

// Chunky button
window.BigButton = function BigButton({ children, onClick, variant = "primary", disabled, style }) {
  const vars = {
    primary: { bg: "#DC0817", fg: "white", border: "#0A1E3F" },
    secondary: { bg: "#0A1E3F", fg: "white", border: "#DC0817" },
    gold: { bg: "#FFB800", fg: "#0A1E3F", border: "#0A1E3F" },
    ghost: { bg: "rgba(255,255,255,0.06)", fg: "#0A1E3F", border: "rgba(10,30,63,0.15)" },
  }[variant];
  return React.createElement("button", {
    onClick, disabled,
    style: {
      background: vars.bg, color: vars.fg,
      border: `3px solid ${vars.border}`,
      borderRadius: 14,
      padding: "14px 22px",
      fontFamily: "'Archivo Black', sans-serif",
      fontSize: 16, letterSpacing: "0.5px", textTransform: "uppercase",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
      transition: "transform 0.08s",
      ...style,
    },
    onMouseDown: e => { if (!disabled) e.currentTarget.style.transform = "translateY(2px)"; e.currentTarget.style.boxShadow = "0 2px 0 rgba(0,0,0,0.2)"; },
    onMouseUp: e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 0 rgba(0,0,0,0.2)"; },
    onMouseLeave: e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 0 rgba(0,0,0,0.2)"; },
  }, children);
};

// Section header
window.SectionHead = function SectionHead({ eyebrow, title, right }) {
  return React.createElement("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18, gap: 16, flexWrap: "wrap" } },
    React.createElement("div", null,
      eyebrow ? React.createElement("div", { style: { fontFamily: "'Archivo Black',sans-serif", fontSize: 11, letterSpacing: 2, color: "#DC0817", textTransform: "uppercase", marginBottom: 4 } }, eyebrow) : null,
      React.createElement("h2", { style: { margin: 0, fontFamily: "'Archivo Black',sans-serif", fontSize: 30, color: "#0A1E3F", letterSpacing: "-0.5px" } }, title),
    ),
    right ? React.createElement("div", null, right) : null,
  );
};

Object.assign(window, { Initials: window.Initials, PlayerChip: window.PlayerChip, BigButton: window.BigButton, SectionHead: window.SectionHead, cx: window.cx });
