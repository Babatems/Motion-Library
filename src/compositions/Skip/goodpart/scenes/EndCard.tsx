import React from "react";
import { AbsoluteFill } from "remotion";
import { SLANT_TAN, brand, ease, fonts } from "../../brand";
import { MaskLine, SkipLogo, SlantPanel, Sparkle, heading, iv, pop, useT } from "../../components/Common";
import { END, SCENE, T, W } from "../timeline";

const LEAN = 540 * SLANT_TAN;

// The site's orange promo card, as an end card: white mark, the line, and the
// card's own white "Get Started" pill.
export const EndCard: React.FC = () => {
  const t = useT(SCENE.end[0]);
  const w = iv(t, [T.toEnd, T.endLand + 0.02], [0, 1], ease.snap);
  const lead = 1920 + LEAN * 2 - w * (1920 + LEAN * 4 + 260);
  const main = lead + 240 * (1 - w);

  const logo = iv(t, [T.endLand - 0.02, T.endLand + 0.32], [0, 1], ease.out);
  const leaf = pop(t, T.endLand + 0.22, { freq: 2.3, damp: 7 });
  const spin = iv(t, [T.endLand + 0.22, T.endLand + 0.8], [-140, 0], ease.out);
  const settle = iv(t, [T.endLand, END], [0, 1], ease.linear);
  const cta = pop(t, T.cta, { freq: 2.2, damp: 8 });

  const sparks = [
    { x: 1290, y: 196, size: 78, color: brand.yellow, at: T.endLand + 0.32, r: 1 },
    { x: 1368, y: 300, size: 38, color: brand.white, at: T.endLand + 0.4, r: -1 },
    { x: 610, y: 400, size: 54, color: brand.pink, at: T.endLand + 0.46, r: 1 },
  ];

  return (
    <AbsoluteFill>
      <SlantPanel x={lead} width={4200} color={brand.logo} />
      <SlantPanel x={main} width={4200} color={brand.orange}>
        <div style={{ position: "absolute", left: -(main - LEAN), top: 0, width: 1920, height: 1080 }}>
          <div style={{ position: "absolute", left: 960 - 310, top: 205, scale: 1 + settle * 0.025 }}>
            <SkipLogo width={620} color={brand.white} bg={brand.orange} wipe={logo} leaf={leaf} leafSpin={spin} />
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
          <div style={{ position: "absolute", left: 0, width: 1920, top: 560, textAlign: "center", ...heading(104, brand.white) }}>
            <MaskLine t={t} at={W.endLine - 0.04}>Skip to the good part.</MaskLine>
          </div>
          <div style={{ position: "absolute", left: 0, width: 1920, top: 742, display: "flex", justifyContent: "center" }}>
            <div
              style={{
                height: 84,
                padding: "0 46px",
                borderRadius: 800,
                background: brand.white,
                color: brand.charcoal,
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: 34,
                display: "flex",
                alignItems: "center",
                scale: Math.max(0, cta),
                opacity: Math.min(1, cta * 4),
              }}
            >
              Get Started
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              width: 1920,
              top: 870,
              textAlign: "center",
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 28,
              color: brand.white,
            }}
          >
            <MaskLine t={t} at={T.cta + 0.12}>skipthedishes.com</MaskLine>
          </div>
        </div>
      </SlantPanel>
    </AbsoluteFill>
  );
};
