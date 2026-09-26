import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { clamp } from "./theme";

type NoProps = Record<string, never>;

// Push-through: outgoing scene flies past the camera, incoming settles in.
const ZoomBlur: React.FC<TransitionPresentationComponentProps<NoProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const exiting = presentationDirection === "exiting";
  return (
    <AbsoluteFill
      style={
        exiting
          ? {
              scale: interpolate(p, [0, 1], [1, 1.6], { ...clamp, output: "perceptual-scale" }),
              filter: `blur(${interpolate(p, [0, 1], [0, 24], clamp)}px)`,
              opacity: interpolate(p, [0.3, 1], [1, 0], clamp),
            }
          : {
              scale: interpolate(p, [0, 1], [0.82, 1], { ...clamp, output: "perceptual-scale" }),
              filter: `blur(${interpolate(p, [0, 1], [18, 0], clamp)}px)`,
              opacity: interpolate(p, [0, 0.5], [0, 1], clamp),
            }
      }
    >
      {children}
    </AbsoluteFill>
  );
};

export const zoomBlur = (): TransitionPresentation<NoProps> => ({
  component: ZoomBlur,
  props: {},
});

// Whip pan: both scenes travel horizontally with a directional (x-only)
// motion blur that peaks mid-transition.
const WhipPan: React.FC<TransitionPresentationComponentProps<NoProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const exiting = presentationDirection === "exiting";
  const id = `whip-${presentationDirection}`;
  const blur = Math.sin(p * Math.PI) * 90;
  return (
    <AbsoluteFill
      style={{
        translate: exiting
          ? `${interpolate(p, [0, 1], [0, -1920], clamp)}px 0px`
          : `${interpolate(p, [0, 1], [1920, 0], clamp)}px 0px`,
        filter: `url(#${id})`,
      }}
    >
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-20%" y="0%" width="140%" height="100%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
      {children}
    </AbsoluteFill>
  );
};

export const whipPan = (): TransitionPresentation<NoProps> => ({
  component: WhipPan,
  props: {},
});

// Iris: incoming scene is revealed through an expanding circle,
// echoing the Lull mark. Outgoing scene recedes.
const Iris: React.FC<TransitionPresentationComponentProps<NoProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const exiting = presentationDirection === "exiting";
  if (exiting) {
    return (
      <AbsoluteFill
        style={{
          scale: interpolate(p, [0, 1], [1, 0.9], clamp),
          filter: `brightness(${interpolate(p, [0, 1], [1, 0.35], clamp)})`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${interpolate(p, [0, 1], [0, 72], clamp)}% at 50% 50%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const iris = (): TransitionPresentation<NoProps> => ({
  component: Iris,
  props: {},
});
