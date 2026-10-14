import React from "react";
import { AbsoluteFill } from "remotion";
import { SLANT_TAN, brand, ease } from "../brand";
import { Photo, SlantPanel, heading, iv, slantClip, useT } from "../components/Common";
import { BASS, CRAVINGS, T } from "./timeline";

const H = 1080;
const WIN_X = 1190; // window's left edge at mid-height, once it has landed
const TYPE_X = 128;
const SIZE = 172;
const LEAN = (H / 2) * SLANT_TAN;

// One line-2 word: rises in from its mask, leaves upward when the next arrives
const CycleWord: React.FC<{ t: number; at: number; next?: number; children: React.ReactNode; color: string }> = ({
  t,
  at,
  next,
  children,
  color,
}) => {
  const inP = iv(t, [at - 0.02, at + 0.26], [0, 1], ease.out);
  const outP = next === undefined ? 0 : iv(t, [next - 0.02, next + 0.2], [0, 1], ease.out);
  if (t < at - 0.05 || outP >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, translate: `0 ${(1 - inP) * 105 - outP * 105}%`, color }}>
      {children}
    </div>
  );
};

export const Montage: React.FC = () => {
  const t = useT(0);

  // window slams in from the right on the bass entry, then swallows the frame
  const land = iv(t, [BASS - 0.04, BASS + 0.34], [0, 1], ease.out);
  const grow = iv(t, [T.expand - 0.04, T.expand + 0.42], [0, 1], ease.snap);
  const winX = WIN_X + (1 - land) * 900 - grow * (WIN_X + 420);
  const winW = 1920 - WIN_X + 400 + grow * (WIN_X + 420);

  // the type block is nudged left as the window pushes in
  const typeShift = -grow * 260;

  // photo layers inside the window: each wipes in from the right at the slant
  const layers = [
    ...CRAVINGS.map((c) => ({ img: c.img, at: c.at, x: c.x, y: c.y })),
    { img: "cheese-pull.jpg", at: T.expand, x: 50, y: 57 },
  ];

  return (
    <AbsoluteFill style={{ background: brand.orange }}>
      {/* type */}
      <div style={{ position: "absolute", left: TYPE_X + typeShift, top: 540 - SIZE * 1.04, ...heading(SIZE, brand.white) }}>
        <div style={{ overflow: "hidden", height: SIZE * 1.08 }}>
          <div style={{ translate: `0 ${(1 - iv(t, [T.craving, T.craving + 0.5], [0, 1], ease.out)) * 105}%` }}>Craving</div>
        </div>
        <div style={{ position: "relative", overflow: "hidden", height: SIZE * 1.16, width: 1400 }}>
          <CycleWord t={t} at={T.something} next={CRAVINGS[0].at} color={brand.charcoal}>
            something?
          </CycleWord>
          {CRAVINGS.map((c, i) => (
            <CycleWord key={c.word} t={t} at={c.at} next={CRAVINGS[i + 1]?.at} color={brand.charcoal}>
              {c.word}
            </CycleWord>
          ))}
        </div>
      </div>

      {/* the slanted photo window (the site hero's diagonal crop). Photos sit
          still in frame space; the window moves over them. */}
      {land > 0 ? (
        <SlantPanel x={winX} width={winW} color={brand.charcoal}>
          <div style={{ position: "absolute", left: -(winX - LEAN), top: 0, width: 1920, height: H }}>
            {layers.map((l, i) => {
              if (t < l.at - 0.02) return null;
              const next = layers[i + 1];
              if (next && t > next.at + 0.3) return null;
              const full = l.img === "cheese-pull.jpg";
              // the first photo arrives with the window itself; the rest wipe in
              const wipe = i === 0 ? 1 : iv(t, [l.at - 0.02, l.at + (full ? 0.42 : 0.22)], [0, 1], full ? ease.snap : ease.out);
              const from = 1920 + LEAN * 2;
              const to = full ? -LEAN * 2 - 40 : WIN_X - LEAN * 2 - 60;
              const age = t - l.at;
              const box: React.CSSProperties = full
                ? { left: 0, width: 1920 }
                : { left: WIN_X - LEAN - 40, width: 1920 - WIN_X + LEAN + 40 };
              return (
                <AbsoluteFill key={l.img + i} style={{ clipPath: slantClip(from + (to - from) * wipe, 2400, H) }}>
                  <div style={{ position: "absolute", top: 0, height: H, overflow: "hidden", ...box }}>
                    <Photo src={l.img} x={l.x} y={l.y} scale={(full ? 1.12 : 1.16) - Math.min(age, 1.5) * 0.06} />
                  </div>
                </AbsoluteFill>
              );
            })}
          </div>
        </SlantPanel>
      ) : null}
    </AbsoluteFill>
  );
};
