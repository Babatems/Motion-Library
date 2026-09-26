import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexMono";
import { Easing } from "remotion";

// Owó-mi design tokens — lifted from the product's app/globals.css and
// components (github.com/Babatems/Owo-mi).
export const fonts = {
  sans: loadJakarta("normal", {
    weights: ["400", "500", "600", "700"],
    subsets: ["latin", "latin-ext"],
  }).fontFamily,
  mono: loadPlex("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily,
};

export const brand = {
  green: "#0e6b4f", // --brand
  greenLight: "#e8f5ef", // --brand-light
  paper: "#fafaf7", // --marketing-bg
  ink: "#0e0f12", // --marketing-bg-dark
  navy: "#16213e", // --navy (hero headline)
  lime: "#c7f23d", // --lime
  neutral200: "#e5e5e5",
  neutral400: "#a3a3a3",
  neutral500: "#737373",
  neutral600: "#525252",
  neutral700: "#404040",
  neutral800: "#262626",
  neutral900: "#171717",
  emerald600: "#059669",
  red600: "#dc2626",
  red500: "#ef4444",
  amber400: "#fbbf24",
  amber600: "#d97706",
  blue400: "#60a5fa",
  maple: "#d52b1e",
};

// Account-type chips, exactly as components/accounts/account-card.tsx
export const ACCOUNT_CHIP: Record<string, { bg: string; fg: string; label: string }> = {
  checking: { bg: "#eff6ff", fg: "#1d4ed8", label: "Chequing" },
  savings: { bg: "#ecfdf5", fg: "#047857", label: "Savings" },
  credit: { bg: "#fff1f2", fg: "#be123c", label: "Credit" },
  tfsa: { bg: "#f5f3ff", fg: "#6d28d9", label: "TFSA" },
  rrsp: { bg: "#fffbeb", fg: "#b45309", label: "RRSP" },
  fhsa: { bg: "#f0f9ff", fg: "#0369a1", label: "FHSA" },
};

export const ease = {
  // the site's own motion curve: cubic-bezier(0.4, 0, 0.2, 1)
  site: Easing.bezier(0.4, 0, 0.2, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 0.9, 0.3),
  spring: Easing.spring({ damping: 200 }),
  pop: Easing.spring({ damping: 15, stiffness: 170 }),
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
