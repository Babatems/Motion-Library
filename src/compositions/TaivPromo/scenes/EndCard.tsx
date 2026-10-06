import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { brand, ease, fonts, radius } from "../brand";
import { Backdrop, Cursor, cursorAt, iv, useT } from "../components/Common";
import { TaivLogo } from "../components/TaivLogo";
import { END, SCENE, W, bar } from "../timeline";

export const LAND = bar(7); // 19.25 — end card lands on the downbeat
export const CTA_IN = W.reimagined + 0.6;
export const CLICK = 22.95;

// Outro: right after the click, the camera pushes into "Get started" until
// its violet fills the frame, then everything fades out. Starts 0.2s after
// the click — as the button springs back — on the bar(9) downbeat, and lasts
// 2s, to END.
export const ZOOM = [bar(9), bar(9) + 1.45] as const; // 23.15 → 24.60
export const FADE = [ZOOM[1] - 0.4, END - 0.04] as const; // overlaps the settle — no dead hold on violet
const BTN = { x: 866.5, y: 722.5 }; // button centre, measured from the render
const S_MAX = 14; // the 285×89 button fills 1920×1080 just as the push settles
const zoomEase = Easing.bezier(0.76, 0, 0.24, 1); // easeInOutQuart

export const EndCard: React.FC = () => {
  const t = useT(SCENE.end[0]);
  const out = iv(t, [FADE[0], FADE[1]], [0, 1], ease.site);
  return (
    <AbsoluteFill>
      {/* Film-style motion blur over the whole end card, from the moment it
          mounts (while it fades in from nothing). Switching it on later makes
          a visible one-frame softening/jump; always-on also gives the logo,
          headline, cursor and the outro push natural blur. */}
      <CameraMotionBlur samples={10} shutterAngle={180}>
        <EndCardShot />
      </CameraMotionBlur>
      {/* kept faintly alive so Chrome never creates the layer mid-shot */}
      <AbsoluteFill
        style={{ background: brand.void, opacity: Math.max(0.002, out) }}
      />
    </AbsoluteFill>
  );
};

const EndCardShot: React.FC = () => {
  const t = useT(SCENE.end[0]);
  const intro = iv(t, [SCENE.end[0], LAND + 0.03], [0, 1], ease.site);
  const icon = iv(t, [LAND - 0.04, LAND + 0.36], [0, 1], ease.quint);
  const letters = [0, 1, 2, 3].map((i) =>
    iv(t, [LAND + 0.02 + i * 0.05, LAND + 0.42 + i * 0.05], [0, 1], ease.quint),
  );
  const shine = iv(t, [W.endTaiv + 0.15, W.endTaiv + 0.85], [0, 1], ease.site);
  // log-space scale: equal perceived speed at every zoom level
  const p = iv(t, [ZOOM[0], ZOOM[1]], [0, 1], zoomEase);
  const s = Math.exp(Math.log(S_MAX) * p);
  const labelO = iv(p, [0.28, 0.6], [1, 0], ease.linear);

  // each word rises out of its own mask as it is spoken
  const word = (at: number) => iv(t, [at - 0.06, at + 0.5], [0, 1], ease.out);
  const wB = word(W.business);
  const wT = word(W.tv);
  const wR = word(W.reimagined);
  const cta = iv(t, [CTA_IN, CTA_IN + 0.45], [0, 1], ease.quint);

  // cursor comes in and clicks "Get started"
  const btn = { x: 850, y: 726 };
  const cur = cursorAt(t, [
    { t: 22.05, x: 1560, y: 1120 },
    { t: CLICK - 0.12, x: btn.x, y: btn.y, arc: 80 },
    { t: 24.2, x: btn.x + 14, y: btn.y + 12 },
  ]);
  const hover = iv(t, [CLICK - 0.3, CLICK - 0.1], [0, 1]);
  const press =
    iv(t, [CLICK, CLICK + 0.06], [0, 1], ease.out) *
    iv(t, [CLICK + 0.12, CLICK + 0.24], [1, 0], ease.out);
  const curO =
    iv(t, [22.05, 22.2], [0, 1]) *
    iv(t, [CLICK + 0.1, ZOOM[0] + 0.25], [1, 0], ease.site); // leaves as the push begins
  const clicked = iv(t, [CLICK, CLICK + 0.6], [0, 1], ease.out);

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: intro }}>
      <AbsoluteFill
        style={{
          transformOrigin: `${BTN.x}px ${BTN.y}px`,
          scale: s,
          translate: `${(960 - BTN.x) * p}px ${(540 - BTN.y) * p}px`,
        }}
      >
        <Backdrop glow={0.8} glowY={46} glowSize={1200} />
        <AbsoluteFill
          style={{
            alignItems: "center",
            paddingTop: 308,
            flexDirection: "column",
          }}
        >
          <div
            style={{
              scale: iv(t, [LAND - 0.1, LAND + 0.6], [1.04, 1], ease.quint),
            }}
          >
            <TaivLogo
              width={560}
              icon={icon}
              letters={letters}
              shine={shine}
              id="end"
            />
          </div>
          <div
            style={{
              marginTop: 70,
              display: "flex",
              gap: 30,
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 112,
              letterSpacing: "-0.035em",
              lineHeight: 1,
            }}
          >
            {[
              { w: "Business", p: wB, color: brand.white },
              { w: "TV", p: wT, color: brand.white },
              { w: "Reimagined", p: wR, color: brand.lilac },
            ].map(({ w, p, color }) => (
              <span
                key={w}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  paddingBottom: "0.1em",
                  marginBottom: "-0.1em",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    color,
                    translate: `0px ${(1 - p) * 110}%`,
                  }}
                >
                  {w}
                </span>
              </span>
            ))}
          </div>

          <div
            style={{
              marginTop: 74,
              display: "flex",
              gap: 22,
              opacity: cta,
              translate: `0px ${(1 - cta) * 24}px`,
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "22px 40px",
                borderRadius: radius.lg + 4,
                background:
                  hover > 0
                    ? `color-mix(in srgb, ${brand.violet} ${100 - hover * 18}%, white)`
                    : brand.violet,
                color: "#fff",
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: 30,
                boxShadow: `0 ${10 + hover * 6}px ${28 + hover * 12}px rgba(10,4,32,${0.45 + hover * 0.15})`,
                translate: `0px ${-hover * 3 + press * 3}px`,
                scale: 1 - press * 0.04,
              }}
            >
              <span style={{ opacity: labelO }}>Get started</span>
              <span
                style={{ translate: `${hover * 6}px 0px`, opacity: labelO }}
              >
                →
              </span>
              <div
                style={{
                  position: "absolute",
                  inset: -2,
                  borderRadius: radius.lg + 6,
                  border: `2px solid ${brand.lavender}`,
                  opacity: t >= CLICK ? 1 - clicked : 0,
                  scale: 1 + clicked * 0.18,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "22px 36px",
                borderRadius: radius.lg + 4,
                background: "rgba(26,16,64,0.9)",
                border: "1px solid rgba(196,168,255,0.22)",
                color: brand.white,
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: 30,
              }}
            >
              taiv.tv
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <Cursor
        x={cur.x}
        y={cur.y}
        press={press}
        opacity={curO}
        t={t}
        clickAt={CLICK}
      />
    </AbsoluteFill>
  );
};
