# Verlet Cloth — internal notes

**Source repo:** none — written directly in the hub. DOM ids are `vl-` prefixed.
Slug `verlet`, `order: 160`, category `simulation`.

## State

Four `Float64Array`s (`px/py` current, `ox/oy` previous) plus a `pinned`
`Uint8Array`; velocity is never stored, it's `current − previous`. Links are
`{a, b, rest, alive}`; `alive = false` is the entire tearing model.

`SPACING = 16` px rest length, `DT = 1/60`, `DRAG = 0.995` (the only damping).
Cloth is up to 48×34 points (1,248 points, 2,422 links at 1280px), rope up to 60
points, flag 34×20 off a left-hand pole.

## Loop

`integrate()` does the Verlet step with gravity and a gusting wind
(`w · (0.65 + 0.35·sin·sin)` so a flag doesn't sit in a steady stream), then
`relax(passes)` sweeps the link list, moving each end half the error, skipping
pinned points, and deleting a link once it exceeds the tear ratio. Positions are
clamped to the canvas at the end of each frame.

Measured at 1280px: 1,248 points, 2,422 links, 6 passes ≈ 14.5k distance checks
per frame, steady 61 fps. One pass leaves the cloth rubbery enough that it tears
under its own weight — that's real, and the copy uses it.

## Scenes

Each scene carries its own gravity and wind (`SCENE_DEFAULTS`): rope and cloth
900 / 0, flag 120 / 900. The flag was unusable at full gravity — it just draped
on the floor; 120/900 makes it fly out from the pole.

## Skins

`quads` is built alongside the links for the grid scenes: four point indices and
the four edge links. A filled skin draws a quad only when all four edges are
alive, so a tear is a real hole.

- **net** — the original line drawing; the *Colour the net by stretch* toggle
  only applies here (blue slack → dark → red near tearing).
- **load** — fills each cell by the average stretch of its four edges. The
  scale is deliberately sensitive (8% over rest is full red, 12% under is full
  blue): cloth is nearly inextensible, so a scale spread over the tear threshold
  came out almost white. Replaced an earlier "gradient map" skin that coloured
  cells by their original position, at the user's request.
- **squares** — near-black cells on a dark ground, lightened by how stretched
  the cell is; folds read as banding.

- **silk** — cells lit by how narrow they have been squeezed relative to their
  rest length, which is what a fold does to a cell seen edge-on. The first
  attempt shaded by the slant of the top edge; in a drape that edge is nearly
  horizontal everywhere, so the cloth came out flat and dark.
- **chainmail** — a ring at every point over the link lines, on near-black.

Rope has no quads and always draws as lines.

## Thumbnail

`thumbnailQuery: "scene=cloth&steps=220&pull=0.5,9"` — thumbnail mode runs
`steps` frames and, with `pull=x,dy`, grabs the nearest point to (x·width,
0.4·height) and drags it down `dy` px per frame, which tears a small hole. Lower
tear thresholds were tried for a bigger gash but the sheet detaches from its
pins and falls off screen.

## Page structure

No *Mobile Behavior* section. Touch: pointer events throughout,
`touch-action: none` on the canvas, 22px grab radius, and the tool select gives
touch users cut and pin. 320px: 286px canvas, 312 points, no overflow.
