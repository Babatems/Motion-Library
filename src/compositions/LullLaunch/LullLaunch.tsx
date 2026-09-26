import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { FilmLook } from "./components/FilmLook";
import { NOTIFICATIONS, cardDelay } from "./notifications";
import { CTA, CLICK } from "./scenes/CTA";
import { Intro } from "./scenes/Intro";
import { Problem } from "./scenes/Problem";
import { Solution } from "./scenes/Solution";
import { colors, SCENES, TRANSITIONS } from "./theme";
import { iris, whipPan, zoomBlur } from "./transitions";

// Absolute start frame of each scene on the master timeline
const START = {
  problem: SCENES.intro - TRANSITIONS.introToProblem,
  solution: SCENES.intro + SCENES.problem - TRANSITIONS.introToProblem - TRANSITIONS.problemToSolution,
  cta:
    SCENES.intro +
    SCENES.problem +
    SCENES.solution -
    TRANSITIONS.introToProblem -
    TRANSITIONS.problemToSolution -
    TRANSITIONS.solutionToCta,
};

const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 1 }) => (
  <Sequence from={at} layout="none" name={`sfx ${src}`}>
    <Audio src={staticFile(`sfx/${src}`)} volume={volume} />
  </Sequence>
);

const SoundDesign: React.FC = () => (
  <>
    <Audio src={staticFile("sfx/music-bed.wav")} volume={0.6} />
    {/* Intro */}
    <Sfx at={3} src="glass_001.ogg" volume={0.5} />
    <Sfx at={16} src="whoosh.wav" volume={0.35} />
    <Sfx at={40} src="whoosh.wav" volume={0.25} />
    {/* Into problem */}
    <Sfx at={START.problem - 2} src="whoosh.wav" volume={0.55} />
    {NOTIFICATIONS.map((_, i) => (
      <Sfx
        key={i}
        at={START.problem + cardDelay(i) - 3}
        src={i % 2 ? "drop_003.ogg" : "drop_002.ogg"}
        volume={0.28 + i * 0.02}
      />
    ))}
    <Sfx at={START.problem + 48} src="switch.wav" volume={0.3} />
    <Sfx at={START.problem + 84} src="shutter-modern.wav" volume={0.25} />
    {[0, 4, 8, 12, 16, 20, 25, 31].map((o) => (
      <Sfx key={o} at={START.problem + 90 + o} src="tick_001.ogg" volume={0.35} />
    ))}
    {/* Into solution */}
    <Sfx at={START.solution - 4} src="whip.wav" volume={0.5} />
    <Sfx at={START.solution + 12} src="whoosh.wav" volume={0.35} />
    <Sfx at={START.solution + 25} src="glass_001.ogg" volume={0.7} />
    <Sfx at={START.solution + 44} src="whoosh.wav" volume={0.25} />
    {[0, 1, 2].map((i) => (
      <Sfx key={i} at={START.solution + 78 + i * 6} src="click_003.ogg" volume={0.35} />
    ))}
    <Sfx at={START.solution + 104} src="toggle_002.ogg" volume={0.6} />
    {/* Into CTA */}
    <Sfx at={START.cta - 6} src="whoosh.wav" volume={0.45} />
    <Sfx at={START.cta + CLICK - 1} src="mouse-click.wav" volume={0.6} />
    <Sfx at={START.cta + CLICK + 6} src="confirmation_002.ogg" volume={0.5} />
  </>
);

export const LullLaunch: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Intro" durationInFrames={SCENES.intro}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={zoomBlur()}
          timing={linearTiming({ durationInFrames: TRANSITIONS.introToProblem })}
        />
        <TransitionSeries.Sequence name="Problem" durationInFrames={SCENES.problem}>
          <Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={whipPan()}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITIONS.problemToSolution,
          })}
        />
        <TransitionSeries.Sequence name="Solution" durationInFrames={SCENES.solution}>
          <Solution />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={iris()}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: TRANSITIONS.solutionToCta,
          })}
        />
        <TransitionSeries.Sequence name="CTA" durationInFrames={SCENES.cta}>
          <CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <FilmLook />
      <SoundDesign />
    </AbsoluteFill>
  );
};
