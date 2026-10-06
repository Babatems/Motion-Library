import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, ease, fonts } from "../brand";
import { Backdrop, Cursor, Pill, cursorAt, glass, iv, mix, useT } from "../components/Common";
import { PROMOS, Promo } from "../components/Screens";
import { TaivLogo } from "../components/TaivLogo";
import { SCENE, W } from "../timeline";
import { DETECT_TV } from "./Detect";

// App window
const WIN = { x: 160, y: 80, w: 1600, h: 820 };
// Screen grid (window-relative)
const TILE = { w: 324, h: 182, gx: 28, gy: 70 };
const GRID = { x: 32, y: 160 };
const tileRect = (i: number) => ({
  x: GRID.x + (i % 3) * (TILE.w + TILE.gx),
  y: GRID.y + Math.floor(i / 3) * (TILE.h + TILE.gy),
});
const NAMES = ["Main bar", "Patio", "Booth row", "Lounge", "Dining room", "Back bar"];
// What each screen is showing before Game Day takes over: a mix of rival ads
// (red dot) and whatever promo someone last set up.
const NOW = [
  { src: PROMOS.taco, label: "Taco Tuesday", ad: false },
  { src: PROMOS.pizza, label: "Rival ad", ad: true },
  { src: PROMOS.coffee, label: "Rival ad", ad: true },
  { src: PROMOS.trivia, label: "Sunset Trivia", ad: false },
  { src: PROMOS.fuel, label: "Rival ad", ad: true },
  { src: PROMOS.happyHour, label: "Happy Hour", ad: false },
];

const PROMO_LIST = [
  { src: PROMOS.gameDay, title: "Game Day · $8 Wings", meta: "Every break · all games" },
  { src: PROMOS.happyHour, title: "Happy Hour", meta: "Mon–Fri · 12–7 PM" },
  { src: PROMOS.taco, title: "Taco Tuesday", meta: "Tue · 4 PM–close" },
  { src: PROMOS.trivia, title: "Sunset Trivia", meta: "Wed · 7 PM" },
];
const COL = { x: 1092, y: 104, w: 476 };
const CARD_H = 92;
const cardY = (i: number) => COL.y + 46 + i * (CARD_H + 12);
const EARN = { x: COL.x, y: 592, w: COL.w, h: 198 };

// Choreography
// The Detect screen glides into tile 1 while the app assembles around it
const MORPH = [SCENE.control[0], SCENE.control[0] + 0.8] as const;
export const HOVER = W.screen + 0.02;
export const GRAB = HOVER + 0.12;
export const DROP_AT = W.anywhere + 0.2;
export const flipAt = (i: number) => DROP_AT + 0.06 + [0, 1, 2, 1, 2, 3][i] * 0.07 + (i === 4 ? 0.02 : 0);
export const COIN0 = W.earn - 0.05;
export const coinAt = (i: number) => COIN0 + i * 0.1;
export const EXIT = 15.7;

const abs = (x: number, y: number) => ({ x: WIN.x + x, y: WIN.y + y });

export const Control: React.FC = () => {
  const t = useT(SCENE.control[0]);
  const m = iv(t, [MORPH[0], MORPH[1]], [0, 1], ease.inOut);
  const winIn = iv(t, [MORPH[0] + 0.02, MORPH[0] + 0.55], [0, 1], ease.site);
  const exit = iv(t, [EXIT, 16.0], [0, 1], ease.site);

  // Cursor path
  const grabCard = abs(COL.x + 170, cardY(0) + CARD_H / 2);
  const dropPt = abs(GRID.x + 514, GRID.y + 200);
  const earnPt = abs(EARN.x + 300, EARN.y + 110);
  const cur = cursorAt(t, [
    { t: 12.35, x: 1980, y: 1010 },
    { t: HOVER, x: grabCard.x, y: grabCard.y, arc: 90 },
    { t: GRAB + 0.04, x: grabCard.x, y: grabCard.y },
    { t: DROP_AT, x: dropPt.x, y: dropPt.y, arc: -70 },
    { t: DROP_AT + 0.3, x: dropPt.x + 20, y: dropPt.y + 10 },
    { t: COIN0 - 0.05, x: earnPt.x, y: earnPt.y, arc: 60 },
    { t: 15.6, x: earnPt.x + 30, y: earnPt.y + 16 },
  ]);
  const dragging = t >= GRAB && t < DROP_AT + 0.04;
  const press = iv(t, [GRAB, GRAB + 0.06], [0, 1], ease.out) * iv(t, [DROP_AT, DROP_AT + 0.08], [1, 0], ease.out);
  const curO = iv(t, [12.35, 12.5], [0, 1]);

  // Earnings counter: each coin that lands bumps the total
  const landed = [0, 1, 2, 3, 4, 5].reduce((acc, i) => acc + iv(t, [coinAt(i) + 0.4, coinAt(i) + 0.6], [0, 1], ease.out), 0);
  const total = 1648 + landed * 33;
  const bump = Math.max(...[0, 1, 2, 3, 4, 5].map((i) => iv(t, [coinAt(i) + 0.42, coinAt(i) + 0.5, coinAt(i) + 0.7], [0, 1, 0], ease.linear)));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop glowX={mix(60, 50, m)} glowY={mix(42, 50, m)} glowSize={mix(1300, 1400, m)} glow={mix(0.9, 0.8, m)} />

      <AbsoluteFill
        style={{
          scale: 1 + exit * 0.05,
          opacity: 1 - exit,
        }}
      >
        {/* App window */}
        <div
          style={{
            ...glass,
            position: "absolute",
            left: WIN.x,
            top: WIN.y,
            width: WIN.w,
            height: WIN.h,
            opacity: winIn,
          }}
        >
          {/* top bar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 72,
              borderBottom: `1px solid ${brand.hairline}`,
              display: "flex",
              alignItems: "center",
              padding: "0 32px",
              gap: 18,
              fontFamily: fonts.sans,
            }}
          >
            <TaivLogo width={110} id="app" />
            <div style={{ width: 1, height: 28, background: brand.hairline, margin: "0 6px" }} />
            <div style={{ fontSize: 22, fontWeight: 600, color: brand.white }}>Main Street Taproom</div>
            <div style={{ fontSize: 18, color: brand.muted }}>▾</div>
            <div style={{ flex: 1 }} />
            <Pill size={17}>
              <span style={{ width: 9, height: 9, borderRadius: 5, background: brand.green, boxShadow: `0 0 10px ${brand.green}` }} />
              6 screens live
            </Pill>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: `linear-gradient(135deg, ${brand.lilac}, ${brand.violet})` }} />
          </div>

          {/* screens header */}
          <div style={{ position: "absolute", left: GRID.x, top: 100, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 28, color: brand.white }}>Screens</div>
            <Pill size={15} style={{ padding: "5px 12px" }}>
              Game-day rules · On
            </Pill>
          </div>

          {/* drop-zone highlight */}
          <div
            style={{
              position: "absolute",
              left: GRID.x - 14,
              top: GRID.y - 14,
              width: TILE.w * 3 + TILE.gx * 2 + 28,
              height: TILE.h * 2 + TILE.gy + 28 + 34,
              borderRadius: 18,
              border: `2px dashed ${brand.lilac}`,
              background: "rgba(111,63,238,0.08)",
              opacity: iv(t, [GRAB + 0.2, GRAB + 0.35], [0, 1]) * iv(t, [DROP_AT, DROP_AT + 0.25], [1, 0]),
            }}
          />

          {/* tiles (tile 0 is drawn outside the window during the morph) */}
          {NAMES.map((name, i) => {
            const r = tileRect(i);
            const inP = i === 0 ? 1 : iv(t, [MORPH[0] + 0.3 + i * 0.06, MORPH[0] + 0.75 + i * 0.06], [0, 1], ease.quint);
            const f = iv(t, [flipAt(i), flipAt(i) + 0.22], [0, 1], ease.inOut);
            const ring = iv(t, [flipAt(i), flipAt(i) + 0.5], [0, 1], ease.out);
            return (
              <div key={name} style={{ position: "absolute", left: r.x, top: r.y, width: TILE.w, opacity: inP, translate: `0px ${(1 - inP) * 14}px` }}>
                <div
                  style={{
                    position: "relative",
                    width: TILE.w,
                    height: TILE.h,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid rgba(196,168,255,0.16)",
                    background: "#000",
                    scale: 1 - Math.sin(f * Math.PI) * 0.06,
                    visibility: i === 0 && m < 1 ? "hidden" : "visible",
                  }}
                >
                  <Promo src={NOW[i].src} />
                  <AbsoluteFill style={{ opacity: f }}>
                    <Promo src={PROMOS.gameDay} />
                  </AbsoluteFill>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: -6,
                    top: -6,
                    width: TILE.w + 12,
                    height: TILE.h + 12,
                    borderRadius: 16,
                    border: `3px solid ${brand.lilac}`,
                    opacity: t >= flipAt(i) ? 1 - ring : 0,
                    scale: 1 + ring * 0.06,
                    boxShadow: `0 0 30px ${brand.violet}`,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 12,
                    fontFamily: fonts.sans,
                    fontSize: 17,
                    // tile 1's label waits until its screen has landed
                    opacity: i === 0 ? iv(m, [0.75, 1], [0, 1], ease.linear) : 1,
                  }}
                >
                  <span style={{ color: brand.white, fontWeight: 600 }}>{name}</span>
                  <span
                    style={{
                      color: t >= flipAt(i) + 0.1 ? brand.lavender : NOW[i].ad ? "#ff8a80" : brand.muted,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    {NOW[i].ad && t < flipAt(i) + 0.1 ? (
                      <span style={{ width: 8, height: 8, borderRadius: 4, background: brand.red }} />
                    ) : null}
                    {t >= flipAt(i) + 0.1 ? "Game Day" : NOW[i].label}
                  </span>
                </div>
              </div>
            );
          })}

          {/* tonight's schedule */}
          <div style={{ position: "absolute", left: GRID.x, top: 682, width: 1028 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.sans, fontSize: 17, color: brand.muted, marginBottom: 12 }}>
              <span style={{ color: brand.white, fontWeight: 600 }}>Tonight</span>
              <span>Commercial breaks replaced automatically</span>
            </div>
            <div style={{ position: "relative", height: 34, borderRadius: 8, background: "rgba(245,247,250,0.06)", overflow: "hidden" }}>
              {Array.from({ length: 16 }).map((_, i) => {
                const on = iv(t, [MORPH[0] + 0.6 + i * 0.025, MORPH[0] + 0.9 + i * 0.025], [0, 1]);
                const gd = t >= flipAt(0) + i * 0.02;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: 40 + i * 62 + ((i * 17) % 13),
                      top: 6,
                      width: 18 + ((i * 7) % 10),
                      height: 22,
                      borderRadius: 4,
                      background: gd ? brand.violet : "rgba(196,168,255,0.35)",
                      opacity: on,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* promos column */}
          <div style={{ position: "absolute", left: COL.x, top: COL.y, fontFamily: fonts.sans, fontWeight: 700, fontSize: 28, color: brand.white }}>
            Promos
          </div>
          {PROMO_LIST.map((p, i) => {
            const inP = iv(t, [MORPH[0] + 0.4 + i * 0.06, MORPH[0] + 0.85 + i * 0.06], [0, 1], ease.quint);
            const hover = i === 0 ? iv(t, [HOVER - 0.1, HOVER + 0.05], [0, 1]) * iv(t, [GRAB + 0.1, GRAB + 0.3], [1, 0]) : 0;
            const lifted = i === 0 && dragging;
            return (
              <div
                key={p.title}
                style={{
                  position: "absolute",
                  left: COL.x,
                  top: cardY(i),
                  width: COL.w,
                  height: CARD_H,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "0 12px",
                  background: hover > 0 ? `rgba(111,63,238,${0.12 + hover * 0.18})` : "rgba(245,247,250,0.04)",
                  border: `1px solid ${hover > 0 ? brand.lilac : brand.hairline}`,
                  opacity: inP * (lifted ? 0.45 : 1),
                  translate: `${(1 - inP) * 30}px 0px`,
                }}
              >
                <div style={{ position: "relative", width: 120, height: 68, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  <Promo src={p.src} />
                </div>
                <div style={{ fontFamily: fonts.sans }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: brand.white }}>{p.title}</div>
                  <div style={{ fontSize: 16, color: brand.muted, marginTop: 4 }}>{p.meta}</div>
                </div>
              </div>
            );
          })}

          {/* earnings */}
          <div
            style={{
              position: "absolute",
              left: EARN.x,
              top: EARN.y,
              width: EARN.w,
              height: EARN.h,
              borderRadius: 16,
              padding: "22px 24px",
              background: "linear-gradient(160deg, rgba(111,63,238,0.32) 0%, rgba(26,16,64,0.6) 70%)",
              border: `1px solid rgba(196,168,255,${0.2 + bump * 0.5})`,
              boxShadow: `0 0 ${bump * 40}px rgba(111,63,238,0.6)`,
              opacity: iv(t, [MORPH[0] + 0.6, MORPH[0] + 1.0], [0, 1]),
              fontFamily: fonts.sans,
            }}
          >
            <div style={{ fontSize: 17, color: brand.muted, fontWeight: 500 }}>Earned from ad breaks · this year</div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: brand.white,
                marginTop: 6,
                scale: 1 + bump * 0.04,
                transformOrigin: "0% 50%",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ${Math.round(total).toLocaleString("en-US")}
            </div>
            <svg width={EARN.w - 48} height={50} style={{ position: "absolute", left: 24, bottom: 18 }}>
              <polyline
                points="0,44 40,40 80,42 120,34 160,36 200,28 240,30 280,20 320,22 360,12 428,4"
                fill="none"
                stroke={brand.lilac}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={520}
                strokeDashoffset={520 * (1 - iv(t, [COIN0, COIN0 + 1.1], [0.35, 1], ease.site))}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                right: 22,
                top: 22,
                fontFamily: fonts.mono,
                fontWeight: 700,
                fontSize: 16,
                color: brand.green,
                opacity: iv(t, [coinAt(0) + 0.45, coinAt(0) + 0.6], [0, 1]),
              }}
            >
              ▲ +${Math.round(landed * 33)} tonight
            </div>
          </div>

          {/* toast */}
          <div
            style={{
              position: "absolute",
              left: WIN.w / 2 - 250,
              top: 16,
              opacity: iv(t, [DROP_AT + 0.35, DROP_AT + 0.55], [0, 1]) * iv(t, [15.35, 15.55], [1, 0]),
              translate: `0px ${iv(t, [DROP_AT + 0.35, DROP_AT + 0.6], [-16, 0])}px`,
            }}
          >
            <Pill tone="violet" size={19}>
              <span style={{ width: 22, height: 22, borderRadius: 11, background: "#fff", color: brand.violet, fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                ✓
              </span>
              Game Day is live on 6 screens
            </Pill>
          </div>
        </div>

        {/* Tile 0 morphing out of the Detect screen (canvas space) */}
        {m < 1
          ? (() => {
              const r = tileRect(0);
              const to = abs(r.x, r.y);
              const X = mix(DETECT_TV.x, to.x, m);
              const Y = mix(DETECT_TV.y, to.y, m);
              const Wd = mix(DETECT_TV.w, TILE.w, m);
              const Hd = mix(DETECT_TV.h, TILE.h, m);
              return (
                <div
                  style={{
                    position: "absolute",
                    left: X,
                    top: Y,
                    width: Wd,
                    height: Hd,
                    borderRadius: 12,
                    overflow: "hidden",
                    // starts identical to the Detect bezel + glow, eases to a bare tile
                    boxShadow: [
                      `0 0 0 ${mix(14, 0, m)}px #07040f`,
                      `0 0 0 ${mix(15, 1, m)}px rgba(196,168,255,${mix(0.18, 0.16, m)})`,
                      `0 ${mix(60, 0, m)}px ${mix(140, 0, m)}px rgba(0,0,0,${mix(0.6, 0, m)})`,
                    ].join(", "),
                  }}
                >
                  <Promo src={PROMOS.taco} />
                </div>
              );
            })()
          : null}

        {/* Dragged card ghost */}
        {dragging ? (
          <div
            style={{
              position: "absolute",
              left: cur.x - 70,
              top: cur.y - 50,
              width: 220,
              height: 124,
              borderRadius: 12,
              overflow: "hidden",
              border: `2px solid ${brand.lilac}`,
              boxShadow: "0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(111,63,238,0.6)",
              rotate: `${iv(t, [GRAB, GRAB + 0.2], [0, -4])}deg`,
              scale: iv(t, [GRAB, GRAB + 0.15], [0.6, 1]) * iv(t, [DROP_AT - 0.08, DROP_AT + 0.04], [1, 0.7]),
            }}
          >
            <Promo src={PROMOS.gameDay} />
          </div>
        ) : null}

        {/* Revenue chips flying from each screen into the earnings card */}
        {NAMES.map((_, i) => {
          const p = iv(t, [coinAt(i), coinAt(i) + 0.55], [0, 1], ease.inOut);
          if (p <= 0 || p >= 1) return null;
          const r = tileRect(i);
          const from = abs(r.x + TILE.w / 2, r.y + TILE.h / 2);
          const to = abs(EARN.x + 120, EARN.y + 90);
          const x = mix(from.x, to.x, p);
          const y = mix(from.y, to.y, p) - Math.sin(p * Math.PI) * 120;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 34,
                top: y - 18,
                opacity: iv(p, [0, 0.12, 0.85, 1], [0, 1, 1, 0], ease.linear),
                scale: 1 - p * 0.3,
              }}
            >
              <Pill tone="violet" size={17} style={{ padding: "5px 12px" }}>
                +$33
              </Pill>
            </div>
          );
        })}

        <Cursor x={cur.x} y={cur.y} press={press} opacity={curO} t={t} clickAt={t >= DROP_AT ? DROP_AT : GRAB} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
