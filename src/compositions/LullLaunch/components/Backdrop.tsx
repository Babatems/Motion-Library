import { noise2D } from "@remotion/noise";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Dark canvas with a slowly drifting dot grid and two aurora blobs
// that wander on a noise field.
export const Backdrop: React.FC<{ glow?: number; seed?: string }> = ({
  glow = 1,
  seed = "a",
}) => {
  const frame = useCurrentFrame();
  const t = frame / 140;
  const ax = noise2D(seed + "ax", t, 0) * 220;
  const ay = noise2D(seed + "ay", t, 0) * 140;
  const bx = noise2D(seed + "bx", t, 0) * 220;
  const by = noise2D(seed + "by", t, 0) * 140;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: 260 + ax,
          top: -300 + ay,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(167,139,250,${0.32 * glow}) 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          left: 760 + bx,
          top: 280 + by,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(94,234,212,${0.18 * glow}) 0%, transparent 65%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.13) 1.4px, transparent 1.6px)",
          backgroundSize: "44px 44px",
          backgroundPosition: `${frame * 0.4}px ${frame * 0.25}px`,
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
