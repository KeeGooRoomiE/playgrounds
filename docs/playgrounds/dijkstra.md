# Dijkstra — internal notes

- **Source repo:** https://github.com/KeeGooRoomiE/dijkstra-playground
- **Migrated:** 2026-08-25
- **Content entry:** `src/content/playgrounds/dijkstra.md`
- **Island:** `src/islands/Dijkstra.astro`

## Migration notes

DOM ids namespaced with a `dk-` prefix. Same canvas-sizing override as [BFS](bfs.md)/[DFS](dfs.md) plus `cursor: crosshair` (this island supports click-and-drag terrain painting directly on the canvas). Terrain brush buttons previously toggled their "selected" look by writing `style.outline`/`style.boxShadow` directly from JS, even though the source's own CSS already defined an unused `.terrain-btn.active` rule for the same purpose — cleaned up to actually use a class toggle (`.dk-terrain-btn.active`) instead of duplicating the styling in JS. Inline `onclick`/`onchange` attributes converted to `addEventListener`.

Same resize-wipes-the-grid bug as [BFS](bfs.md) — fixed the same way (see BFS notes for the full explanation); here the fix regenerates via `generateMap()`.

## Original README

```markdown
# Dijkstra's Algorithm Playground

Interactive visualization of Dijkstra's algorithm on a paintable terrain map. Road, plains, forest, and water tiles carry different movement costs — watch the algorithm avoid expensive terrain even when it means taking more steps. Each visited cell shows its `dist[]` value in real time.

🌐 **Live Demo:** https://keegooroomie.github.io/dijkstra-playground/

Part of the [keegooroomie Algorithms Lab](https://github.com/KeeGooRoomiE) series · [← BFS](https://keegooroomie.github.io/bfs-pathfinding-playground/) · [DFS →](https://keegooroomie.github.io/dfs-pathfinding-playground/)

---

## What This Is

Dijkstra is the first pathfinding algorithm that cares about the cost of a step, not just the count. On a uniform grid it behaves identically to BFS. The difference appears the moment terrain has different traversal costs — a highway covers more distance but costs less than a swamp. Dijkstra always finds the minimum-cost path, not the minimum-hop path.

---

## The Algorithm

```
dist = {start: 0, every other node: ∞}
pq = PriorityQueue()
pq.push(start, priority=0)
parent = {}

while pq is not empty:
    current, cost = pq.pop_min()     // cheapest known node first

    if current == goal:
        return reconstruct_path(parent, goal), cost

    for each neighbor, edge_cost of current:
        new_cost = dist[current] + edge_cost
        if new_cost < dist[neighbor]:
            dist[neighbor] = new_cost
            parent[neighbor] = current
            pq.push(neighbor, priority=new_cost)
```

The relaxation step — updating a neighbor's cost when a cheaper route is found — is the core of the algorithm. Once a node is popped from the priority queue, its shortest distance is final and will not change.

**Complexity:** O((V + E) log V) with a binary heap.

---

## Terrain Costs

| Terrain | Cost per step |
|---------|--------------|
| 🟡 Road | 1 |
| 🟢 Plains | 2 |
| 🌲 Forest | 4 |
| 🌊 Water | 8 |
| ⬛ Wall | impassable |

---

## Modes

| Mode | Description |
|------|-------------|
| **Instant** | Full Dijkstra, result rendered immediately |
| **Animated** | Priority queue expands cell by cell (10ms/cell), path traces afterward |
| **Step-by-step** | One PQ operation per 165ms — shows current node, cost, and PQ size. Manual → also available. |

All modes show `dist[]` values on visited cells when the toggle is enabled.

---

## Controls

| Control | Action |
|---------|--------|
| Terrain brush buttons | Select paint mode (road/plains/forest/water/wall/start/end/erase) |
| Click or drag on canvas | Paint terrain |
| **Generate map** | Random terrain with ~12% walls |
| **Run Dijkstra** | Execute with selected mode |
| **→ Next step** | Manual tick in step-by-step mode |
| **Clear path** | Remove visited/path overlay, keep terrain |
| **Show dist[] values** toggle | Show/hide cumulative cost labels on visited cells |

---

## History

Edsger W. Dijkstra devised the algorithm in 1956 while sitting in a café in Amsterdam, solving a demonstration problem for a new computer at the Mathematical Centre: find the shortest route between two Dutch cities — Rotterdam to Groningen. He worked it out in roughly twenty minutes without paper or pencil. The constraint of having no paper forced him to discard every unnecessary complexity.

The paper was published in 1959, three pages long. It is one of the most cited papers in computer science. Dijkstra received the Turing Award in 1972, partly for this and related work on graph algorithms and structured programming.

---

## Where Dijkstra Is Used

- **GPS navigation** — minimum travel-time routing on road graphs with live traffic weights
- **OSPF network routing** — each router runs Dijkstra on the full link-state graph; edge weights are link metrics (bandwidth, delay, load)
- **Game AI** — unit pathfinding on terrain maps with different movement costs; the basis of most RTS pathfinding
- **Airline/cargo routing** — minimum-cost paths through hub networks
- **Dijkstra vs BFS** — BFS is Dijkstra with all edge weights = 1; the priority queue degenerates to a FIFO queue

---

## Technical Notes

- Vanilla JS + Canvas API, zero dependencies
- Priority queue implemented as a sorted array — sufficient for playground grid sizes, simpler than a binary heap
- Stale entries in the PQ (from relaxation updates) are skipped when popped via visited set check
- `dist[]` grid rendered as overlay on top of terrain colors — terrain always visible underneath
- Step mode uses chained `setTimeout(fn, 165)` — no drift, correct mid-run reset
```
