---
title: A* Search
order: 65
tags: [pathfinding, graph, weighted]
category: graph
description: Dijkstra with a sense of direction — and one slider that turns Dijkstra into A* into greedy search on the same map, so you can watch the moment the cheapest path stops being guaranteed.
thumbnail: /thumbnails/a-star.png
thumbnailAlt: "A pastel terrain grid where a thin violet band hugs an orange path along the top from S to E, a red dashed cheapest path dips below it, and hatching fills the rest of the map Dijkstra would have searched."
island: a-star
thumbnailQuery: "weight=3"
---

## What Is A*?

[Dijkstra's algorithm](../dijkstra/) finds the cheapest path, but it has no idea
where the goal is. It spreads out evenly in every direction, cheapest first, and
only stops when the goal happens to come up. On a map where the goal is due
east, it searches just as hard to the west.

**A\*** adds a sense of direction. For every cell it also estimates how far is
left to the goal, and it explores the cells that look best *overall*: cost so
far plus estimated cost to go. Peter Hart, Nils Nilsson and Bertram Raphael
published it in 1968 at the Stanford Research Institute, where they needed it
to plan routes for Shakey, one of the first mobile robots.

The catch is in the estimate. Keep it honest — never guessing more than the
real remaining cost — and A* still finds the cheapest path, usually after
searching a fraction of the map. Inflate it, and search gets faster still, but
the guarantee goes. The slider on this page lets you find that line yourself.

To find out more, you can read the Wikipedia article on [A* search algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm).

## How It Works

```
f(cell) = g(cell) + w · h(cell)

g — the cheapest known cost from the start to this cell
h — an estimate of the cost from this cell to the goal
w — how much to trust the estimate

repeat: take the cell with the smallest f from the queue,
        stop if it's the goal, otherwise push its neighbours
```

It's [Dijkstra](../dijkstra/) with one term added. Dijkstra orders the queue by
**g** alone; A* orders it by **g + h**.

**The heuristic** here is the grid distance to the goal: Manhattan distance
(steps across plus steps down), or the straight-line distance. The cheapest
terrain costs 1 per cell, so neither can ever claim the goal is further than it
really is. That property — never overestimating — is called **admissible**, and
it's exactly what keeps the path optimal.

**The weight** is where the three algorithms meet:

- **w = 0** — h drops out and f is just g. This *is* Dijkstra: on the same map
  it expands exactly as many cells as the [Dijkstra page](../dijkstra/) does.
- **w = 1** — classic A*. Cheapest path guaranteed, far less searching.
- **w > 1** — weighted A*, which Ira Pohl studied in 1970. The estimate now
  outweighs the real cost, so search charges at the goal. The path is no longer
  guaranteed cheapest, only at most *w* times the cheapest.
- **w large** — practically greedy best-first search: go wherever looks closest,
  whatever it costs.

## Key Concepts

### Same map, honest comparison

The terrain and maze here are made by the same generators as the
[Dijkstra](../dijkstra/) and [BFS](../bfs/) pages, so the same `?seed=` in the
address, at the same window width, gives the same map on all three. On the page itself, every run also
solves the map with Dijkstra in the background: the hatched cells are what it
would have searched, and *Dijkstra expands* is its count.

### Where the guarantee breaks

On one terrain map (the one in this page's preview), A* at weight 1 finds
the cost-68 path with 45% fewer cells than Dijkstra. Weight 2 cuts that to 89
cells and the path is *still* cheapest. At weight 3 it expands 49 cells, and the
path costs 79. The bound is loose, and "not guaranteed" isn't the same as
"wrong" — the slider shows how often you get away with it.

### A better estimate searches less

Straight-line distance is admissible too, but on a grid without diagonal moves
it underestimates more than Manhattan distance does. On the same map, A* with it
expands 374 cells instead of 301. The closer h is to the true remaining cost,
the less there is to search.

### When the heuristic can't help

Switch to the maze. A straight line to the goal points through walls, so the
estimate is nearly useless: A* saves only a few percent over Dijkstra. A
heuristic is only as good as the map lets it be.

## Real-World Applications

### Games

A* is the default pathfinding algorithm in games: units crossing a tile map,
characters routing around obstacles. Designers often inflate the heuristic
to trade a slightly longer route for a faster search.

### Robots

It was invented for a robot, and planners for robots and autonomous vehicles
still build on it, usually over a map of free and occupied space.

### Route planning

Road-network routing uses A* variants with much better estimates than a straight
line, for example precomputed distances to a few landmarks, which cut the search
down dramatically on continent-sized graphs.

### Puzzles

Solvers for the 15-puzzle and the Rubik's Cube search a graph of positions
guided by an admissible estimate of moves remaining. IDA*, a memory-light
version of A*, is the classic tool for optimal 15-puzzle solutions.

## Playground

Press **Run A\*** and move the **Heuristic weight** slider: every change re-runs
the search on the same map. At 0 the flood matches Dijkstra; at 1 it narrows
toward the goal; somewhere past 1 the orange path peels away from the red dashed
cheapest one. **Compare with Dijkstra** shows the extra area Dijkstra would
search, and **Show f = g + w·h** prints each cell's score. Paint terrain and
walls with the **Brush**, switch the **Map** to the maze, or try the straight-line
**Heuristic**.
