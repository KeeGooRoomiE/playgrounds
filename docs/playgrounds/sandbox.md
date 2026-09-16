# Sandbox — internal notes

**Source repo:** none — written directly in the hub. DOM ids are `sb-` prefixed.

## Links out

The body links to `../game-of-life/` (Conway's Game of Life), which now exists —
the link was written before that playground, at the user's request.

Relative links (`../perlin-noise/`, `../game-of-life/`) resolve correctly both
locally (`/sandbox/`) and under the GitHub Pages base path
(`/playgrounds/sandbox/`), because every page URL ends in a slash.

## Grid and state

`PX = 3` canvas pixels per cell, `H = 520 / 3`, width floored from the wrapper.
Five parallel `Uint8Array`s per cell: `grid` (occupied), `jit` (random shade for
Desert), `hue` (pour band for Sand bottle), `grip` (friction) and `act`
(recent-movement glow for What moves). Everything except `grid` is copied along
when a grain moves, so a skin switch never changes the sand, only its paint.

## Rule

`step()` runs twice per animation frame: rows bottom-up, row direction
alternating per step, fall straight down if possible, else slide to a free lower
diagonal (random when both are free). A grain with `grip = g` only slides if the
side column is empty for `g + 1` cells below, so 0 / 1 / 2 give roughly 45°, 63°
and 72° slopes. `grip` is rolled per grain from the Friction slider (fractional
values mix grips); changing the slider re-rolls every existing grain, so
lowering it makes steep piles slump — deliberate, and called out in the copy.

An "always try left first" toggle was built and removed: it only changes which
side fills first, and the finished pile is the same 45° either way, so it didn't
demonstrate anything visible.

## Generate

Two octaves of seeded Perlin (`x/28` plus half of `x/14`), normalised to the
field's own min–max, cells above `THRESHOLD = 0.75` become sand. Raw Perlin
isn't in [0, 1], so the threshold is meaningless without normalising. At 0.75
only ~4–5% of cells fill (1,764 grains at 1280px, seed 42): a sparse sky of
clumps, which is the intended look. A coarser `x/48` scale was tried and gave
too few clumps.

## Brush

Pointer events with capture; the right button always erases, otherwise the
*Drag or tap to* select decides, which is the touch path. Stamps are
interpolated between frames so fast drags stay continuous. Pour fills 30% of the
empty cells in the brush circle per frame. `touch-action: none` on the canvas,
so dragging pours rather than scrolls the page. Context menu suppressed on the
canvas.

Sand bottle bands: `pourHue` advances by 1/90 per pouring frame, so the colour
steps to the next of eight fixed sand-art colours about every 1.5 s. A smooth HSL
rainbow was tried first and read as a gradient, not layers.

## Resize

Continuous `requestAnimationFrame` loop. On resize the grid is reallocated to
the new width, copying the sand that still fits; columns beyond a narrower width
are lost.

## Thumbnail

`thumbnailQuery: "seed=42&skin=desert&threshold=0.61&frames=150"` — settings
chosen by the user. `threshold` (URL only, 0–1 exclusive) overrides the 0.75
cut-off so the cover has more sand: 10,367 grains at 1280px, about a fifth of
the cells (0.45 was tried and buried most of the sky). 150 frames lets it fully
settle into dunes. Thumbnail mode doesn't step the simulation in the rAF loop, so the still
doesn't keep falling before capture. A scripted three-pile pour
(`demo=piles`) was tried as the cover first and removed once this was chosen.

## Page structure

Short layout, as for Brownian Tree and Sorting: no *Mobile Behavior* section,
*Playground* last.

## Verified

- Pour by mouse drag and erase with the right button; three pours at friction
  0 / 50 / 100 produce visibly steeper piles; dropping friction to 0 afterwards
  sets them sliding (505 grains moving in the next frames, glowing in What moves).
- All five skins render the same sand.
- 320px (touch emulation): 285px canvas, no horizontal overflow. No console
  errors.
