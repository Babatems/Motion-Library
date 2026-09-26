import React from "react";
import { brand, ease, fonts } from "../brand";
import { LucideName } from "../icons";
import { Icon, Spark, fmtMoney } from "./Brand";
import { iv } from "./Common";

// Recreation of app/(dashboard)/dashboard/page.tsx at 2x.
// Everything is positioned in "world" pixels so the camera can target cards.
export const WIN = { x: 160, y: 90, w: 1600, h: 900 };
const SIDEBAR_W = 270;
const PAD = 40;
const CX = WIN.x + SIDEBAR_W + PAD; // content left
const CW = WIN.w - SIDEBAR_W - PAD * 2; // content width
const TOP = WIN.y + 44; // below browser bar

export const CARD = {
  kpi: { y: TOP + 120, h: 140 },
  spending: { x: CX, y: TOP + 290, w: (CW - 24) / 2, h: 300 },
  budget: { x: CX + (CW - 24) / 2 + 24, y: TOP + 290, w: (CW - 24) / 2, h: 300 },
  accounts: { x: CX, y: TOP + 614, w: (CW - 24) / 2, h: 210 },
  goals: { x: CX + (CW - 24) / 2 + 24, y: TOP + 614, w: (CW - 24) / 2, h: 210 },
};
export const center = (c: { x: number; y: number; w: number; h: number }) => ({
  x: c.x + c.w / 2,
  y: c.y + c.h / 2,
});

const NAV: [LucideName, string][] = [
  ["layout-dashboard", "Dashboard"],
  ["credit-card", "Accounts"],
  ["arrow-left-right", "Transactions"],
  ["chart-pie", "Budgets"],
  ["target", "Goals"],
  ["settings", "Settings"],
];

const Card: React.FC<{
  box: { x: number; y: number; w: number; h: number };
  children: React.ReactNode;
  highlight?: number;
}> = ({ box, children, highlight = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: box.x,
      top: box.y,
      width: box.w,
      height: box.h,
      borderRadius: 18,
      background: "#fff",
      border: `1px solid ${highlight > 0 ? `rgba(14,107,79,${0.15 + highlight * 0.45})` : brand.neutral200}`,
      boxShadow: `0 1px 2px rgba(0,0,0,0.04), 0 ${20 * highlight}px ${50 * highlight}px -20px rgba(14,107,79,${0.35 * highlight})`,
      padding: "22px 26px",
      fontFamily: fonts.sans,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

const Title: React.FC<{ children: React.ReactNode; right?: string }> = ({ children, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
    <div style={{ fontSize: 22, fontWeight: 600, color: brand.neutral700 }}>{children}</div>
    {right ? (
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 17, color: brand.neutral400 }}>
        {right} <Icon name="arrow-right" size={16} />
      </div>
    ) : null}
  </div>
);

const Bar: React.FC<{ pct: number; color: string; h?: number }> = ({ pct, color, h = 10 }) => (
  <div style={{ height: h, borderRadius: 99, background: "#f5f5f5", overflow: "hidden" }}>
    <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", borderRadius: 99, background: color }} />
  </div>
);

const SPEND: [string, number][] = [
  ["Housing", 142500],
  ["Groceries", 48212],
  ["Dining Out", 36890],
  ["Transport", 21430],
];

export type DashState = {
  t: number; // global seconds
  born: number; // when the dashboard materialises
  budgetAt: number; // camera arrives at budget card
  goalsAt: number; // camera arrives at goals
  budgetFocus: number;
  goalsFocus: number;
};

export const Dashboard: React.FC<DashState> = ({ t, born, budgetAt, goalsAt, budgetFocus, goalsFocus }) => {
  const count = iv(t, [born + 0.2, born + 1.3], [0, 1], ease.out);
  const fill = (i: number) => iv(t, [born + 0.35 + i * 0.07, born + 1.2 + i * 0.07], [0, 1], ease.out);
  const dining = iv(t, [budgetAt + 0.1, budgetAt + 0.9], [71, 92], ease.out);
  const home = iv(t, [goalsAt + 0.15, goalsAt + 1.55], [38, 74], ease.inOut);
  const car = iv(t, [goalsAt + 0.3, goalsAt + 1.55], [40, 58], ease.inOut);
  const kpiW = (CW - 3 * 20) / 4;

  const kpis: [string, number, string, boolean][] = [
    ["Net Worth", 6140723 * count, brand.neutral900, false],
    ["Income", 624000 * count, brand.emerald600, false],
    ["Spending", -311247 * count, brand.red600, false],
    ["Net", 312753 * count, brand.emerald600, true],
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: WIN.x,
        top: WIN.y,
        width: WIN.w,
        height: WIN.h,
        borderRadius: 26,
        background: "#fcfcfb",
        border: `1px solid ${brand.neutral200}`,
        boxShadow: "0 60px 120px -40px rgba(14,15,18,0.35), 0 8px 24px rgba(14,15,18,0.06)",
        overflow: "hidden",
        fontFamily: fonts.sans,
      }}
    >
      {/* Browser bar */}
      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px",
          borderBottom: `1px solid ${brand.neutral200}`,
          background: "#f6f6f4",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 480,
            padding: "5px 60px",
            borderRadius: 8,
            background: "#fff",
            border: `1px solid ${brand.neutral200}`,
            fontSize: 16,
            color: brand.neutral500,
            fontFamily: fonts.mono,
          }}
        >
          owo-mi.ca/dashboard
        </div>
      </div>

      {/* Sidebar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 44,
          bottom: 0,
          width: SIDEBAR_W,
          borderRight: `1px solid ${brand.neutral200}`,
          background: "#fafafa",
          padding: "28px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 600, letterSpacing: "-0.03em", marginBottom: 30, paddingLeft: 10 }}>
          <Spark size={18} />
          Owó-mi
        </div>
        {NAV.map(([icon, label], i) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 14px",
              borderRadius: 12,
              marginBottom: 4,
              fontSize: 20,
              fontWeight: i === 0 ? 600 : 500,
              color: i === 0 ? brand.neutral900 : brand.neutral500,
              background: i === 0 ? "#efefed" : "transparent",
            }}
          >
            <Icon name={icon} size={21} />
            {label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ position: "absolute", left: 0, top: 0, width: WIN.w, height: WIN.h, translate: `${-WIN.x}px ${-WIN.y}px` }}>
        <div style={{ position: "absolute", left: CX, top: TOP + 28 }}>
          <div style={{ fontSize: 32, fontWeight: 600, color: brand.neutral900, letterSpacing: "-0.02em" }}>
            Adeyemi Family
          </div>
          <div style={{ fontSize: 19, color: brand.neutral500, marginTop: 2 }}>September 2026</div>
        </div>

        {kpis.map(([label, cents, color, sign], i) => (
          <Card key={label} box={{ x: CX + i * (kpiW + 20), y: CARD.kpi.y, w: kpiW, h: CARD.kpi.h }}>
            <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: brand.neutral500 }}>
              {label}
            </div>
            <div style={{ marginTop: 14, fontSize: i === 0 ? 40 : 34, fontWeight: 600, color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
              {sign ? "+" : ""}
              {fmtMoney(Math.round(cents))}
            </div>
          </Card>
        ))}

        <Card box={CARD.spending}>
          <Title right="View all">Spending by category</Title>
          {SPEND.map(([name, cents], i) => (
            <div key={name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: brand.neutral700, marginBottom: 5 }}>
                <span>{name}</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtMoney(cents)}</span>
              </div>
              <Bar pct={(cents / 142500) * 100 * fill(i)} color={brand.blue400} h={8} />
            </div>
          ))}
        </Card>

        <Card box={CARD.budget} highlight={budgetFocus}>
          <Title right="Manage">Budget health</Title>
          {(
            [
              ["Dining Out", dining],
              ["Groceries", 78 * fill(1)],
              ["Transport", 74 * fill(2)],
            ] as [string, number][]
          ).map(([name, pct], i) => (
            <div key={name} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, color: brand.neutral700, marginBottom: 7 }}>
                <span>{name}</span>
                <span style={{ fontSize: 17, fontWeight: 600, color: pct >= 100 ? brand.red600 : brand.amber600 }}>
                  {Math.round(i === 0 ? pct * Math.min(1, fill(0) * 2) : pct)}%
                </span>
              </div>
              <Bar pct={i === 0 ? pct * Math.min(1, fill(0) * 2) : pct} color={pct >= 100 ? brand.red500 : brand.amber400} h={10} />
            </div>
          ))}
        </Card>

        <Card box={CARD.accounts}>
          <Title right="Accounts">Contribution room</Title>
          {(
            [
              ["TFSA", 700000, 0.62],
              ["RRSP", 3381000, 0.35],
              ["FHSA", 800000, 0.5],
            ] as [string, number, number][]
          ).map(([name, cents, used], i) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
              <div style={{ width: 70, fontSize: 18, fontWeight: 600, color: brand.neutral700 }}>{name}</div>
              <div style={{ flex: 1 }}>
                <Bar pct={used * 100 * fill(i + 2)} color={brand.green} h={8} />
              </div>
              <div style={{ width: 130, textAlign: "right", fontSize: 17, color: brand.neutral500, fontVariantNumeric: "tabular-nums" }}>
                {fmtMoney(Math.round(cents * (1 - used)))}
              </div>
            </div>
          ))}
        </Card>

        <Card box={CARD.goals} highlight={goalsFocus}>
          <Title right="Goals">Savings goals</Title>
          {(
            [
              ["First home · FHSA", 4000000, home],
              ["New car", 2000000, car],
            ] as [string, number, number][]
          ).map(([name, target, pct]) => (
            <div key={name} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: brand.neutral900 }}>{name}</span>
                <span style={{ color: brand.neutral500, fontVariantNumeric: "tabular-nums" }}>
                  {fmtMoney(Math.round((target * pct) / 100))} / {fmtMoney(target).replace(".00", "")}
                </span>
              </div>
              <Bar pct={pct * fill(4)} color={brand.green} h={10} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};
