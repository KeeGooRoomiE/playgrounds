# Conway's Game of Life — internal notes

**Source repo:** none — written directly in the hub. DOM ids are `gol-` prefixed.
Slug is `game-of-life`, which is what `sandbox.md` links to.

## Board

`CELL = 8` px, width floored from the wrapper, `H = 520 / 8 = 65` rows (106
columns at 1280px). Two `Uint8Array`s swapped each generation, plus `age`
(generations a cell has been alive, for the Age skin) and `ghost` (fading mark
where a cell died, for Trails).

**Finite on purpose** — the user asked for no infinite canvas. `Edges` chooses
between dead space outside (walls) and a torus (wrap), and the copy leans on the
difference rather than hiding it: a glider into a wall becomes a block at
generation 68, the same glider on a torus runs forever. Both were verified.

## Rules

`RULES` maps a name to `born` / `survive` neighbour counts: Life B3/S23,
HighLife B36/S23, Day & Night B3678/S34678. Everything else in the island is
rule-agnostic.

## Repeat detection

After each generation the board is hashed (FNV-1a over the cell bytes) and
looked up in a map of the last 400 hashes. A hit means the pattern closed a
cycle: period 1 is a still life, anything else is announced as "Period n", and
the run stops. Extinction stops it too. Verified: blinker → period 2, pulsar →
period 3, a random soup settled to period 2 at generation 442, glider into a
wall → still life at 68.

A period longer than 400 generations isn't detected, and on a torus a lone
glider's period is the board's width in cells — deliberately not special-cased.

## Patterns

`PATTERNS` holds string bitmaps: glider, LWSS, blinker, toad, pulsar, Gosper
glider gun, R-pentomino, acorn. The *Click the board to* select decides whether
a click draws single cells or stamps the chosen pattern centred on the click;
the right button always erases. `touch-action: none` on the canvas so drawing
doesn't scroll the page.

## Thumbnail

`thumbnailQuery: "seed=42&pattern=gun&gens=160&skin=age"` — the island reads
`skin`, `rule`, `edges`, `pattern` and (thumbnail only) `gens`. The gun is
stamped near the top-left and 160 generations give it a clean diagonal stream of
gliders. 320 and 520 were tried: by then the early gliders have hit the wall and
the debris starts eating the gun, which reads as a mess.

## Page structure

Short layout, as for Brownian Tree, Sorting and Sandbox: no *Mobile Behavior*
section, *Playground* last.

## Verified

- Glider on wrap still travelling at generation 240; glider into a wall freezes
  as a block; pulsar period 3; soup stabilises; HighLife runs.
- 320px (touch emulation): 280px canvas, no horizontal overflow, no console
  errors.
