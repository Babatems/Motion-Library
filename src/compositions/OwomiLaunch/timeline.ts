// Master timeline, in SECONDS. Every cue below is locked either to the
// music's beat grid or to a word timestamp from the voiceover
// (words measured with Whisper on the generated voice clips).

export const FPS = 60;
export const sec = (s: number) => Math.round(s * FPS);

// Music: "Motivating Mornings" (Mixkit) — 120.6 BPM
export const BEAT = 0.4975;
export const DROP1 = 12.17; // first lift → Owó-mi reveal
export const DROP2 = 28.09; // second lift (32 beats later) → trust + CTA
export const END = 39.0;

// Scene windows [start, end] in seconds (scenes overlap during transitions)
export const SCENE = {
  open: [0, 3.35],
  problem: [3.0, DROP1 + 0.1],
  reveal: [DROP1 - 0.25, 16.1],
  product: [15.7, DROP2 + 0.9],
  trust: [DROP2, 33.4],
  cta: [33.0, END],
} as const;

// Voiceover clip start times
export const VO_AT = {
  a1: 0.55,
  a2: 2.95,
  a3: 9.35,
  b1: 12.4,
  b1b: 14.05,
  b2: 16.0,
  b3: 23.3,
  b4: 25.95,
  c1: 28.75,
  brand: 33.25, // "Owó-mi" reused from b1 (trimmed) — a sonic logo
  c2b: 34.05,
};

// Word-level timestamps (global seconds)
export type Word = { w: string; t: number };
export const WORDS: Record<string, { words: Word[]; end: number }> = {
  a1: {
    end: 2.44,
    words: [
      { w: "Your", t: 0.64 }, { w: "money", t: 0.84 }, { w: "lives", t: 1.08 },
      { w: "in", t: 1.48 }, { w: "a", t: 1.68 }, { w: "lot", t: 1.8 },
      { w: "of", t: 2.02 }, { w: "places.", t: 2.14 },
    ],
  },
  a2: {
    end: 8.88,
    words: [
      { w: "Chequing", t: 3.06 }, { w: "at", t: 3.46 }, { w: "one", t: 3.64 },
      { w: "bank.", t: 3.86 }, { w: "A", t: 4.76 }, { w: "TFSA", t: 4.94 },
      { w: "at", t: 5.8 }, { w: "another.", t: 6.12 }, { w: "A", t: 6.86 },
      { w: "credit", t: 7.04 }, { w: "card", t: 7.28 }, { w: "you'd", t: 7.66 },
      { w: "rather", t: 7.96 }, { w: "not", t: 8.24 }, { w: "open.", t: 8.52 },
    ],
  },
  a3: {
    end: 11.69,
    words: [
      { w: "So,", t: 9.49 }, { w: "where", t: 10.19 }, { w: "does", t: 10.47 },
      { w: "it", t: 10.65 }, { w: "actually", t: 10.83 }, { w: "go?", t: 11.31 },
    ],
  },
  b2: {
    end: 22.93,
    words: [
      { w: "Every", t: 16.11 }, { w: "Canadian", t: 16.47 }, { w: "account,", t: 16.75 },
      { w: "from", t: 17.75 }, { w: "chequing", t: 17.83 }, { w: "to", t: 18.17 },
      { w: "your", t: 18.43 }, { w: "TFSA,", t: 18.53 }, { w: "RRSP", t: 19.85 },
      { w: "and", t: 20.25 }, { w: "FHSA,", t: 20.71 }, { w: "in", t: 21.93 },
      { w: "one", t: 22.15 }, { w: "clear", t: 22.39 }, { w: "picture.", t: 22.63 },
    ],
  },
  b3: {
    end: 25.9,
    words: [
      { w: "Know", t: 23.42 }, { w: "before", t: 23.76 }, { w: "you", t: 24.04 },
      { w: "go", t: 24.22 }, { w: "over.", t: 24.36 }, { w: "Not", t: 25.22 },
      { w: "after.", t: 25.46 },
    ],
  },
  b4: {
    end: 28.07,
    words: [
      { w: "And", t: 26.07 }, { w: "watch", t: 26.39 }, { w: "every", t: 26.75 },
      { w: "goal", t: 27.27 }, { w: "get", t: 27.53 }, { w: "closer.", t: 27.75 },
    ],
  },
  c1: {
    end: 32.79,
    words: [
      { w: "Read-only.", t: 28.83 }, { w: "Hosted", t: 30.15 }, { w: "in", t: 30.47 },
      { w: "Canada.", t: 30.61 }, { w: "Et", t: 31.55 }, { w: "en", t: 31.73 },
      { w: "français,", t: 31.85 }, { w: "aussi.", t: 32.41 },
    ],
  },
  c2b: {
    end: 35.89,
    words: [
      { w: "Finally", t: 34.15 }, { w: "know", t: 34.89 }, { w: "where", t: 35.01 },
      { w: "your", t: 35.17 }, { w: "money", t: 35.33 }, { w: "goes.", t: 35.49 },
    ],
  },
};

// Lines shown in the caption track (the rest are typeset in-scene)
export const CAPTIONED = ["a2", "b2", "b3", "b4"] as const;

// Speech windows used to duck the music under the voice
export const SPEECH: [number, number][] = [
  [0.6, 2.5], [3.0, 8.95], [9.45, 11.75], [12.45, 13.35], [14.1, 15.45],
  [16.05, 23.0], [23.37, 25.95], [26.02, 28.12], [28.8, 32.85], [33.28, 33.8],
  [34.1, 35.95],
];
