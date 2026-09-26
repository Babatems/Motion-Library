import React from "react";
import { AbsoluteFill } from "remotion";
import { brand, ease, fonts } from "../brand";
import { AccountCard, Bank, BankLogo, Spark } from "../components/Brand";
import { iv, useT } from "../components/Common";
import { DROP1, SCENE, WORDS } from "../timeline";

const START = SCENE.problem[0];
const SCATTER = 9.4; // "So…" — the cards fall apart
const IMPLODE = 11.62; // everything collapses into the spark

type CardSpec = {
  bank: Bank;
  type: "checking" | "tfsa" | "credit" | "savings" | "rrsp" | "fhsa";
  cents: number;
  at: number;
  x: number;
  y: number;
  z: number;
  rot: number;
};

// Each card lands on the word that names it
const CARDS: CardSpec[] = [
  {
    bank: "rbc",
    type: "checking",
    cents: 241807,
    at: 3.02,
    x: -520,
    y: -150,
    z: 0,
    rot: -5,
  },
  {
    bank: "td",
    type: "tfsa",
    cents: 1425000,
    at: 4.9,
    x: 470,
    y: -215,
    z: -120,
    rot: 4,
  },
  {
    bank: "cibc",
    type: "credit",
    cents: -108904,
    at: 7.0,
    x: -30,
    y: 175,
    z: 60,
    rot: -2,
  },
  {
    bank: "scotiabank",
    type: "savings",
    cents: 805939,
    at: 8.5,
    x: 640,
    y: 250,
    z: -260,
    rot: 6,
  },
  {
    bank: "bmo",
    type: "rrsp",
    cents: 3176012,
    at: 8.62,
    x: -690,
    y: 280,
    z: -300,
    rot: -7,
  },
  {
    bank: "scotiabank",
    type: "fhsa",
    cents: 520000,
    at: 8.74,
    x: 90,
    y: -360,
    z: -420,
    rot: 3,
  },
];
const FLIP: [number, number] = [7.72, 8.2]; // "…you'd rather not open."

const TX: [string, number][] = [
  ["TIM HORTONS #2231", -412],
  ["UBER *TRIP", -2340],
  ["NETFLIX.COM", -2099],
  ["LOBLAWS 1042", -8637],
  ["PRESTO FARE", -330],
  ["AMAZON.CA", -6499],
  ["SPOTIFY P1A2", -1199],
  ["ESSO 4471", -7112],
  ["SKIPTHEDISHES", -3875],
  ["ROGERS WIRELESS", -9500],
  ["SHOPPERS DRUG MART", -2744],
  ["APPLE.COM/BILL", -499],
  ["COSTCO WHOLESALE", -21488],
  ["CINEPLEX", -3150],
  ["STARBUCKS", -685],
  ["HYDRO ONE", -11420],
  ["CANADIAN TIRE", -4396],
  ["DOORDASH", -2911],
  ["PETRO-CANADA", -6630],
  ["METRO 208", -5418],
  ["SEPHORA", -7400],
  ["INTERAC e-TRANSFER", -20000],
  ["AIR CANADA", -48912],
  ["SAQ", -3299],
];

const money = (c: number) =>
  `${c < 0 ? "−" : ""}$${(Math.abs(c) / 100).toLocaleString("en-CA", { minimumFractionDigits: 2 })}`;

const TxColumn: React.FC<{ t: number; col: number; speed: number }> = ({
  t,
  col,
  speed,
}) => {
  const rows = [...TX.slice(col * 5), ...TX.slice(0, col * 5), ...TX];
  // distance travelled accelerates (integral of an ease-in speed ramp)
  const p = Math.max(0, t - SCATTER - 0.1);
  const dist = speed * (p * p * 260 + p * 120);
  return (
    <div
      style={{
        position: "absolute",
        left: 90 + col * 450,
        top: 0,
        width: 400,
        translate: `0px ${1100 - dist}px`,
      }}
    >
      {rows.map(([m, c], i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 86,
            padding: "0 22px",
            marginBottom: 14,
            borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            fontFamily: fonts.mono,
            fontSize: 22,
          }}
        >
          <span style={{ color: "rgba(250,250,250,0.72)" }}>{m}</span>
          <span
            style={{ color: "#f87171", fontVariantNumeric: "tabular-nums" }}
          >
            {money(c)}
          </span>
        </div>
      ))}
    </div>
  );
};

export const Problem: React.FC = () => {
  const t = useT(START);
  const q = WORDS.a3.words;

  // Camera orbit across the whole scatter phase
  const orbitY = iv(t, [3.0, SCATTER + 0.6], [14, -12], ease.inOut);
  const orbitX = iv(t, [3.0, SCATTER + 0.6], [8, 3], ease.inOut);
  const implode = iv(t, [IMPLODE, DROP1 - 0.08], [0, 1], ease.in);
  const streamBlur = iv(t, [10.2, IMPLODE], [0, 26], ease.in);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(14,107,79,0.22) 0%, rgba(14,107,79,0) 70%)",
        }}
      />

      {/* Everything collapses toward the centre on the implode */}
      <AbsoluteFill
        style={{
          scale: 1 - implode * 0.96,
          opacity: 1 - iv(t, [IMPLODE + 0.2, DROP1 - 0.1], [0, 1]),
          filter: `blur(${implode * 18}px)`,
        }}
      >
        {/* Phase 2: the transaction stream */}
        <AbsoluteFill
          style={{
            opacity: iv(t, [SCATTER + 0.1, SCATTER + 0.6], [0, 0.55]),
            filter: "url(#owomi-vblur)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, black 22%, black 78%, transparent 100%)",
          }}
        >
          <svg width={0} height={0} style={{ position: "absolute" }}>
            <filter
              id="owomi-vblur"
              x="0"
              y="-10%"
              width="100%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation={`0 ${streamBlur}`} />
            </filter>
          </svg>
          {[0, 1, 2, 3].map((c) => (
            <TxColumn key={c} t={t} col={c} speed={c % 2 ? 1.18 : 0.92} />
          ))}
        </AbsoluteFill>

        {/* Phase 1: accounts scattered across banks, in a slowly orbiting 3D space */}
        <AbsoluteFill style={{ perspective: 1800 }}>
          <AbsoluteFill
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${orbitX}deg) rotateY(${orbitY}deg)`,
            }}
          >
            {CARDS.map((c, i) => {
              const land = iv(t, [c.at - 0.08, c.at + 0.5], [0, 1], ease.pop);
              const appear = iv(t, [c.at - 0.08, c.at + 0.12], [0, 1]);
              const scatter = iv(
                t,
                [SCATTER + i * 0.04, SCATTER + 0.9 + i * 0.04],
                [0, 1],
                ease.in,
              );
              const flip =
                c.type === "credit" ? iv(t, FLIP, [0, 180], ease.inOut) : 0;
              const bob = Math.sin((t + i) * 1.3) * 8;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 960 - 230,
                    top: 540 - 90,
                    transformStyle: "preserve-3d",
                    transform: `translate3d(${c.x * (1 + scatter * 0.9)}px, ${c.y * (1 + scatter * 0.9) + bob}px, ${
                      c.z + (1 - land) * -700 + scatter * 500
                    }px) rotateZ(${c.rot + (1 - land) * 10}deg)`,
                  }}
                >
                  <div
                    style={{
                      opacity: appear * (1 - scatter),
                      filter: `blur(${(1 - appear) * 14 + scatter * 16}px)`,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        transformStyle: "preserve-3d",
                        transform: `perspective(1400px) rotateY(${flip}deg)`,
                      }}
                    >
                      <AccountCard
                        bank={c.bank}
                        type={c.type}
                        cents={c.cents}
                        dark
                        width={460}
                        style={{ backfaceVisibility: "hidden" }}
                      />
                      {c.type === "credit" ? (
                        // card back — the statement you'd rather not look at
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 22,
                            background:
                              "linear-gradient(135deg, #1f1f23 0%, #0b0b0d 100%)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            transform: "rotateY(180deg)",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: 28,
                          }}
                        >
                          <div
                            style={{
                              height: 44,
                              margin: "0 -28px",
                              background: "#000",
                            }}
                          />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: fonts.mono,
                                fontSize: 24,
                                color: "rgba(255,255,255,0.45)",
                                letterSpacing: "0.12em",
                              }}
                            >
                              •••• •••• •••• 4521
                            </span>
                            <BankLogo
                              bank="cibc"
                              height={30}
                              style={{ opacity: 0.8 }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </AbsoluteFill>
        </AbsoluteFill>

        {/* Phase 2 headline */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: 54,
              color: "rgba(250,250,250,0.6)",
              letterSpacing: "-0.02em",
              opacity: iv(t, [q[0].t - 0.05, q[0].t + 0.2], [0, 1]),
              translate: `0px ${iv(t, [q[0].t - 0.05, q[0].t + 0.35], [20, 0])}px`,
            }}
          >
            So…
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 136,
              letterSpacing: "-0.045em",
              lineHeight: 1.02,
              color: "#fafafa",
              textAlign: "center",
              textShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            {q.slice(1).map((w, i) => (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: "inline-block",
                    opacity: iv(t, [w.t - 0.05, w.t + 0.12], [0, 1]),
                    scale: iv(t, [w.t - 0.05, w.t + 0.35], [1.25, 1], ease.out),
                    filter: `blur(${iv(t, [w.t - 0.05, w.t + 0.2], [10, 0])}px)`,
                    color: w.w === "go?" ? brand.lime : undefined,
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

      {/* The spark that everything collapses into */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            scale: iv(t, [IMPLODE + 0.15, DROP1 - 0.05], [0, 1], ease.pop),
            rotate: `${iv(t, [IMPLODE + 0.15, DROP1], [-120, 0])}deg`,
            filter: "drop-shadow(0 0 30px rgba(199,242,61,0.7))",
          }}
        >
          <Spark size={90} color={brand.lime} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
