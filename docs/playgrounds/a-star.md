# A* Search — internal notes

**Source repo:** none — written directly in the hub, modelled on `Dijkstra.astro`.
DOM ids are `as-` prefixed. Slug `a-star`, `order: 65` so it sits between
Dijkstra (60) and Galaxy Sampler (70) in prev/next.

## The honesty rule

The whole page is a comparison, so the maps must be the maps the neighbouring
pages show. `generateTerrain()` is Dijkstra's `generateMap()` and
`generateMaze()` is BFS's, copied with `rand()` calls in the same order, the same
`init()` start/end defaults (whose cells get reset to `empty` before
`findOpenSide`, which affects where S and E land), the same cell sizes (24px
terrain, 20px maze) and the same resize behaviour (`init(); generate()`, which
draws a fresh map from the continuing RNG). **If either source page's generator
changes, change it here too**, or seeded comparisons silently stop being true.

Verified at 1280px:
- Terrain, seeds `kgrm_s121`, `42`, `abc`: canvas pixels identical to the
  Dijkstra page before running; at w = 0 the expanded count and path cost equal
  the Dijkstra page's (552/68, 644/82, 599/65).
- Maze, seeds `kgrm_bfs`, `42`, `abc`: wall layout identical to the BFS page
  (sampled at every cell centre; the palettes differ so raw pixels don't), and
  w = 0 expands the same number of cells BFS visits.

Because the URL comparison still depends on window width and event history, the
page also carries its own comparison: every run first solves the same map at
w = 0 (`runToEnd(0, …)`), which feeds *Dijkstra expands*, *Cheapest possible*,
the hatched ghost area and the dashed optimal path.

## Search

`astar(weight, kind)` is a generator yielding one expansion at a time; instant,
animated (10ms per expansion, like Dijkstra) and step (165ms + button) modes
all drain the same generator.

- Queue: array sorted by `f` then larger `g` first, `shift()`ed — the same
  stable-sort structure as Dijkstra's page. At w = 0 the `g` tie-break is inert,
  which is why counts match exactly.
- Closed set, no reopening. With w > 1 the heuristic is inadmissible and a
  closed cell could later be reached more cheaply; not reopening is standard
  weighted A* and keeps the cost ≤ w·C* bound.
- Heuristics: Manhattan or Euclidean in cells. Minimum terrain cost is 1, so
  both are admissible.
- `weight` change or heuristic change re-runs automatically once a path is on
  screen, which is what makes the slider feel continuous.

## Drawing

After a run the terrain is drawn at 40% over white so the indigo flood and
the hatched "Dijkstra only" cells read as areas. The first version tinted
full-strength terrain and was unreadable (yellow + indigo, green + indigo).
The dashed red optimal path only appears when the found path costs more.

Pointer events replace Dijkstra's mouse events, so painting works on touch.

## Measured (terrain, seed `kgrm_s121`, 1280px; expanded / cost)

| w | 0 | 0.5 | 1 | 1.5 | 2 | 3 | 5 |
|---|---|---|---|---|---|---|---|
| kgrm_s121 | 552/68 | 457/68 | 301/68 | 189/68 | 89/68 | 49/79 | 38/93 |
| 42 | 644/82 | 590/82 | 465/82 | 288/82 | 177/88 | 70/104 | 38/114 |

Euclidean at w = 1: 374 vs Manhattan 301 (kgrm_s121), 545 vs 465 (42). Maze
(kgrm_s121): A* at w = 1 saves 6% over Dijkstra; maze seed 42: 0%.

## Thumbnail

`thumbnailQuery: "weight=3"` on the default capture seed `kgrm_s121` — the same
seed the Dijkstra thumbnail uses, so the two cards show the same map. Weight 3
is the frame where all three layers are visible: a thin A* flood, the hatched
Dijkstra area, and the dashed cheaper path the fast search missed.

## Page structure

Short layout, like the recent playgrounds: no *Mobile Behavior* section,
*Playground* last. The body links back to Dijkstra (and to BFS) at the user's
request.

320px: 264px canvas, no horizontal overflow, no console errors.
