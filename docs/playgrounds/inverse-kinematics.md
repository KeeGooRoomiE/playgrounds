# Inverse Kinematics — internal notes

**Source repo:** none — written directly in the hub. DOM ids are `ik-` prefixed.
Slug `inverse-kinematics` (the user renamed it from `fabrik` during the build;
the island file is `InverseKinematics.astro`), `order: 180`, category
`animation`.

## Solver

`pass()` is one FABRIK iteration: backward from the tip (tip onto the target,
then each joint pulled onto the line to its successor at bone length), forward
from the base (base pinned, each joint pushed out to bone length). `pull()` is
the only geometry in the file.

`solve()` runs up to *Passes per frame* iterations, stopping at a 0.5px
tolerance, and records a ghost per pass when the toggle is on. Out of reach
(target further than the summed bone lengths) is special-cased to a straight
line — no iteration can do better.

`limit()` clamps a new bone to within *Max bend per joint* of the previous one,
applied during the forward pass from the third joint on. With tight limits some
targets become unreachable and the pass counter pegs at its budget, which the
copy calls out.

## Passes readout

The frame loop re-solves from the current pose, so a chain that is already on
target reports 0 passes — correct, but it made every capture read "Reached in 0
passes". Thumbnail mode now solves once at startup from the straightened chain
and then freezes (`if (toggleFollow.checked && !THUMB)`), so the still keeps its
pass count and ghosts. From straight, the default 14-bone chain takes 6–7
passes; tracking a moving pointer takes 1–2.

## Skins

- **tentacle** — tapered segments, hue per chain, suckers offset along the
  normal.
- **bones** — smoothed spine plus the raw polyline and joint circles; the view
  the ghosts read best on.
- **arm** — two-tone capsules with pivots and a gripper at the tip.
- **lamp** — dark scene, shade rotated onto the last bone with a light cone.

## Mounts

All chains stand on the floor, spread evenly across it, same length. A variant
with shorter wall-mounted chains on each side was built and reverted at the
user's request.

## Thumbnail

`thumbnailQuery: "skin=tentacle&chains=3&tx=0.72&ty=0.22&reach=0"` — three
chains converging on one target, reach circles off. Thumbnail mode also reads
`bones`, `bend`, `passes`, `ghost` and `tx`/`ty` (fractions of the canvas).

## Links

Body links to `../verlet/`; the Verlet page's "Inverse kinematics is the same
trick" concept now links here.

## Page structure

No *Mobile Behavior* section, and *Playground* is the last section so it sits
directly above the island — the user asked for that here. Touch: pointer events, `touch-action: none`, the
target follows a drag, and everything else is sliders. 320px: 286px canvas, no
overflow.
