import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AppId } from "../apps";
import { AppIcon } from "../components/AppIcon";
import { Backdrop } from "../components/Backdrop";
import { LullMark } from "../components/LullMark";
import { CARD_WIDTH, NotificationCard } from "../components/NotificationCard";
import { NOTIFICATIONS } from "../notifications";
import { accentGradient, clamp, colors, ease, fonts } from "../theme";

const suck = Easing.bezier(0.55, 0, 0.25, 1);

// Phone geometry (scene coordinates)
const PHONE = { left: 1380, top: 110, w: 440, h: 860 };
const DIGEST_W = 520;
const DIGEST_SLOT = { x: PHONE.left + PHONE.w / 2, y: PHONE.top + 205 };
const DIGEST_SCALE = (PHONE.w - 40) / DIGEST_W;

const MERGE = 26; // digest is born
const MOVE = [44, 68] as const; // digest flies into the phone

const PRIORITY: { app: AppId; title: string; body: string }[] = [
  { app: "slack", title: "Design review moved", body: "Now 3:00 PM · from Maya" },
  { app: "gmail", title: "Contract signed", body: "Acme Co. · needs countersign" },
  { app: "googlecalendar", title: "Deep work · 2h", body: "Protected — pings held" },
];

const CHIPS = ["Smart batching", "Priority AI", "Focus mode"];

const Digest: React.FC = () => (
  <div
    style={{
      width: DIGEST_W,
      padding: "26px 30px",
      borderRadius: 34,
      border: "1.5px solid transparent",
      background: `linear-gradient(rgba(22,20,32,0.96), rgba(22,20,32,0.96)) padding-box, ${accentGradient} border-box`,
      boxShadow: "0 30px 80px -20px rgba(167,139,250,0.55)",
      fontFamily: fonts.body,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 15,
          background: "#15131F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <LullMark size={28} morph={1} glow={0.4} id="digest" />
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 20,
          letterSpacing: "0.2em",
          color: colors.muted,
          flex: 1,
        }}
      >
        LULL · DIGEST
      </div>
      <div style={{ fontSize: 20, color: colors.muted }}>now</div>
    </div>
    <div
      style={{
        fontFamily: fonts.display,
        fontSize: 40,
        fontWeight: 600,
        color: colors.text,
        marginTop: 18,
        letterSpacing: "-0.02em",
      }}
    >
      3 things need you.
    </div>
    <div style={{ fontSize: 26, color: colors.muted, marginTop: 4 }}>
      124 can wait until 5 PM.
    </div>
  </div>
);

export const Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const toggle = interpolate(frame, [104, 112], [0, 1], { ...clamp, easing: ease.out });
  const held = Math.round(interpolate(frame, [70, 100], [0, 124], { ...clamp, easing: ease.out }));

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop glow={interpolate(frame, [20, 60], [0.3, 1], clamp)} seed="sol" />

      {/* Camera: gentle push over the whole scene */}
      <AbsoluteFill style={{ scale: interpolate(frame, [30, 170], [1, 1.045], clamp) }}>
        {/* Lifestyle photo card, revealed with an expanding inset mask */}
        <div
          style={{
            position: "absolute",
            left: 780,
            top: 170,
            width: 720,
            height: 740,
            borderRadius: 40,
            overflow: "hidden",
            clipPath: `inset(${interpolate(frame, [50, 80], [50, 0], { ...clamp, easing: ease.out })}% round 40px)`,
            boxShadow: "0 40px 100px -30px rgba(0,0,0,0.8)",
          }}
        >
          <Img
            src={staticFile("img/solution.jpg")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "28% 50%",
              scale: interpolate(frame, [50, 170], [1.3, 1.08], { ...clamp, easing: ease.out }),
              translate: `${interpolate(frame, [50, 170], [30, -10], clamp)}px 0px`,
            }}
          />
          <AbsoluteFill
            style={{
              background: "linear-gradient(90deg, rgba(7,7,10,0.35), transparent 40%, rgba(7,7,10,0.55))",
            }}
          />
        </div>

        {/* Left column: headline */}
        <div style={{ position: "absolute", left: 120, top: 250, width: 640 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: fonts.mono,
              fontSize: 22,
              letterSpacing: "0.3em",
              color: colors.accentB,
              textTransform: "uppercase",
              opacity: interpolate(frame, [50, 60], [0, 1], clamp),
            }}
          >
            <div
              style={{
                width: 56,
                height: 2,
                background: colors.accentB,
                scale: `${interpolate(frame, [50, 66], [0, 1], { ...clamp, easing: ease.out })} 1`,
                transformOrigin: "left",
              }}
            />
            02 — The solution
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 132,
              letterSpacing: "-0.045em",
              lineHeight: 1,
              marginTop: 34,
              overflow: "hidden",
              paddingBottom: 14,
            }}
          >
            <div
              style={{
                translate: `0px ${interpolate(frame, [56, 78], [150, 0], { ...clamp, easing: ease.out })}px`,
                color: colors.text,
              }}
            >
              Meet{" "}
              <span style={{ backgroundImage: accentGradient, WebkitBackgroundClip: "text", color: "transparent" }}>
                Lull.
              </span>
            </div>
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: 40,
              lineHeight: 1.3,
              color: colors.muted,
              marginTop: 18,
              opacity: interpolate(frame, [66, 80], [0, 1], clamp),
              translate: `0px ${interpolate(frame, [66, 84], [30, 0], { ...clamp, easing: ease.out })}px`,
            }}
          >
            AI that holds the noise and lets through{" "}
            <span style={{ color: colors.text }}>only what matters.</span>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
            {CHIPS.map((c, i) => (
              <div
                key={c}
                style={{
                  fontFamily: fonts.body,
                  fontSize: 24,
                  fontWeight: 500,
                  color: colors.text,
                  padding: "12px 22px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${colors.line}`,
                  opacity: interpolate(frame, [84 + i * 5, 94 + i * 5], [0, 1], clamp),
                  scale: interpolate(frame, [84 + i * 5, 98 + i * 5], [0.7, 1], { ...clamp, easing: ease.bouncy }),
                }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div
          style={{
            position: "absolute",
            left: PHONE.left,
            top: PHONE.top,
            width: PHONE.w,
            height: PHONE.h,
            borderRadius: 64,
            background: "linear-gradient(180deg, #121118 0%, #0B0A10 100%)",
            border: "10px solid #1C1B22",
            boxShadow:
              "0 0 0 1.5px rgba(255,255,255,0.12), 0 60px 120px -30px rgba(0,0,0,0.9), 0 0 120px -30px rgba(167,139,250,0.35)",
            overflow: "hidden",
            opacity: interpolate(frame, [44, 56], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [44, 70], [160, 0], { ...clamp, easing: ease.out })}px`,
            fontFamily: fonts.body,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              marginLeft: -60,
              width: 120,
              height: 34,
              borderRadius: 20,
              background: "#000",
            }}
          />
          <div style={{ position: "absolute", top: 18, left: 34, fontSize: 20, fontWeight: 600, color: colors.text }}>
            9:41
          </div>
          <div
            style={{
              position: "absolute",
              top: 72,
              left: 22,
              fontFamily: fonts.display,
              fontSize: 36,
              fontWeight: 600,
              color: colors.text,
              letterSpacing: "-0.02em",
            }}
          >
            Today
          </div>

          <div
            style={{
              position: "absolute",
              top: 318,
              left: 22,
              fontFamily: fonts.mono,
              fontSize: 15,
              letterSpacing: "0.2em",
              color: colors.muted,
              opacity: interpolate(frame, [72, 80], [0, 1], clamp),
            }}
          >
            NEEDS YOU
          </div>
          {PRIORITY.map((p, i) => (
            <div
              key={p.title}
              style={{
                position: "absolute",
                top: 348 + i * 92,
                left: 16,
                right: 16,
                height: 80,
                borderRadius: 22,
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${colors.line}`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 14px",
                opacity: interpolate(frame, [76 + i * 6, 86 + i * 6], [0, 1], clamp),
                translate: `${interpolate(frame, [76 + i * 6, 92 + i * 6], [60, 0], { ...clamp, easing: ease.out })}px 0px`,
              }}
            >
              <AppIcon app={p.app} size={48} />
              <div>
                <div style={{ fontSize: 21, fontWeight: 600, color: colors.text }}>{p.title}</div>
                <div style={{ fontSize: 17, color: colors.muted, marginTop: 2 }}>{p.body}</div>
              </div>
            </div>
          ))}

          <div
            style={{
              position: "absolute",
              top: 640,
              left: 22,
              right: 22,
              fontSize: 19,
              color: colors.muted,
              display: "flex",
              justifyContent: "space-between",
              opacity: interpolate(frame, [70, 80], [0, 1], clamp),
            }}
          >
            <span>Held quietly</span>
            <span style={{ color: colors.text, fontVariantNumeric: "tabular-nums" }}>{held}</span>
          </div>

          {/* Focus mode toggle */}
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: 16,
              right: 16,
              height: 88,
              borderRadius: 26,
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: `rgba(167,139,250,${0.06 + toggle * 0.14})`,
              border: `1px solid rgba(167,139,250,${0.15 + toggle * 0.35})`,
              opacity: interpolate(frame, [88, 98], [0, 1], clamp),
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: colors.text }}>Focus mode</div>
              <div style={{ fontSize: 16, color: colors.muted, marginTop: 2 }}>
                {toggle > 0.5 ? "On · until 5:00 PM" : "Off"}
              </div>
            </div>
            <div
              style={{
                width: 76,
                height: 44,
                borderRadius: 22,
                background: toggle > 0.5 ? accentGradient : "rgba(255,255,255,0.18)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: interpolate(toggle, [0, 1], [4, 36]),
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Converging notifications (match-cut from the Problem scene) */}
        {NOTIFICATIONS.map((n, i) => {
          const s = 8 + i * 1.5;
          const e = s + 16;
          return (
            <NotificationCard
              key={n.app}
              app={n.app}
              message={n.message}
              style={{
                left: n.x - CARD_WIDTH / 2,
                top: n.y - 55,
                translate: `${interpolate(frame, [s, e], [0, 960 - n.x], { ...clamp, easing: suck })}px ${interpolate(frame, [s, e], [0, 540 - n.y], { ...clamp, easing: suck })}px`,
                scale: interpolate(frame, [s, e], [1, 0.5], { ...clamp, easing: suck }),
                rotate: `${interpolate(frame, [s, e], [n.rot, 0], { ...clamp, easing: suck })}deg`,
                opacity: interpolate(frame, [e - 5, e], [1, 0], clamp),
                filter: `blur(${interpolate(frame, [s, s + 8, e], [0, 6, 2], clamp)}px)`,
              }}
            />
          );
        })}

        {/* Shockwave ring at the merge point */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 540,
            width: interpolate(frame, [MERGE, MERGE + 22], [40, 1400], { ...clamp, easing: ease.out }),
            aspectRatio: "1",
            translate: "-50% -50%",
            borderRadius: "50%",
            border: `2px solid ${colors.accentA}`,
            boxShadow: `0 0 40px ${colors.accentA}, inset 0 0 40px rgba(167,139,250,0.4)`,
            opacity: interpolate(frame, [MERGE - 1, MERGE, MERGE + 22], [0, 0.9, 0], clamp),
          }}
        />

        {/* The digest: born at center, then flies into the phone */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: DIGEST_W,
            translate: `${interpolate(frame, MOVE, [960, DIGEST_SLOT.x], { ...clamp, easing: ease.inOut }) - DIGEST_W / 2}px ${interpolate(frame, MOVE, [540, DIGEST_SLOT.y], { ...clamp, easing: ease.inOut }) - 95}px`,
            scale:
              interpolate(frame, [MERGE, MERGE + 14], [0.4, 1], { ...clamp, easing: ease.bouncy }) *
              interpolate(frame, MOVE, [1.12, DIGEST_SCALE], { ...clamp, easing: ease.inOut }),
            opacity: interpolate(frame, [MERGE - 2, MERGE + 4], [0, 1], clamp),
          }}
        >
          <Digest />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
