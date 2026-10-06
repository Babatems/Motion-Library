# first-mv — Remotion motion video project

Remotion 4.0.529 + React 19 + Tailwind v4 (via `@remotion/tailwind-v4`), rspack bundler.

Practice repo for product launch / promo videos. Next up (from ~Oct 2026): spec videos for **Winnipeg companies**, used for outreach. See "Client work" below.

## Commands
- `npm run dev` — open Remotion Studio (live preview, props editor)
- `npm run render -- <CompId> out/<name>.mp4` — render video
- `npm run still -- <CompId> out/<name>.png --frame=<n>` — render a single frame (use to visually verify work)
- `npm run lint` — eslint + tsc; run after every change

## Structure
- `src/Root.tsx` — registers every `<Composition>` (id, fps, size, duration, schema, defaultProps)
- `src/compositions/<Name>/` — one folder per video (layout below)
- `public/` — static assets; reference with `staticFile("file.png")`. Per-video assets go in `public/<video>/` (e.g. `public/owomi/`); `public/sfx/`, `public/icons/`, `public/img/` are shared
- `out/` — render output (gitignored)

## Finished videos
| Comp ID | Output | Specs | What it is |
|---|---|---|---|
| `TaivPromo` | `out/taiv-promo.mp4` | 1920×1080, **60fps**, 25.2s | Spec pitch for Taiv (Winnipeg, AI business-TV). Female VO (Kokoro TTS `af_heart`) + Mixkit music/SFX, all timed to the beat grid and Whisper word timestamps. Outro: cursor clicks "Get started", then a 2s motion-blurred push into the button. First client spec piece; corner babatems mark. Render with `--jpeg-quality=95` |
| `OwomiLaunch` | `out/owomi-launch.mp4` | 1920×1080, **60fps**, 39s | Launch film for Owó-mi (Canadian budgeting app). VO + music + ~70 SFX cues, all timed in seconds to the beat grid and Whisper word timestamps. The most polished piece, and the reference for client work |
| `LullLaunch` | `out/lull-launch.mp4` | 1920×1080, 30fps | Launch film for "Lull" (notification-calming app). Music + SFX, no VO. Custom `TransitionSeries` transitions. Each scene is also registered on its own under the `LullLaunch-Scenes` folder for previewing |
| `HelloMotion` | `out/HelloMotion.mp4` | 1920×1080, 30fps, 130f | Starter/test comp with a zod schema and Tailwind |

## Composition folder layout (follow this for new videos)
```
src/compositions/<Name>/
  <Name>.tsx          # root: arranges scenes, overlays (grain/captions), soundtrack
  brand.ts | theme.ts # fonts (loadFont), color tokens, `ease` curves, `clamp` const
  timeline.ts         # (VO-driven videos) FPS, sec(), beats, scene windows, VO/word timings
  scenes/             # Intro/Open, Problem, Solution/Product/Reveal, Trust, CTA …
  components/         # reusable pieces for this video (brand mark, cards, dashboard, grain)
  *.ts                # data (apps, notifications, icons)
```
- Brand tokens come from the real product: copy colours, fonts and easing from the client's site CSS (see `OwomiLaunch/brand.ts`, where each token is commented with its source CSS variable).
- Both finished videos follow the same story arc: **hook → problem → reveal → product/features → trust → CTA/end card**.

## Two timing approaches
1. **Frame-based with TransitionSeries** (`LullLaunch`): scene lengths in frames in `theme.ts` (`SCENES`, `TRANSITIONS`, `TOTAL_FRAMES`). Custom presentations live in `transitions.tsx` (`zoomBlur`, `whipPan`, `iris`). Best for music-only videos.
2. **Seconds-based master timeline** (`OwomiLaunch`): everything in `timeline.ts` is in seconds (`sec(s)` converts to frames). Scenes are mounted with overlapping `[start, end]` windows, so transitions are hand-built inside the scenes. Inside a scene, `useT(start)` returns global seconds and `iv()` is a clamped, eased `interpolate` over seconds (`components/Common.tsx`). Use this for anything with voiceover.

## Audio / sound design (learned on OwomiLaunch)
- Each SFX is listed as a cue `[eventTime, name, volume]`. The `PEAK` map stores each file's peak offset, and the cue starts at `t - PEAK[name]` so the loudest moment of the sound lands on the visual event.
- Music is ducked under speech by a `volume` callback built from `SPEECH` windows. Give the brand name extra room.
- Mix targets: VO normalized to about −14 dBFS speech level (peaks at −1 dBFS), sitting ~10 dB above the music. Master `SFX_GAIN`/`VO_GAIN` keep the summed mix under −1 dBFS.
- Never let SFX land on important words (product names, key features). Move them into the gaps before or after.
- Captions: word-level, from `WORDS` in `timeline.ts`. Only lines not already typeset in the scene are captioned (`CAPTIONED`).
- Music/SFX used so far are royalty-free (e.g. Mixkit). Keep it that way for client work, and note the source in a comment.
- Female VO without a voice actor: Kokoro TTS (`kokoro-onnx`, voice `af_heart`) run via `uv`, then high-pass/EQ/compression with `pedalboard` and normalised to ~−12.5 dBFS speech / −1 dBFS peaks. Spell brand names phonetically for the TTS (Taiv → "Tyve"). Word timings come from faster-whisper `small.en` (pass numpy audio; the bundled `av` can't open files).
- Remotion's bundled ffmpeg (`npx remotion ffmpeg`) lacks most audio filters — do audio processing in Python instead.

## Look like a motion designer made it (feedback on TaivPromo: "looks heavily AI")
- Carry the message with **editorial supers**: big left-aligned type, deliberate line breaks, each line rising out of its own mask on a fast expo-out, timed to the VO (`SUPERS` in `TaivPromo/timeline.ts`). No karaoke caption pills.
- No blur-fade reveals, glow/drop-shadow on text, shockwave rings, light streaks or faint floating tiles. These are the template/AI tells. Use masks, crisp slides and confident cuts.
- No decorative HUD text (tiny mono labels, fake counters). A label must be readable and needed; use sentence case in the brand sans.
- Use real brand imagery (the client's own promos and screenshots). Avoid drawn stand-ins such as cartoon sports fields.
- Vary composition (type column + product, full-bleed photo, centred end card), rather than centring everything on the same glow.
- The TTS voice is the biggest remaining tell; a real VO is the single largest upgrade.

## Remotion rules
- All animation must be driven by `useCurrentFrame()` via `interpolate()` / `spring()`. Never use CSS transitions/animations, `setTimeout`, or `Date.now()` — renders will flicker or be wrong.
- Use `<Img>`, `<Video>`/`<OffthreadVideo>`, `<Audio>` from remotion (not plain tags) so assets load before frames are captured.
- Time scenes with `<Sequence>`, `<Series>`, or `<TransitionSeries>`. With TransitionSeries, total duration = sum of sequences − transition durations; keep `durationInFrames` in Root in sync (or use `calculateMetadata`).
- Always clamp `interpolate` with `extrapolateLeft/Right: "clamp"` unless overshoot is intended (each video exports a `clamp` const).
- Don't use `backdrop-filter`, and don't fade whole scenes with parent `opacity` — Chrome switches compositing layers on the frame the fade completes, causing a visible one-frame pop. Use opaque-enough fills, and fade scenes with an overlay of the background colour instead. Motion must also be continuous: no `%` wrap-around on positions unless the pattern tiles seamlessly.
- Same for animated CSS `filter`s (e.g. `drop-shadow` glows) under an overlay — draw glows as gradients instead.
- Thumbnails: content scaled to ~25% with thin lines or fine patterns that move by sub-pixel steps shimmers. Keep small screens still-ish, with thick lines and slow motion.
- To find glitches, decode the render and diff consecutive frames (PyAV + numpy); an isolated spike means a pop.
- Randomness/noise must be deterministic per frame (e.g. `seed={frame % 12}` in the grain filter, or `@remotion/noise`).
- Fonts: `loadFont()` from `@remotion/google-fonts/<Font>`, called once in `brand.ts`/`theme.ts`.
- Styling: finished videos use inline styles with tokens from `brand.ts`/`theme.ts`. Tailwind is available but only used in `HelloMotion`.
- All `@remotion/*` packages must stay on the exact same version as `remotion` — install with `--save-exact`, upgrade with `npm run upgrade`.
- Config (`remotion.config.ts`): rspack, JPEG frames, output overwrite on, Tailwind enabled.

## Installed helpers
`@remotion/transitions`, `@remotion/motion-blur` (`CameraMotionBlur`: wrap a whole scene from its first frame — its samples run ~¾ frame ahead, so switching it on mid-move makes a jump), `@remotion/shapes`, `@remotion/paths`, `@remotion/google-fonts`, `@remotion/media-utils`, `@remotion/noise`, `@remotion/zod-types`, `zod`.

## Client work (Winnipeg companies)
- One composition folder and one `public/<client>/` folder per company. Start from the OwomiLaunch structure.
- Pull real brand assets (logo, colours, fonts, product screenshots, tone of voice) from the company's site, and record the source of each token in `brand.ts`.
- Keep them short and polished: 1080p (16:9, plus 9:16 or 1:1 cuts for social when useful), 15–45s, with a clear end card showing the company's name and CTA.
- These are unsolicited spec pieces. Don't publish anything that uses a company's branding before they have agreed to it.
- Spec pieces carry a small corner "© BABATEMS · SPEC CONCEPT" mark (`Watermark` in `TaivPromo/components/Common.tsx`). A diagonal background tile was tried on Taiv and removed at the user's request — too visible.
- Verify with `npm run still` on key frames and `npm run lint` before any full render.
