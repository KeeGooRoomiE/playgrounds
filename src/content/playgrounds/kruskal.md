---
title: Kruskal's Algorithm
order: 80
tags: [procedural, graph]
category: graph
description: The minimum spanning tree algorithm, run as a maze generator — sort every edge, keep the ones that join two separate pieces, reject the ones that would close a loop.
thumbnail: /thumbnails/kruskal.png
island: kruskal
thumbnailQuery: "skin=city"
---

## What Is Kruskal's Algorithm?

In 1956, Joseph Kruskal published a two-page paper answering a question from
the telephone industry: given a set of towns and the cost of running cable
between each pair, which cables do you lay to connect everything for the least
money? His answer is almost insultingly simple. Sort every possible cable by
cost. Walk the list from cheapest to dearest. Lay a cable if the two towns it
joins aren't already connected somehow; skip it if they are. Stop when
everything is one network.

What comes out is a **minimum spanning tree** — a set of connections that
reaches every town, costs as little as possible, and contains no redundant
loop. The last part is what makes it a *tree* rather than just a network.

The same procedure generates a perfect maze. Treat each cell of a grid as a
town and each shared wall as a possible cable. Run Kruskal. Every wall it
removes joins two previously separate regions; every wall it keeps would have
closed a loop. The result is a maze where any two cells are connected by
exactly one path — no loops, no unreachable corners, no tuning required.

To find out more, you can read the Wikipedia article on [Kruskal's algorithm](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm).

## How It Works

The whole algorithm is three lines. The difficulty is hidden in one of them:
*"are these two already connected?"* Answering that naively — by searching the
built structure every time — is what turns an elegant idea into a slow one.

```
sort edges by weight
for each edge (a, b) in order:
    if find(a) != find(b):     # different components?
        union(a, b)            # merge them
        keep the edge
    else:
        discard it             # it would close a loop
```

`find` and `union` come from a **disjoint-set union** structure (also called
union-find). Every cell starts in its own set. `find` returns which set a cell
belongs to; `union` merges two sets. Both run in effectively constant time
thanks to two tricks:

```
find(x):                       # path compression
    while parent[x] != x:
        parent[x] = parent[parent[x]]   # flatten as you climb
        x = parent[x]
    return x

union(a, b):                   # union by size
    ra, rb = find(a), find(b)
    if size[ra] < size[rb]: swap(ra, rb)
    parent[rb] = ra            # hang the smaller tree off the bigger
    size[ra] += size[rb]
```

Path compression flattens the tree while you walk it, so the next lookup is
shorter. Union by size keeps the tree from degenerating into a chain. Together
they give an amortised cost so close to constant that the sort dominates the
whole algorithm: **O(E log E)** overall.

On a plain grid every wall costs the same, so there's nothing to sort — a
shuffle stands in for "some arbitrary order among equal weights". That's why
the maze changes every run while the *procedure* never does.

## Playground

**Skin** switches the palette only — Maze, City streets, Circuit board. The
grid, the shuffled edge order and the algorithm are untouched. This is the
point worth sitting with: a spanning tree has no opinion about whether it's a
corridor, a road or a copper trace. Switch skins mid-run and the structure
carries straight over.

**Colour components** paints every cell by which set it currently belongs to.
Leave it on for the first run. At the start it's confetti — every cell is its
own island. Each accepted edge merges two colours into one, and you can watch
the field consolidate until a single colour remains. That moment is the
spanning tree completing.

**Step-by-step (165 ms)** advances one edge at a time and narrates the verdict
under the canvas: whether the two cells were in different sets (wall removed,
sets merged) or the same one (rejected — it would have closed a loop). Watch
the *Rejected* counter climb in the late stages: once most of the grid is one
component, nearly every remaining edge is redundant.

**Run Kruskal** starts over from full walls. **Rebuild walls** resets to the
same edge order so you can replay an identical run; **New grid** reshuffles for
a different maze.

Things worth trying:

- Turn **Animate carving** off for an instant maze — useful for comparing skins
  back to back.
- Watch *Components left*. It starts at the cell count and falls by exactly one
  per accepted edge, never otherwise. A grid of *n* cells always needs exactly
  *n − 1* walls removed — that invariant holds no matter how the shuffle lands.
- Let a run finish and count loops. There are none, anywhere. That's not luck,
  it's the cycle rejection doing its job.

## Mobile Behavior

The controls panel stacks above the canvas below `960px`, as every island here
does — no override. The grid is rebuilt from the wrapper's width rather than
scaled, so a narrow screen gets a genuinely smaller maze (fewer columns at the
same 20px cell) instead of a squashed one. Rotating the device regenerates it
at the new width; an in-progress run is cancelled rather than left half-drawn
against a stale grid.

There is no hover or drag interaction, so nothing degrades on touch: every
control is a button, a toggle or a select. Tested down to 320px, where the grid
settles at 13 columns and stays legible.

## Key Concepts

### Spanning tree

A subset of edges that touches every vertex and contains no cycle. For *n*
vertices it always has exactly *n − 1* edges — one fewer than the number of
things being connected. The playground's *Components left* counter is that fact
running in reverse: start at *n* separate pieces, and each edge you accept
removes exactly one piece.

### Cycle rejection

The only decision Kruskal ever makes. If both ends of an edge are already in
the same component, there is by definition already a path between them, so this
edge would create a second one — a loop. Discarding it is what guarantees the
result is a tree. In maze terms: it's why you never get a corridor that loops
back on itself.

### Disjoint-set union

The data structure that makes the decision cheap. Without it you'd flood-fill
the partial maze on every edge to check connectivity, turning a near-linear
algorithm quadratic. With path compression and union by size, the answer is
effectively constant-time — and the structure is about fifteen lines of code.

### Why the mazes look the way they do

Kruskal picks edges from all over the grid at once, so the maze grows as many
scattered fragments that eventually fuse. That produces short, bushy dead ends
and a fairly uniform texture. Depth-first maze generation, by contrast, carves
one long snake and backtracks, giving long winding corridors. Same perfect-maze
guarantee, visibly different character — the algorithm's shape shows up in the
output.

## Real-World Applications

### Network design

The original problem, still the current one. Laying fibre, running electrical
distribution, planning a pipeline: nodes to connect, a cost per link, and a
requirement to spend as little as possible with no redundant runs. Kruskal or
Prim sits underneath, usually with extra constraints bolted on for capacity and
redundancy — real networks deliberately add loops back for fault tolerance,
which is precisely the thing the pure algorithm forbids.

### Clustering

Stop Kruskal early and you don't get one tree, you get several — and those
components are a clustering of the data. Cut the *k − 1* most expensive edges
of a complete spanning tree and you have *k* clusters. This is single-linkage
hierarchical clustering, arrived at from the other direction, and it's used for
image segmentation and taxonomy building.

### Procedural generation in games

Maze and dungeon layout, exactly as demonstrated here. The guarantee that every
room is reachable and no corridor loops is what makes it safe to generate
levels unattended — no player can spawn in a sealed pocket. Games that want
loops for pacing reasons typically run Kruskal first for the connectivity
guarantee, then knock out a handful of extra walls deliberately.

### Circuit routing

The Circuit skin isn't only decorative. Connecting a set of pins with minimum
total trace length is a spanning tree problem, and MST algorithms provide the
starting estimate that routers then refine around obstacles and layer changes.
