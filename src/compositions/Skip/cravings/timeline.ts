// "Cravings" — 10s, music only. Master timeline in SECONDS, locked to the beat.
//
// Music: "Funkee Monkeee" (Mixkit Stock Music Free License), exactly 120 BPM.
// Beats in the track fall on 0.766 + k·0.5s; the bass enters on the bar at
// 6.766s. Starting the track at 5.266s puts that entry at 1.5s in the film.
// public/skip/music-cravings.wav is the 5.0–16.0s section of the track,
// pre-gained +6 dB through a limiter (peak −1.5 dBFS) so the music-only cut sits at
// the same loudness as the VO film.
export const FPS = 60;
export const sec = (s: number) => Math.round(s * FPS);

const EXCERPT_AT = 5.0;
export const MUSIC_START = 5.266 - EXCERPT_AT;
export const BEAT = 0.5; // exactly 30 frames
export const BASS = 1.5; // bass enters: the window slams in
export const b = (n: number) => BASS + n * BEAT; // beat n after the bass entry

export const END = 10;

// Bars (4 beats) land on b(0), b(4), b(8), b(12), b(16).
// Words that cycle under "Craving", one per beat from the bass entry: food
// first, then the rest of what Skip delivers.
export const CRAVINGS: { word: string; img: string; at: number; x?: number; y?: number }[] = [
  { word: "pizza?", img: "pizza.jpg", at: b(0), y: 55 },
  { word: "sushi?", img: "sushi.jpg", at: b(1), y: 55 },
  { word: "ramen?", img: "ramen.jpg", at: b(2) },
  { word: "tacos?", img: "tacos.jpg", at: b(3) },
  { word: "burgers?", img: "burger.jpg", at: b(4), x: 50, y: 45 },
  { word: "wings?", img: "chicken.jpg", at: b(5), x: 45 },
  { word: "groceries?", img: "groceries.jpg", at: b(6), y: 45 },
  { word: "flowers?", img: "flowers.jpg", at: b(7), y: 40 },
];

export const T = {
  craving: 0.12, // "Craving" rises
  something: 0.62, // "something?"
  expand: b(8), // 5.5 — bar 3: the window takes the whole frame (cheese pull)
  card: b(8.5), // order card pops
  delivered: b(10.5), // 6.75
  wipe: b(11.5), // 7.25 — skip wipe, a beat before the bar
  logo: b(12), // 7.5 — bar 4: logo lands
  line: b(12.75),
  sub: b(13.5),
  outro: b(16), // 9.5 — last downbeat, the music lets go
};
