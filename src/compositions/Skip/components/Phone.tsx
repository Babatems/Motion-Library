import { getLength, getPointAtLength } from "@remotion/paths";
import React from "react";
import { Img, staticFile } from "remotion";
import { brand, ease, fonts, radius, shadow } from "../brand";
import { Icon, Star, iv, mix } from "./Common";

// Logical screen size (iPhone points). The phone is built at this size and
// scaled with CSS, so text stays vector-sharp at any zoom.
export const SCREEN = { w: 390, h: 844 };
const BEZEL = 13;

export const Phone: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      width: SCREEN.w + BEZEL * 2,
      height: SCREEN.h + BEZEL * 2,
      borderRadius: 64,
      background: "#16191a",
      boxShadow: `${shadow.float}, inset 0 0 0 2px #2b3133`,
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: BEZEL,
        top: BEZEL,
        width: SCREEN.w,
        height: SCREEN.h,
        borderRadius: 51,
        overflow: "hidden",
        background: brand.white,
      }}
    >
      {children}
      {/* dynamic island */}
      <div
        style={{
          position: "absolute",
          left: SCREEN.w / 2 - 62,
          top: 11,
          width: 124,
          height: 36,
          borderRadius: 18,
          background: "#0b0d0e",
        }}
      />
    </div>
  </div>
);

const text = (size: number, weight: number, color: string = brand.charcoal): React.CSSProperties => ({
  fontFamily: fonts.sans,
  fontSize: size,
  fontWeight: weight,
  color,
  lineHeight: 1.2,
  letterSpacing: "-0.01em",
  whiteSpace: "nowrap",
});

const StatusBar: React.FC<{ dark?: boolean; bg?: string }> = ({ dark = true, bg }) => {
  const c = dark ? brand.charcoal : brand.white;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN.w, height: 54, zIndex: 5, background: bg }}>
      <div style={{ ...text(16, 600, c), position: "absolute", left: 44, top: 18 }}>6:41</div>
      <div style={{ position: "absolute", right: 30, top: 21, display: "flex", gap: 6, alignItems: "flex-end" }}>
        {[5, 7, 9, 11].map((h, i) => (
          <div key={i} style={{ width: 3.5, height: h, borderRadius: 1, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 6,
            width: 25,
            height: 12,
            borderRadius: 3.5,
            border: `1.5px solid ${c}`,
            padding: 1.5,
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: "78%", height: "100%", borderRadius: 1.5, background: c }} />
        </div>
      </div>
    </div>
  );
};

// ─── Home feed ─────────────────────────────────────────────────────────────
export const RESTAURANTS = [
  { name: "Corner Slice Pizzeria", img: "pizza.jpg", rating: "4.8", time: "20–30 min", y: 52 },
  { name: "Red River Ramen", img: "ramen.jpg", rating: "4.9", time: "25–35 min", y: 50 },
  { name: "Nori House", img: "sushi.jpg", rating: "4.7", time: "15–25 min", y: 55 },
  { name: "Prairie Smash Burger", img: "burger.jpg", rating: "4.8", time: "20–30 min", y: 45 },
  { name: "Taquería Osborne", img: "tacos.jpg", rating: "4.6", time: "25–35 min", y: 50 },
];
export const CATEGORIES = [
  { label: "Pizza", img: "pizza.jpg" },
  { label: "Grocery", img: "groceries.jpg" },
  { label: "Sushi", img: "sushi.jpg" },
  { label: "Flowers", img: "flowers.jpg" },
  { label: "Chicken", img: "chicken.jpg" },
];
const CARD_H = 262;
export const FEED_TOP = 334; // first card's top, before scroll

const Thumb: React.FC<{ img: string; y?: number; style?: React.CSSProperties }> = ({ img, y = 50, style }) => (
  <Img
    src={staticFile(`skip/img/${img}`)}
    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${y}%`, ...style }}
  />
);

export const HomeScreen: React.FC<{
  scroll?: number; // px
  cardsIn?: number[]; // per-card arrival 0..1
  press?: { index: number; p: number }; // pressed card
  catIn?: number;
}> = ({ scroll = 0, cardsIn, press, catIn = 1 }) => (
  <div style={{ position: "absolute", inset: 0, background: brand.white }}>
    <div style={{ position: "absolute", left: 0, top: -scroll, width: SCREEN.w }}>
      {/* header */}
      <div style={{ position: "absolute", left: 20, top: 62, display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name="pin16" size={22} color={brand.orange} />
        <div>
          <div style={text(12, 600, brand.steel)}>Delivering to</div>
          <div style={text(17, 800)}>Portage Ave, Winnipeg</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 20,
          top: 64,
          width: 40,
          height: 40,
          borderRadius: 20,
          background: brand.cream,
        }}
      />
      {/* search pill */}
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 122,
          width: SCREEN.w - 40,
          height: 50,
          borderRadius: radius.button,
          background: brand.cream,
          display: "flex",
          alignItems: "center",
          paddingLeft: 18,
          gap: 10,
          boxSizing: "border-box",
        }}
      >
        <svg width={18} height={18} viewBox="0 0 24 24">
          <circle cx="10.5" cy="10.5" r="7" stroke={brand.charcoal} strokeWidth="2.4" fill="none" />
          <path d="M16 16l5 5" stroke={brand.charcoal} strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <div style={text(15, 500, brand.slate)}>What can we bring to your door?</div>
      </div>
      {/* categories */}
      <div style={{ position: "absolute", left: 20, top: 192, display: "flex", gap: 14 }}>
        {CATEGORIES.map((c, i) => {
          const p = iv(catIn, [i * 0.1, i * 0.1 + 0.5], [0, 1], ease.out);
          return (
            <div key={c.label} style={{ width: 62, textAlign: "center", translate: `${(1 - p) * 40}px 0`, opacity: p }}>
              <div style={{ width: 62, height: 62, borderRadius: 31, overflow: "hidden", background: brand.cream }}>
                <Thumb img={c.img} />
              </div>
              <div style={{ ...text(12.5, 700), marginTop: 7 }}>{c.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ ...text(21, 800), position: "absolute", left: 20, top: FEED_TOP - 38 }}>Local favourites</div>
      {RESTAURANTS.map((r, i) => {
        const a = cardsIn ? cardsIn[i] ?? 1 : 1;
        const pressed = press && press.index === i ? press.p : 0;
        return (
          <div
            key={r.name}
            style={{
              position: "absolute",
              left: 20,
              top: FEED_TOP + i * CARD_H + (1 - a) * 60,
              width: SCREEN.w - 40,
              opacity: a,
              scale: 1 - pressed * 0.035,
            }}
          >
            <div style={{ height: 196, borderRadius: radius.card, overflow: "hidden", background: brand.cream }}>
              <Thumb img={r.img} y={r.y} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 11 }}>
              <div style={text(17, 700)}>{r.name}</div>
              <div style={{ ...text(14, 700), display: "flex", alignItems: "center", gap: 4 }}>
                <Star size={14} color={brand.orange} />
                {r.rating}
              </div>
            </div>
            <div style={{ ...text(14, 500, brand.steel), marginTop: 3 }}>{r.time}</div>
          </div>
        );
      })}
    </div>
    <StatusBar bg={brand.white} />
    <TabBar />
  </div>
);

const TabBar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      bottom: 0,
      width: SCREEN.w,
      height: 86,
      background: brand.white,
      borderTop: `1px solid ${brand.creamDeep}`,
      display: "flex",
      justifyContent: "space-around",
      paddingTop: 12,
      boxSizing: "border-box",
    }}
  >
    {[
      { l: "Home", on: true },
      { l: "Search" },
      { l: "Orders" },
      { l: "Account" },
    ].map(({ l, on }) => (
      <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: l === "Home" ? 7 : 12,
            border: `2.4px solid ${on ? brand.orange : brand.steel}`,
            boxSizing: "border-box",
          }}
        />
        <div style={text(11, 700, on ? brand.orange : brand.steel)}>{l}</div>
      </div>
    ))}
  </div>
);

// ─── Live order tracker ────────────────────────────────────────────────────
// Stylised street map (Winnipeg-ish grid with the Assiniboine's curve).
const ROUTE = "M70 120 L70 210 L180 210 L180 330 L300 330 L300 420";
const ROUTE_LEN = getLength(ROUTE);

export const TrackerScreen: React.FC<{
  progress: number; // courier along route 0..1
  delivered: number; // 0..1 state flip
  sheetIn?: number;
  minutes?: number;
  restaurant?: { name: string; img: string };
}> = ({ progress, delivered, sheetIn = 1, minutes = 12, restaurant = RESTAURANTS[0] }) => {
  const pt = getPointAtLength(ROUTE, Math.max(0.01, progress * ROUTE_LEN)) ?? { x: 70, y: 120 };
  const steps = [1, 1, Math.min(1, progress * 1.2), delivered];
  return (
    <div style={{ position: "absolute", inset: 0, background: "#ebe7e0" }}>
      <svg width={SCREEN.w} height={560} style={{ position: "absolute", left: 0, top: 0 }}>
        <rect width={SCREEN.w} height={560} fill="#ebe7e0" />
        {/* parks */}
        <rect x={200} y={92} width={150} height={90} rx={10} fill="#d7e6cf" />
        <rect x={20} y={380} width={120} height={110} rx={10} fill="#d7e6cf" />
        {/* river */}
        <path d="M-20 520 C 80 470, 120 400, 230 400 S 360 470, 420 380" stroke="#c8dfe6" strokeWidth={34} fill="none" />
        {/* streets */}
        {[70, 180, 300].map((x) => (
          <line key={`v${x}`} x1={x} y1={-10} x2={x} y2={570} stroke="#fff" strokeWidth={14} />
        ))}
        {[120, 210, 330, 420].map((y) => (
          <line key={`h${y}`} x1={-10} y1={y} x2={400} y2={y} stroke="#fff" strokeWidth={14} />
        ))}
        {[25, 125, 240, 350].map((x) => (
          <line key={`s${x}`} x1={x} y1={-10} x2={x} y2={570} stroke="#f7f5f1" strokeWidth={6} />
        ))}
        {[165, 270, 375].map((y) => (
          <line key={`t${y}`} x1={-10} y1={y} x2={400} y2={y} stroke="#f7f5f1" strokeWidth={6} />
        ))}
        {/* route: full path faint, travelled part solid */}
        <path d={ROUTE} stroke="rgba(243,104,5,0.28)" strokeWidth={7} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path
          d={ROUTE}
          stroke={brand.orange}
          strokeWidth={7}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={`${progress * ROUTE_LEN} ${ROUTE_LEN}`}
        />
      </svg>
      {/* restaurant */}
      <div style={{ position: "absolute", left: 70 - 22, top: 120 - 44 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: brand.white,
            boxShadow: shadow.raised,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name="pinRestaurant" size={28} color={brand.orange} />
        </div>
      </div>
      {/* home */}
      <div
        style={{
          position: "absolute",
          left: 300 - 20,
          top: 420 - 20,
          width: 40,
          height: 40,
          borderRadius: 20,
          background: brand.charcoal,
          border: "4px solid #fff",
          boxSizing: "border-box",
          boxShadow: shadow.raised,
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24">
          <path d="M3 11L12 3l9 8v10h-6v-6H9v6H3z" fill="#fff" />
        </svg>
      </div>
      {/* courier */}
      <div
        style={{
          position: "absolute",
          left: pt.x - 25,
          top: pt.y - 25,
          width: 50,
          height: 50,
          borderRadius: 25,
          background: brand.orange,
          border: "4px solid #fff",
          boxSizing: "border-box",
          boxShadow: "0 6px 16px rgba(243,104,5,0.45)",
          display: "grid",
          placeItems: "center",
          scale: 1 - delivered * 0.15,
        }}
      >
        <Icon name="car" size={26} color="#fff" />
      </div>
      <StatusBar />
      {/* bottom sheet */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 486 + (1 - sheetIn) * 380,
          width: SCREEN.w,
          height: 400,
          background: brand.white,
          borderRadius: "26px 26px 0 0",
          boxShadow: "0 -8px 30px rgba(36,46,48,0.12)",
          padding: "16px 22px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: 40, height: 5, borderRadius: 3, background: brand.creamDeep, margin: "0 auto 18px" }} />
        <div style={{ position: "relative", height: 74 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - delivered, translate: `0 ${-delivered * 12}px` }}>
            <div style={text(14, 600, brand.steel)}>Arriving in</div>
            <div style={{ ...text(40, 800), letterSpacing: "-0.03em" }}>{minutes} min</div>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: delivered,
              translate: `0 ${(1 - delivered) * 14}px`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                background: brand.green,
                display: "grid",
                placeItems: "center",
                scale: mix(0.6, 1, delivered),
              }}
            >
              <svg width={24} height={24} viewBox="0 0 24 24">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ ...text(34, 800), letterSpacing: "-0.03em" }}>Delivered</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: brand.creamDeep, overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.max(0, Math.min(1, s)) * 100}%`,
                  height: "100%",
                  background: delivered > 0.5 ? brand.green : brand.orange,
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ ...text(16, 700), marginTop: 16, position: "relative", height: 22 }}>
          <span style={{ position: "absolute", opacity: 1 - delivered }}>Your courier is on the way</span>
          <span style={{ position: "absolute", opacity: delivered }}>Enjoy. That&apos;s the good part.</span>
        </div>
        <div style={{ height: 1, background: brand.creamDeep, margin: "20px 0 16px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, overflow: "hidden" }}>
            <Thumb img={restaurant.img} />
          </div>
          <div>
            <div style={text(16, 700)}>{restaurant.name}</div>
            <div style={text(14, 500, brand.steel)}>2 items</div>
          </div>
        </div>
      </div>
    </div>
  );
};
