import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SLANT_TAN, brand, clamp, ease, fonts } from "../brand";
import { ICONS, IconName } from "../icons";
import { LEAF_CENTER, LOGO_LEAF, LOGO_P, LOGO_SKI, LOGO_VIEWBOX } from "../logo";

// Global time (seconds) inside a scene mounted at `start`
export const useT = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps + start;
};

// interpolate over seconds, always clamped
export const iv = (
  t: number,
  input: readonly number[],
  output: readonly number[],
  easing: ((x: number) => number) | undefined = ease.out,
) => interpolate(t, input, output, { ...clamp, easing });

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

// Damped spring over seconds (0 → 1 with a little overshoot), deterministic
export const pop = (t: number, at: number, { freq = 2.4, damp = 7 } = {}) => {
  const x = t - at;
  if (x <= 0) return 0;
  return 1 - Math.exp(-damp * x) * Math.cos(2 * Math.PI * freq * x);
};

// ─── Skip wordmark ─────────────────────────────────────────────────────────
// `wipe` reveals the mark left→right through a mask cut at the logo's own slant.
// The leaf is drawn in `bg` on a solid P, so it can spring in on its own.
export const SkipLogo: React.FC<{
  width: number;
  color?: string;
  bg: string;
  wipe?: number; // 0..1
  leaf?: number; // 0..1 (spring value, may overshoot)
  leafSpin?: number; // degrees
  style?: React.CSSProperties;
}> = ({ width, color = brand.logo, bg, wipe = 1, leaf = 1, leafSpin = 0, style }) => {
  const h = (width * LOGO_VIEWBOX.h) / LOGO_VIEWBOX.w;
  // slanted mask edge, in viewBox units
  const lean = LOGO_VIEWBOX.h * SLANT_TAN;
  const x = -lean + wipe * (LOGO_VIEWBOX.w + lean * 2);
  const id = React.useId().replace(/:/g, "");
  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}`}
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <clipPath id={`wipe-${id}`}>
          <polygon points={`-20,-5 ${x + lean},-5 ${x - lean * 0.1},45 -20,45`} />
        </clipPath>
      </defs>
      <g clipPath={wipe < 1 ? `url(#wipe-${id})` : undefined}>
        <path d={LOGO_SKI} fill={color} />
        <path d={LOGO_P} fill={color} />
        <path
          d={LOGO_LEAF}
          fill={bg}
          style={{
            transformBox: "view-box",
            transformOrigin: `${LEAF_CENTER.x}px ${LEAF_CENTER.y}px`,
            transform: `scale(${Math.max(0, leaf)}) rotate(${leafSpin}deg)`,
          }}
        />
      </g>
    </svg>
  );
};

// ─── Sparkle (the four-point star from the site's app illustration) ───────
export const Sparkle: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  s?: number; // scale 0..1 (spring)
  rot?: number;
}> = ({ x, y, size, color, s = 1, rot = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="-1 -1 2 2"
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      scale: Math.max(0, s),
      rotate: `${rot}deg`,
      overflow: "visible",
    }}
  >
    <path
      d="M0 -1 C0.1 -0.28 0.28 -0.1 1 0 C0.28 0.1 0.1 0.28 0 1 C-0.1 0.28 -0.28 0.1 -1 0 C-0.28 -0.1 -0.1 -0.28 0 -1 Z"
      fill={color}
    />
  </svg>
);

// ─── Slanted panel ─────────────────────────────────────────────────────────
// A full-height parallelogram leaning at the logo's 15°, used for every
// "skip" wipe. `x` is the panel's left edge at mid-height (px).
export const SlantPanel: React.FC<{
  x: number;
  width: number;
  color?: string;
  height?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, width, color, height = 1080, children, style }) => {
  const lean = (height / 2) * SLANT_TAN;
  return (
    <div
      style={{
        position: "absolute",
        left: x - lean,
        top: 0,
        width: width + lean * 2,
        height,
        background: color,
        clipPath: `polygon(${lean * 2}px 0, 100% 0, calc(100% - ${lean * 2}px) 100%, 0 100%)`,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Clip-path polygon for a slanted window (both side edges at 15°)
export const slantClip = (left: number, right: number, height: number) => {
  const lean = (height / 2) * SLANT_TAN;
  return `polygon(${left + lean}px 0, ${right + lean}px 0, ${right - lean}px ${height}px, ${left - lean}px ${height}px)`;
};

// ─── Photo ─────────────────────────────────────────────────────────────────
export const Photo: React.FC<{
  src: string;
  scale?: number;
  x?: number; // object-position %
  y?: number;
  style?: React.CSSProperties;
}> = ({ src, scale = 1, x = 50, y = 50, style }) => (
  <Img
    src={staticFile(`skip/img/${src}`)}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: `${x}% ${y}%`,
      scale,
      ...style,
    }}
  />
);

// ─── PIE icon ──────────────────────────────────────────────────────────────
export const Icon: React.FC<{ name: IconName; size: number; color: string; style?: React.CSSProperties }> = ({
  name,
  size,
  color,
  style,
}) => (
  <svg width={size} height={size} viewBox={name === "pin16" ? "0 0 16 16" : "0 0 32 32"} style={style}>
    {ICONS[name].map((d, i) => (
      <path key={i} d={d} fill={color} />
    ))}
  </svg>
);

export const Star: React.FC<{ size: number; color?: string }> = ({ size, color = brand.charcoal }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "inline-block" }}>
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.5 6.6-.8z" fill={color} />
  </svg>
);

// ─── Editorial type ────────────────────────────────────────────────────────
// A line that rises out of its own mask on a fast expo-out and leaves upward.
export const MaskLine: React.FC<{
  t: number;
  at: number;
  out?: number;
  children: React.ReactNode;
  dur?: number;
  outDur?: number;
  dir?: 1 | -1; // exit direction: 1 = up, -1 = down
  style?: React.CSSProperties;
}> = ({ t, at, out, children, dur = 0.55, outDur = 0.3, dir = 1, style }) => {
  const inP = iv(t, [at - 0.03, at + dur], [0, 1], ease.out);
  const outP = out === undefined ? 0 : iv(t, [out - outDur, out], [0, 1], ease.in);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em", ...style }}>
      <div style={{ translate: `0px ${(1 - inP) * 115 - outP * 115 * dir}%`, whiteSpace: "nowrap" }}>{children}</div>
    </div>
  );
};

export const heading = (size: number, color: string = brand.charcoal): React.CSSProperties => ({
  fontFamily: fonts.sans,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1.02,
  letterSpacing: "-0.03em",
  color,
});

// ─── Film finish ───────────────────────────────────────────────────────────
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.035 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity, mixBlendMode: "overlay" }}>
        <filter id="skip-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(frame / 2) % 10} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#skip-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// Author mark on the spec piece. `dark` (0..1) blends it towards charcoal for
// light backgrounds; animate it across cuts so the tint never jumps.
export const Watermark: React.FC<{ dark?: number }> = ({ dark = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        right: 34,
        bottom: 26,
        fontFamily: fonts.sans,
        fontWeight: 600,
        fontSize: 17,
        letterSpacing: "0.12em",
        color: `rgba(${mix(255, 36, dark)},${mix(255, 46, dark)},${mix(255, 48, dark)},${mix(0.62, 0.45, dark)})`,
      }}
    >
      © BABATEMS · SPEC CONCEPT
    </div>
  </AbsoluteFill>
);

export { interpolate };
