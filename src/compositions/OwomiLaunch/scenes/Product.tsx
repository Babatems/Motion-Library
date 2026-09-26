import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { brand, clamp, ease, fonts } from "../brand";
import { AccountCard, Bank, Icon, Spark } from "../components/Brand";
import { iv, useT } from "../components/Common";
import { CARD, Dashboard, center } from "../components/Dashboard";
import { SCENE } from "../timeline";

const START = SCENE.product[0];
const CONVERGE = 21.93; // "…in one clear picture"
const BORN = 22.3;
const BUDGET_AT = 24.15;
const GOALS_AT = 26.95;
const TOAST = 24.45; // "…go over"
const HEADS_UP = 25.47; // "Not after."

const ORBIT = { cx: 960, cy: 510, rx: 640, ry: 265 };

const ORBIT_CARDS: {
  bank: Bank;
  type: "checking" | "tfsa" | "credit" | "savings" | "rrsp" | "fhsa";
  cents: number;
  at: number;
  angle: number;
}[] = [
  { bank: "scotiabank", type: "savings", cents: 805939, at: 16.47, angle: 200 },
  { bank: "cibc", type: "credit", cents: -8904, at: 16.75, angle: 330 },
  { bank: "rbc", type: "checking", cents: 241807, at: 17.83, angle: 140 },
  { bank: "td", type: "tfsa", cents: 1425000, at: 18.53, angle: 30 },
  { bank: "bmo", type: "rrsp", cents: 3176012, at: 19.85, angle: 262 },
  { bank: "scotiabank", type: "fhsa", cents: 520000, at: 20.71, angle: 88 },
];

// Camera keyframes: [time, focusX, focusY, screenX, screenY, scale, rotX, rotY]
const CAM: [number, number, number, number, number, number, number, number][] = [
  [BORN, 960, 540, 960, 540, 0.9, 0, 0],
  [23.35, 960, 540, 960, 520, 0.93, 7, -7],
  [23.55, 960, 540, 960, 520, 0.93, 7, -7],
  [BUDGET_AT, center(CARD.budget).x, center(CARD.budget).y, 820, 610, 1.72, 3, -5],
  [26.3, center(CARD.budget).x, center(CARD.budget).y, 800, 600, 1.78, 3, -6],
  [GOALS_AT, center(CARD.goals).x, center(CARD.goals).y, 900, 540, 1.78, 4, 4],
  [28.3, center(CARD.goals).x, center(CARD.goals).y, 900, 540, 1.95, 3, 6],
];
const cam = (t: number, k: number) =>
  interpolate(
    t,
    CAM.map((c) => c[0]),
    CAM.map((c) => c[k]),
    { ...clamp, easing: ease.inOut },
  );

const Toast: React.FC<{ t: number }> = ({ t }) => {
  const inP = iv(t, [TOAST - 0.05, TOAST + 0.45], [0, 1], ease.pop);
  return (
    <div
      style={{
        position: "absolute",
        left: 1230,
        top: 150,
        width: 600,
        padding: "22px 24px",
        borderRadius: 20,
        background: "#fff",
        border: "1px solid rgba(239,68,68,0.25)",
        boxShadow: "0 30px 70px -20px rgba(220,38,38,0.35), 0 4px 12px rgba(0,0,0,0.06)",
        display: "flex",
        gap: 18,
        alignItems: "flex-start",
        fontFamily: fonts.sans,
        opacity: iv(t, [TOAST - 0.05, TOAST + 0.12], [0, 1]) * iv(t, [26.25, 26.5], [1, 0]),
        translate: `${(1 - inP) * 80}px ${(1 - inP) * -20}px`,
        scale: 0.9 + inP * 0.1,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          background: brand.red500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          scale: 1 + Math.max(0, Math.sin((t - TOAST) * 9)) * 0.08 * iv(t, [TOAST, TOAST + 1.2], [1, 0]),
        }}
      >
        <Icon name="circle-alert" size={28} color="#fff" strokeWidth={2.4} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#b91c1c", letterSpacing: "-0.01em" }}>
          You&apos;re close to your limit
        </div>
        <div style={{ fontSize: 20, color: brand.neutral600, marginTop: 4, lineHeight: 1.35 }}>
          Dining Out is at 92% of its $400 budget.
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center" }}>
          <div
            style={{
              fontSize: 17,
              fontWeight: 600,
              color: "#b91c1c",
              background: "#fef2f2",
              padding: "7px 14px",
              borderRadius: 999,
            }}
          >
            View details →
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 17,
              fontWeight: 600,
              color: brand.green,
              background: brand.greenLight,
              padding: "7px 14px",
              borderRadius: 999,
              opacity: iv(t, [HEADS_UP - 0.05, HEADS_UP + 0.15], [0, 1]),
              scale: iv(t, [HEADS_UP - 0.05, HEADS_UP + 0.35], [0.7, 1], ease.pop),
            }}
          >
            <Icon name="check" size={17} strokeWidth={3} />
            Sent 9 days before month-end
          </div>
        </div>
      </div>
    </div>
  );
};

export const Product: React.FC = () => {
  const t = useT(START);

  const converge = iv(t, [CONVERGE, CONVERGE + 0.45], [0, 1], ease.in);
  const born = iv(t, [BORN, BORN + 0.75], [0, 1], ease.out);
  const orbitFade = iv(t, [CONVERGE + 0.2, BORN + 0.3], [1, 0]);

  const fx = cam(t, 1);
  const fy = cam(t, 2);
  const sx = cam(t, 3);
  const sy = cam(t, 4);
  const s = cam(t, 5) * (0.2 + born * 0.8);
  const budgetFocus = iv(t, [BUDGET_AT - 0.4, BUDGET_AT], [0, 1]) * iv(t, [26.3, 26.7], [1, 0]);
  const goalsFocus = iv(t, [GOALS_AT - 0.4, GOALS_AT], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.paper, overflow: "hidden", opacity: iv(t, [15.7, 16.0], [0, 1]) }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 48%, rgba(14,107,79,0.10) 0%, rgba(14,107,79,0) 70%)",
        }}
      />

      {/* ── Orbit: every account flows in ─────────────────────────── */}
      <AbsoluteFill style={{ opacity: orbitFade }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <ellipse
            cx={ORBIT.cx}
            cy={ORBIT.cy}
            rx={ORBIT.rx}
            ry={ORBIT.ry}
            fill="none"
            stroke="rgba(14,107,79,0.22)"
            strokeWidth={2}
            strokeDasharray="4 10"
            strokeDashoffset={-t * 30}
            opacity={iv(t, [15.8, 16.4], [0, 1])}
          />
        </svg>
        {/* hub */}
        <div
          style={{
            position: "absolute",
            left: ORBIT.cx - 90,
            top: ORBIT.cy - 90,
            width: 180,
            height: 180,
            borderRadius: 90,
            background: `radial-gradient(circle at 35% 30%, #16906b 0%, ${brand.green} 60%, #0a5a42 100%)`,
            boxShadow: "0 30px 80px -20px rgba(14,107,79,0.6), inset 0 2px 0 rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale:
              iv(t, [15.85, 16.35], [0, 1], ease.pop) *
              (1 + iv(t, [CONVERGE + 0.3, CONVERGE + 0.45], [0, 0.25]) - iv(t, [CONVERGE + 0.45, BORN + 0.2], [0, 0.25])),
          }}
        >
          <Spark size={78} color="#fff" style={{ rotate: `${t * 20}deg` }} />
        </div>
        {ORBIT_CARDS.map((c, i) => {
          const a = ((c.angle + (t - 16) * 9) * Math.PI) / 180;
          const ox = ORBIT.cx + ORBIT.rx * Math.cos(a);
          const oy = ORBIT.cy + ORBIT.ry * Math.sin(a);
          const depth = (Math.sin(a) + 1) / 2; // 0 back → 1 front
          const land = iv(t, [c.at - 0.1, c.at + 0.55], [0, 1], ease.out);
          // fly in from beyond the frame, along the radial line
          const fromX = ORBIT.cx + (ox - ORBIT.cx) * 2.6;
          const fromY = ORBIT.cy + (oy - ORBIT.cy) * 2.6;
          let x = fromX + (ox - fromX) * land;
          let y = fromY + (oy - fromY) * land;
          x = x + (ORBIT.cx - x) * converge;
          y = y + (ORBIT.cy - y) * converge;
          const word = c.at + 0.02;
          const glow = iv(t, [word - 0.05, word + 0.15], [0, 1]) * iv(t, [word + 0.6, word + 1.0], [1, 0]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 180,
                top: y - 80,
                zIndex: Math.round(depth * 100),
                scale: (0.78 + depth * 0.3) * (1 - converge * 0.8),
                opacity: iv(t, [c.at - 0.1, c.at + 0.1], [0, 1]) * (1 - iv(t, [CONVERGE + 0.25, CONVERGE + 0.45], [0, 1])),
                filter: `blur(${(1 - land) * 10}px)`,
              }}
            >
              <AccountCard bank={c.bank} type={c.type} cents={c.cents} width={360} chipGlow={glow} />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* ── The one clear picture ─────────────────────────────────── */}
      <AbsoluteFill style={{ perspective: 2400, opacity: iv(t, [BORN, BORN + 0.25], [0, 1]) }}>
        <AbsoluteFill
          style={{
            transformOrigin: "0 0",
            transform: `translate(${sx}px, ${sy}px) rotateX(${cam(t, 6)}deg) rotateY(${cam(t, 7)}deg) scale(${s}) translate(${-fx}px, ${-fy}px)`,
          }}
        >
          <Dashboard
            t={t}
            born={BORN}
            budgetAt={BUDGET_AT}
            goalsAt={GOALS_AT}
            budgetFocus={budgetFocus}
            goalsFocus={goalsFocus}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      <Toast t={t} />

      {/* Goal milestone badge */}
      <div
        style={{
          position: "absolute",
          left: 1290,
          top: 250,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 22px",
          borderRadius: 999,
          background: brand.green,
          color: "#fff",
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 26,
          boxShadow: "0 20px 50px -15px rgba(14,107,79,0.7)",
          opacity: iv(t, [27.65, 27.85], [0, 1]),
          scale: iv(t, [27.65, 28.1], [0.6, 1], ease.pop),
          translate: `0px ${iv(t, [27.65, 28.1], [20, 0])}px`,
        }}
      >
        <Icon name="trending-up" size={26} strokeWidth={2.4} />
        On track · 3 months early
      </div>
    </AbsoluteFill>
  );
};
