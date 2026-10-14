// "Skip to the good part" — 20s, voiceover. Master timeline in SECONDS: cues
// are locked to the music's beat grid or to word timestamps from the VO
// (faster-whisper small.en on the final clips).
export const FPS = 60;
export const sec = (s: number) => Math.round(s * FPS);

// Music: "Take this Higher" (Mixkit Stock Music Free License), 123 BPM. The
// bass cuts out at 27.60s of the track and drops back in on the downbeat at
// 29.048s; starting the track at 24.948s lands that drop at 4.1s, and the
// track's breakdown (8 bars later) falls just as the film ends.
export const DROP = 4.1;
export const MUSIC_START = 29.048 - DROP;
export const BEAT = 0.4878;
export const b = (n: number) => DROP + n * BEAT; // beat n from the drop; bars every 4
export const BREAK = b(-3); // 2.64 — the bass drops out
export const END = 20;

// Voiceover: Chatterbox TTS (Resemble AI, MIT), built-in voice, picked by
// UTMOS score from several takes, then EQ/compression in Python. The hook was
// read as one line and cut at its pauses, so each phrase lands on the grid.
export const VO_AT = {
  h1: b(-8) - 0.05, // "Traffic."
  h2: b(-6.5) - 0.05, // "Lineups."
  h3: b(-5) - 0.05, // "Waiting around."
  h4: b(-2) - 0.05, // "Skip it." — inside the break
  p1: 5.15, // "Food, groceries, and more, from over fifty thousand retailers."
  p2: 9.55, // "Then watch your order, all the way to your door."
  p3: 13.45, // "Delivering to four hundred and fifty cities and towns across Canada."
  e1: 17.85, // "Skip. Skip to the good part."
} as const;
export type VoKey = keyof typeof VO_AT;

// Clip lengths (s) and word onsets inside each clip
export const VO_LEN: Record<VoKey, number> = {
  h1: 0.6, h2: 0.7, h3: 0.91, h4: 0.64, p1: 4.01, p2: 2.5, p3: 2.93, e1: 1.95,
};
const ON = 0.04; // whisper's first word starts at 0; the audio onset is ~40ms in
const w = (k: VoKey, at: number) => +(VO_AT[k] + ON + at).toFixed(3);

export const W = {
  traffic: w("h1", 0),
  lineups: w("h2", 0),
  waiting: w("h3", 0),
  around: w("h3", 0.26),
  skip: w("h4", 0),
  it: w("h4", 0.3),
  food: w("p1", 0),
  groceries: w("p1", 0.68),
  andMore: w("p1", 1.24),
  from: w("p1", 1.64),
  fifty: w("p1", 2.42),
  retailers: w("p1", 3.16),
  then: w("p2", 0),
  watch: w("p2", 0.28),
  all: w("p2", 1.12),
  door: w("p2", 2.04),
  delivering: w("p3", 0),
  n450: w("p3", 0.58),
  cities: w("p3", 1.02),
  towns: w("p3", 1.78),
  canada: w("p3", 2.28),
  endSkip: w("e1", 0),
  endLine: w("e1", 0.68),
  good: w("e1", 1.2),
};

// Speech windows used to duck the music under the voice
export const SPEECH: [number, number][] = (Object.keys(VO_AT) as VoKey[]).map((k) => [VO_AT[k] + 0.02, VO_AT[k] + VO_LEN[k]]);

// Scene windows [start, end] (overlapping where scenes hand over)
export const SCENE = {
  hook: [0, b(0) + 0.1],
  reveal: [b(-0.4), b(2) + 0.45],
  product: [b(2) - 0.05, 13.35],
  canada: [12.95, b(28) + 0.05],
  end: [b(27.4), END],
} as const;

export const T = {
  skipBtn: 2.72, // skip button appears in the gap after "around"
  press: W.it + 0.14, // pressed as "Skip it." finishes (3.55)
  strike: W.it + 0.17,
  linesOut: b(-0.6),
  wipe: b(-0.35), // orange wipe arrives on the drop
  logo: DROP,
  toProduct: b(2), // 5.08
  phoneIn: b(2) + 0.06,
  scrollA: 6.3,
  scrollB: 8.9,
  tap: 9.3,
  push: 9.48,
  rideA: 9.85,
  rideB: 11.7,
  delivered: 12.02, // after "door."
  toCanada: 12.95,
  toEnd: b(27.4), // 17.47
  endLand: b(28), // 17.76 — bar 7 downbeat
  cta: 18.95,
};

// Editorial supers for the product scene
export type SuperLine = { text: string; at: number; accent?: boolean };
export const SUPERS_PRODUCT: { lines: SuperLine[]; out: number }[] = [
  {
    lines: [
      { text: "Food.", at: W.food },
      { text: "Groceries.", at: W.groceries },
      { text: "And more.", at: W.andMore },
    ],
    out: W.from - 0.12,
  },
  {
    lines: [
      { text: "From over", at: W.from },
      { text: "50,000+", at: W.fifty - 0.06, accent: true },
      { text: "retailers.", at: W.retailers },
    ],
    out: T.tap + 0.1,
  },
  {
    lines: [
      { text: "Watch it", at: W.watch },
      { text: "all the way", at: W.all },
      { text: "to your door.", at: W.door - 0.12, accent: true },
    ],
    out: T.toCanada + 0.1,
  },
];
