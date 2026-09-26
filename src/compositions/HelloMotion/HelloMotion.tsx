import { loadFont } from "@remotion/google-fonts/Inter";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import {
  linearTiming,
  springTiming,
  TransitionSeries,
} from "@remotion/transitions";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

const { fontFamily } = loadFont("normal", { weights: ["400", "800"] });

export const helloMotionSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  accent: zColor(),
});

type Props = z.infer<typeof helloMotionSchema>;

const Title: React.FC<Props> = ({ title, subtitle, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="items-center justify-center bg-neutral-950 text-white"
      style={{ fontFamily }}
    >
      <h1
        className="text-8xl font-extrabold"
        style={{ transform: `scale(${pop})`, color: accent }}
      >
        {title}
      </h1>
      <p className="mt-6 text-4xl" style={{ opacity: subtitleOpacity }}>
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};

const Outro: React.FC<Pick<Props, "accent">> = ({ accent }) => (
  <AbsoluteFill
    className="items-center justify-center text-6xl font-extrabold text-neutral-950"
    style={{ fontFamily, backgroundColor: accent }}
  >
    Let's make videos.
  </AbsoluteFill>
);

export const HelloMotion: React.FC<Props> = (props) => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={75}>
        <Title {...props} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({
          config: { damping: 200 },
          durationInFrames: 20,
        })}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <Outro accent={props.accent} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />
      <TransitionSeries.Sequence durationInFrames={30}>
        <AbsoluteFill className="bg-neutral-950" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
