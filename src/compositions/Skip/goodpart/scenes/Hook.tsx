import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, ease, fonts } from "../../brand";
import { MaskLine, heading, iv, mix, pop, useT } from "../../components/Common";
import { SCENE, T, W } from "../timeline";

const LINES = [
  { text: "Traffic.", at: W.traffic },
  { text: "Lineups.", at: W.lineups },
  { text: "Waiting around.", at: W.waiting },
];

// The everyday hassles, stacked as they're named, then struck out and skipped
// like an ad when the Skip button is pressed.
export const Hook: React.FC = () => {
  const t = useT(SCENE.hook[0]);
  const btn = pop(t, T.skipBtn, { freq: 2.2, damp: 8 });
  const press = iv(t, [T.press - 0.04, T.press + 0.05], [0, 1], ease.out) * (1 - iv(t, [T.press + 0.1, T.press + 0.3], [0, 1], ease.out));
  const lit = iv(t, [T.press - 0.02, T.press + 0.08], [0, 1], ease.out);
  // the ad-style progress bar: crawls, then jumps to the end on the press
  const crawl = iv(t, [0, T.press], [0, 0.34], ease.linear);
  const jump = iv(t, [T.press, T.press + 0.28], [0, 1], ease.snap);
  const progress = mix(crawl, 1, jump);
  // a slow push on the type so the hold never feels static
  const drift = iv(t, [0, T.linesOut], [0, 1], ease.linear);

  return (
    <AbsoluteFill style={{ background: brand.cream }}>
      <div style={{ position: "absolute", left: 140, top: 262, ...heading(168), scale: 1 + drift * 0.03, transformOrigin: "0 50%" }}>
        {LINES.map((l, i) => {
          const strike = iv(t, [T.strike + i * 0.05, T.strike + 0.2 + i * 0.05], [0, 1], ease.out);
          const out = iv(t, [T.linesOut + i * 0.04, T.linesOut + 0.3 + i * 0.04], [0, 1], ease.expoIn);
          return (
            <div key={l.text} style={{ translate: `${-out * 1500}px 0` }}>
              <MaskLine t={t} at={l.at} dur={0.5}>
                <span style={{ position: "relative", display: "inline-block" }}>
                  {l.text}
                  <span
                    style={{
                      position: "absolute",
                      left: -10,
                      right: -14,
                      top: "52%",
                      height: "0.12em",
                      background: brand.orange,
                      scale: `${strike} 1`,
                      transformOrigin: "0 50%",
                    }}
                  />
                </span>
              </MaskLine>
            </div>
          );
        })}
      </div>

      {/* skip button */}
      <div
        style={{
          position: "absolute",
          right: 140,
          bottom: 132,
          height: 116,
          padding: "0 48px 0 56px",
          borderRadius: 800,
          display: "flex",
          alignItems: "center",
          gap: 18,
          background: lit > 0 ? `rgb(${mix(36, 243, lit)},${mix(46, 104, lit)},${mix(48, 5, lit)})` : brand.charcoal,
          color: brand.white,
          fontFamily: fonts.sans,
          fontWeight: 800,
          fontSize: 52,
          letterSpacing: "-0.01em",
          scale: Math.max(0, btn) * (1 - press * 0.08),
          transformOrigin: "100% 50%",
        }}
      >
        Skip
        <svg width={48} height={41} viewBox="0 0 40 34">
          <path d="M2 3 L17 17 L2 31 Z M18 3 L33 17 L18 31 Z" fill={brand.white} />
          <rect x={34} y={3} width={5} height={28} rx={1.5} fill={brand.white} />
        </svg>
      </div>

      {/* progress bar along the bottom edge */}
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: 10, background: brand.creamDeep }}>
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: jump > 0 ? brand.orange : brand.charcoal,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
