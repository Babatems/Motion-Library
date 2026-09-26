import React from "react";
import { APPS, AppId } from "../apps";

const INSTAGRAM_BG =
  "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)";

export const AppIcon: React.FC<{ app: AppId; size: number }> = ({ app, size }) => {
  const { color, path } = APPS[app];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background:
          app === "instagram"
            ? INSTAGRAM_BG
            : `linear-gradient(160deg, ${color} 0%, ${color} 60%, color-mix(in srgb, ${color} 75%, black) 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 0 0 1px rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24">
        <path d={path} fill="#fff" />
      </svg>
    </div>
  );
};
