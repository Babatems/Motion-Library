// Shared SFX library for the Skip films (public/skip/sfx). All Mixkit (Mixkit
// Sound Effects Free License): the Owó-mi/Taiv set plus "Fast car drive by"
// (#1538, the sonic logo — Skip's mark comes with the sound of tyres speeding
// away), "Speeding swoosh" (#1484), "Quick zoom impact" (#772), "Bubble pop up
// alert" (#2357), "Modern technology select" (#3124).
//
// Peak offset (s) of each file, measured from the audio: a cue starts at
// `t - PEAK[name]` so the loudest moment lands exactly on its visual event.
export const PEAK: Record<string, number> = {
  "bass-hit": 0.09,
  "bass-hit-future": 0.21,
  "bubble-pop": 0.24,
  "car-drive-by": 1.22,
  "chime-confirm": 0.2,
  "chime-positive": 0.19,
  "click-classic": 0.14,
  "click-device": 0.01,
  "click-tone": 0.01,
  "notify-hint": 0.46,
  "pop-dry": 0.04,
  "pop-long": 0.04,
  "pop-message": 0.06,
  "reverse-air": 0.61,
  "reverse-swell": 0.88,
  select: 0.12,
  "speeding-swoosh": 0.59,
  "sweep-short": 0.46,
  "sweep-small": 0.34,
  "swoosh-fast": 0.11,
  "tap-switch": 0.01,
  "tech-select": 0.02,
  "whoosh-air": 0.72,
  "whoosh-cinematic": 1.08,
  "whoosh-deep-impact": 0.63,
  "whoosh-fast": 0.73,
  "zoom-impact": 0.52,
};

const WAV = new Set(["reverse-air", "reverse-swell"]);
export const sfxFile = (name: string) => `skip/sfx/${name}.${WAV.has(name) ? "wav" : "mp3"}`;
