import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand } from "./brand";
import { Captions, Grain } from "./components/Common";
import { CTA, CLICK } from "./scenes/CTA";
import { Open } from "./scenes/Open";
import { Problem } from "./scenes/Problem";
import { Product } from "./scenes/Product";
import { Reveal } from "./scenes/Reveal";
import { Trust } from "./scenes/Trust";
import { DROP1, DROP2, END, FPS, SCENE, SPEECH, VO_AT, sec } from "./timeline";

// Peak offset (s) of each SFX file, measured from the audio — used so the
// loudest moment of a sound lands exactly on its visual event.
const PEAK: Record<string, number> = {
  "bass-hit": 0.08, "bass-hit-future": 0.17, "whoosh-fast": 0.71, "whoosh-cinematic": 1.08,
  "sweep-small": 0.33, "sweep-short": 0.45, "whoosh-air": 0.71, "swoosh-fast": 0.11,
  "tech-slide": 0.17, "pop-whoosh": 0.02, "pop-long": 0.03, "pop-message": 0.05, "pop-dry": 0.13,
  "click-tone": 0, "click-device": 0, "click-classic": 0.13, select: 0.12, "tap-switch": 0,
  "coins-clink": 0.08, "coins-touch": 0.24, "chime-positive": 0.18, "chime-confirm": 0.19,
  "chime-correct": 0.02, "notify-hint": 0.41, "chime-page": 0.3, "reverse-swell": 0.96,
  "reverse-air": 0.61, "whoosh-deep-impact": 0.55,
};
const WAV = new Set(["reverse-swell", "reverse-air"]);
// Master gains — keeps the summed mix under -1 dBFS with the voice on top
const SFX_GAIN = 0.62;
const VO_GAIN = 1;

// [event time (s), sfx, volume]
const CUES: [number, string, number][] = [
  // Open — banknote panels slam in, then split away
  [0.4, "whoosh-air", 0.5],
  [0.95, "bass-hit-future", 0.3],
  [3.1, "swoosh-fast", 0.5],
  [3.15, "sweep-small", 0.35],
  // Problem — every account lands on the word that names it
  [3.1, "pop-long", 0.42],
  [4.98, "pop-long", 0.42],
  [7.08, "pop-long", 0.42],
  [7.95, "sweep-short", 0.65], // the credit card flips face-down
  [8.22, "click-classic", 0.45],
  [8.58, "pop-dry", 0.4],
  [8.7, "pop-dry", 0.36],
  [8.82, "pop-dry", 0.32],
  [9.8, "whoosh-cinematic", 0.5], // cards scatter
  [9.62, "tech-slide", 0.7], // transaction stream
  [10.2, "pop-whoosh", 0.3],
  [10.84, "pop-whoosh", 0.3],
  [11.32, "pop-whoosh", 0.4],
  [11.95, "chime-page", 0.35], // the spark appears
  [12.12, "reverse-air", 0.45],
  [DROP1, "reverse-swell", 0.55], // implode → swell into the drop
  // Reveal — theme sweep to light
  [DROP1 + 0.02, "bass-hit", 0.6],
  [DROP1 + 0.06, "whoosh-deep-impact", 0.18],
  [DROP1 + 0.12, "sweep-small", 0.4],
  [13.2, "click-tone", 0.45],
  [14.45, "sweep-short", 0.4], // the name splits
  [14.72, "select", 0.22], // "my"
  [15.06, "select", 0.22], // "money"
  [15.45, "coins-touch", 0.35],
  [15.95, "whoosh-fast", 0.45],
  // Product — accounts orbit in
  [16.0, "pop-long", 0.45],
  ...[16.47, 16.75, 17.83, 18.53, 19.85, 20.71].flatMap(
    (at): [number, string, number][] => [
      [at - 0.22, "swoosh-fast", 0.16],
      [at - 0.14, "pop-message", 0.3],
    ],
  ),
  [22.05, "whoosh-cinematic", 0.35], // converge
  [22.33, "bass-hit-future", 0.22], // the one clear picture
  [23.0, "chime-confirm", 0.3],
  [23.05, "coins-clink", 0.3],
  [23.3, "tech-slide", 0.45],
  [23.8, "whoosh-air", 0.22], // camera → budget
  [24.7, "pop-message", 0.45], // toast
  [24.75, "notify-hint", 0.9],
  [25.24, "click-tone", 0.25], // heads-up sent
  [26.05, "sweep-short", 0.2],
  [26.5, "whoosh-air", 0.18], // camera → goals
  [28.12, "chime-positive", 0.4], // on track — rings out on the lift
  // Trust — dark sweep on the second lift
  [DROP2 + 0.02, "bass-hit", 0.55],
  [DROP2 + 0.12, "sweep-small", 0.38],
  [28.45, "pop-long", 0.35],
  ...[28.83, 30.15, 31.55].flatMap((at): [number, string, number][] => [
    [at - 0.16, "click-classic", 0.38],
  ]),
  ...[0, 1, 2, 3, 4].map((i): [number, string, number] => [29.5 + i * 0.07, "click-tone", 0.2]),
  [32.34, "tap-switch", 0.45], // EN → FR, in the gap after "français,"
  // CTA — hero reprise
  [33.02, "whoosh-air", 0.45],
  [33.9, "bass-hit-future", 0.3],
  [33.12, "sweep-short", 0.2],
  [33.95, "click-tone", 0.3],
  [35.95, "pop-long", 0.3],
  [36.3, "sweep-short", 0.15],
  [CLICK, "click-classic", 0.6],
  [CLICK + 0.1, "chime-confirm", 0.5],
  [37.6, "whoosh-cinematic", 0.3],
  [37.54, "bass-hit", 0.4], // end-card lands on the beat
  [37.62, "chime-positive", 0.5],
];

const VO_FILES: [keyof typeof VO_AT, string, number?][] = [
  ["a1", "a1"], ["a2", "a2"], ["a3", "a3"], ["b1", "b1"], ["b1b", "b1b"], ["b2", "b2"],
  ["b3", "b3"], ["b4", "b4"], ["c1", "c1"], ["brand", "b1", 0.38], ["c2b", "c2b"],
];

const musicVolume = (f: number) => {
  const t = f / FPS;
  let duck = 0;
  for (const [a, b] of SPEECH) {
    duck = Math.max(duck, interpolate(t, [a - 0.2, a, b, b + 0.35], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  // the brand name gets extra room
  for (const [a, b] of [[12.75, 13.35], [33.26, 33.82]]) {
    duck = Math.max(duck, interpolate(t, [a - 0.15, a, b, b + 0.3], [0, 1.45, 1.45, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  const base = t < DROP1 ? 0.62 : 0.5;
  const fadeIn = interpolate(t, [0, 0.08], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(t, [37.5, END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return base * (1 - Math.min(duck * 0.72, 0.86)) * fadeIn * fadeOut;
};

const SoundTrack: React.FC = () => (
  <>
    <Audio src={staticFile("owomi/music.mp3")} volume={musicVolume} />
    {VO_FILES.map(([at, file, trim]) => (
      <Sequence key={at} from={sec(VO_AT[at])} layout="none" name={`VO ${at}`}>
        <Audio src={staticFile(`owomi/vo/${file}.wav`)} trimBefore={trim ? sec(trim) : undefined} volume={VO_GAIN} />
      </Sequence>
    ))}
    {CUES.map(([t, name, volume], i) => {
      const from = sec(Math.max(0, t - PEAK[name]));
      const gain = volume * SFX_GAIN;
      return (
        <Sequence key={i} from={from} layout="none" name={`sfx ${name}`}>
          <Audio src={staticFile(`owomi/sfx/${name}.${WAV.has(name) ? "wav" : "mp3"}`)} volume={gain} />
        </Sequence>
      );
    })}
  </>
);

const Scene: React.FC<{ win: readonly [number, number]; name: string; children: React.ReactNode }> = ({
  win,
  name,
  children,
}) => (
  <Sequence from={sec(win[0])} durationInFrames={sec(win[1] - win[0])} name={name}>
    {children}
  </Sequence>
);

const CaptionLayer: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return <Captions t={t} darkAt={(x) => x < DROP1 || x >= DROP2} />;
};

export const OwomiLaunch: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.ink }}>
    <Scene win={SCENE.problem} name="Problem">
      <Problem />
    </Scene>
    <Scene win={SCENE.open} name="Open">
      <Open />
    </Scene>
    <Scene win={SCENE.product} name="Product">
      <Product />
    </Scene>
    <Scene win={SCENE.reveal} name="Reveal">
      <Reveal />
    </Scene>
    <Scene win={SCENE.trust} name="Trust">
      <Trust />
    </Scene>
    <Scene win={SCENE.cta} name="CTA">
      <CTA />
    </Scene>
    <CaptionLayer />
    <Grain opacity={0.05} />
    <SoundTrack />
  </AbsoluteFill>
);
