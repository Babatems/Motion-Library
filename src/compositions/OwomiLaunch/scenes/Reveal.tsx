import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, ease, fonts } from "../brand";
import { Spark } from "../components/Brand";
import { BanknoteStrips, iv, useT } from "../components/Common";
import { MAPLE_LEAF } from "../icons";
import { DROP1, SCENE } from "../timeline";

const START = SCENE.reveal[0];
const MEET = 12.5;
const NAME = 12.8;
const SPLIT = 14.2; // "It means…"
const MY = 14.7;
const MONEY = 15.04;
const EXIT = 15.6;

export const MaplePill: React.FC<{ style?: React.CSSProperties; dark?: boolean }> = ({ style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 22px",
      borderRadius: 999,
      background: brand.greenLight,
      color: brand.green,
      border: "1px solid rgba(14,107,79,0.2)",
      fontFamily: fonts.sans,
      fontWeight: 600,
      fontSize: 26,
      ...style,
    }}
  >
    <svg width={26} height={26} viewBox="2400 0 4800 4800">
      <path d={MAPLE_LEAF} fill={brand.maple} />
    </svg>
    Built in Canada
  </div>
);

const Label: React.FC<{ t: number; at: number; top: string; bottom: string }> = ({ t, at, top, bottom }) => (
  <div
    style={{
      position: "absolute",
      top: "100%",
      left: "50%",
      marginTop: 34,
      translate: `-50% ${iv(t, [at - 0.05, at + 0.35], [18, 0])}px`,
      opacity: iv(t, [at - 0.05, at + 0.2], [0, 1]),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      whiteSpace: "nowrap",
    }}
  >
    <div
      style={{
        width: 2,
        height: iv(t, [at - 0.05, at + 0.3], [0, 40]),
        background: brand.green,
        opacity: 0.5,
      }}
    />
    <div style={{ fontFamily: fonts.mono, fontSize: 26, color: brand.neutral500, letterSpacing: "0.08em" }}>{top}</div>
    <div style={{ fontFamily: fonts.sans, fontSize: 46, fontWeight: 600, color: brand.green, letterSpacing: "-0.02em" }}>
      {bottom}
    </div>
  </div>
);

export const Reveal: React.FC = () => {
  const t = useT(START);

  // The Owó-mi theme sweep — circle grows from the spark (0.45s, site easing)
  const sweep = iv(t, [DROP1 - 0.02, DROP1 + 0.5], [0, 150], ease.site);
  const split = iv(t, [SPLIT, SPLIT + 0.55], [0, 1], ease.inOut);
  const exit = iv(t, [EXIT, EXIT + 0.5], [0, 1], ease.in);
  const letters = ["O", "w", "ó"];

  return (
    <AbsoluteFill style={{ clipPath: `circle(${sweep}% at 50% 50%)` }}>
      <AbsoluteFill style={{ backgroundColor: brand.paper }} />
      {/* Hero texture, exactly as the site renders it */}
      <AbsoluteFill style={{ scale: iv(t, [DROP1, EXIT + 0.5], [1.08, 1.0], ease.out) }}>
        <BanknoteStrips offsets={[0, 0, 0, 0, 0]} opacity={0.16} grayscale={0.45} />
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${brand.paper} 0%, rgba(250,250,247,0) 35%, ${brand.paper} 100%)`,
          }}
        />
        <AbsoluteFill
          style={{
            opacity: 0.25,
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, #0e6b4f 40%, transparent), transparent)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          scale: 1 - exit * 0.35,
          opacity: 1 - exit,
          translate: `0px ${-exit * 140 - split * 60}px`,
          filter: `blur(${exit * 10}px)`,
        }}
      >
        <MaplePill
          style={{
            opacity: iv(t, [13.15, 13.4], [0, 1]),
            translate: `0px ${iv(t, [13.15, 13.55], [16, 0])}px`,
            marginBottom: 40,
          }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* ✦ lands first, then the name unrolls beside it */}
          <div
            style={{
              scale: iv(t, [DROP1 - 0.05, DROP1 + 0.45], [0.6, 1], ease.pop),
              rotate: `${iv(t, [DROP1 - 0.05, DROP1 + 0.6], [-90, 0])}deg`,
              marginRight: iv(t, [MEET, NAME + 0.3], [0, 44], ease.out),
            }}
          >
            <Spark size={132} />
          </div>
          <div
            style={{
              display: "flex",
              overflow: "visible",
              maxWidth: iv(t, [MEET, NAME + 0.3], [0, 820], ease.out) + split * 80,
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 210,
              letterSpacing: "-0.05em",
              color: brand.navy,
              lineHeight: 1,
            }}
          >
            <div style={{ position: "relative", display: "flex" }}>
              {letters.map((ch, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: iv(t, [NAME - 0.2 + i * 0.05, NAME + i * 0.05], [0, 1]),
                    translate: `0px ${iv(t, [NAME - 0.2 + i * 0.05, NAME + 0.3 + i * 0.05], [80, 0])}px`,
                    filter: `blur(${iv(t, [NAME - 0.2 + i * 0.05, NAME + 0.2 + i * 0.05], [12, 0])}px)`,
                  }}
                >
                  {ch}
                </span>
              ))}
              <Label t={t} at={MONEY} top="owó" bottom="money" />
            </div>
            <span
              style={{
                display: "inline-block",
                color: brand.green,
                width: split * 70 + 96,
                letterSpacing: 0,
                textAlign: "center",
                opacity: iv(t, [NAME + 0.1, NAME + 0.3], [0, 1]) * (1 - split * 0.85),
              }}
            >
              -
            </span>
            <div style={{ position: "relative", display: "flex" }}>
              {["m", "i"].map((ch, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: iv(t, [NAME + 0.05 + i * 0.05, NAME + 0.25 + i * 0.05], [0, 1]),
                    translate: `0px ${iv(t, [NAME + 0.05 + i * 0.05, NAME + 0.45 + i * 0.05], [80, 0])}px`,
                    filter: `blur(${iv(t, [NAME + 0.05 + i * 0.05, NAME + 0.35 + i * 0.05], [12, 0])}px)`,
                  }}
                >
                  {ch}
                </span>
              ))}
              <Label t={t} at={MY} top="mi" bottom="my" />
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: fonts.mono,
            fontSize: 28,
            letterSpacing: "0.22em",
            color: brand.neutral500,
            opacity: iv(t, [13.3, 13.6], [0, 1]) * (1 - split),
            height: 40 * (1 - split),
          }}
        >
          OH-WOH · MEE
        </div>
        <div
          style={{
            position: "relative",
            marginTop: 170 * split,
            fontFamily: fonts.sans,
            fontSize: 32,
            color: brand.neutral600,
            opacity: iv(t, [MONEY + 0.3, MONEY + 0.55], [0, 1]),
          }}
        >
          “my money” — in Yoruba.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
