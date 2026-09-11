# Kruskal's Algorithm — internal notes

**Source repo:** none. This is the first playground written directly in the
hub rather than migrated from a standalone `index.html` repo, so its
frontmatter has no `sourceRepo` — see below.

## Why `sourceRepo` became optional

`src/pages/[slug].astro` prints "Originally built as a standalone project:"
next to that field unconditionally. For a playground authored here that
sentence is simply false, so the schema field is now `.optional()` and the
detail page only renders the line when it's present. Migrated playgrounds are
unaffected; new ones omit the field.

## Structure

Follows the pathfinding islands (`Bfs.astro` is the nearest relative) — same
`CELL = 20`, same odd-indexed grid where cells sit at odd coordinates and the
walls between them at even ones, same 520px canvas height, same 165 ms
step-by-step tick, same `.playground` two-column layout.

DOM ids are `kr-` prefixed.

### Disjoint-set union

`find` with path compression, `union` by size. This is the only part of the
algorithm with any depth, and it's the reason the visualisation is worth
having: the *Colour components* toggle paints each cell by `find(cell)`, so
merges show up as colours collapsing into one another. Hue is derived directly
from the root id (`root * 47 % 360`), which means two cells share a colour
exactly when they share a set — no colour table to keep in sync.

### Edge order

Kruskal sorts by weight. On an unweighted grid every edge ties, so the island
shuffles instead — a Fisher–Yates over the edge list using `getRandom()` from
`src/lib/seed.ts`, which makes thumbnail capture reproducible. This is noted in
the body copy too, since "sort" with nothing to sort by is a fair question from
a reader.

## Skins

`SKINS` is a plain palette map — `wall`, `open`, `grid`, `centerline`, `frame`.
Switching one re-renders with different colours and nothing else: the grid, the
edge order and the algorithm state are untouched. That separation is load
bearing for the write-up's central claim (a spanning tree doesn't care whether
it's a corridor, a street or a copper trace), so keep skins purely presentational
if more are added.

`centerline` is the only behavioural flag: when set, `drawCentrelines()` paints
a road marking along each open cell, oriented by whether a horizontal or
vertical neighbour is open. Only `city` uses it.

`frame` is written to the wrapper's background because `COLS` is floored from
the wrapper width — the few leftover pixels past the grid's right edge should
read as more wall/block rather than a stray gap. Same trick as BFS/DFS.

## Resize

One-shot draw, so `window.addEventListener('resize', generate)` rebuilds the
grid rather than just resizing the canvas. A bare size reset would blank it,
and a `resize` fires right after first paint when the scrollbar appears — the
bug documented in `bfs.md`. Consequence worth knowing: resizing abandons an
in-progress run, which is deliberate (the old grid no longer exists).

## Thumbnail

`thumbnailQuery: "skin=city"` — the island reads a `skin` URL param at startup.
In `isThumbnailMode()` it disables animation, step mode and component colouring,
then runs to completion, so the card shows a finished street plan rather than a
half-carved grid or a field of confetti.

## Verified

- Spanning-tree invariants on a 41×25 grid (240 cells): accepted = 239 = n−1,
  components fall to exactly 1, considered = accepted + rejected.
- Independently confirmed against the rendered pixels: 240 open cells + 239
  carved walls + 546 remaining walls = 1025 grid squares.
- All three skins produce distinct palettes.
- Step mode enables its button, emits a per-edge verdict, and decrements the
  component count only on accepted edges.
- Resize regenerates rather than blanking; 375px → 17 columns, 320px → 13,
  no horizontal page overflow at either.
