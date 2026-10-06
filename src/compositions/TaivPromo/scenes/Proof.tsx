import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, ease, fonts } from "../brand";
import { Backdrop, iv, useT } from "../components/Common";
import { PROMOS, Promo } from "../components/Screens";
import { SCENE, W } from "../timeline";

// Tilted wall of on-screen promos — the "network" band from taiv.tv
const WALL = [
  PROMOS.gameDay, PROMOS.taco, PROMOS.pizza, PROMOS.happyHour, PROMOS.coffee, PROMOS.trivia, PROMOS.fuel,
  PROMOS.brand, PROMOS.gameDayDark,
];
const COLS = 8;
const ROWS = 6;
const TW = 420;
const TH = 236;
const GAP = 26;

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export const Proof: React.FC = () => {
  const t = useT(SCENE.proof[0]);
  const s0 = SCENE.proof[0];
  const intro = iv(t, [15.86, 16.3], [0, 1], ease.quint);
  const exit = iv(t, [18.95, 19.3], [0, 1], ease.in);
  const slide = (t - s0) * 55;

  const venues = iv(t, [W.seven - 0.05, W.seven + 0.85], [0, 7000], ease.quint);
  const renew = iv(t, [W.ninety - 0.05, W.ninety + 0.6], [0, 99], ease.quint);
  const s1 = iv(t, [W.seven - 0.04, W.seven + 0.56], [0, 1], ease.out);
  const s2 = iv(t, [W.ninety - 0.12, W.ninety + 0.5], [0, 1], ease.out);
  const divider = iv(t, [W.seven + 0.7, W.ninety - 0.1], [0, 1], ease.inOut);
  const foot = iv(t, [W.ninety + 0.9, W.ninety + 1.3], [0, 1], ease.quint);

  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: intro * (1 - exit) }}>
      <Backdrop glow={0.6} glowSize={1500} />
      {/* the wall */}
      <div
        style={{
          position: "absolute",
          left: -560,
          top: -300,
          width: COLS * (TW + GAP),
          height: ROWS * (TH + GAP),
          transform: `perspective(2000px) rotateX(${30 - intro * 4}deg) rotateZ(-13deg) translateX(${-slide}px) scale(${1.08 + exit * 0.1})`,
          transformOrigin: "50% 50%",
          filter: "blur(2.5px) saturate(0.7) brightness(0.62)",
        }}
      >
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const c = i % COLS;
          const r = Math.floor(i / COLS);
          const src = WALL[(c * 2 + r * 3) % WALL.length];
          const lit = iv(t, [s0 + 0.05 + ((c + r) % 7) * 0.05, s0 + 0.45 + ((c + r) % 7) * 0.05], [0, 1], ease.quint);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c * (TW + GAP) + (r % 2) * 120,
                top: r * (TH + GAP),
                width: TW,
                height: TH,
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid rgba(196,168,255,0.22)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                opacity: lit,
              }}
            >
              <Promo src={src} />
            </div>
          );
        })}
      </div>
      {/* darken for legibility */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(10,4,32,0.93) 0%, rgba(10,4,32,0.8) 55%, rgba(10,4,32,0.55) 100%)",
        }}
      />

      <AbsoluteFill style={{ scale: (0.97 + intro * 0.03) * (1 + exit * 0.04) }}>
        <Stat x={560} p={s1} value={`${fmt(venues)}`} unit="+" label="venues nationwide" />
        <div
          style={{
            position: "absolute",
            left: 959,
            top: 540 - 120 * divider,
            width: 2,
            height: 240 * divider,
            background: "linear-gradient(180deg, transparent, rgba(196,168,255,0.6), transparent)",
          }}
        />
        <Stat x={1360} p={s2} value={`${Math.round(renew)}`} unit="%" label="of venues renew every year" />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 760,
            textAlign: "center",
            fontFamily: fonts.sans,
            fontWeight: 500,
            fontSize: 24,
            color: brand.muted,
            opacity: foot,
            translate: `0px ${(1 - foot) * 12}px`,
          }}
        >
          30,000+ screens · 5.2B+ monthly impressions
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Number and label each rise out of their own mask — no blur, no glow
const Stat: React.FC<{ x: number; p: number; value: string; unit: string; label: string }> = ({ x, p, value, unit, label }) => (
  <div style={{ position: "absolute", left: x - 400, width: 800, top: 370, textAlign: "center" }}>
    <div style={{ overflow: "hidden", paddingBottom: "0.06em" }}>
      <div
        style={{
          translate: `0px ${(1 - p) * 105}%`,
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 190,
          lineHeight: 1,
          letterSpacing: "-0.045em",
          color: brand.white,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
        <span style={{ color: brand.lilac }}>{unit}</span>
      </div>
    </div>
    <div style={{ overflow: "hidden", marginTop: 12 }}>
      <div
        style={{
          translate: `0px ${(1 - iv(p, [0.35, 1], [0, 1], ease.linear)) * 110}%`,
          fontFamily: fonts.sans,
          fontWeight: 500,
          fontSize: 32,
          color: brand.muted,
        }}
      >
        {label}
      </div>
    </div>
  </div>
);
