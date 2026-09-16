---
title: DFS — Depth-First Search
order: 50
tags: [pathfinding, graph]
category: graph
description: The stack-based traversal that dives as deep as possible before backtracking — finds a path, not necessarily the shortest one.
thumbnail: /thumbnails/dfs.png
thumbnailAlt: "A maze where a long orange trail wanders through most corridors, with a pink path marking the route that reached E."
sourceRepo: https://github.com/KeeGooRoomiE/dfs-pathfinding-playground
island: dfs
# bfs and dfs share the same maze carver — without distinct seeds here they'd
# capture the literal same maze and look identical in the card grid.
thumbnailQuery: "seed=kgrm_dfs"
---

## The Origin

The history of DFS predates BFS by almost a century. In 1882, French mathematician Charles Trémaux described a method for escaping mazes: mark every passage you traverse, never enter a passage marked twice, and when you reach a dead end, backtrack to the last junction with an unmarked passage. This is DFS with backtracking, described without graph theory — graphs as a formalism didn't exist yet in that form.

The algorithm was formalized on graphs in 1972 by John Hopcroft and Robert Tarjan, who received the Turing Award in 1986 partly for this and related work. Tarjan also derived his algorithm for finding strongly connected components directly from DFS — it remains a separate chapter in most textbook treatments today. The core operation is the same: descend as deep as possible, then backtrack.

> 90 years between Trémaux's maze paper and the formal graph algorithm. The idea is old enough that it predates the vocabulary used to describe it.

To find out more, you can read the Wikipedia article on [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search).

## How It Works

Where BFS uses a queue and processes nodes in the order they were discovered, DFS uses a stack and always processes the most recently discovered node first. The effect: instead of expanding outward in rings, DFS dives in a single direction as deep as it can go, then backtracks when it hits a dead end and tries the next available direction.

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

The structural difference from BFS is one word: `stack.pop()` instead of `queue.pop_front()`. Everything else — visited set, parent map, path reconstruction — is identical. The behavior is completely different.

### Why DFS Does Not Guarantee the Shortest Path

BFS processes nodes in order of distance from the start, so the first time it reaches the goal it has taken the fewest possible steps. DFS has no such guarantee — it reaches the goal via whatever path it happened to dive into first. On a grid with an open path going directly right and a long winding path going left first, DFS may find the long path before the short one depending on neighbor ordering.

This is not a flaw being worked around — it's the correct behavior for problems where shortest path is irrelevant. DFS answers "is there a path?" and "what is the structure of the graph?" faster than BFS in many practical cases, because it doesn't need to maintain the full frontier in memory.

### Recursive Form

DFS maps naturally to recursion because the call stack is itself a stack. The iterative and recursive versions are equivalent:

```
def dfs(current, goal, visited, parent):
    if current == goal:
        return True
    for neighbor in neighbors(current):
        if neighbor not in visited:
            visited.add(neighbor)
            parent[neighbor] = current
            if dfs(neighbor, goal, visited, parent):
                return True
    return False
```

The recursive form is cleaner to read and harder to control — stack depth equals the length of the current path, which causes stack overflow on deep graphs. Iterative DFS with an explicit stack is preferred in production.

### Complexity

Time: O(V + E) — same as BFS. Space: O(V) worst case for the stack, but in practice the stack holds only the current path plus branching points, making it significantly more memory-efficient than BFS on wide graphs. On a maze with long corridors, BFS maintains a frontier thousands of cells wide; DFS maintains a stack one path deep.

## Where DFS Is Used

### Topological Sort — Terraform, Ansible, Make

Topological sort orders nodes in a directed acyclic graph such that every edge points from earlier to later in the ordering. The standard algorithm is DFS: run a full depth-first traversal, and append each node to the result list on the way back up (post-order). The result is a valid topological order. Terraform uses this to determine the order in which to create cloud resources — a database must exist before the application server that depends on it. Ansible resolves task dependencies the same way. Make has done it since 1976.

### Garbage Collection — Tracing Collectors

Mark-and-sweep garbage collectors, used in the JVM, Go, and V8, perform DFS from the root set (globals, stack frames, registers) through the object graph. Every reachable object gets marked. Anything unreached is garbage. DFS is used here rather than BFS because it follows object references naturally — you descend into an object's fields, then their fields — and requires less auxiliary memory than maintaining a BFS frontier across a large heap.

### Maze Generation

Recursive backtracker — the maze generation algorithm used in this and the BFS playground — is DFS. Start at a random cell, mark it visited, pick a random unvisited neighbor, carve a passage and recurse. When stuck, backtrack. The result is a perfect maze: exactly one path between any two cells, no loops, every cell reachable.

### Micromouse and Autonomous Robot Competitions

Micromouse is an IEEE competition running since 1977 where small autonomous robots navigate an unknown 16×16 maze as fast as possible. A common exploration strategy is modified DFS with weighted neighbor selection. After a full exploration run, the robot uses the discovered map for a fast speed run — competitors routinely reach solve times under 5 seconds on a maze with 256 cells.

### Sudoku and Constraint Satisfaction

Backtracking search for constraint satisfaction problems — Sudoku solving, N-queens, scheduling — is DFS. Place a value in a cell, recurse into the next cell, and if no valid value exists, backtrack to the previous cell and try the next value.

### Filesystem Traversal

`find`, `du`, `grep -r`, and every recursive file operation descend into a directory, process its contents, descend into subdirectories, and return — DFS.

## DFS vs BFS on a Grid

| | DFS | BFS |
|---|---|---|
| Data structure | Stack (LIFO) | Queue (FIFO) |
| Expansion pattern | Deep dive, backtrack | Concentric rings |
| Shortest path? | No | Yes (unweighted) |
| Memory (wide graph) | O(depth) — efficient | O(width) — expensive |
| Memory (deep graph) | O(depth) — expensive | O(width) — efficient |
| Best for | Reachability, structure, generation | Shortest path, layer-by-layer |

On a grid maze, DFS typically visits more cells than necessary to find a path, but uses less memory than BFS because it only needs to remember the current path and its branch points. The path it finds is valid but rarely shortest.
