import React from "react";
import { brand } from "../brand";
import { ICON, LETTERS, LOGO_VIEWBOX } from "../logo";

// Taiv lockup. Every piece is driven by a 0..1 progress so scenes can
// choreograph the assembly: the two screen triangles and the stand fly
// together, then T-A-I-V rise in, then a light sweep crosses the mark.
export const TaivLogo: React.FC<{
  width: number;
  icon?: number; // 0..1 assembly of the TV icon
  letters?: number[]; // 0..1 per letter
  shine?: number; // 0..1 sweep position (0 = off)
  color?: string;
  id?: string;
  iconOnly?: boolean;
}> = ({ width, icon = 1, letters = [1, 1, 1, 1], shine = 0, color = brand.white, id = "taiv", iconOnly = false }) => {
  const vbW = iconOnly ? 320 : LOGO_VIEWBOX.w;
  const height = (width / vbW) * LOGO_VIEWBOX.h;
  const k = 1 - icon;
  const piece = (dx: number, dy: number, rot: number, cx: number, cy: number) =>
    `translate(${dx * k} ${dy * k}) rotate(${rot * k} ${cx} ${cy})`;
  const iconO = Math.min(1, icon * 2.2);

  const shineX = -400 + shine * (vbW + 800);
  const gradId = `${id}-shine`;
  const clipId = `${id}-clip`;

  const iconPaths = (fill: string) => (
    <>
      <path d={ICON.top} fill={fill} transform={piece(150, -110, 24, 180, 60)} opacity={iconO} />
      <path d={ICON.left} fill={fill} transform={piece(-150, 70, -18, 80, 110)} opacity={iconO} />
      <path d={ICON.stand} fill={fill} transform={piece(0, 80, 0, 158, 188)} opacity={iconO} />
    </>
  );
  const letterPaths = (fill: string) =>
    iconOnly
      ? null
      : LETTERS.map((l, i) => {
          const p = letters[i] ?? 1;
          return (
            <path
              key={l.ch}
              d={l.d}
              fill={fill}
              opacity={Math.min(1, p * 1.6)}
              transform={`translate(0 ${(1 - p) * 70})`}
            />
          );
        });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${vbW} ${LOGO_VIEWBOX.h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={shineX} y1={0} x2={shineX + 260} y2={LOGO_VIEWBOX.h}>
          <stop offset="0" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="0.5" stopColor={brand.lavender} stopOpacity={0.9} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
        <clipPath id={clipId}>
          {iconPaths("#000")}
          {letterPaths("#000")}
        </clipPath>
      </defs>
      {iconPaths(color)}
      {letterPaths(color)}
      {shine > 0 && shine < 1 ? (
        <g clipPath={`url(#${clipId})`}>
          <rect x={-400} y={-50} width={vbW + 800} height={LOGO_VIEWBOX.h + 100} fill={`url(#${gradId})`} />
        </g>
      ) : null}
    </svg>
  );
};
