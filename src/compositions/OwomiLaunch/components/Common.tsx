import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, clamp, ease, fonts } from "../brand";
import { CAPTIONED, FPS, WORDS } from "../timeline";

// Global time (seconds) inside a scene mounted at `start`
export const useT = (start: number) => useCurrentFrame() / FPS + start;

// interpolate over seconds, always clamped
export const iv = (
  t: number,
  input: readonly number[],
  output: readonly number[],
  easing: ((x: number) => number) | undefined = ease.out,
) => interpolate(t, input, output, { ...clamp, easing });

const HERO = staticFile("owomi/hero-section-currency-face-stack.avif");

// The engraved-banknote portraits from the Owó-mi hero, split into its
// five panels so each can move on its own.
export const BanknoteStrips: React.FC<{
  offsets: number[]; // per-strip translateY in px
  opacity?: number;
  grayscale?: number;
  scale?: number;
}> = ({ offsets, opacity = 1, grayscale = 0, scale = 1 }) => {
  const W = 1920;
  const H = 1080;
  const stripW = W / 5;
  return (
    <AbsoluteFill style={{ opacity, scale }}>
      {offsets.map((y, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i * stripW,
            top: 0,
            width: stripW + 1,
            height: H,
            overflow: "hidden",
            translate: `0px ${y}px`,
          }}
        >
          <Img
            src={HERO}
            style={{
              position: "absolute",
              left: -i * stripW,
              top: 0,
              width: W,
              height: H,
              maxWidth: "none",
              objectFit: "cover",
              filter: `grayscale(${grayscale})`,
            }}
          />
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity, mixBlendMode: "overlay" }}>
        <filter id="owomi-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={Math.floor(frame / 2) % 10} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#owomi-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// Word-by-word caption track (X autoplays muted)
export const Captions: React.FC<{ t: number; darkAt: (t: number) => boolean }> = ({ t, darkAt }) => {
  const line = CAPTIONED.find((k) => {
    const w = WORDS[k];
    return t >= w.words[0].t - 0.15 && t <= w.end + 0.35;
  });
  if (!line) return null;
  const { words, end } = WORDS[line];
  const dark = darkAt(t);
  const inO = iv(t, [words[0].t - 0.15, words[0].t + 0.1], [0, 1]);
  const outO = iv(t, [end + 0.1, end + 0.35], [1, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 64,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(inO, outO),
        translate: `0px ${(1 - inO) * 12}px`,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          textAlign: "center",
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 40,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          padding: "12px 26px",
          borderRadius: 16,
          background: dark ? "rgba(14,15,18,0.55)" : "rgba(250,250,247,0.75)",
          backdropFilter: "blur(14px)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(14,15,18,0.06)"}`,
        }}
      >
        {words.map((w, i) => {
          const spoken = t >= w.t;
          return (
            <span
              key={i}
              style={{
                color: spoken ? (dark ? "#fafafa" : brand.navy) : dark ? "rgba(250,250,250,0.32)" : "rgba(22,33,62,0.3)",
              }}
            >
              {w.w}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
