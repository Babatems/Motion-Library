import React from "react";
import { APPS, AppId } from "../apps";
import { colors, fonts } from "../theme";
import { AppIcon } from "./AppIcon";

export const CARD_WIDTH = 540;

// iOS-style glass notification
export const NotificationCard: React.FC<{
  app: AppId;
  message: string;
  time?: string;
  style?: React.CSSProperties;
}> = ({ app, message, time = "now", style }) => {
  return (
    <div
      style={{
        position: "absolute",
        width: CARD_WIDTH,
        padding: "22px 26px",
        borderRadius: 30,
        background: "rgba(30,30,36,0.72)",
        backdropFilter: "blur(28px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 30px 60px -20px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08)",
        display: "flex",
        gap: 20,
        alignItems: "center",
        fontFamily: fonts.body,
        ...style,
      }}
    >
      <AppIcon app={app} size={64} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            color: colors.muted,
            fontWeight: 500,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
          }}
        >
          <span>{APPS[app].name}</span>
          <span style={{ textTransform: "none" }}>{time}</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: colors.text,
            fontWeight: 600,
            marginTop: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};
