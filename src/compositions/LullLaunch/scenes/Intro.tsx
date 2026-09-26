import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { LullMark } from "../components/LullMark";
import { clamp, colors, ease, fonts } from "../theme";

const WORD = "Lull";
const TAGLINE = ["Silence", "the", "noise.", "Keep", "the", "signal."];

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  // Dot pops in, then grows while morphing into the crescent
  const dotScale = interpolate(frame, [2, 16], [0, 0.32], { ...clamp, easing: ease.bouncy });
  const grow = interpolate(frame, [16, 40], [0, 1], { ...clamp, easing: ease.inOut });
  const markScale = dotScale + grow * (1 - 0.32);

  return (
    <AbsoluteFill>
      <Backdrop glow={interpolate(frame, [0, 50], [0.2, 1], clamp)} seed="intro" />

      {/* Camera: slow push-in over the whole scene */}
      <AbsoluteFill
        style={{
          scale: interpolate(frame, [0, 84], [1, 1.07], clamp),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 22,
            color: colors.muted,
            textTransform: "uppercase",
            position: "absolute",
            top: 380,
            opacity: interpolate(frame, [30, 46], [0, 1], clamp),
            letterSpacing: `${interpolate(frame, [30, 60], [0.9, 0.42], { ...clamp, easing: ease.out })}em`,
          }}
        >
          Introducing
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Mark: centered, then slides left to make room for the wordmark */}
          <div
            style={{
              scale: markScale,
              rotate: `${interpolate(frame, [16, 44], [-120, 0], { ...clamp, easing: ease.out })}deg`,
            }}
          >
            <LullMark size={170} morph={grow} glow={interpolate(frame, [20, 50], [0.4, 1], clamp)} id="intro" />
          </div>

          {/* Wordmark revealed from behind the mark */}
          <div
            style={{
              overflow: "hidden",
              maxWidth: interpolate(frame, [38, 60], [0, 260], { ...clamp, easing: ease.out }),
              marginLeft: interpolate(frame, [38, 60], [0, 34], { ...clamp, easing: ease.out }),
              display: "flex",
            }}
          >
            {WORD.split("").map((ch, i) => (
              <span
                key={i}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 600,
                  fontSize: 176,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  display: "inline-block",
                  backgroundImage: `linear-gradient(100deg, ${colors.text} 40%, ${colors.accentA} 50%, ${colors.text} 60%)`,
                  backgroundSize: "300% 100%",
                  backgroundPosition: `${interpolate(frame, [58, 82], [100, 0], clamp)}% 0%`,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  paddingBottom: 18,
                  translate: `0px ${interpolate(frame, [42 + i * 3, 58 + i * 3], [60, 0], { ...clamp, easing: ease.out })}px`,
                  opacity: interpolate(frame, [42 + i * 3, 52 + i * 3], [0, 1], clamp),
                  filter: `blur(${interpolate(frame, [42 + i * 3, 58 + i * 3], [14, 0], clamp)}px)`,
                }}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 690,
            display: "flex",
            gap: 14,
            fontFamily: fonts.body,
            fontSize: 44,
            fontWeight: 500,
            color: colors.muted,
          }}
        >
          {TAGLINE.map((w, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: i >= 3 ? colors.text : colors.muted,
                opacity: interpolate(frame, [54 + i * 2.5, 66 + i * 2.5], [0, 1], clamp),
                translate: `0px ${interpolate(frame, [54 + i * 2.5, 70 + i * 2.5], [24, 0], { ...clamp, easing: ease.out })}px`,
                filter: `blur(${interpolate(frame, [54 + i * 2.5, 68 + i * 2.5], [8, 0], clamp)}px)`,
              }}
            >
              {w}
            </span>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
