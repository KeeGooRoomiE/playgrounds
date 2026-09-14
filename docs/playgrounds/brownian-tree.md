# Brownian Tree — internal notes

**Source repo:** none — written directly in the hub. DOM ids are `bt-` prefixed.

## Grid

`PX = 2` canvas pixels per lattice cell, width floored from the wrapper, height
`520 / PX`, like the other islands' 520px canvas. Not `CELL = 20`: a DLA tree
needs thousands of cells across to look like anything. At 1280px desktop the
grid is 339×260 and a single-point tree stops at ~5.8k particles when the launch
circle reaches the edge.

Occupancy is `occ` (particle index per cell), particles are parallel arrays
`xs/ys/parent/kids`. `parent` is the particle a newcomer stuck to, which gives
the tree structure used by *Branch weight*, the lightning strike and the fungal
line widths. Parents always have a lower index than their children, so subtree
weights are one reverse pass.

## Walkers and shortcuts

- **Distance map** `dist` (Manhattan, capped at `CAP = 24`), updated by a BFS
  from each newly stuck cell that only revisits cells that got closer.
- **Hops:** at distance `d ≥ 3` a walker jumps to a uniformly chosen cell on the
  Manhattan ring of radius `d − 2`, which provably can't reach the tree. Wind is
  applied to hops by rejection on the ring direction.
- **Launch strategy** (`strategy()`), by seed:
  - `circle` (single point, no tapped seeds): launch at `rmax + 6`, kill beyond
    `2·rmax + 20` or off-grid. Done when the circle leaves the grid.
  - `above` (ground line): launch 8 rows above the highest particle, x wraps
    around, kill 40 rows above. Done when the launch row reaches the top.
  - `far` (window frame, five seeds, any tapped seed): uniform random cell with
    `dist ≥ 12`. Done after 300 failed draws.
  - `inside` (ring): as `far`, restricted to inside the ring.
  - Frame and ring originally launched from a small disc at the centre; the
    first branch to reach the centre ended growth and left the frost sparse.
- **Particle cap:** 30% of cells, which only the dense seeds ever reach.
- **Round-robin cursor** `rr` across 30 concurrent walkers persists between
  frames, so the per-frame budget (Speed) never changes the sequence — verified:
  speed 7 and 10 give identical counts and stats at seed 42.
- **One particle at a time** uses a single walker with `trail = true`, which
  disables hops so the drawn path is a real walk. Moves per frame `2^speed / 8`.

## Determinism across skins

Everything that shapes growth uses `rand` (`getRandom()`); decoration — strike
timing and tip choice, spores, mineral speckle — uses `Math.random`. Verified:
the seed-42 point tree is 5,820 particles under every skin.

## Skins

`SKINS` holds palette (`a` = old / heavy, `b` = new / light), glow blur radius
and a `decor` switch:

- `storm` (Lightning strike): every 0.9–3.5 s, `buildStrike()` picks one of the
  12 deepest tips, traces `parent` to the root, and adds forks (35% of side
  children, up to 14 steps deep). Drawn with a blue shadow and a screen flash,
  fading over ~550 ms. In thumbnail mode `born = Infinity`, so it stays lit.
- `frost`: gradient glass, soft highlight, thin frame line. Intended pairing is
  the Window frame seed; the skin doesn't force it.
- `fungus` (Fungal spread): instead of pixels, each particle is a line to its
  parent, width bucketed by log subtree weight, drawn once blurred and once
  sharp, plus drifting spores and a vignette. Nod to the *The Last of Us* title
  sequence; no imagery or branding from it is used.
- `speckle` (Mineral): a random speckle texture, cached per canvas size.

## Resize

Continuous `requestAnimationFrame` loop, so the canvas is repainted every frame
and can't be left blank. A grid with growth or tapped seeds is kept and scaled
down by CSS `max-width`; only an untouched grid is rebuilt to the new width,
which covers the resize fired after first paint.

## Thumbnail

`thumbnailQuery: "seed=42&skin=lichtenberg&seedShape=multi&colour=weight"` —
seed 42 at the user's request for this playground; the site-wide capture default
stays `kgrm_s121`. The island reads `skin`, `seedShape` and `colour` from the URL
(`seedShape`, not `seed`, which is the RNG). Thumbnail mode hides walkers and
grows synchronously to completion before the first frame.

## Page structure — deliberate exception

At the user's request this page departs from the mandatory six-section body:
no *Mobile Behavior* section, *Playground* moved to the end and kept to one
paragraph, and the other sections cut to roughly half. Mobile behaviour is
still recorded in the Measured list below. Don't "fix" it back to the template.

## Measured (seed 42, 1280px)

- Point, 100% stickiness: 5,820 particles, tip extensions 77%, rough dimension
  1.80 (1.80–1.89 throughout growth). 10% stickiness: 9,824 particles, 69%, 1.91.
- Ground line 10,253; with wind down 80% 19,812. Window frame 19,710; ring 7,249;
  five seeds hit the 30% cap at 21,502.
- Wind right 60% on a point grows a fan reaching left (upwind).
- 320px: 286px canvas, no horizontal overflow; resize to 300px keeps the tree.
