import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand, clamp, ease, fonts, radius } from "../brand";
import { FPS, SUPERS } from "../timeline";

// Global time (seconds) inside a scene mounted at `start`
export const useT = (start: number) => useCurrentFrame() / FPS + start;

// interpolate over seconds, always clamped
export const iv = (
  t: number,
  input: readonly number[],
  output: readonly number[],
  easing: ((x: number) => number) | undefined = ease.quint,
) => interpolate(t, input, output, { ...clamp, easing });

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

// The taiv.tv hero backdrop: indigo void, dot grid, violet radial glow
export const Backdrop: React.FC<{
  glow?: number;
  glowX?: number;
  glowY?: number;
  glowSize?: number;
  grid?: number;
  drift?: number;
}> = ({ glow = 1, glowX = 50, glowY = 45, glowSize = 900, grid = 1, drift = 0 }) => (
  <AbsoluteFill style={{ background: brand.void }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(${glowSize}px ${glowSize * 0.72}px at ${glowX}% ${glowY}%, rgba(111,63,238,${0.42 * glow}) 0%, rgba(63,36,136,${0.22 * glow}) 38%, rgba(10,4,32,0) 72%)`,
      }}
    />
    <AbsoluteFill
      style={{
        opacity: 0.55 * grid,
        backgroundImage: "radial-gradient(rgba(196,168,255,0.34) 1.4px, transparent 1.6px)",
        backgroundSize: "36px 36px",
        backgroundPosition: `${drift}px ${drift * 0.5}px`,
        maskImage: `radial-gradient(${glowSize * 1.1}px ${glowSize * 0.8}px at ${glowX}% ${glowY}%, black 0%, rgba(0,0,0,0.35) 55%, transparent 85%)`,
      }}
    />
  </AbsoluteFill>
);

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity, mixBlendMode: "overlay" }}>
        <filter id="taiv-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(frame / 2) % 10} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#taiv-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.6 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(5,2,18,${strength}) 100%)`,
    }}
  />
);

// Author mark: a small corner signature on the spec piece.
export const WATERMARK = "babatems";
export const Watermark: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          right: 34,
          bottom: 26,
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 17,
          letterSpacing: "0.12em",
          color: "rgba(245,247,250,0.42)",
          textShadow: "0 1px 6px rgba(0,0,0,0.5)",
        }}
      >
        © {WATERMARK.toUpperCase()} · SPEC CONCEPT
      </div>
    </AbsoluteFill>
  );
};

// ─── Cursor ────────────────────────────────────────────────────────────────
export type CursorKey = { t: number; x: number; y: number; arc?: number };

// Position along a list of keyframes; each leg eases in-out and bows
// sideways by `arc` px so the motion feels hand-driven.
export const cursorAt = (t: number, keys: CursorKey[]) => {
  if (t <= keys[0].t) return { x: keys[0].x, y: keys[0].y };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b.t) {
      const p = ease.inOut((t - a.t) / (b.t - a.t));
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const bow = Math.sin(Math.PI * p) * (b.arc ?? 0);
      return { x: a.x + dx * p + (-dy / len) * bow, y: a.y + dy * p + (dx / len) * bow };
    }
  }
  const last = keys[keys.length - 1];
  return { x: last.x, y: last.y };
};

export const Cursor: React.FC<{
  x: number;
  y: number;
  press?: number; // 0..1
  opacity?: number;
  scale?: number;
  clickAt?: number; // global time of a click, draws a ripple
  t?: number;
}> = ({ x, y, press = 0, opacity = 1, scale = 1, clickAt, t = 0 }) => {
  const ripple = clickAt === undefined ? 0 : iv(t, [clickAt, clickAt + 0.5], [0, 1], ease.out);
  const rippleO = clickAt === undefined ? 0 : iv(t, [clickAt, clickAt + 0.05, clickAt + 0.5], [0, 0.8, 0], ease.linear);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: -40,
          top: -40,
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: `2px solid ${brand.lavender}`,
          opacity: rippleO,
          scale: 0.3 + ripple * 0.9,
        }}
      />
      <svg
        width={44}
        height={44}
        viewBox="0 0 28 28"
        style={{
          position: "absolute",
          left: -6,
          top: -4,
          scale: scale * (1 - press * 0.14),
          transformOrigin: "6px 4px",
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.45))",
          overflow: "visible",
        }}
      >
        <path
          d="M6 3.5 L6 21.5 L10.6 17.3 L13.5 23.8 L16.6 22.4 L13.8 16.1 L20 16.1 Z"
          fill="#ffffff"
          stroke="#0a0420"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// ─── Tracking brackets ─────────────────────────────────────────────────────
export const Brackets: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  lock: number; // 0..1
  color: string;
  label?: string;
  sub?: string;
  arm?: number;
  stroke?: number;
  labelScale?: number;
}> = ({ x, y, w, h, lock, color, label, sub, arm = 28, stroke = 3, labelScale = 1 }) => {
  const pad = (1 - lock) * 34;
  const o = Math.min(1, lock * 3);
  const X = x - pad;
  const Y = y - pad;
  const Wd = w + pad * 2;
  const Hd = h + pad * 2;
  const c = (l: number, t: number, rot: number) => (
    <div
      style={{
        position: "absolute",
        left: l,
        top: t,
        width: arm,
        height: arm,
        borderLeft: `${stroke}px solid ${color}`,
        borderTop: `${stroke}px solid ${color}`,
        rotate: `${rot}deg`,
        transformOrigin: "0 0",
      }}
    />
  );
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: o, pointerEvents: "none" }}>
      {c(X, Y, 0)}
      {c(X + Wd, Y, 90)}
      {c(X + Wd, Y + Hd, 180)}
      {c(X, Y + Hd, 270)}
      {label ? (
        <div
          style={{
            position: "absolute",
            left: X,
            top: Y - 40 * labelScale,
            display: "flex",
            alignItems: "center",
            gap: 8 * labelScale,
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 18 * labelScale,
            letterSpacing: "-0.005em",
            whiteSpace: "nowrap",
            color: "#fff",
            opacity: iv(lock, [0.6, 1], [0, 1], ease.linear),
          }}
        >
          <span style={{ background: color, padding: `${5 * labelScale}px ${11 * labelScale}px`, borderRadius: 6 * labelScale }}>
            {label}
          </span>
          {sub ? <span style={{ color, textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>{sub}</span> : null}
        </div>
      ) : null}
    </div>
  );
};

// ─── Pills & glass ─────────────────────────────────────────────────────────
export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: "glass" | "violet" | "red";
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, tone = "glass", size = 20, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.45,
      padding: `${size * 0.45}px ${size * 0.85}px`,
      borderRadius: 999,
      fontFamily: fonts.sans,
      fontWeight: 600,
      fontSize: size,
      color: brand.white,
      whiteSpace: "nowrap",
      background:
        tone === "violet" ? brand.violet : tone === "red" ? "rgba(255,59,48,0.92)" : "rgba(26,16,64,0.88)",
      border: `1px solid ${tone === "glass" ? "rgba(196,168,255,0.22)" : "rgba(255,255,255,0.14)"}`,
      boxShadow: tone === "violet" ? "0 10px 30px rgba(111,63,238,0.45)" : "0 10px 30px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const glass: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(36,27,84,0.94) 0%, rgba(26,16,64,0.94) 100%)",
  border: "1px solid rgba(196,168,255,0.16)",
  borderRadius: radius.marketing,
  boxShadow: "0 40px 120px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
};

// ─── Supers ────────────────────────────────────────────────────────────────
// Kinetic type: each line rises out of its own mask on a fast expo-out (no
// blur, no fade), and the block leaves upward through the same masks.
const renderText = (text: string, accent?: string) => {
  if (!accent || !text.includes(accent)) return text;
  const [before, after] = text.split(accent);
  return (
    <>
      {before}
      <span style={{ color: brand.lilac }}>{accent}</span>
      {after}
    </>
  );
};

export const Supers: React.FC<{ t: number }> = ({ t }) => (
  <>
    {SUPERS.map((sup) => {
      if (t < sup.lines[0].at - 0.05 || t > sup.out + 0.4) return null;
      return (
        <div
          key={sup.id}
          style={{
            position: "absolute",
            left: sup.x,
            [sup.anchor]: sup.y,
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: sup.size,
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
            color: brand.white,
          }}
        >
          {sup.lines.map((line, i) => {
            const inP = iv(t, [line.at - 0.04, line.at + 0.56], [0, 1], ease.out);
            const outP = iv(t, [sup.out - 0.32 + i * 0.05, sup.out + i * 0.05], [0, 1], ease.in);
            return (
              <div key={i} style={{ overflow: "hidden", paddingBottom: "0.1em", marginBottom: "-0.1em" }}>
                <div style={{ translate: `0px ${(1 - inP) * 112 - outP * 112}%`, whiteSpace: "nowrap" }}>
                  {renderText(line.text, line.accent)}
                </div>
              </div>
            );
          })}
        </div>
      );
    })}
  </>
);
