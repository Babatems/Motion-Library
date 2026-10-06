// Master timeline, in SECONDS. Cues are locked to the music's beat grid or
// to word timestamps from the voiceover (measured with faster-whisper
// small.en on the final VO clips).

export const FPS = 60;
export const sec = (s: number) => Math.round(s * FPS);

// Music: "New Bass 01" by Lily J (Mixkit Stock Music Free License) — 123 BPM.
// The bass drops in at 22.94s of the track; we start the track at 17.34s so
// the drop lands on the logo reveal.
export const MUSIC_START = 17.34;
export const BEAT = 60 / 123.047;
export const DROP = 5.6;
export const bar = (n: number) => DROP + n * 4 * BEAT; // bar downbeats after the drop
export const END = bar(9) + 2.0; // 25.15 — 2s outro push starts on the bar right after the click

// Scene windows [start, end] in seconds (scenes overlap during transitions)
export const SCENE = {
  hook: [0, 5.75],
  reveal: [5.58, 7.7],
  detect: [7.62, 12.2],
  control: [11.9, 16.02],
  proof: [15.8, 19.32],
  end: [19.1, END],
} as const;

// Voiceover clip start times (voice: Kokoro af_heart)
export const VO_AT = {
  a1: 0.45,
  a2: 4.05,
  b1: 6.05,
  b2: 7.75,
  b3: 12.2,
  c1: 16.0,
  c2: bar(7) + 0.2, // 19.45 — "Taiv." right after the end-card downbeat
} as const;

// Word-level timestamps (global seconds)
export type Word = { w: string; t: number };
const at = (start: number, words: [string, number][]): Word[] =>
  words.map(([w, t]) => ({ w, t: +(start + t).toFixed(2) }));

export const WORDS: Record<keyof typeof VO_AT, { words: Word[]; end: number }> = {
  a1: {
    end: VO_AT.a1 + 3.16,
    words: at(VO_AT.a1, [
      ["Every", 0], ["commercial", 0.28], ["break,", 0.64], ["your", 1.44], ["TVs", 1.56],
      ["are", 1.9], ["selling", 2.16], ["someone", 2.5], ["else.", 2.8],
    ]),
  },
  a2: { end: VO_AT.a2 + 0.81, words: at(VO_AT.a2, [["Not", 0], ["anymore.", 0.24]]) },
  b1: { end: VO_AT.b1 + 0.87, words: at(VO_AT.b1, [["This", 0], ["is", 0.18], ["Taiv.", 0.34]]) },
  b2: {
    end: VO_AT.b2 + 4.18,
    words: at(VO_AT.b2, [
      ["Its", 0], ["AI", 0.18], ["spots", 0.58], ["the", 0.96], ["ads", 1.2], ["in", 1.48],
      ["real", 1.68], ["time,", 1.88], ["and", 2.32], ["plays", 2.82], ["your", 3.06],
      ["specials", 3.22], ["instead.", 3.58],
    ]),
  },
  b3: {
    end: VO_AT.b3 + 3.38,
    words: at(VO_AT.b3, [
      ["Manage", 0], ["every", 0.42], ["screen", 0.72], ["from", 1.02], ["anywhere.", 1.28],
      ["And", 1.64], ["earn", 2.2], ["from", 2.44], ["every", 2.68], ["break.", 2.98],
    ]),
  },
  c1: {
    end: VO_AT.c1 + 2.98,
    words: at(VO_AT.c1, [["7,000", 0], ["venues.", 0.82], ["99%", 1.6], ["renew.", 2.56]]),
  },
  c2: {
    end: VO_AT.c2 + 2.19,
    words: at(VO_AT.c2, [["Taiv.", 0], ["Business", 0.64], ["TV,", 0.84], ["reimagined.", 1.7]]),
  },
};

// Handy word times used by the scenes
export const W = {
  commercial: WORDS.a1.words[1].t,
  break1: WORDS.a1.words[2].t,
  someone: WORDS.a1.words[7].t,
  not: WORDS.a2.words[0].t,
  taiv: WORDS.b1.words[2].t,
  ads: WORDS.b2.words[4].t,
  time: WORDS.b2.words[7].t,
  plays: WORDS.b2.words[9].t,
  instead: WORDS.b2.words[12].t,
  screen: WORDS.b3.words[2].t,
  anywhere: WORDS.b3.words[4].t,
  and: WORDS.b3.words[5].t,
  earn: WORDS.b3.words[6].t,
  break3: WORDS.b3.words[9].t,
  seven: WORDS.c1.words[0].t,
  ninety: WORDS.c1.words[2].t,
  endTaiv: WORDS.c2.words[0].t,
  business: WORDS.c2.words[1].t,
  tv: WORDS.c2.words[2].t,
  reimagined: WORDS.c2.words[3].t,
};

// Editorial supers — big left-aligned type that carries the message for
// muted viewing (replaces a caption track). Each line slides up out of a mask
// as its first word is spoken; the block exits upward before the next one.
// `accent` colours part of a line in the brand lilac.
export type SuperLine = { text: string; at: number; accent?: string };
export type SuperDef = {
  id: string;
  lines: SuperLine[];
  out: number;
  x: number;
  y: number; // distance from top (anchor "top") or bottom (anchor "bottom")
  anchor: "top" | "bottom";
  size: number;
};
export const SUPERS: SuperDef[] = [
  {
    id: "hook",
    lines: [
      { text: "Every commercial break,", at: WORDS.a1.words[0].t },
      { text: "your TVs are selling someone else.", at: WORDS.a1.words[3].t, accent: "someone else." },
    ],
    out: 3.72,
    x: 120,
    y: 130,
    anchor: "bottom",
    size: 72,
  },
  {
    id: "not",
    lines: [{ text: "Not anymore.", at: WORDS.a2.words[0].t }],
    out: 5.0,
    x: 120,
    y: 130,
    anchor: "bottom",
    size: 96,
  },
  {
    id: "detect-a",
    lines: [
      { text: "Its AI spots", at: WORDS.b2.words[0].t },
      { text: "the ads", at: WORDS.b2.words[3].t },
      { text: "in real time,", at: WORDS.b2.words[5].t },
    ],
    out: 10.12,
    x: 120,
    y: 170,
    anchor: "top",
    size: 72,
  },
  {
    id: "detect-b",
    lines: [
      { text: "And plays", at: WORDS.b2.words[9].t - 0.25 },
      { text: "your specials", at: WORDS.b2.words[10].t, accent: "specials" },
      { text: "instead.", at: WORDS.b2.words[12].t },
    ],
    out: 11.72,
    x: 120,
    y: 170,
    anchor: "top",
    size: 72,
  },
  {
    id: "control-a",
    lines: [{ text: "Manage every screen from anywhere.", at: WORDS.b3.words[0].t }],
    out: WORDS.b3.words[5].t - 0.02,
    x: 160,
    y: 62,
    anchor: "bottom",
    size: 42,
  },
  {
    id: "control-b",
    lines: [{ text: "And earn from every break.", at: WORDS.b3.words[5].t + 0.02, accent: "earn" }],
    out: WORDS.b3.end + 0.1,
    x: 160,
    y: 62,
    anchor: "bottom",
    size: 42,
  },
];

// Speech windows used to duck the music under the voice
export const SPEECH: [number, number][] = (Object.keys(VO_AT) as (keyof typeof VO_AT)[]).map((k) => [
  VO_AT[k] + 0.02,
  WORDS[k].end,
]);
