---
title: BFS — Breadth-First Search
order: 40
tags: [pathfinding, graph]
category: pathfinding
description: The queue-based traversal that expands a maze layer by layer — guaranteed shortest path on unweighted graphs, no heuristics required.
thumbnail: /thumbnails/bfs.png
sourceRepo: https://github.com/KeeGooRoomiE/bfs-pathfinding-playground
island: bfs
# bfs and dfs share the same maze carver — without distinct seeds here they'd
# capture the literal same maze and look identical in the card grid.
thumbnailQuery: "seed=kgrm_bfs"
---

## The Origin

BFS was not invented once. In 1959, Edward F. Moore described it while studying shortest escape paths through mazes — the context was routing signals, not computers, and the paper appeared in a proceedings volume on switching circuits. Two years later, C.Y. Lee independently arrived at the same algorithm while working on printed circuit board routing at Bell Labs. The two men were unaware of each other's work.

The algorithm existed in isolation in each domain — Moore's version for maze traversal, Lee's version for PCB wire routing — under different names, described differently, cited separately. It was only formalized as a general graph traversal procedure in the 1970s, when textbooks on algorithms began to consolidate what practitioners in different fields had already been using for a decade. The name "breadth-first search" came with that formalization.

> 65 years later, nothing has replaced the queue. The data structure is the algorithm: FIFO ordering is what guarantees level-by-level expansion, which is what guarantees shortest path in unweighted graphs. There is no simpler correct solution to this class of problem.

To find out more, you can read the Wikipedia article on [breadth-first search](https://en.wikipedia.org/wiki/Breadth-first_search).

## How It Works

The idea is simpler than the name: put the starting node in a queue. On each step, take the first node out of the queue, look at all its unvisited neighbors, and add them to the end of the queue. Repeat until you reach the goal or the queue empties.

Because the queue is FIFO — first in, first out — every node at distance 1 from the start is processed before any node at distance 2, and every node at distance 2 before any at distance 3. The search expands in concentric layers, like ripples from a stone dropped in water. The moment you reach the goal, you are guaranteed to have found the shortest path — because you processed all shorter-distance nodes first.

```
queue = [start]
visited = {start}
parent = {}

while queue is not empty:
    current = queue.pop_front()      // FIFO — oldest node first

    if current == goal:
        return reconstruct_path(parent, goal)

    for each neighbor of current:
        if neighbor not in visited:
            visited.add(neighbor)
            parent[neighbor] = current
            queue.append(neighbor)   // added to the back
```

The `parent` map records which node we came from. After reaching the goal, we walk backward through this map to reconstruct the path. Without it, we know we can reach the goal, but not how.

### Why FIFO Guarantees the Shortest Path

Each node is added to the queue at the moment it is discovered, with an implicit "distance" equal to its discoverer's distance plus one. Because nodes are processed in insertion order and all edges cost 1, a node at distance d is never processed after a node at distance d+1. The first time the goal is dequeued, it was reached by the shortest possible route — any other route would have reached it later, from a deeper layer.

This property only holds on unweighted graphs. If edges have different costs, processing in insertion order no longer corresponds to processing in order of total cost, and BFS stops being optimal. That is the exact problem Dijkstra's algorithm solves.

### Complexity

Time: O(V + E) — every vertex is enqueued once, every edge is examined once. Space: O(V) for the queue and visited set in the worst case (all nodes reachable). On a grid with N cells, this is O(N) for both, which makes BFS predictable in memory-constrained environments.

## Where BFS Is Used

### Social Networks — Degrees of Connection

LinkedIn's "2nd degree" and "3rd degree" connection labels are computed with BFS from your profile outward through the graph of connections. First-degree connections are layer 1; their connections (excluding yours) are layer 2; and so on. The label is the BFS depth at which a person is first discovered. Running full Dijkstra for this would be unnecessary — all edges are unweighted (a connection is a connection), so BFS is both correct and optimal.

### Network Routing Protocols

Distance-vector routing protocols like RIP propagate reachability information hop by hop, which is structurally BFS on the network graph. Each router knows its immediate neighbors; it broadcasts this knowledge; neighbors incorporate it and broadcast further. Convergence — the state where all routers have a consistent view of the network — corresponds to BFS reaching all nodes from every source simultaneously.

### Rubik's Cube Solving

God's Number — the maximum number of moves required to solve any Rubik's Cube configuration — was proven to be 20 in 2010, after a distributed computation that explored roughly 43 quintillion states. The exploration was bidirectional BFS: from the solved state forward, and from the scrambled state backward, meeting in the middle. BFS guarantees that the meeting point is the shortest solution because both frontiers expand by one move per layer.

### Game AI and NPC Navigation

On tile-based maps with uniform movement cost — every step costs the same whether moving on grass, stone, or sand — BFS finds the shortest path with less overhead than A*. No heuristic computation, no priority queue, just a plain queue. For simple NPCs on small maps this is often the right choice.

### Dependency Resolution

Package managers, build systems, and Kubernetes all perform reachability and ordering computations on dependency graphs. BFS on the dependency graph starting from a package gives you all transitive dependencies in order of depth — immediate dependencies first, their dependencies second. This is exactly the information needed to determine installation order and detect circular dependencies at the earliest possible point.

## Limitations

BFS is complete (it finds a path if one exists) and optimal (the path is shortest) on unweighted graphs. Both properties break on weighted graphs — an edge of cost 10 looks identical to an edge of cost 1 from BFS's perspective, since it processes by insertion order, not by cumulative cost.

Memory is the practical constraint. BFS stores the entire frontier in the queue, which in the worst case is O(V). On a 1000×1000 grid with no walls, the frontier at the halfway point is roughly 2000 cells. For very large graphs this becomes a problem — iterative deepening DFS (IDDFS) achieves BFS's optimality with O(d) space, at the cost of re-exploring nodes. Bidirectional BFS halves the search depth by running two simultaneous BFS instances from start and goal, reducing frontier size significantly.

For anything with non-uniform edge costs, Dijkstra generalizes BFS correctly by replacing the FIFO queue with a priority queue ordered by cumulative cost. For known single-target problems with a spatial heuristic available, A* further reduces the number of nodes explored. But both are extensions of the same core idea: maintain a frontier, expand it systematically, track where you came from.
