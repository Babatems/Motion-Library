import React from "react";
import { Img, staticFile } from "remotion";
import { ACCOUNT_CHIP, brand, fonts } from "../brand";
import { LUCIDE, LucideName } from "../icons";

// ✦ — the Owó-mi nav mark, drawn as a vector so it stays crisp at any scale
export const Spark: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({
  size,
  color = brand.green,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: "visible", ...style }}>
    <path
      d="M12 0C12.9 6.2 17.8 11.1 24 12C17.8 12.9 12.9 17.8 12 24C11.1 17.8 6.2 12.9 0 12C6.2 11.1 11.1 6.2 12 0Z"
      fill={color}
    />
  </svg>
);

export const Wordmark: React.FC<{
  size: number;
  color?: string;
  sparkColor?: string;
  style?: React.CSSProperties;
}> = ({ size, color = brand.neutral900, sparkColor = brand.green, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: size * 0.28,
      fontFamily: fonts.sans,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: "-0.035em",
      color,
      lineHeight: 1,
      ...style,
    }}
  >
    <Spark size={size * 0.62} color={sparkColor} />
    <span>Owó-mi</span>
  </div>
);

export const Icon: React.FC<{
  name: LucideName;
  size: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({ name, size, color = "currentColor", strokeWidth = 2, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, ...style }}
    dangerouslySetInnerHTML={{ __html: LUCIDE[name] }}
  />
);

export type Bank = "rbc" | "td" | "scotiabank" | "bmo" | "cibc";
export const BANK_NAME: Record<Bank, string> = {
  rbc: "RBC",
  td: "TD",
  scotiabank: "Scotiabank",
  bmo: "BMO",
  cibc: "CIBC",
};

// Logos use tightly-cropped copies of the site's bank SVGs; sized by height.
export const BankLogo: React.FC<{ bank: Bank; height: number; style?: React.CSSProperties }> = ({
  bank,
  height,
  style,
}) => (
  <Img
    src={staticFile(`owomi/banks/${bank}-tight.svg`)}
    style={{ height: bank === "rbc" ? height * 1.5 : height, width: "auto", maxWidth: "none", flexShrink: 0, ...style }}
  />
);

const money = (cents: number) => {
  const neg = cents < 0;
  const s = (Math.abs(cents) / 100).toLocaleString("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${neg ? "-" : ""}$${s}`;
};
export const fmtMoney = money;

// Mirrors components/accounts/account-card.tsx (and the landing illustration)
export const AccountCard: React.FC<{
  bank: Bank;
  name?: string;
  type: keyof typeof ACCOUNT_CHIP;
  cents: number;
  dark?: boolean;
  width?: number;
  chipGlow?: number;
  style?: React.CSSProperties;
}> = ({ bank, name, type, cents, dark = false, width = 440, chipGlow = 0, style }) => {
  const chip = ACCOUNT_CHIP[type];
  const k = width / 440;
  return (
    <div
      style={{
        width,
        padding: `${26 * k}px ${28 * k}px`,
        borderRadius: 22 * k,
        background: dark ? "rgba(23,23,23,0.92)" : "#ffffff",
        border: `1px solid ${dark ? "rgba(255,255,255,0.10)" : "rgba(229,229,229,0.9)"}`,
        boxShadow: dark
          ? "0 30px 60px -24px rgba(0,0,0,0.8)"
          : "0 24px 50px -24px rgba(14,15,18,0.25), 0 2px 6px rgba(14,15,18,0.04)",
        fontFamily: fonts.sans,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 * k }}>
        <div
          style={{
            height: 40 * k,
            display: "flex",
            alignItems: "center",
            padding: dark ? `0 ${8 * k}px` : 0,
            borderRadius: 8 * k,
            background: dark ? "rgba(255,255,255,0.92)" : "transparent",
          }}
        >
          <BankLogo bank={bank} height={bank === "scotiabank" ? 20 * k : 26 * k} />
        </div>
        <div
          style={{
            flex: 1,
            fontSize: 20 * k,
            fontWeight: 600,
            color: dark ? "#f5f5f5" : brand.neutral900,
            whiteSpace: "nowrap",
          }}
        >
          {name ?? (bank === "rbc" ? "Royal Bank" : "")}
        </div>
        <div
          style={{
            fontSize: 16 * k,
            fontWeight: 600,
            padding: `${5 * k}px ${12 * k}px`,
            borderRadius: 999,
            background: chip.bg,
            color: chip.fg,
            boxShadow: chipGlow > 0 ? `0 0 0 ${4 * chipGlow * k}px ${chip.fg}33` : undefined,
            scale: 1 + chipGlow * 0.12,
          }}
        >
          {chip.label}
        </div>
        <div style={{ color: brand.neutral400, fontSize: 22 * k, letterSpacing: 1 }}>···</div>
      </div>
      <div
        style={{
          marginTop: 22 * k,
          fontSize: 44 * k,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
          color: cents < 0 ? brand.red600 : dark ? "#fafafa" : brand.neutral900,
        }}
      >
        {money(cents)}
      </div>
      <div style={{ fontSize: 17 * k, color: brand.neutral500, marginTop: 2 * k }}>
        Current balance
      </div>
    </div>
  );
};

export const Cursor: React.FC<{ x: number; y: number; scale?: number; opacity?: number }> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
}) => (
  <svg
    width={46}
    height={46}
    viewBox="0 0 24 24"
    style={{
      position: "absolute",
      left: x - 7,
      top: y - 4,
      scale,
      opacity,
      filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))",
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
);
