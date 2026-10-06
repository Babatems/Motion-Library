import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { brand, ease, fonts } from "../brand";
import { Brackets, Cursor, Vignette, cursorAt, iv, useT } from "../components/Common";
import { DROP, SCENE, W } from "../timeline";

// The bar photo from taiv.tv's own with/without comparison (1280×853),
// drawn at 1.5× so it covers the frame.
const IMG_SCALE = 1.5;
const IMG_W = 1280 * IMG_SCALE;
const IMG_H = 853 * IMG_SCALE;

// Screen rectangles measured from the photo (image px)
const TVS = [
  { x: 58, y: 92, w: 457, h: 313 },
  { x: 544, y: 134, w: 369, h: 281 },
  { x: 940, y: 159, w: 325, h: 264 },
].map((r) => ({ ...r, x: r.x * IMG_SCALE, y: r.y * IMG_SCALE, w: r.w * IMG_SCALE, h: r.h * IMG_SCALE }));

// Camera pushes in slowly around the middle screen, then crash-zooms into it
const ORIGIN = { x: TVS[1].x + TVS[1].w / 2, y: TVS[1].y + TVS[1].h / 2 };
export const ZOOM_AT = 4.98;

// Compare handle (canvas x)
export const HANDLE_IN = 3.55;
export const GRAB = 3.98;
export const DRAG = [4.06, 4.92] as const;
const H0 = 118;
const H1 = 1850;
const handleX = (t: number) => (t < DRAG[0] ? H0 : iv(t, [DRAG[0], DRAG[1]], [H0, H1], ease.inOut));

// When the dragged handle passes each screen's centre (for the channel-flip SFX)
export const SWAP_TIMES = TVS.map((tv) => {
  const target = ORIGIN.x + (tv.x + tv.w / 2 - ORIGIN.x) * 1.02;
  let a: number = DRAG[0];
  let b: number = DRAG[1];
  for (let k = 0; k < 30; k++) {
    const mid = (a + b) / 2;
    if (handleX(mid) < target) a = mid;
    else b = mid;
  }
  return +a.toFixed(3);
});

export const Hook: React.FC = () => {
  const t = useT(SCENE.hook[0]);

  const push = iv(t, [0, ZOOM_AT], [1, 1.022], ease.linear);
  const zoom = iv(t, [ZOOM_AT, DROP], [0, 1], ease.in);
  const s = push * (1 + zoom * 4.2);
  const camera: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: IMG_W,
    height: IMG_H,
    transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px`,
    scale: s,
    translate: `${(960 - ORIGIN.x) * zoom}px ${(540 - ORIGIN.y) * zoom}px`,
    filter: `blur(${zoom * 6}px)`,
  };
  const toCanvasX = (x: number) => ORIGIN.x + (x - ORIGIN.x) * s + (960 - ORIGIN.x) * zoom;

  // the handle slides in from the left edge instead of snapping to H0
  const hx = t < DRAG[0] ? iv(t, [HANDLE_IN, HANDLE_IN + 0.32], [0, H0], ease.quint) : handleX(t);
  const handleO = iv(t, [HANDLE_IN, HANDLE_IN + 0.25], [0, 1]) * iv(t, [ZOOM_AT, ZOOM_AT + 0.2], [1, 0]);
  const fadeIn = iv(t, [0, 0.55], [0, 1], ease.site);

  // Cursor: enters, grabs the handle, drags it across, lets go
  const cur =
    t < DRAG[0]
      ? cursorAt(t, [
          { t: 3.45, x: 1620, y: 1120 },
          { t: GRAB - 0.04, x: H0 + 8, y: 612, arc: -90 },
        ])
      : t <= DRAG[1] + 0.06
        ? { x: hx + 8, y: 612 + Math.sin(((t - DRAG[0]) / (DRAG[1] - DRAG[0])) * Math.PI) * -18 }
        : cursorAt(t, [
            { t: DRAG[1] + 0.06, x: H1 + 8, y: 612 },
            { t: DRAG[1] + 0.6, x: H1 - 60, y: 760, arc: 20 },
          ]);
  const press = iv(t, [GRAB, GRAB + 0.07], [0, 1], ease.out) * iv(t, [DRAG[1] + 0.02, DRAG[1] + 0.1], [1, 0], ease.out);
  const curO = iv(t, [3.45, 3.6], [0, 1]) * iv(t, [ZOOM_AT, ZOOM_AT + 0.15], [1, 0]);

  // Flash of violet as we punch through the screen into the reveal
  const flash = iv(t, [DROP - 0.2, DROP - 0.02], [0, 1], ease.in);

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill>
        {/* Without Taiv */}
        <div style={camera}>
          <Img src={staticFile("taiv/img/without-taiv.webp")} style={{ width: IMG_W, height: IMG_H }} />
        </div>
        {/* With Taiv — revealed left of the handle */}
        <AbsoluteFill style={{ clipPath: `inset(0px ${Math.max(0, 1920 - hx)}px 0px 0px)` }}>
          <div style={camera}>
            <Img src={staticFile("taiv/img/with-taiv.webp")} style={{ width: IMG_W, height: IMG_H }} />
          </div>
        </AbsoluteFill>
        {/* grade */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,4,32,0.3) 0%, rgba(10,4,32,0) 38%, rgba(10,4,32,0.55) 62%, rgba(6,3,20,0.92) 100%)" }} />
        <Vignette strength={0.7} />

        {/* Tracking brackets, in image space so they ride the camera */}
        <div style={camera}>
          {TVS.map((tv, i) => {
            const lockAt = W.break1 + 0.42 + i * 0.12;
            const lock = iv(t, [lockAt, lockAt + 0.32], [0, 1], ease.quint);
            const swapped = hx > toCanvasX(tv.x + tv.w * 0.5);
            const out = iv(t, [ZOOM_AT, ZOOM_AT + 0.15], [1, 0]);
            const jitter = Math.sin(t * 9 + i * 2) * (1 - lock) * 6;
            return (
              <div key={i} style={{ opacity: out }}>
                <Brackets
                  x={tv.x + 8 + jitter}
                  y={tv.y + 8}
                  w={tv.w - 16}
                  h={tv.h - 16}
                  lock={lock}
                  color={swapped ? brand.violet : brand.red}
                  arm={30}
                  stroke={3}
                />
              </div>
            );
          })}
        </div>

        {/* Compare handle — the slider from the taiv.tv homepage */}
        <div style={{ opacity: handleO }}>
          <div
            style={{
              position: "absolute",
              left: hx - 1.5,
              top: 0,
              width: 3,
              height: 1080,
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 0 12px rgba(0,0,0,0.35)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: hx - 34,
              top: 578,
              width: 68,
              height: 68,
              borderRadius: 34,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
              scale: 1 + press * 0.08,
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 26,
              color: brand.violet,
              letterSpacing: "-0.1em",
            }}
          >
            ‹ ›
          </div>
        </div>

        <Cursor x={cur.x} y={cur.y} press={press} opacity={curO} t={t} clickAt={GRAB} />
      </AbsoluteFill>

      {/* fade up from black as an overlay — a parent opacity fade makes Chrome
          drop a compositing layer on the last frame, which reads as a pop */}
      <AbsoluteFill style={{ background: "#000", opacity: 1 - fadeIn }} />
      <AbsoluteFill style={{ background: brand.violet, opacity: flash }} />
    </AbsoluteFill>
  );
};
