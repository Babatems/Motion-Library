import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { LullMark } from "../components/LullMark";
import { accentGradient, clamp, colors, ease, fonts } from "../theme";

export const CLICK = 54; // cursor click frame (relative to CTA)

const HEADLINE = ["Get", "your", "focus", "back."];

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();

  const press = interpolate(frame, [CLICK - 2, CLICK + 2, CLICK + 10], [1, 0.93, 1], {
    ...clamp,
    easing: ease.out,
  });
  const done = interpolate(frame, [CLICK + 4, CLICK + 14], [0, 1], { ...clamp, easing: ease.out });

  // Cursor glides in on a curved path (x and y use different easings)
  const cx = interpolate(frame, [26, CLICK - 2], [1520, 1010], { ...clamp, easing: ease.out });
  const cy = interpolate(frame, [26, CLICK - 2], [1060, 745], { ...clamp, easing: ease.inOut });

  return (
    <AbsoluteFill>
      <Backdrop glow={1.2} seed="cta" />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          scale: interpolate(frame, [0, 85], [1.04, 1], { ...clamp, easing: ease.out }),
        }}
      >
        <div
          style={{
            scale: interpolate(frame, [2, 20], [0.3, 1], { ...clamp, easing: ease.bouncy }),
            opacity: interpolate(frame, [2, 8], [0, 1], clamp),
            rotate: `${interpolate(frame, [2, 26], [-90, 0], { ...clamp, easing: ease.out })}deg`,
          }}
        >
          <LullMark
            size={104}
            morph={interpolate(frame, [4, 24], [0, 1], { ...clamp, easing: ease.inOut })}
            id="cta"
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 30,
            marginTop: 50,
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 132,
            letterSpacing: "-0.045em",
            lineHeight: 1,
          }}
        >
          {HEADLINE.map((w, i) => (
            <div key={w} style={{ overflow: "hidden", paddingBottom: 16 }}>
              <div
                style={{
                  translate: `0px ${interpolate(frame, [8 + i * 3, 28 + i * 3], [150, 0], { ...clamp, easing: ease.out })}px`,
                  ...(w === "focus"
                    ? { backgroundImage: accentGradient, WebkitBackgroundClip: "text", color: "transparent" }
                    : { color: colors.text }),
                }}
              >
                {w}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontFamily: fonts.body,
            fontSize: 40,
            color: colors.muted,
            marginTop: 10,
            opacity: interpolate(frame, [20, 32], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [20, 36], [20, 0], { ...clamp, easing: ease.out })}px`,
          }}
        >
          Early access opens this fall.
        </div>

        {/* Button */}
        <div
          style={{
            position: "relative",
            marginTop: 60,
            height: 104,
            width: 520,
            borderRadius: 999,
            overflow: "hidden",
            scale: press * interpolate(frame, [24, 38], [0.6, 1], { ...clamp, easing: ease.bouncy }),
            opacity: interpolate(frame, [24, 30], [0, 1], clamp),
            background: `linear-gradient(#0E0D14, #0E0D14) padding-box, ${accentGradient} border-box`,
            border: "2px solid transparent",
            boxShadow: `0 20px 70px -10px rgba(167,139,250,${0.35 + done * 0.35})`,
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 38,
          }}
        >
          {/* Fill wipes in after the click */}
          <AbsoluteFill
            style={{
              background: accentGradient,
              clipPath: `circle(${done * 120}% at 50% 50%)`,
            }}
          />
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              color: colors.text,
              opacity: 1 - done,
              translate: `0px ${-done * 30}px`,
            }}
          >
            Join the waitlist →
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 14,
              color: "#0B0A10",
              opacity: done,
              translate: `0px ${(1 - done) * 30}px`,
            }}
          >
            <svg width={36} height={36} viewBox="0 0 24 24">
              <path
                d="M4 12.5l5 5L20 6.5"
                fill="none"
                stroke="#0B0A10"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={24}
                strokeDashoffset={interpolate(frame, [CLICK + 8, CLICK + 20], [24, 0], clamp)}
              />
            </svg>
            You're on the list
          </AbsoluteFill>
        </div>

        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 26,
            letterSpacing: "0.2em",
            color: colors.muted,
            marginTop: 40,
            opacity: interpolate(frame, [36, 48], [0, 1], clamp),
          }}
        >
          LULL.APP
        </div>
      </AbsoluteFill>

      {/* Click ripple */}
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: 20,
          height: 20,
          marginLeft: -10,
          marginTop: -10,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.8)",
          scale: interpolate(frame, [CLICK, CLICK + 16], [0.5, 7], { ...clamp, easing: ease.out }),
          opacity: interpolate(frame, [CLICK, CLICK + 16], [frame >= CLICK ? 1 : 0, 0], clamp),
        }}
      />
      {/* Cursor */}
      <svg
        width={44}
        height={44}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: cx - 6,
          top: cy - 4,
          opacity: interpolate(frame, [26, 34, 74, 82], [0, 1, 1, 0], clamp),
          scale: press,
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))",
        }}
      >
        <path
          d="M4 2.5l15 9.2-6.6 1.4 3.9 7.3-2.9 1.5-3.9-7.3L4.8 19z"
          fill="#fff"
          stroke="#111"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      </svg>
    </AbsoluteFill>
  );
};
