import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, ease, fonts, shadow } from "../brand";
import { Icon, iv, mix, pop, useT } from "../components/Common";
import { T } from "./timeline";

// The live-tracking promise ("Watch your order from the moment you place it
// 'til it's right at your door") as a single card over the cheese pull.
export const OrderCard: React.FC<{ start: number }> = ({ start }) => {
  const t = useT(start);
  const s = pop(t, T.card, { freq: 2.2, damp: 9 });
  const o = iv(t, [T.card, T.card + 0.1], [0, 1], ease.linear);
  const done = iv(t, [T.delivered - 0.02, T.delivered + 0.24], [0, 1], ease.out);
  const check = pop(t, T.delivered, { freq: 2.6, damp: 8 });
  const ride = iv(t, [T.card + 0.15, T.delivered], [0, 1], ease.inOut);
  const steps = [1, 1, ride, done];
  // a soft charcoal floor under the card so it reads on the photo
  const floor = iv(t, [T.card - 0.1, T.card + 0.3], [0, 1], ease.out);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 520px at 50% 52%, rgba(36,46,48,${0.34 * floor}) 0%, rgba(36,46,48,0) 70%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 960 - 380,
          top: 540 - 120,
          width: 760,
          height: 240,
          borderRadius: 24,
          background: brand.white,
          boxShadow: shadow.float,
          opacity: o,
          scale: mix(0.86, 1, s),
          translate: `0 ${(1 - Math.min(1, s)) * 40}px`,
          padding: "36px 40px",
          boxSizing: "border-box",
          display: "flex",
          gap: 30,
          fontFamily: fonts.sans,
        }}
      >
        <div style={{ position: "relative", width: 96, height: 96, flex: "none" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 48,
              background: brand.orange,
              display: "grid",
              placeItems: "center",
              scale: 1 - done,
            }}
          >
            <Icon name="car" size={54} color="#fff" />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 48,
              background: brand.green,
              display: "grid",
              placeItems: "center",
              scale: Math.max(0, check),
            }}
          >
            <svg width={50} height={50} viewBox="0 0 24 24">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ position: "relative", height: 100, overflow: "hidden", lineHeight: 1.15 }}>
            <div style={{ position: "absolute", translate: `0 ${-done * 110}px` }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: brand.charcoal, letterSpacing: "-0.02em" }}>
                Your order&apos;s on its way
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, color: brand.steel, marginTop: 6 }}>Arriving in 12 min</div>
            </div>
            <div style={{ position: "absolute", translate: `0 ${(1 - done) * 110}px` }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: brand.charcoal, letterSpacing: "-0.02em" }}>
                Delivered
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, color: brand.steel, marginTop: 6 }}>Right to your door</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            {steps.map((p, i) => (
              <div key={i} style={{ flex: 1, height: 9, borderRadius: 5, background: brand.creamDeep, overflow: "hidden" }}>
                <div style={{ width: `${p * 100}%`, height: "100%", background: done > 0.5 ? brand.green : brand.orange }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
