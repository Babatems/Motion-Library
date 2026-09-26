import { loadFont as loadDisplay } from "@remotion/google-fonts/InterTight";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Easing } from "remotion";

export const fonts = {
  display: loadDisplay("normal", {
    weights: ["500", "600", "700"],
    subsets: ["latin"],
  }).fontFamily,
  body: loadBody("normal", { weights: ["400", "500", "600"], subsets: ["latin"] })
    .fontFamily,
  mono: loadMono("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily,
};

export const colors = {
  bg: "#07070A",
  text: "#F5F5F7",
  muted: "#9A9AA5",
  line: "rgba(255,255,255,0.10)",
  accentA: "#A78BFA",
  accentB: "#5EEAD4",
  danger: "#FF5A5F",
};

export const accentGradient = `linear-gradient(100deg, ${colors.accentA} 0%, #93C5FD 50%, ${colors.accentB} 100%)`;

// Easings shared across scenes so the whole piece moves with one "voice".
export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  spring: Easing.spring({ damping: 200 }),
  bouncy: Easing.spring({ damping: 14, stiffness: 180 }),
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Scene lengths (frames @ 30fps). Total = sum(scenes) - sum(transitions).
export const SCENES = {
  intro: 84,
  problem: 150,
  solution: 170,
  cta: 85,
};
export const TRANSITIONS = {
  introToProblem: 14,
  problemToSolution: 12,
  solutionToCta: 16,
};
export const TOTAL_FRAMES =
  SCENES.intro +
  SCENES.problem +
  SCENES.solution +
  SCENES.cta -
  TRANSITIONS.introToProblem -
  TRANSITIONS.problemToSolution -
  TRANSITIONS.solutionToCta;
