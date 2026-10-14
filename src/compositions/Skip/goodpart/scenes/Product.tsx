import React from "react";
import { AbsoluteFill } from "remotion";
import { SLANT_TAN, brand, ease } from "../../brand";
import { MaskLine, SlantPanel, heading, iv, mix, useT } from "../../components/Common";
import { HomeScreen, Phone, RESTAURANTS, SCREEN, TrackerScreen } from "../../components/Phone";
import { SCENE, SUPERS_PRODUCT, T } from "../timeline";

const LEAN = 540 * SLANT_TAN;
const TAP_INDEX = 3; // Prairie Smash Burger
const CARD_STEP = 262;
const SCROLL = CARD_STEP * TAP_INDEX; // the tapped card ends up first in view

const Supers: React.FC<{ t: number }> = ({ t }) => (
  <>
    {SUPERS_PRODUCT.map((block, bi) => {
      if (t < block.lines[0].at - 0.05 || t > block.out + 0.5) return null;
      return (
        <div key={bi} style={{ position: "absolute", left: 140, top: 340, ...heading(128) }}>
          {block.lines.map((l, i) => (
            <MaskLine key={i} t={t} at={l.at} out={block.out + i * 0.05} dur={0.5}>
              <span style={{ color: l.accent ? brand.orange : brand.charcoal }}>{l.text}</span>
            </MaskLine>
          ))}
        </div>
      );
    })}
  </>
);

// Cream "skip" wipe in from the right, then the app: browse, tap, track.
export const Product: React.FC = () => {
  const t = useT(SCENE.product[0]);
  const w = iv(t, [T.toProduct - 0.04, T.toProduct + 0.34], [0, 1], ease.snap);
  const x = 1920 + LEAN * 2 - w * (1920 + LEAN * 4 + 60);

  // phone
  const rise = iv(t, [T.phoneIn, T.phoneIn + 0.85], [0, 1], ease.out);
  const focus = iv(t, [T.push, T.push + 1.2], [0, 1], ease.inOut);

  // home feed
  const catIn = iv(t, [T.phoneIn + 0.15, T.phoneIn + 0.9], [0, 1], ease.linear);
  const cardsIn = RESTAURANTS.map((_, i) => iv(t, [T.phoneIn + 0.2 + i * 0.08, T.phoneIn + 0.7 + i * 0.08], [0, 1], ease.out));
  const scroll = iv(t, [T.scrollA, T.scrollB], [0, SCROLL], ease.inOut);
  const press =
    iv(t, [T.tap - 0.06, T.tap + 0.06], [0, 1], ease.out) * (1 - iv(t, [T.tap + 0.1, T.tap + 0.26], [0, 1], ease.out));

  // push to the tracker (iOS-style: new screen slides over, old one parallaxes)
  const push = iv(t, [T.push, T.push + 0.45], [0, 1], ease.quint);
  const ride = iv(t, [T.rideA, T.rideB], [0.04, 1], ease.inOut);
  const delivered = iv(t, [T.delivered, T.delivered + 0.3], [0, 1], ease.out);
  const sheetIn = iv(t, [T.push + 0.15, T.push + 0.7], [0, 1], ease.out);
  const minutes = Math.max(1, Math.round(12 - ride * 11));

  return (
    <AbsoluteFill>
      <SlantPanel x={x} width={4200} color={brand.cream}>
        <div style={{ position: "absolute", left: -(x - LEAN), top: 0, width: 1920, height: 1080 }}>
          <Supers t={t} />
          <Phone
            style={{
              left: 1400 - (SCREEN.w + 26) / 2,
              top: 540 - (SCREEN.h + 26) / 2,
              translate: `0 ${(1 - rise) * 1000}px`,
              rotate: `${(1 - rise) * 6}deg`,
              scale: mix(1.12, 1.17, focus),
            }}
          >
            <div style={{ position: "absolute", inset: 0, translate: `${-push * 120}px 0` }}>
              <HomeScreen scroll={scroll} catIn={catIn} cardsIn={cardsIn} press={{ index: TAP_INDEX, p: press }} />
            </div>
            {push > 0 ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  translate: `${(1 - push) * SCREEN.w}px 0`,
                  boxShadow: "-12px 0 30px rgba(0,0,0,0.12)",
                }}
              >
                <TrackerScreen
                  progress={ride}
                  delivered={delivered}
                  sheetIn={sheetIn}
                  minutes={minutes}
                  restaurant={RESTAURANTS[TAP_INDEX]}
                />
              </div>
            ) : null}
          </Phone>
        </div>
      </SlantPanel>
    </AbsoluteFill>
  );
};
