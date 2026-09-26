import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, ease, fonts } from "../brand";
import { Cursor, Spark, Wordmark } from "../components/Brand";
import { BanknoteStrips, iv, useT } from "../components/Common";
import { SCENE, WORDS } from "../timeline";
import { MaplePill } from "./Reveal";

const START = SCENE.cta[0];
export const CLICK = 36.62;
const OUTRO = 37.35;

export const CTA: React.FC = () => {
  const t = useT(START);
  const words = WORDS.c2b.words;

  const offsets = [0, 1, 2, 3, 4].map((i) =>
    iv(t, [33.0 + i * 0.06, 33.75 + i * 0.06], [(i % 2 ? 1 : -1) * 1100, 0], ease.out),
  );
  const press = iv(t, [CLICK - 0.03, CLICK + 0.05, CLICK + 0.25], [1, 0.98, 1], ease.out);
  const cx = iv(t, [35.95, CLICK - 0.05], [1500, 850], ease.out);
  const cy = iv(t, [35.95, CLICK - 0.05], [1060, 790], ease.inOut);
  const outro = iv(t, [OUTRO, OUTRO + 0.55], [0, 1], ease.inOut);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.ink, opacity: iv(t, [33.0, 33.2], [0, 1]) }}>
      <AbsoluteFill style={{ scale: iv(t, [33.0, 39.0], [1.1, 1.0], ease.out) }}>
        <BanknoteStrips offsets={offsets} opacity={0.2} grayscale={1} />
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${brand.ink} 0%, rgba(14,15,18,0) 35%, ${brand.ink} 100%)`,
          }}
        />
        <AbsoluteFill
          style={{
            opacity: 0.35,
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, #0e6b4f 60%, transparent), transparent)",
          }}
        />
      </AbsoluteFill>

      {/* Site nav */}
      <div
        style={{
          position: "absolute",
          left: 170,
          right: 170,
          top: 36,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: fonts.sans,
          opacity: iv(t, [33.3, 33.6], [0, 1]) * (1 - outro),
          translate: `0px ${iv(t, [33.3, 33.8], [-30, 0])}px`,
        }}
      >
        <Wordmark size={30} color="#fafafa" />
        <div style={{ display: "flex", alignItems: "center", gap: 36, fontSize: 24, color: "rgba(250,250,250,0.7)" }}>
          <span>Français</span>
          <span>Sign in</span>
          <span style={{ background: brand.green, color: "#fff", fontWeight: 600, padding: "10px 20px", borderRadius: 10 }}>
            Start free →
          </span>
        </div>
      </div>

      {/* Hero */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: 1 - outro,
          scale: 1 - outro * 0.06,
          filter: `blur(${outro * 12}px)`,
        }}
      >
        <MaplePill
          style={{
            opacity: iv(t, [33.45, 33.7], [0, 1]),
            translate: `0px ${iv(t, [33.45, 33.85], [16, 0])}px`,
          }}
        />
        <div
          style={{
            marginTop: 34,
            width: 1400,
            textAlign: "center",
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 124,
            lineHeight: 1.06,
            letterSpacing: "-0.045em",
            color: "#fafafa",
          }}
        >
          {words.map((w, i) => (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  opacity: iv(t, [w.t - 0.06, w.t + 0.12], [0, 1]),
                  translate: `0px ${iv(t, [w.t - 0.06, w.t + 0.35], [40, 0])}px`,
                  filter: `blur(${iv(t, [w.t - 0.06, w.t + 0.25], [12, 0])}px)`,
                }}
              >
                {w.w}
              </span>
              {i === 3 ? <br /> : " "}
            </React.Fragment>
          ))}
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: fonts.sans,
            fontSize: 34,
            color: "rgba(250,250,250,0.62)",
            opacity: iv(t, [35.75, 36.05], [0, 1]),
            translate: `0px ${iv(t, [35.75, 36.15], [14, 0])}px`,
          }}
        >
          Every Canadian account. One clear picture.
        </div>
        <div
          style={{
            marginTop: 44,
            display: "flex",
            gap: 22,
            fontFamily: fonts.sans,
            fontSize: 32,
            opacity: iv(t, [35.85, 36.1], [0, 1]),
            translate: `0px ${iv(t, [35.85, 36.25], [20, 0])}px`,
          }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "24px 42px",
              borderRadius: 18,
              background: brand.green,
              color: "#fff",
              fontWeight: 600,
              scale: press,
              boxShadow: `0 20px 60px -15px rgba(14,107,79,${0.5 + iv(t, [CLICK, CLICK + 0.3], [0, 0.4])})`,
            }}
          >
            {/* click ripple */}
            <div
              style={{
                position: "absolute",
                left: 380,
                top: 40,
                width: 600,
                height: 600,
                marginLeft: -300,
                marginTop: -300,
                borderRadius: 300,
                background: "rgba(255,255,255,0.25)",
                scale: iv(t, [CLICK, CLICK + 0.45], [0, 1]),
                opacity: iv(t, [CLICK, CLICK + 0.45], [t >= CLICK ? 1 : 0, 0]),
              }}
            />
            <span style={{ position: "relative" }}>Start tracking — it&apos;s free</span>
          </div>
          <div
            style={{
              padding: "24px 38px",
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(38,38,38,0.6)",
              color: "rgba(250,250,250,0.88)",
              fontWeight: 500,
            }}
          >
            See how it works →
          </div>
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: fonts.sans,
            fontSize: 24,
            color: "rgba(250,250,250,0.42)",
            opacity: iv(t, [36.1, 36.4], [0, 1]),
          }}
        >
          No credit card · Read-only · Built in Canada
        </div>
      </AbsoluteFill>

      <Cursor x={cx} y={cy} scale={press} opacity={iv(t, [35.95, 36.15], [0, 1]) * (1 - outro)} />

      {/* End card */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          opacity: iv(t, [OUTRO + 0.2, OUTRO + 0.6], [0, 1]),
        }}
      >
        <div style={{ scale: iv(t, [OUTRO + 0.2, OUTRO + 0.9], [0.85, 1], ease.out) }}>
          <Wordmark size={150} color="#fafafa" />
        </div>
        <div
          style={{
            marginTop: 36,
            fontFamily: fonts.mono,
            fontSize: 30,
            letterSpacing: "0.24em",
            color: "rgba(250,250,250,0.55)",
            opacity: iv(t, [OUTRO + 0.5, OUTRO + 0.85], [0, 1]),
          }}
        >
          OWO-MI.CA
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            opacity: iv(t, [OUTRO + 0.15, OUTRO + 0.3, OUTRO + 0.8], [0, 0.9, 0]),
            scale: iv(t, [OUTRO + 0.15, OUTRO + 0.8], [0.4, 3.2], ease.out),
            rotate: `${iv(t, [OUTRO + 0.15, OUTRO + 0.8], [0, 90])}deg`,
          }}
        >
          <Spark size={160} color={brand.lime} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
