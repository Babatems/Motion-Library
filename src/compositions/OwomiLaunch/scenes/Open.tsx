import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, ease, fonts } from "../brand";
import { BanknoteStrips, iv, useT } from "../components/Common";
import { SCENE, WORDS } from "../timeline";

const START = SCENE.open[0];
const EXIT = 3.0;

// Cold open: the engraved banknote portraits slam in, one panel at a time.
export const Open: React.FC = () => {
  const t = useT(START);
  const words = WORDS.a1.words;

  const offsets = [0, 1, 2, 3, 4].map((i) => {
    const dir = i % 2 === 0 ? -1 : 1;
    const inY = iv(t, [0.05 + i * 0.09, 0.85 + i * 0.09], [dir * 1100, 0], ease.out);
    const outY = iv(t, [EXIT - 0.05 + i * 0.03, EXIT + 0.3 + i * 0.03], [0, -dir * 1150], ease.in);
    return inY + outY;
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: brand.ink, opacity: iv(t, [EXIT, EXIT + 0.25], [1, 0]) }} />
      {/* Camera: slow pull-back */}
      <AbsoluteFill style={{ scale: iv(t, [0, 3.3], [1.14, 1.0], ease.inOut) }}>
        <BanknoteStrips offsets={offsets} opacity={0.62} grayscale={0.35} />
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${brand.ink} 0%, rgba(14,15,18,0.35) 38%, rgba(14,15,18,0.35) 62%, ${brand.ink} 100%)`,
            opacity: iv(t, [0, 0.8], [1, 1]),
          }}
        />
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(14,15,18,0.78) 0%, rgba(14,15,18,0) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* Headline, typeset word-by-word on the voice */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: iv(t, [EXIT - 0.1, EXIT + 0.15], [1, 0]),
          translate: `0px ${iv(t, [EXIT - 0.1, EXIT + 0.3], [0, -60], ease.in)}px`,
        }}
      >
        <div
          style={{
            width: 1500,
            textAlign: "center",
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: 118,
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
            color: "#fafafa",
          }}
        >
          {words.map((w, i) => (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  opacity: iv(t, [w.t - 0.06, w.t + 0.14], [0, 1]),
                  translate: `0px ${iv(t, [w.t - 0.06, w.t + 0.3], [36, 0])}px`,
                  filter: `blur(${iv(t, [w.t - 0.06, w.t + 0.22], [12, 0])}px)`,
                  color: w.w === "places." ? brand.lime : undefined,
                }}
              >
                {w.w}
              </span>
              {i === 2 ? <br /> : " "}
            </React.Fragment>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
