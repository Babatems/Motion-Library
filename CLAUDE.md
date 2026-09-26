# first-mv — Remotion motion video project

Remotion 4.0.529 + React 19 + Tailwind v4 (via `@remotion/tailwind-v4`), rspack bundler.

## Commands
- `npm run dev` — open Remotion Studio (live preview, props editor)
- `npm run render -- <CompId> out/<name>.mp4` — render video
- `npm run still -- <CompId> out/<name>.png --frame=<n>` — render a single frame (use to visually verify work)
- `npm run lint` — eslint + tsc; run after every change

## Structure
- `src/Root.tsx` — registers every `<Composition>` (id, fps, size, duration, schema, defaultProps)
- `src/compositions/<Name>/` — one folder per video; export component + zod schema
- `public/` — static assets; reference with `staticFile("file.png")`
- `out/` — render output (gitignored)

## Remotion rules
- All animation must be driven by `useCurrentFrame()` via `interpolate()` / `spring()`. Never use CSS transitions/animations, `setTimeout`, or `Date.now()` — renders will flicker or be wrong.
- Use `<Img>`, `<Video>`/`<OffthreadVideo>`, `<Audio>` from remotion (not plain tags) so assets load before frames are captured.
- Time scenes with `<Sequence>`, `<Series>`, or `<TransitionSeries>`. With TransitionSeries, total duration = sum of sequences − transition durations; keep `durationInFrames` in Root in sync (or use `calculateMetadata`).
- Always clamp `interpolate` with `extrapolateLeft/Right: "clamp"` unless overshoot is intended.
- Fonts: `loadFont()` from `@remotion/google-fonts/<Font>`.
- All `@remotion/*` packages must stay on the exact same version as `remotion` — install with `--save-exact`, upgrade with `npm run upgrade`.

## Installed helpers
`@remotion/transitions`, `@remotion/shapes`, `@remotion/paths`, `@remotion/google-fonts`, `@remotion/media-utils`, `@remotion/noise`, `@remotion/zod-types`, `zod`.
