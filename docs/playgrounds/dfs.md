# DFS — internal notes

- **Source repo:** https://github.com/KeeGooRoomiE/dfs-pathfinding-playground
- **Migrated:** 2026-08-25
- **Content entry:** `src/content/playgrounds/dfs.md`
- **Island:** `src/islands/Dfs.astro`

## Migration notes

DOM ids namespaced with a `dfs-` prefix. Same canvas-sizing and legend-dot overrides as [BFS](bfs.md) — this repo shares its exact maze/grid/step-mode architecture (stack instead of queue). Inline `onclick` attributes converted to `addEventListener`. The source footer linked back to the BFS playground ("← BFS"); that cross-link is superseded by the hub's own prev/next navigation, so it wasn't carried over.

Same resize-wipes-the-maze bug as [BFS](bfs.md) — fixed the same way (see BFS notes for the full explanation).

## Original README

```markdown
# DFS Pathfinding Playground

Interactive visualization of Depth-First Search on a procedurally generated maze. Three modes: instant result, animated traversal, and step-by-step with 165ms ticks showing the stack diving deep before backtracking.

🌐 **Live Demo:** https://keegooroomie.github.io/dfs-pathfinding-playground/

Part of the [keegooroomie Algorithms Lab](https://github.com/KeeGooRoomiE) series · [BFS →](https://keegooroomie.github.io/bfs-pathfinding-playground/)

---

## What This Is

DFS dives as deep as possible in a single direction before backtracking. Where BFS expands in concentric rings like ripples, DFS leaves a winding trail — a long corridor that eventually hits dead ends and retreats. It finds a path, not necessarily the shortest one. The traversal pattern is visually distinctive and often counterintuitive to watch.

---

## The Algorithm

```
stack = [start]
visited = {start}
parent = {}

while stack is not empty:
    current = stack.pop()          // LIFO — newest node first

    if current == goal:
        return reconstruct_path(parent, goal)

    for each neighbor of current:
        if neighbor not in visited:
            visited.add(neighbor)
            parent[neighbor] = current
            stack.push(neighbor)   // goes on top
```

One word different from BFS: `stack.pop()` instead of `queue.pop_front()`. The data structure is the algorithm.

**Complexity:** O(V + E) time, O(depth) space — memory-efficient on wide graphs, expensive on deep ones.

---

## DFS vs BFS

| | DFS | BFS |
|--|-----|-----|
| Data structure | Stack (LIFO) | Queue (FIFO) |
| Expansion | Deep dive, backtrack | Concentric rings |
| Shortest path? | No | Yes (unweighted) |
| Memory (wide graph) | Efficient | Expensive |
| Memory (deep graph) | Expensive | Efficient |
| Best for | Reachability, structure, generation | Shortest path |

---

## Modes

| Mode | Description |
|------|-------------|
| **Instant** | Runs full DFS, renders result immediately |
| **Animated** | Stack dives cell by cell (8ms/cell), path traces afterward |
| **Step-by-step** | One stack operation per 165ms tick — watch the stack size and visited count update in real time. Manual → button also available. |

---

## History

In 1882, Charles Trémaux described a method for escaping mazes: mark every passage you traverse, never enter a passage marked twice, backtrack at dead ends. This is DFS with backtracking, written without graph theory because the formalism didn't exist yet.

Formalized on graphs in 1972 by John Hopcroft and Robert Tarjan. Tarjan derived his algorithm for finding strongly connected components directly from DFS the same year — it remains a separate chapter in most algorithm textbooks. Hopcroft and Tarjan received the Turing Award in 1986.

---

## Where DFS Is Used

- **Topological sort** — Terraform, Ansible, and Make resolve resource/task dependencies via post-order DFS
- **Garbage collection** — tracing collectors in JVM, Go, and V8 mark reachable objects with DFS from the root set
- **Maze generation** — recursive backtracker (used in this playground) is DFS; produces long winding corridors
- **Micromouse** — IEEE autonomous robot competition since 1977; robots explore unknown mazes with weighted DFS, physically backtracking through corridors
- **Sudoku / constraint satisfaction** — backtracking search descends depth-first, retreating when no valid value exists
- **Filesystem traversal** — `find`, `du`, `grep -r` all descend into directories recursively

---

## Technical Notes

- Vanilla JS + Canvas API, zero dependencies
- Maze generated via recursive division (same algorithm as BFS playground)
- Start placed on leftmost open column, end on rightmost
- Step mode uses chained `setTimeout(fn, 165)` — no drift, correct mid-run reset behavior
- Frontier cells (on stack, not yet processed) rendered in distinct color from visited cells
- Iterative stack implementation — no recursion, no stack overflow on deep mazes
```
