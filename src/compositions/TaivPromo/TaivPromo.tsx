import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, clamp } from "./brand";
import { Grain, Supers, Watermark } from "./components/Common";
import { Control, COIN0, DROP_AT, EXIT, GRAB as C_GRAB, HOVER, coinAt, flipAt } from "./scenes/Control";
import { Detect, LOCK, SCAN, SWAP1, SWAP2 } from "./scenes/Detect";
import { CLICK, CTA_IN, EndCard, LAND, ZOOM } from "./scenes/EndCard";
import { DRAG, GRAB, HANDLE_IN, Hook, SWAP_TIMES, ZOOM_AT } from "./scenes/Hook";
import { Proof } from "./scenes/Proof";
import { Reveal } from "./scenes/Reveal";
import { DROP, END, FPS, MUSIC_START, SCENE, SPEECH, VO_AT, W, bar, sec } from "./timeline";

// Peak offset (s) of each SFX file, measured from the audio — the cue starts
// at `t - PEAK` so the loudest moment lands exactly on its visual event.
// Owó-mi library files keep their measured peaks; the new Mixkit files
// (Mixkit Sound Effects Free License) were measured the same way.
const PEAK: Record<string, number> = {
  "bass-hit": 0.08, "bass-hit-future": 0.17, "whoosh-fast": 0.71, "whoosh-cinematic": 1.08,
  "sweep-small": 0.33, "sweep-short": 0.45, "whoosh-air": 0.71, "swoosh-fast": 0.11,
  "tech-slide": 0.17, "pop-long": 0.03, "pop-message": 0.05, "pop-dry": 0.13,
  "click-tone": 0, "click-device": 0, "click-classic": 0.13, select: 0.12, "tap-switch": 0,
  "coins-touch": 0.24, "chime-positive": 0.18, "chime-confirm": 0.19, "notify-hint": 0.41,
  "reverse-swell": 0.96, "reverse-air": 0.61, "whoosh-deep-impact": 0.55,
  "glitch-small": 0.39, "data-scan": 0.72, "glitch-confirm": 0.01, "remote-click": 0.12,
};
const WAV = new Set(["reverse-swell", "reverse-air", "glitch-small", "data-scan", "glitch-confirm", "remote-click"]);
// Master gains — keep the summed mix under -1 dBFS with the voice on top
const SFX_GAIN = 0.62;
const VO_GAIN = 1;

// [event time (s), sfx, volume]
const CUES: [number, string, number][] = [
  // Hook — a commercial break in a real bar
  ...[0, 1, 2].map((i): [number, string, number] => [W.break1 + 0.5 + i * 0.12, "select", 0.14]), // brackets lock
  [HANDLE_IN + 0.08, "sweep-small", 0.14], // compare handle
  [GRAB, "click-classic", 0.4],
  [DRAG[0] + 0.12, "tech-slide", 0.28],
  ...SWAP_TIMES.map((at): [number, string, number] => [at, "remote-click", 0.3]), // each TV flips
  [DRAG[1] + 0.02, "click-tone", 0.18],
  [ZOOM_AT + 0.5, "whoosh-cinematic", 0.42], // punch into the screen
  [DROP, "reverse-swell", 0.5],
  // Reveal — the drop
  [DROP + 0.01, "bass-hit", 0.62],
  [DROP + 0.04, "whoosh-deep-impact", 0.2],
  [DROP + 0.1, "sweep-small", 0.3],
  [W.taiv + 0.62, "sweep-short", 0.16], // shine, after "Taiv."
  [7.62, "whoosh-air", 0.3],
  // Detect — the AI catches the break
  [SCAN[0] + 0.72, "data-scan", 0.2],
  [LOCK, "glitch-confirm", 0.32],
  [SWAP1 + 0.05, "whoosh-fast", 0.26],
  [SWAP1 + 0.2, "pop-message", 0.24],
  [SWAP2 + 0.02, "swoosh-fast", 0.13], // kept light — it sits under "instead"
  [SCENE.control[0] + 0.08, "swoosh-fast", 0.18], // glide into the dashboard, after "instead."
  // Control — drag a promo onto every screen, earn from the breaks
  [HOVER, "select", 0.16],
  [C_GRAB, "click-classic", 0.42],
  [C_GRAB + 0.14, "swoosh-fast", 0.14],
  [DROP_AT, "click-device", 0.3],
  ...[0, 1, 2, 3, 4, 5].map((i): [number, string, number] => [flipAt(i) + 0.1, "pop-message", 0.12]),
  [DROP_AT + 0.45, "notify-hint", 0.42], // toast
  ...[0, 2, 4].map((i): [number, string, number] => [coinAt(i) + 0.45, "coins-touch", 0.11]), // light — under "every break"
  [COIN0 + 1.32, "chime-confirm", 0.26],
  [EXIT + 0.2, "whoosh-cinematic", 0.3],
  // Proof
  [W.seven - 0.05, "bass-hit-future", 0.32],
  [W.ninety - 0.22, "sweep-short", 0.2],
  [LAND, "reverse-air", 0.34],
  // End card — lands on the downbeat
  [LAND + 0.01, "bass-hit", 0.52],
  [LAND + 0.04, "whoosh-deep-impact", 0.14],
  [CTA_IN + 0.05, "pop-long", 0.26],
  [CLICK, "click-classic", 0.55],
  [CLICK + 0.08, "chime-confirm", 0.4],
  [bar(9), "bass-hit-future", 0.24],
  // Outro — push into "Get started"
  [ZOOM[0] + 0.02, "sweep-small", 0.18],
  [ZOOM[0] + 0.78, "whoosh-cinematic", 0.42], // peaks as the push is fastest
  [ZOOM[1] - 0.05, "bass-hit-future", 0.2], // soft landing as the violet fills the frame
];

const VO_FILES = Object.keys(VO_AT) as (keyof typeof VO_AT)[];

const musicVolume = (f: number) => {
  const t = f / FPS;
  let duck = 0;
  for (const [a, b] of SPEECH) {
    duck = Math.max(duck, interpolate(t, [a - 0.15, a, b, b + 0.3], [0, 1, 1, 0], clamp));
  }
  // the brand name gets extra room
  for (const [a, b] of [[W.taiv - 0.05, W.taiv + 0.5], [W.endTaiv - 0.05, W.endTaiv + 0.5]]) {
    duck = Math.max(duck, interpolate(t, [a - 0.1, a, b, b + 0.25], [0, 1.4, 1.4, 0], clamp));
  }
  const base = t < DROP - 0.05 ? 1 : 0.75;
  const fadeIn = interpolate(t, [0, 0.4], [0, 1], clamp);
  const fadeOut = interpolate(t, [ZOOM[0], END - 0.05], [1, 0], clamp); // music leaves with the outro push
  return base * (1 - Math.min(duck * 0.58, 0.7)) * fadeIn * fadeOut;
};

// Bar room tone under the opening — pulled away as we punch into the screen
const ambienceVolume = (f: number) => {
  const t = f / FPS;
  return 0.32 * interpolate(t, [0, 0.4, ZOOM_AT, DROP - 0.05], [0, 1, 1, 0], clamp);
};

const SoundTrack: React.FC = () => (
  <>
    <Audio src={staticFile("taiv/music.mp3")} trimBefore={sec(MUSIC_START)} volume={musicVolume} />
    <Audio src={staticFile("taiv/sfx/bar-ambience.wav")} volume={ambienceVolume} />
    {VO_FILES.map((k) => (
      <Sequence key={k} from={sec(VO_AT[k])} layout="none" name={`VO ${k}`}>
        <Audio src={staticFile(`taiv/vo/${k}.wav`)} volume={VO_GAIN} />
      </Sequence>
    ))}
    {CUES.map(([t, name, volume], i) => {
      const gain = volume * SFX_GAIN;
      return (
        <Sequence key={i} from={sec(Math.max(0, t - PEAK[name]))} layout="none" name={`sfx ${name}`}>
          <Audio src={staticFile(`taiv/sfx/${name}.${WAV.has(name) ? "wav" : "mp3"}`)} volume={gain} />
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

const SuperLayer: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return <Supers t={t} />;
};

export const TaivPromo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.void }}>
    <Scene win={SCENE.hook} name="Hook">
      <Hook />
    </Scene>
    <Scene win={SCENE.reveal} name="Reveal">
      <Reveal />
    </Scene>
    <Scene win={SCENE.detect} name="Detect">
      <Detect />
    </Scene>
    <Scene win={SCENE.control} name="Control">
      <Control />
    </Scene>
    <Scene win={SCENE.proof} name="Proof">
      <Proof />
    </Scene>
    <Scene win={SCENE.end} name="End card">
      <EndCard />
    </Scene>
    <SuperLayer />
    <Grain opacity={0.045} />
    <Watermark />
    <SoundTrack />
  </AbsoluteFill>
);
