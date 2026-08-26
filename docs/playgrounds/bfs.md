# BFS — internal notes

- **Source repo:** https://github.com/KeeGooRoomiE/bfs-pathfinding-playground
- **Migrated:** 2026-08-25
- **Content entry:** `src/content/playgrounds/bfs.md`
- **Island:** `src/islands/Bfs.astro`

## Migration notes

DOM ids namespaced with a `bfs-` prefix. The maze grid renders at an exact pixel size (`canvas.width = COLS * CELL`, no devicePixelRatio scaling), and depends on the canvas's CSS box matching that pixel buffer 1:1 — the hub's default global `canvas { width:100%; height:600px }` rule was overridden with a scoped `width:auto;height:auto` for this island. Legend dots restyled to small squares (`border-radius:2px`) instead of the hub's default circular dots, since they represent grid-cell colors, not category swatches.

Note: the source README's controls table lists a "Clear all" button ("Reset to empty grid") that does not exist in the actual `index.html` — confirmed absent via grep during planning. Not carried over, since it was never implemented in the original either. Inline `onclick` attributes converted to `addEventListener`.

**Bug found and fixed during testing:** the source's `window.addEventListener('resize', init)` calls `init()` alone, which resets `grid` to empty and re-renders — but never regenerates the maze. On the standalone single-purpose page this rarely mattered; on the hub's page (sidebar + long article) a vertical scrollbar appears after first paint, firing a native `resize` event almost immediately, which wiped the maze to blank right after load. Fixed by having the resize handler call `init(); generateMaze();` together, matching the pattern already used by `perlin-noise`/`galaxy-sampler`. Same bug existed in [DFS](dfs.md), [Dijkstra](dijkstra.md), and [L-Systems](l-system.md) — fixed identically in all four.

## Original README

```markdown
# BFS Pathfinding Playground

Interactive visualization of Breadth-First Search on a procedurally generated maze. Three modes: instant result, animated traversal, and step-by-step with 165ms ticks showing the queue expanding layer by layer.

🌐 **Live Demo:** https://keegooroomie.github.io/bfs-pathfinding-playground/

---

## What This Is

BFS is the foundational shortest-path algorithm for unweighted graphs. It expands in concentric layers from the start — every neighbor at distance 1 before any node at distance 2 — guaranteeing the shortest path by construction. The visualization makes the layered expansion visible: watch the frontier grow like ripples, then trace back the optimal route.

Part of the [keegooroomie Algorithms Lab](https://github.com/KeeGooRoomiE) series on pathfinding algorithms.

---

## The Algorithm

```
queue = [start]
visited = {start}
parent = {}

while queue is not empty:
    current = queue.pop_front()       // FIFO — oldest node first

    if current == goal:
        return reconstruct_path(parent, goal)

    for each neighbor of current:
        if neighbor not in visited:
            visited.add(neighbor)
            parent[neighbor] = current
            queue.append(neighbor)    // added to the back
```

FIFO ordering is what guarantees shortest path: every node at depth d is processed before any node at depth d+1. The first time the goal is dequeued, it was reached by the shortest possible route.

**Complexity:** O(V + E) time, O(V) space.

---

## Modes

| Mode | Description |
|------|-------------|
| **Instant** | Runs full BFS, renders result immediately |
| **Animated** | Frontier expands cell by cell (8ms/cell), path traces afterward |
| **Step-by-step** | One queue operation per 165ms tick — watch the frontier, queue size, and visited count update in real time. Manual → button also available. |

---

## Controls

| Control | Action |
|---------|--------|
| **Generate maze** | New recursive-division maze with start on left, end on right |
| **Run BFS** | Execute with selected mode |
| **→ Next step** | Manual tick in step-by-step mode |
| **Clear path** | Remove visited/path overlay, keep maze |
| **Clear all** | Reset to empty grid |

---

## Visual Legend

| Color | Meaning |
|-------|---------|
| 🟩 Green | Start |
| 🟥 Red | End |
| ⬛ Dark | Wall |
| 🔵 Light blue | Visited |
| 💙 Blue | Frontier (in queue) |
| 🟡 Amber | Shortest path |

---

## History

BFS was not invented once. Edward F. Moore described it in 1959 while studying shortest escape paths through mazes. C.Y. Lee independently arrived at the same algorithm in 1961 while working on PCB wire routing at Bell Labs. The two were unaware of each other. The algorithm existed under different names in different domains until the 1970s, when it was formalized as a general graph traversal procedure in algorithm textbooks.

---

## Technical Notes

- Vanilla JS + Canvas API, zero dependencies
- Maze generated via recursive division (guaranteed solution)
- Start placed on leftmost open column, end on rightmost — maximizes path length
- Step mode uses `setTimeout(fn, 165)` chained calls, not `setInterval` — avoids drift and correctly handles mid-run resets
- Frontier cells (in queue, not yet processed) rendered in a distinct color from visited cells (already processed) — the distinction matters for understanding BFS state
```
