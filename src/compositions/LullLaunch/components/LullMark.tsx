import React, { useMemo } from "react";
import { colors } from "../theme";

// The Lull logo is a crescent. To morph cleanly from a circle ("the dot")
// into the crescent, both shapes are sampled with the SAME number of points
// in the SAME order, then lerped point-by-point. The circle's short right arc
// bends inward to become the crescent's inner "bite".

const SAMPLES = 120;
const DX = 0.42; // offset of the bite circle
const R_IN = 0.92; // radius of the bite circle

// Intersection of unit circle and the bite circle
const IX = (1 + DX * DX - R_IN * R_IN) / (2 * DX);
const IY = Math.sqrt(1 - IX * IX);
const THETA0 = Math.atan2(IY, IX);

const outerArc = (): [number, number][] => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const a = THETA0 + (i / SAMPLES) * (2 * Math.PI - 2 * THETA0);
    pts.push([Math.cos(a), Math.sin(a)]);
  }
  return pts;
};

// Closing edge for the circle: the short arc on the right side
const circleClose = (): [number, number][] => {
  const pts: [number, number][] = [];
  for (let i = 1; i < SAMPLES; i++) {
    const a = 2 * Math.PI - THETA0 + (i / SAMPLES) * (2 * THETA0);
    pts.push([Math.cos(a), Math.sin(a)]);
  }
  return pts;
};

// Closing edge for the crescent: inner arc of the bite circle
const crescentClose = (): [number, number][] => {
  const p1 = Math.atan2(-IY, IX - DX) + 2 * Math.PI;
  const p2 = Math.atan2(IY, IX - DX);
  const pts: [number, number][] = [];
  for (let i = 1; i < SAMPLES; i++) {
    const a = p1 + (i / SAMPLES) * (p2 - p1);
    pts.push([DX + R_IN * Math.cos(a), R_IN * Math.sin(a)]);
  }
  return pts;
};

const OUTER = outerArc();
const CIRCLE_CLOSE = circleClose();
const CRESCENT_CLOSE = crescentClose();

export const LullMark: React.FC<{
  size: number;
  morph: number; // 0 = circle, 1 = crescent
  rotate?: number;
  glow?: number;
  id?: string;
}> = ({ size, morph, rotate = -38, glow = 1, id = "lull" }) => {
  const d = useMemo(() => {
    const closing = CIRCLE_CLOSE.map(([cx, cy], i) => {
      const [tx, ty] = CRESCENT_CLOSE[i];
      return [cx + (tx - cx) * morph, cy + (ty - cy) * morph];
    });
    const all = [...OUTER, ...closing];
    return (
      all
        .map(([x, y], i) => `${i === 0 ? "M" : "L"}${(x * 48).toFixed(2)} ${(-y * 48).toFixed(2)}`)
        .join(" ") + " Z"
    );
  }, [morph]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      style={{
        overflow: "visible",
        filter: `drop-shadow(0 0 ${size * 0.18 * glow}px rgba(167,139,250,${0.55 * glow}))`,
      }}
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.accentA} />
          <stop offset="55%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor={colors.accentB} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id}-grad)`} transform={`rotate(${rotate})`} />
    </svg>
  );
};
