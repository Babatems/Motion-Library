import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Easing } from "remotion";

// Taiv design tokens — lifted from the taiv.tv stylesheets
// (/_astro/BaseLayout.css, /_astro/index.css). Source variable in each comment.
export const fonts = {
  // --font-sans: "Inter Variable", "Inter", …
  sans: loadInter("normal", {
    weights: ["400", "500", "600", "700", "800"],
    subsets: ["latin"],
  }).fontFamily,
  // --font-mono is ui-monospace; JetBrains Mono stands in for the HUD labels
  mono: loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily,
};

export const brand = {
  void: "#0a0420", // --color-dark-indigo (page background)
  deep: "#0c0726", // hero gradient stop
  surface: "#1a1040", // --color-surface (cards)
  surface2: "#241b54", // card hover / raised surface
  violet: "#6f3fee", // --color-ultra-violet / --color-purple-200 (buttons)
  lilac: "#9b6eff", // --color-purple-100 ("Reimagined", stat accents)
  lavender: "#c4a8ff", // --color-purple-50
  amethyst: "#3f2488", // --color-purple-300
  white: "#f5f7fa", // --color-tech-white (text, logo fill)
  muted: "rgba(245,247,250,0.55)", // --text-muted
  hairline: "rgba(245,247,250,0.08)",
  red: "#ff3b30", // --color-red-100
  green: "#00de6f", // --color-green-200 (success / live)
  coral: "#fa9479", // --color-coral
  sky: "#74d4ff", // --color-blue-100
};

export const radius = {
  marketing: 20, // --radius-marketing
  surface: 14, // --radius-surface
  lg: 8, // --radius-lg (buttons)
};

export const ease = {
  // --ease-out-quint: cubic-bezier(.22, 1, .36, 1) — the site's signature curve
  quint: Easing.bezier(0.22, 1, 0.36, 1),
  // --ease-in-out: cubic-bezier(.4, 0, .2, 1)
  site: Easing.bezier(0.4, 0, 0.2, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 0.9, 0.3),
  expoIn: Easing.bezier(0.7, 0, 0.84, 0),
  linear: (x: number) => x,
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
