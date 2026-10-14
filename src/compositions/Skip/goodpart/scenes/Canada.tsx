import React from "react";
import { AbsoluteFill } from "remotion";
import { SLANT_TAN, brand, ease } from "../../brand";
import { MaskLine, Photo, SlantPanel, heading, iv, pop, slantClip, useT } from "../../components/Common";
import { LEAF_CENTER, LOGO_LEAF } from "../../logo";
import { SCENE, T, W, b } from "../timeline";

const LEAN = 540 * SLANT_TAN;
const WIN_X = 1130; // photo panel's left edge at mid-height (the site hero's diagonal)

// Photos swap every two beats. Skip's own hero photo leads.
const SHOTS = [
  { img: "hero-pasta.jpg", at: T.toCanada, x: 40, y: 55 },
  { img: "ramen.jpg", at: b(20) },
  { img: "tacos.jpg", at: b(22) },
  { img: "sushi.jpg", at: b(24), y: 55 },
  { img: "groceries.jpg", at: b(26), y: 40 },
];

const Leaf: React.FC<{ size: number; s: number; rot: number }> = ({ size, s, rot }) => (
  <svg
    width={size}
    height={size}
    viewBox={`${LEAF_CENTER.x - 9} ${LEAF_CENTER.y - 9.5} 18 18`}
    style={{ display: "inline-block", verticalAlign: "-0.06em", marginLeft: "0.18em", scale: Math.max(0, s), rotate: `${rot}deg` }}
  >
    <path d={LOGO_LEAF} fill={brand.orange} />
  </svg>
);

export const Canada: React.FC = () => {
  const t = useT(SCENE.canada[0]);
  const w = iv(t, [T.toCanada, T.toCanada + 0.4], [0, 1], ease.snap);
  const lead = 1920 + LEAN * 2 - w * (1920 + LEAN * 4 + 260);
  const main = lead + 200 * (1 - w);
  // the photo window trails the wipe a touch, for depth
  const win = iv(t, [T.toCanada + 0.06, T.toCanada + 0.6], [0, 1], ease.out);
  const winX = WIN_X + (1 - win) * 700;
  const leaf = pop(t, W.canada + 0.42, { freq: 2.3, damp: 7 });

  return (
    <AbsoluteFill>
      <SlantPanel x={lead} width={4200} color={brand.orange} />
      <SlantPanel x={main} width={4200} color={brand.cream}>
        <div style={{ position: "absolute", left: -(main - LEAN), top: 0, width: 1920, height: 1080 }}>
          {/* type */}
          <div style={{ position: "absolute", left: 140, top: 196 }}>
            <div style={{ ...heading(52, brand.slate), fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>
              <MaskLine t={t} at={W.delivering}>Delivering to</MaskLine>
            </div>
            <div style={{ ...heading(300, brand.orange), letterSpacing: "-0.045em" }}>
              <MaskLine t={t} at={W.n450 - 0.04} dur={0.55}>
                450
              </MaskLine>
            </div>
            <div style={{ ...heading(84), marginTop: 6 }}>
              <MaskLine t={t} at={W.cities}>cities and towns</MaskLine>
              <MaskLine t={t} at={W.canada - 0.3}>
                <span>
                  across Canada.
                  <Leaf size={70} s={leaf} rot={(1 - Math.min(1, leaf)) * -90} />
                </span>
              </MaskLine>
            </div>
          </div>

          {/* photo window */}
          <SlantPanel x={winX} width={1920 - WIN_X + 300} color={brand.charcoal}>
            <div style={{ position: "absolute", left: -(winX - LEAN), top: 0, width: 1920, height: 1080 }}>
              {SHOTS.map((s, i) => {
                const next = SHOTS[i + 1];
                if (t < s.at - 0.02 || (next && t > next.at + 0.3)) return null;
                const wipe = i === 0 ? 1 : iv(t, [s.at - 0.02, s.at + 0.26], [0, 1], ease.out);
                const from = 1920 + LEAN * 2;
                const to = WIN_X - LEAN * 2 - 60;
                const age = t - s.at;
                return (
                  <AbsoluteFill key={s.img} style={{ clipPath: slantClip(from + (to - from) * wipe, 2400, 1080) }}>
                    <div style={{ position: "absolute", top: 0, height: 1080, left: WIN_X - LEAN - 40, width: 1920 - WIN_X + LEAN + 40, overflow: "hidden" }}>
                      <Photo src={s.img} x={s.x} y={s.y} scale={1.12 - Math.min(age, 1.6) * 0.05} />
                    </div>
                  </AbsoluteFill>
                );
              })}
            </div>
          </SlantPanel>
        </div>
      </SlantPanel>
    </AbsoluteFill>
  );
};
