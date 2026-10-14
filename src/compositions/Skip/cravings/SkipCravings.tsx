import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, clamp } from "../brand";
import { Grain, Watermark } from "../components/Common";
import { PEAK, sfxFile } from "../sfx";
import { EndCard } from "./EndCard";
import { Montage } from "./Montage";
import { OrderCard } from "./OrderCard";
import { BASS, CRAVINGS, END, FPS, MUSIC_START, T, sec } from "./timeline";

const SFX_GAIN = 1;

// [event time (s), sfx, volume]
const CUES: [number, string, number][] = [
  [T.craving + 0.1, "swoosh-fast", 0.16],
  [T.something + 0.04, "pop-dry", 0.22],
  // bass entry: the window slams in
  [BASS, "bass-hit", 0.26],
  [BASS + 0.02, "zoom-impact", 0.24],
  // a tick on every swap, alternating so it doesn't machine-gun
  ...CRAVINGS.slice(1).map((c, i): [number, string, number] => [c.at + 0.02, i % 2 ? "tech-select" : "click-tone", 0.2]),
  ...CRAVINGS.slice(1).filter((_, i) => i % 2 === 1).map((c): [number, string, number] => [c.at + 0.1, "swoosh-fast", 0.09]),
  // the window swallows the frame
  [T.expand + 0.22, "speeding-swoosh", 0.3],
  [T.card + 0.04, "pop-message", 0.4],
  [T.delivered + 0.02, "chime-positive", 0.32],
  // sonic logo: tyres speeding away through the skip wipe
  [T.wipe + 0.16, "car-drive-by", 0.42],
  [T.logo + 0.22, "bubble-pop", 0.34], // the leaf
  [T.logo + 0.32, "pop-dry", 0.12],
  [T.logo + 0.44, "pop-dry", 0.09],
  [T.line + 0.08, "swoosh-fast", 0.1],
  [T.outro, "bass-hit-future", 0.2],
];

const musicVolume = (f: number) => {
  const t = f / FPS;
  return interpolate(t, [0, 0.12, T.outro + 0.05, END], [0, 0.72, 0.72, 0], clamp);
};

const SoundTrack: React.FC = () => (
  <>
    <Audio src={staticFile("skip/music-cravings.wav")} trimBefore={sec(MUSIC_START)} volume={musicVolume} />
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

const WatermarkLayer: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return <Watermark dark={interpolate(t, [T.wipe, T.logo], [0, 1], clamp)} />;
};

export const SkipCravings: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.orange }}>
    <Sequence durationInFrames={sec(T.logo + 0.1)} name="Montage">
      <Montage />
    </Sequence>
    <Sequence from={sec(T.card - 0.2)} durationInFrames={sec(T.logo + 0.1 - (T.card - 0.2))} name="Order card">
      <OrderCard start={T.card - 0.2} />
    </Sequence>
    <Sequence from={sec(T.wipe - 0.05)} name="End card">
      <EndCard start={T.wipe - 0.05} />
    </Sequence>
    <Grain opacity={0.03} />
    <WatermarkLayer />
    <SoundTrack />
  </AbsoluteFill>
);
