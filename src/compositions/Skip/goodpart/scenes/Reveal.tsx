import React from "react";
import { AbsoluteFill } from "remotion";
import { SLANT_TAN, brand, ease } from "../../brand";
import { SkipLogo, SlantPanel, Sparkle, iv, pop, useT } from "../../components/Common";
import { DROP, SCENE, T } from "../timeline";

const LEAN = 540 * SLANT_TAN;

// On the drop: a two-layer orange wipe at the logo's slant, the mark wipes on
// through the same angle and the maple leaf springs into the P.
export const Reveal: React.FC = () => {
  const t = useT(SCENE.reveal[0]);
  const w = iv(t, [T.wipe, DROP + 0.02], [0, 1], ease.snap);
  const lead = 1920 + LEAN * 2 - w * (1920 + LEAN * 4 + 260);
  const main = lead + 240 * (1 - w);

  const wipe = iv(t, [DROP + 0.02, DROP + 0.34], [0, 1], ease.out);
  const leaf = pop(t, DROP + 0.2, { freq: 2.3, damp: 7 });
  const spin = iv(t, [DROP + 0.2, DROP + 0.8], [-140, 0], ease.out);
  const hold = iv(t, [DROP, T.toProduct], [0, 1], ease.linear);
  // leaves with the next wipe: the mark slides left on the slant
  const exit = iv(t, [T.toProduct - 0.04, T.toProduct + 0.32], [0, 1], ease.expoIn);

  const sparks = [
    { x: 1410, y: 330, size: 92, color: brand.yellow, at: DROP + 0.3, r: 1 },
    { x: 1500, y: 452, size: 46, color: brand.white, at: DROP + 0.38, r: -1 },
    { x: 470, y: 690, size: 64, color: brand.pink, at: DROP + 0.44, r: 1 },
  ];

  return (
    <AbsoluteFill>
      <SlantPanel x={lead} width={4200} color={brand.logo} />
      <SlantPanel x={main} width={4200} color={brand.orange}>
        <div style={{ position: "absolute", left: -(main - LEAN), top: 0, width: 1920, height: 1080 }}>
          <div style={{ position: "absolute", inset: 0, translate: `${-exit * 1300}px 0` }}>
            <div style={{ position: "absolute", left: 960 - 400, top: 540 - 167, scale: 1 + hold * 0.035 }}>
              <SkipLogo width={800} color={brand.white} bg={brand.orange} wipe={wipe} leaf={leaf} leafSpin={spin} />
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
          </div>
        </div>
      </SlantPanel>
    </AbsoluteFill>
  );
};
