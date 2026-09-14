# Hamiltonian Path — internal notes

**Source repo:** none — written directly in the hub, like Kruskal, so no
`sourceRepo` in the frontmatter.

DOM ids are `ham-` prefixed.

## Why the grid isn't `CELL = 20`

Every other grid island floors its column count from the wrapper width at a
fixed 20px cell. That can't work here: Hamiltonian search is exponential, and a
40×25 board with blocks would never finish. The board is a fixed N×N (4–10)
chosen by the visitor, and the *cell size* is what adapts —
`min(wrapper width, 520) / N`, floored at 16px. The 520px cap matches the height
the other islands use.

## Resize

Because the board no longer depends on viewport width, the resize handler
rescales and redraws the current state rather than regenerating. This still
satisfies the one-shot-draw rule from `bfs.md` — setting `canvas.width` wipes
the bitmap, so a redraw is mandatory — but it deliberately does *not* cancel a
search in progress, unlike Kruskal's.

## Search

Iterative backtracking with an explicit stack: `path` plus `choices[k]`, the
untried neighbours of `path[k]`. `stepOnce()` performs one *visible* event —
extend, refuse (pruned) or back up — which is what lets animation, step mode
and the silent solver share one implementation.

- **Order:** Warnsdorff's rule — fewest unvisited onward neighbours first.
- **Pruning (`feasible()`), checked after tentatively entering a cell:**
  unvisited cells must stay connected to the head; each must have ≥2 exits
  (cycle: counting the start) or, for a path, at most one may have a single
  exit; a cycle must not wall in its start and must finish adjacent to it.
- **Fixed start:** for a cycle this is without loss of generality, so an
  exhausted search proves no cycle exists at all. For a path it only proves
  none exists *from that start* — the copy says so.
- **Budget:** `MAX_MOVES = 400000` visible events, then "Gave up". Instant mode
  runs in 20k-event chunks via `setTimeout(0)` so a hopeless search can't freeze
  the tab.

## Impossibility proofs (`proveImpossible()`)

Run before searching when *Check parity first* is on: connectivity, checkerboard
parity (cycle: equal counts; path: differ by ≤1 and start on the majority
colour), and degree-1 cells (cycle: none; path: ≤2, and if 2 the start is one of
them). Turning the toggle off is the teaching moment — the search has no parity
awareness and grinds to the same verdict.

## Random fields

`randomField()` scatters blocks at the chosen density using `getRandom()`.
With *Guarantee solvable* on, it also rebalances parity by blocking extra
majority-colour cells, picks a start on the correct colour, and `generate()`
rejection-samples: draw, silently search with a 6000-event budget, repeat up to
60 times, halving density every 15 failures. The last draw is kept even if it
failed, which in practice doesn't happen at the slider's 30% maximum.

Measured on 8×8 at 12% with the toggle off, 20 draws: 17 rejected by the proof,
2 exhausted by search, 1 solvable.

## Skins

Presentational only (`SKINS` + a `style` switch in `render()`): Snake draws a
tail-to-head lightness gradient and eyes oriented by the last move; Line puzzle
a flat stroke; Graph draws every adjacency edge faintly so the underlying graph
is visible. A completed cycle adds a dashed closing segment.

## Thumbnail

Default skin (snake), default goal (path), seed `kgrm_s121`, no `thumbnailQuery`.
In thumbnail mode the canvas is padded sideways by `OX = N·CS/6` so the square
board becomes 4:3 and survives the card's `object-fit: cover` without losing
rows.

## Verified

- Guaranteed-solvable fields solve for path and cycle at 4, 6, 8 and 10;
  10×10 generation ≈130 ms including rejection sampling.
- 5×5 and 7×7 empty cycle: rejected by parity with the counts in the message;
  with proofs off, 5×5 exhausts in ~1.8k moves with the same verdict.
- 5×5 with one dark corner blocked: cycle of 24 found.
- Tap editing toggles blocks and moves the start; resize mid-search keeps
  searching.
- 320px viewport: 280px canvas (28px cells at 10×10), no horizontal overflow.
