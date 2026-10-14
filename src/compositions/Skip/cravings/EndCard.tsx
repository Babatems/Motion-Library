import React from "react";
import { AbsoluteFill } from "remotion";
import { SLANT_TAN, brand, ease, fonts } from "../brand";
import { MaskLine, SkipLogo, SlantPanel, Sparkle, heading, iv, pop, useT } from "../components/Common";
import { T } from "./timeline";

const LEAN = 540 * SLANT_TAN;

// Two-layer "skip" wipe at the logo's slant (an orange band leading the cream),
// then the site's hero lock-up: mark, "Skip to the good part.", the subhead.
export const EndCard: React.FC<{ start: number }> = ({ start }) => {
  const t = useT(start);
  const w = iv(t, [T.wipe, T.logo], [0, 1], ease.snap);
  const lead = 1920 + LEAN * 2 + 40 - w * (1920 + LEAN * 4 + 400);
  const cream = lead + 170 - w * 170;

  const logoW = iv(t, [T.logo - 0.08, T.logo + 0.36], [0, 1], ease.out);
  const leaf = pop(t, T.logo + 0.2, { freq: 2.4, damp: 7.5 });
  const spin = iv(t, [T.logo + 0.2, T.logo + 0.75], [-120, 0], ease.out);
  const settle = iv(t, [T.logo, 10], [0, 1], ease.linear);

  const sparks = [
    { x: 1365, y: 300, size: 74, color: brand.yellow, at: T.logo + 0.3, r: 1 },
    { x: 1440, y: 392, size: 40, color: brand.orange, at: T.logo + 0.38, r: -1 },
    { x: 560, y: 470, size: 52, color: brand.pink, at: T.logo + 0.44, r: 1 },
  ];

  return (
    <AbsoluteFill>
      <SlantPanel x={lead} width={4000} color={brand.orange} />
      <SlantPanel x={cream} width={4000} color={brand.cream}>
        <div style={{ position: "absolute", left: -(cream - LEAN), top: 0, width: 1920, height: 1080 }}>
          <div
            style={{
              position: "absolute",
              left: 960 - 290,
              top: 270,
              scale: 1 + settle * 0.03,
            }}
          >
            <SkipLogo width={580} bg={brand.cream} wipe={logoW} leaf={leaf} leafSpin={spin} />
          </div>
          {sparks.map((s, i) => (
            <Sparkle
              key={i}
              x={s.x}
              y={s.y}
              size={s.size}
              color={s.color}
              s={pop(t, s.at, { freq: 2.2, damp: 7 })}
              rot={s.r * (t - s.at) * 30}
            />
          ))}
          <div style={{ position: "absolute", left: 0, width: 1920, top: 590, textAlign: "center", ...heading(96, brand.orange) }}>
            <MaskLine t={t} at={T.line}>Skip to the good part.</MaskLine>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 718,
              textAlign: "center",
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: 40,
              color: brand.slate,
            }}
          >
            <MaskLine t={t} at={T.sub}>What can we bring to your door?</MaskLine>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 935,
              textAlign: "center",
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: "0.01em",
              color: brand.charcoal,
            }}
          >
            <MaskLine t={t} at={T.sub + 0.25}>skipthedishes.com</MaskLine>
          </div>
        </div>
      </SlantPanel>
    </AbsoluteFill>
  );
};
