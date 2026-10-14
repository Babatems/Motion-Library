import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { Easing } from "remotion";

// Skip design tokens, lifted from skipthedishes.com (Oct 2026 build, Just Eat
// Takeaway's PIE design system). Source of each value in the comment.
//
// Typeface: the site sets everything in "JET Sans Digital" (Bold Monday,
// licensed to JET; the font file forbids redistribution), so it is NOT
// bundled here. Figtree (OFL) is the stand-in: same geometric build,
// double-storey a, single-storey g, and a heavy 800 for the H1 style.
// If Skip signs off, swap in their licensed font file in this one place.
export const fonts = {
  sans: loadFigtree("normal", {
    weights: ["500", "600", "700", "800", "900"],
    subsets: ["latin"],
  }).fontFamily,
};

export const brand = {
  orange: "#f36805", // h1 "Skip to the good part." + primary button bg (PIE interactive-brand)
  orangeDeep: "#df5f05", // button hover
  logo: "#ff8000", // fill of /images/skip-orange-rounded-corners-logo.svg
  charcoal: "#242e30", // PIE content-default (body text, headings)
  slate: "#3c4c4f", // hero subhead "What can we bring to your door?"
  steel: "#8c999b", // PIE content-subdued
  cream: "#f5f3f1", // PIE container-subtle (section backgrounds)
  creamDeep: "#efedea", // container-strong / dividers
  white: "#ffffff",
  ink: "#1a1a19", // "Download Our App" card
  mint: "#c1dade", // "Give the Gift of Skip" card
  yellow: "#f6c243", // sparkle in the app illustration
  pink: "#f4a6c4", // sparkle in the app illustration (sampled from the SVG)
  peach: "#fde3cc", // Skip+ banner gradient start (sampled)
  green: "#017a39", // PIE support-positive
};

export const radius = {
  card: 16, // .info-card / promo cards: border-radius 16px
  input: 12,
  button: 800, // pill buttons: border-radius 800px
  small: 8,
};

export const shadow = {
  card: "0 2px 8px rgba(0,0,0,0.10)", // card box-shadow on the site
  raised: "0 4px 5px rgba(0,0,0,0.07), 0 1px 10px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.10)", // PIE elevation-02
  float: "0 30px 80px rgba(36,46,48,0.22), 0 8px 20px rgba(36,46,48,0.12)",
};

// The logo is set at a 15° forward slant (K stem: dx 10.25 over 39 units in
// logo-icon.svg). Every "skip" wipe in these films uses the same angle, and the
// hero photo's diagonal edge on the site leans the same way.
export const SLANT = 15;
export const SLANT_TAN = Math.tan((SLANT * Math.PI) / 180);

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-out: type and panels arriving
  quint: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 0.9, 0.3),
  expoIn: Easing.bezier(0.7, 0, 0.84, 0),
  snap: Easing.bezier(0.85, 0, 0.15, 1), // fast-in, fast-out: the "skip" jump
  linear: (x: number) => x,
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
