import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, clamp } from "../brand";
import { Grain, Watermark } from "../components/Common";
import { PEAK, sfxFile } from "../sfx";
import { Canada } from "./scenes/Canada";
import { EndCard } from "./scenes/EndCard";
import { Hook } from "./scenes/Hook";
import { Product } from "./scenes/Product";
import { Reveal } from "./scenes/Reveal";
import { DROP, END, FPS, MUSIC_START, SCENE, SPEECH, T, VO_AT, VoKey, W, sec } from "./timeline";

const SFX_GAIN = 0.7;
const VO_GAIN = 1;

// [event time (s), sfx, volume]. Nothing lands on a spoken word: cues sit in
// the gaps before or after the phrases.
const CUES: [number, string, number][] = [
  // Hook
  [T.skipBtn + 0.02, "pop-dry", 0.3], // skip button, in the gap after "around"
  [T.press, "click-classic", 0.55],
  [T.press + 0.02, "tap-switch", 0.2],
  [T.strike + 0.14, "sweep-short", 0.22],
  [T.linesOut + 0.2, "swoosh-fast", 0.3],
  [DROP - 0.02, "reverse-air", 0.24],
  // Drop: the mark, with the sonic logo (tyres speeding away)
  [DROP + 0.01, "bass-hit", 0.24],
  [DROP + 0.08, "car-drive-by", 0.34],
  [DROP + 0.22, "bubble-pop", 0.32], // the leaf
  [DROP + 0.32, "pop-dry", 0.12],
  [DROP + 0.42, "pop-dry", 0.09],
  // Product
  [T.toProduct + 0.12, "swoosh-fast", 0.22],
  [T.tap, "tap-switch", 0.32],
  [T.push + 0.1, "swoosh-fast", 0.14],
  [T.delivered + 0.02, "chime-positive", 0.34],
  // Reach
  [T.toCanada + 0.18, "speeding-swoosh", 0.28],
  [W.canada + 0.62, "pop-dry", 0.16], // leaf, after "Canada."
  // End card on the bar downbeat
  [T.endLand - 0.12, "whoosh-fast", 0.26],
  [T.endLand, "bass-hit", 0.42],
];

const musicVolume = (f: number) => {
  const t = f / FPS;
  let duck = 0;
  for (const [a, b] of SPEECH) {
    duck = Math.max(duck, interpolate(t, [a - 0.12, a, b, b + 0.28], [0, 1, 1, 0], clamp));
  }
  // the brand name at the end gets extra room
  duck = Math.max(duck, interpolate(t, [W.endSkip - 0.1, W.endSkip, W.endSkip + 0.45, W.endSkip + 0.7], [0, 1.25, 1.25, 0], clamp));
  const base = t < DROP - 0.05 ? 0.78 : 0.62;
  const fadeIn = interpolate(t, [0, 0.25], [0, 1], clamp);
  const fadeOut = interpolate(t, [19.55, END], [1, 0], clamp);
  return base * (1 - Math.min(duck * 0.6, 0.72)) * fadeIn * fadeOut;
};

const VO_FILES = Object.keys(VO_AT) as VoKey[];

const SoundTrack: React.FC = () => (
  <>
    <Audio src={staticFile("skip/music-goodpart.mp3")} trimBefore={sec(MUSIC_START)} volume={musicVolume} />
    {VO_FILES.map((k) => (
      <Sequence key={k} from={sec(VO_AT[k])} layout="none" name={`VO ${k}`}>
        <Audio src={staticFile(`skip/vo/${k}.wav`)} volume={VO_GAIN} />
      </Sequence>
    ))}
    {CUES.map(([t, name, volume], i) => {
      const gain = volume * SFX_GAIN;
      return (
        <Sequence key={i} from={sec(Math.max(0, t - PEAK[name]))} layout="none" name={`sfx ${name}`}>
          <Audio src={staticFile(sfxFile(name))} volume={gain} />
        </Sequence>
      );
    })}
  </>
);

const Scene: React.FC<{ win: readonly [number, number]; name: string; children: React.ReactNode }> = ({ win, name, children }) => (
  <Sequence from={sec(win[0])} durationInFrames={sec(win[1] - win[0])} name={name}>
    {children}
  </Sequence>
);

// Light on orange and over the photo panel, dark on cream; blended across each wipe
const WatermarkLayer: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const dark = interpolate(
    t,
    [DROP - 0.1, DROP, T.toProduct, T.toProduct + 0.25, T.toCanada + 0.15, T.toCanada + 0.45],
    [1, 0, 0, 1, 1, 0],
    clamp,
  );
  return <Watermark dark={dark} />;
};

export const SkipGoodPart: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.cream }}>
    <Scene win={SCENE.hook} name="Hook">
      <Hook />
    </Scene>
    <Scene win={SCENE.reveal} name="Reveal">
      <Reveal />
    </Scene>
    <Scene win={SCENE.product} name="Product">
      <Product />
    </Scene>
    <Scene win={SCENE.canada} name="Canada">
      <Canada />
    </Scene>
    <Scene win={SCENE.end} name="End card">
      <EndCard />
    </Scene>
    <Grain opacity={0.03} />
    <WatermarkLayer />
    <SoundTrack />
  </AbsoluteFill>
);
