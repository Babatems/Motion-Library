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

## Remotion rules
- All animation must be driven by `useCurrentFrame()` via `interpolate()` / `spring()`. Never use CSS transitions/animations, `setTimeout`, or `Date.now()` — renders will flicker or be wrong.
- Use `<Img>`, `<Video>`/`<OffthreadVideo>`, `<Audio>` from remotion (not plain tags) so assets load before frames are captured.
- Time scenes with `<Sequence>`, `<Series>`, or `<TransitionSeries>`. With TransitionSeries, total duration = sum of sequences − transition durations; keep `durationInFrames` in Root in sync (or use `calculateMetadata`).
- Always clamp `interpolate` with `extrapolateLeft/Right: "clamp"` unless overshoot is intended (each video exports a `clamp` const).
- Randomness/noise must be deterministic per frame (e.g. `seed={frame % 12}` in the grain filter, or `@remotion/noise`).
- Fonts: `loadFont()` from `@remotion/google-fonts/<Font>`, called once in `brand.ts`/`theme.ts`.
- Styling: finished videos use inline styles with tokens from `brand.ts`/`theme.ts`. Tailwind is available but only used in `HelloMotion`.
- All `@remotion/*` packages must stay on the exact same version as `remotion` — install with `--save-exact`, upgrade with `npm run upgrade`.
- Config (`remotion.config.ts`): rspack, JPEG frames, output overwrite on, Tailwind enabled.

## Installed helpers
`@remotion/transitions`, `@remotion/shapes`, `@remotion/paths`, `@remotion/google-fonts`, `@remotion/media-utils`, `@remotion/noise`, `@remotion/zod-types`, `zod`.

## Client work (Winnipeg companies)
- One composition folder and one `public/<client>/` folder per company. Start from the OwomiLaunch structure.
- Pull real brand assets (logo, colours, fonts, product screenshots, tone of voice) from the company's site, and record the source of each token in `brand.ts`.
- Keep them short and polished: 1080p (16:9, plus 9:16 or 1:1 cuts for social when useful), 15–45s, with a clear end card showing the company's name and CTA.
- These are unsolicited spec pieces. Don't publish anything that uses a company's branding before they have agreed to it.
- Verify with `npm run still` on key frames and `npm run lint` before any full render.
