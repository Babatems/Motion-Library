import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, ease, fonts } from "../brand";
import { Backdrop, iv, useT } from "../components/Common";
import { TaivLogo } from "../components/TaivLogo";
import { DROP, SCENE, W } from "../timeline";

// The drop: the violet of the screen we punched through clears to the brand
// indigo and the mark assembles. Deliberately restrained — no rings, streaks
// or floating tiles; the logo carries the moment.
export const Reveal: React.FC = () => {
  const t = useT(SCENE.reveal[0]);
  const flash = iv(t, [SCENE.reveal[0], DROP + 0.3], [1, 0], ease.out);

  const icon = iv(t, [DROP + 0.02, DROP + 0.5], [0, 1], ease.quint);
  const letters = [0, 1, 2, 3].map((i) => iv(t, [DROP + 0.26 + i * 0.06, DROP + 0.76 + i * 0.06], [0, 1], ease.quint));
  const shine = iv(t, [W.taiv + 0.45, W.taiv + 1.15], [0, 1], ease.site);
  const tag = iv(t, [W.taiv + 0.42, W.taiv + 0.98], [0, 1], ease.out);

  const exit = iv(t, [7.3, 7.62], [0, 1], ease.in);
  const logoScale = iv(t, [DROP, DROP + 0.9], [1.06, 1], ease.quint);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop glow={0.75} glowY={48} glowSize={1200} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 40,
          translate: `0px ${-exit * 48 - 10}px`,
        }}
      >
        <div style={{ scale: logoScale }}>
          <TaivLogo width={900} icon={icon} letters={letters} shine={shine} id="reveal" />
        </div>
        {/* tagline rises out of a mask */}
        <div style={{ overflow: "hidden", paddingBottom: 6 }}>
          <div
            style={{
              translate: `0px ${(1 - tag) * 110}%`,
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: 34,
              letterSpacing: "-0.01em",
              color: brand.muted,
            }}
          >
            The AI OS for <span style={{ color: brand.white }}>business TV</span>.
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: brand.violet, opacity: flash }} />
      {/* exit with an overlay, not parent opacity (avoids a one-frame layer pop) */}
      <AbsoluteFill style={{ background: brand.void, opacity: Math.max(0.002, exit) }} />
    </AbsoluteFill>
  );
};
