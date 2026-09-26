import { noise2D } from "@remotion/noise";
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CARD_WIDTH, NotificationCard } from "../components/NotificationCard";
import { NOTIFICATIONS, cardDelay } from "../notifications";
import { clamp, colors, ease, fonts } from "../theme";

// Rack focus: at this frame the pile-up falls out of focus and the stat takes over
const RACK = 84;

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera shake that builds as the notifications pile up, then settles on the stat
  const shakeAmt = interpolate(frame, [30, 70, RACK, RACK + 8], [0, 7, 7, 0], clamp);
  const shakeX = noise2D("sx", frame / 3, 0) * shakeAmt;
  const shakeY = noise2D("sy", frame / 3, 0) * shakeAmt;

  const landed = NOTIFICATIONS.filter((_, i) => frame >= cardDelay(i)).length;
  const count = Math.round(
    interpolate(frame, [cardDelay(0), cardDelay(NOTIFICATIONS.length - 1) + 6], [0, 147], {
      ...clamp,
      easing: ease.in,
    }),
  );

  // Stat counts up from 00:00 to 23:15 (Gloria Mark, UC Irvine)
  const totalSecs = Math.round(
    interpolate(frame, [RACK + 6, RACK + 40], [0, 23 * 60 + 15], { ...clamp, easing: ease.out }),
  );
  const mm = String(Math.floor(totalSecs / 60)).padStart(2, "0");
  const ss = String(totalSecs % 60).padStart(2, "0");

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      {/* Photo with Ken Burns pan */}
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, 150], [1.12, 1.26], clamp),
          translate: `${interpolate(frame, [0, 150], [60, -40], clamp)}px 0px`,
        }}
      >
        <Img
          src={staticFile("img/problem.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: `saturate(0.6) brightness(${interpolate(frame, [RACK, RACK + 14], [0.62, 0.3], clamp)})`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(7,7,10,0.92) 0%, rgba(7,7,10,0.65) 38%, rgba(7,7,10,0.1) 70%), linear-gradient(0deg, rgba(7,7,10,0.7) 0%, transparent 40%)",
        }}
      />
      {/* Red alarm tint that pulses as the pile grows */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 70% at 75% 50%, rgba(255,70,80,${interpolate(frame, [20, 70, RACK], [0, 0.22, 0], clamp) * (0.75 + 0.25 * Math.sin(frame / 2.2))}) 0%, transparent 70%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Everything in the "chaos" layer racks out of focus for the stat */}
      <AbsoluteFill
        style={{
          translate: `${shakeX}px ${shakeY}px`,
          filter: `blur(${interpolate(frame, [RACK, RACK + 14], [0, 16], { ...clamp, easing: ease.inOut })}px)`,
          opacity: interpolate(frame, [RACK, RACK + 14], [1, 0.35], clamp),
          scale: interpolate(frame, [RACK, RACK + 20], [1, 0.94], { ...clamp, easing: ease.out }),
        }}
      >
        {/* Kicker */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 110,
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontFamily: fonts.mono,
            fontSize: 22,
            letterSpacing: "0.3em",
            color: colors.danger,
            textTransform: "uppercase",
            opacity: interpolate(frame, [4, 14], [0, 1], clamp),
          }}
        >
          <div
            style={{
              width: 56,
              height: 2,
              background: colors.danger,
              scale: `${interpolate(frame, [4, 20], [0, 1], { ...clamp, easing: ease.out })} 1`,
              transformOrigin: "left",
            }}
          />
          01 — The problem
        </div>

        {/* Headline */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 330,
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 112,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: colors.text,
          }}
        >
          {["Every ping", "steals your"].map((line, i) => (
            <div key={i} style={{ overflow: "hidden", paddingBottom: 6 }}>
              <div
                style={{
                  translate: `0px ${interpolate(frame, [6 + i * 5, 26 + i * 5], [130, 0], { ...clamp, easing: ease.out })}px`,
                }}
              >
                {line}
              </div>
            </div>
          ))}
          <div style={{ overflow: "hidden", paddingBottom: 10 }}>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                color: colors.danger,
                translate: `0px ${interpolate(frame, [16, 36], [130, 0], { ...clamp, easing: ease.out })}px`,
              }}
            >
              focus.
              {/* strike-through drawn in */}
              <div
                style={{
                  position: "absolute",
                  left: -6,
                  right: -6,
                  top: "54%",
                  height: 9,
                  borderRadius: 9,
                  background: colors.text,
                  scale: `${interpolate(frame, [48, 60], [0, 1], { ...clamp, easing: ease.inOut })} 1`,
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
        </div>

        {/* Live counter */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 730,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: fonts.mono,
            fontSize: 30,
            color: colors.muted,
            opacity: interpolate(frame, [14, 24], [0, 1], clamp),
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: colors.danger,
              boxShadow: `0 0 18px ${colors.danger}`,
              opacity: 0.5 + 0.5 * Math.abs(Math.sin(frame / 4)),
            }}
          />
          notifications today:
          <span style={{ color: colors.text, fontVariantNumeric: "tabular-nums" }}>{count}</span>
        </div>

        {/* The pile-up */}
        {NOTIFICATIONS.slice(0, Math.max(landed + 1, 1)).map((n, i) => {
          const d = cardDelay(i);
          return (
            <NotificationCard
              key={n.app}
              app={n.app}
              message={n.message}
              style={{
                left: n.x - CARD_WIDTH / 2,
                top: n.y - 55,
                opacity: interpolate(frame, [d - 4, d], [0, 1], clamp),
                scale: interpolate(frame, [d - 4, d + 8], [0.6, 1], { ...clamp, easing: ease.bouncy }),
                translate: `0px ${interpolate(frame, [d - 4, d + 8], [-50, 0], { ...clamp, easing: ease.out })}px`,
                rotate: `${interpolate(frame, [d - 4, d + 10], [n.rot * 3, n.rot], { ...clamp, easing: ease.out })}deg`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* The stat */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: interpolate(frame, [RACK + 4, RACK + 14], [0, 1], clamp),
          scale: interpolate(frame, [RACK + 4, RACK + 30], [1.15, 1], {
            ...clamp,
            easing: ease.out,
            output: "perceptual-scale",
          }),
          filter: `blur(${interpolate(frame, [RACK + 4, RACK + 18], [20, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 26,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: colors.muted,
          }}
        >
          Time to refocus after one interruption
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 300,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
            color: colors.text,
            marginTop: 20,
            textShadow: "0 0 80px rgba(255,90,95,0.35)",
          }}
        >
          {mm}
          <span style={{ color: colors.danger, opacity: frame % 20 < 12 ? 1 : 0.35 }}>:</span>
          {ss}
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 26,
            color: colors.muted,
            marginTop: 26,
            opacity: interpolate(frame, [RACK + 30, RACK + 42], [0, 1], clamp),
          }}
        >
          Source: Gloria Mark, UC Irvine — “The Cost of Interrupted Work”
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
