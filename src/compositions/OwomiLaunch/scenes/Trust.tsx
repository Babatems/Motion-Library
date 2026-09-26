import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, ease, fonts } from "../brand";
import { Bank, BankLogo, Icon } from "../components/Brand";
import { iv, useT } from "../components/Common";
import { MAPLE_LEAF } from "../icons";
import { DROP2, SCENE } from "../timeline";

const START = SCENE.trust[0];
const LINES = [
  { at: 28.83, title: "Read-only.", sub: "We see your transactions. We can never move a cent." },
  { at: 30.15, title: "Hosted in Canada.", sub: "Montréal region · PIPEDA & Québec Law 25" },
  { at: 31.55, title: "Et en français, aussi.", sub: "" },
];
const TOGGLE = 31.95;
const BANKS: Bank[] = ["rbc", "td", "scotiabank", "bmo", "cibc"];

const Badge: React.FC<{ t: number }> = ({ t }) => {
  // One badge that morphs its glyph on each line: eye → maple leaf → FR
  const g = [
    iv(t, [28.8, 29.05], [0, 1]) * iv(t, [30.1, 30.3], [1, 0]),
    iv(t, [30.12, 30.4], [0, 1]) * iv(t, [31.5, 31.7], [1, 0]),
    iv(t, [31.52, 31.8], [0, 1]),
  ];
  const pulse = (at: number) => iv(t, [at - 0.05, at + 0.12], [0, 1]) * iv(t, [at + 0.12, at + 0.6], [1, 0]);
  const ring = Math.max(pulse(28.83), pulse(30.15), pulse(31.55));
  return (
    <div
      style={{
        position: "absolute",
        right: 230,
        top: 290,
        width: 420,
        height: 420,
        borderRadius: 210,
        background: "radial-gradient(circle at 35% 30%, rgba(14,107,79,0.55), rgba(14,107,79,0.12) 70%)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: iv(t, [DROP2 + 0.25, DROP2 + 0.9], [0.5, 1], ease.pop) * (1 + ring * 0.05),
        opacity: iv(t, [DROP2 + 0.25, DROP2 + 0.5], [0, 1]),
        boxShadow: `0 0 ${80 + ring * 80}px rgba(14,107,79,${0.35 + ring * 0.3})`,
      }}
    >
      <div style={{ position: "absolute", opacity: g[0], scale: 0.7 + g[0] * 0.3 }}>
        <Icon name="eye" size={190} color="#fafafa" strokeWidth={1.5} />
      </div>
      <svg width={220} height={220} viewBox="2400 0 4800 4800" style={{ position: "absolute", opacity: g[1], scale: 0.7 + g[1] * 0.3 }}>
        <path d={MAPLE_LEAF} fill={brand.maple} />
      </svg>
      <div
        style={{
          position: "absolute",
          opacity: g[2],
          scale: 0.7 + g[2] * 0.3,
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 150,
          letterSpacing: "-0.04em",
          color: "#fafafa",
        }}
      >
        Fr
      </div>
    </div>
  );
};

export const Trust: React.FC = () => {
  const t = useT(START);
  // Dark theme sweep back — the site's toggle, the other direction
  const sweep = iv(t, [DROP2 - 0.02, DROP2 + 0.5], [0, 150], ease.site);
  const toggle = iv(t, [TOGGLE, TOGGLE + 0.25], [0, 1], ease.inOut);

  return (
    <AbsoluteFill style={{ clipPath: `circle(${sweep}% at 68% 30%)`, backgroundColor: brand.ink }}>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse 60% 60% at 80% 40%, rgba(14,107,79,0.25), transparent 70%)" }}
      />
      <Badge t={t} />

      {/* Statements stack up; earlier ones step back */}
      <div style={{ position: "absolute", left: 160, top: 180, width: 1100 }}>
        {LINES.map((l, i) => {
          const inP = iv(t, [l.at - 0.08, l.at + 0.4], [0, 1]);
          const later = LINES.filter((o, j) => j > i && t >= o.at - 0.08).length;
          return (
            <div
              key={l.title}
              style={{
                opacity: inP * (later ? 0.32 : 1),
                translate: `0px ${(1 - inP) * 50}px`,
                filter: `blur(${(1 - inP) * 8}px)`,
                marginBottom: 34,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontWeight: 700,
                  fontSize: 104,
                  letterSpacing: "-0.045em",
                  lineHeight: 1.02,
                  color: "#fafafa",
                }}
              >
                {l.title}
              </div>
              {l.sub ? (
                <div
                  style={{
                    fontFamily: i === 1 ? fonts.mono : fonts.sans,
                    fontSize: i === 1 ? 26 : 32,
                    color: "rgba(250,250,250,0.55)",
                    marginTop: 12,
                    letterSpacing: i === 1 ? "0.04em" : "-0.01em",
                    opacity: iv(t, [l.at + 0.25, l.at + 0.55], [0, 1]),
                  }}
                >
                  {l.sub}
                </div>
              ) : (
                // EN | FR toggle — clicks over to Français
                <div
                  style={{
                    marginTop: 18,
                    display: "inline-flex",
                    position: "relative",
                    padding: 6,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: 26,
                    opacity: iv(t, [l.at + 0.15, l.at + 0.35], [0, 1]),
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 6,
                      left: 6 + toggle * 150,
                      width: 150,
                      height: 50,
                      borderRadius: 999,
                      background: brand.green,
                    }}
                  />
                  {["English", "Français"].map((w, k) => (
                    <div
                      key={w}
                      style={{
                        position: "relative",
                        width: 150,
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: (k === 1 ? toggle : 1 - toggle) > 0.5 ? "#fff" : "rgba(250,250,250,0.5)",
                      }}
                    >
                      {w}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust strip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 90,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          opacity: iv(t, [29.4, 29.8], [0, 1]),
        }}
      >
        <div style={{ fontFamily: fonts.mono, fontSize: 20, letterSpacing: "0.2em", color: "rgba(250,250,250,0.45)" }}>
          BUILT TO CONNECT WITH CANADA&apos;S MAJOR BANKS
        </div>
        <div style={{ display: "flex", gap: 26 }}>
          {BANKS.map((b, i) => (
            <div
              key={b}
              style={{
                width: 180,
                height: 84,
                borderRadius: 18,
                background: "#fafafa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: iv(t, [29.45 + i * 0.07, 29.7 + i * 0.07], [0, 1]),
                translate: `0px ${iv(t, [29.45 + i * 0.07, 29.85 + i * 0.07], [24, 0])}px`,
              }}
            >
              <BankLogo bank={b} height={b === "scotiabank" ? 26 : 38} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
