import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { brand, ease, fonts } from "../brand";
import { Backdrop, Brackets, iv, useT } from "../components/Common";
import { PROMOS, Promo } from "../components/Screens";
import { SCENE, W } from "../timeline";

// Editorial layout: the super sits in the left column (see SUPERS), the
// screen on the right, the Taiv Box below the type.
// Screen geometry is shared with the Control scene for the match cut.
export const DETECT_TV = { x: 760, y: 150, w: 1040, h: 585 };

export const AD_IN = W.ads - 0.06;
export const SCAN = [AD_IN + 0.16, AD_IN + 0.95] as const; // the scan sweeps on "ads in real time"
export const LOCK = W.time + 0.36; // lock-on lands in the pause after "real time,"
export const SWAP1 = W.plays - 0.12; // your special wipes in on "plays"
export const SWAP2 = W.instead - 0.08;
const SETTLE = 11.55; // flatten out for the match cut into the dashboard

const playhead = (t: number) => 0.46 + (t - AD_IN) * 0.12;
const BREAK = [0.4, 0.95] as const;

export const Detect: React.FC = () => {
  const t = useT(SCENE.detect[0]);
  const { x, y, w, h } = DETECT_TV;

  const intro = iv(t, [7.62, 8.25], [0, 1], ease.quint); // starts as the logo finishes leaving
  const settle = iv(t, [SETTLE, SCENE.control[0]], [0, 1], ease.inOut);
  const rotY = (-6 + (t - SCENE.detect[0]) * 0.8) * (1 - settle);
  const ui = intro * (1 - settle);

  const scan = iv(t, [SCAN[0], SCAN[1]], [0, 1], ease.site);
  const scanO = iv(t, [SCAN[0], SCAN[0] + 0.06, SCAN[1], SCAN[1] + 0.2], [0, 1, 1, 0], ease.linear);
  const lock = iv(t, [LOCK, LOCK + 0.3], [0, 1], ease.quint);
  const wipe1 = iv(t, [SWAP1, SWAP1 + 0.42], [0, 1], ease.inOut);
  const wipe2 = iv(t, [SWAP2, SWAP2 + 0.42], [0, 1], ease.inOut);
  const swapped = t >= SWAP1 + 0.2;
  const ph = Math.min(0.97, playhead(t));
  const detected = t >= LOCK;
  const led = iv(t, [LOCK, LOCK + 0.7], [0, 1], ease.out);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop glowX={66} glowY={42} glowSize={1300} glow={0.6} />

      {/* the screen */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: h,
          transform: `perspective(2400px) rotateY(${rotY}deg) scale(${0.96 + intro * 0.04})`,
          transformOrigin: "30% 50%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -14,
            borderRadius: 26,
            background: "#07040f",
            border: "1px solid rgba(196,168,255,0.18)",
            boxShadow: "0 60px 140px rgba(0,0,0,0.6)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, borderRadius: 12, overflow: "hidden", background: "#000" }}>
          {/* a rival's spot is running when we arrive */}
          <Promo src={PROMOS.pizza} />
          {/* AI scan — one clean line with a faint tint behind it */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: `${scan * 100}%`,
              opacity: scanO,
              background: "linear-gradient(180deg, rgba(111,63,238,0) 0%, rgba(111,63,238,0.18) 100%)",
              borderBottom: `2px solid ${brand.lavender}`,
            }}
          />
          {/* specials wipe in */}
          <AbsoluteFill style={{ clipPath: `inset(0px ${(1 - wipe1) * 100}% 0px 0px)` }}>
            <Promo src={PROMOS.happyHour} />
          </AbsoluteFill>
          <AbsoluteFill style={{ clipPath: `inset(0px ${(1 - wipe2) * 100}% 0px 0px)` }}>
            <Promo src={PROMOS.taco} />
          </AbsoluteFill>
          {[wipe1, wipe2].map((p, i) =>
            p > 0 && p < 1 ? (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${p * 100}%`,
                  width: 3,
                  background: brand.lavender,
                  boxShadow: "0 0 18px rgba(111,63,238,0.8)",
                }}
              />
            ) : null,
          )}
        </div>
        {/* lock-on */}
        <div style={{ opacity: 1 - settle }}>
          <Brackets
            x={-2}
            y={-2}
            w={w + 4}
            h={h + 4}
            lock={lock}
            color={swapped ? brand.violet : brand.red}
            label={swapped ? `Now playing · ${t >= SWAP2 + 0.2 ? "Taco Tuesday" : "Happy Hour"}` : "Ad detected"}
            arm={40}
            stroke={3}
          />
        </div>
      </div>

      {/* Taiv Box, under the type */}
      <div
        style={{
          position: "absolute",
          left: 90 - (1 - intro) * 40,
          top: 540,
          width: 540,
          opacity: ui,
        }}
      >
        {/* contact shadow */}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 250,
            width: 400,
            height: 60,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(0,0,0,0.55), transparent)",
          }}
        />
        <Img src={staticFile("taiv/img/taiv-box.webp")} style={{ position: "relative", width: 540 }} />
        {/* power LED acknowledges the lock */}
        <div
          style={{
            position: "absolute",
            left: 84 - 36 * led,
            top: 169 - 36 * led,
            width: 72 * led,
            height: 72 * led,
            borderRadius: "50%",
            border: `2px solid ${brand.lilac}`,
            opacity: t >= LOCK ? 1 - led : 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 30,
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 20,
            color: brand.muted,
            letterSpacing: "-0.01em",
          }}
        >
          Taiv Box
        </div>
      </div>

      {/* broadcast timeline */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y + h + 42,
          width: w,
          height: 40,
          opacity: ui,
          borderRadius: 10,
          background: "rgba(26,16,64,0.9)",
          border: "1px solid rgba(196,168,255,0.14)",
          overflow: "hidden",
        }}
      >
        <Segment from={0} to={BREAK[0]} label="Live game" color="rgba(245,247,250,0.1)" />
        <Segment
          from={BREAK[0]}
          to={BREAK[1]}
          label={swapped ? "Your promo" : detected ? "Ad detected" : "Ad break"}
          color={swapped ? brand.violet : detected ? "rgba(111,63,238,0.5)" : "rgba(255,59,48,0.7)"}
        />
        <Segment from={BREAK[1]} to={1} label="" color="rgba(245,247,250,0.1)" />
        <div
          style={{
            position: "absolute",
            left: `${ph * 100}%`,
            top: 0,
            bottom: 0,
            width: 2,
            marginLeft: -1,
            background: "#fff",
          }}
        />
      </div>
      {/* fade in with an overlay rather than parent opacity (avoids a one-frame pop) */}
      <AbsoluteFill style={{ background: brand.void, opacity: 1 - intro }} />
    </AbsoluteFill>
  );
};

const Segment: React.FC<{ from: number; to: number; label: string; color: string }> = ({ from, to, label, color }) => (
  <div
    style={{
      position: "absolute",
      left: `${from * 100}%`,
      width: `${(to - from) * 100}%`,
      top: 0,
      bottom: 0,
      padding: "0 16px",
      display: "flex",
      alignItems: "center",
      borderRight: "2px solid rgba(10,4,32,0.9)",
      background: color,
      fontFamily: fonts.sans,
      fontWeight: 600,
      fontSize: 16,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
    }}
  >
    {label}
  </div>
);
