---
title: Dijkstra's Algorithm
order: 60
tags: [pathfinding, graph, weighted]
category: graph
description: The priority-queue generalization of BFS to weighted graphs — finds the cheapest path, not the shortest one, by always expanding the least-costly frontier node first.
thumbnail: /thumbnails/dijkstra.png
sourceRepo: https://github.com/KeeGooRoomiE/dijkstra-playground
island: dijkstra
---

## Rotterdam to Groningen

In 1956, Edsger W. Dijkstra was sitting in a café in Amsterdam with his fiancée. He was thinking about a demonstration problem for a new computer at the Mathematical Centre: find the shortest route between two Dutch cities. He worked it out in about twenty minutes, without paper or pencil, selecting a solution that was clean enough to describe without writing anything down. The algorithm was published in 1959 in a three-page paper. It is one of the most cited papers in computer science.

Dijkstra later said the elegance came from the constraint of having no paper — every unnecessary complexity was a burden he couldn't afford to carry mentally, so he discarded it. The result was an algorithm with exactly one central idea and nothing else attached to it.

Dijkstra also invented the semaphore for process synchronization, formulated the dining philosophers problem, and wrote the foundational essay "Go To Statement Considered Harmful." He received the Turing Award in 1972.

> The name. In Dutch: "Dijkstra" — the IJ is a digraph pronounced roughly like the English "eye". In English it gets anglicized in various ways.

To find out more, you can read the Wikipedia article on [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm).

## How It Works

BFS finds the shortest path in terms of hops — the fewest edges. Dijkstra finds the shortest path in terms of cost — the lowest sum of edge weights. On a map where every step costs 1, they behave identically. The difference appears the moment a step through a swamp costs 8 and a step on a road costs 1.

The mechanism: instead of a plain queue, Dijkstra uses a priority queue ordered by cumulative cost from the start. At each step, it extracts the node with the lowest known cost, updates its neighbors if a cheaper route is found, and continues. It never revisits a node it has already finalized — once a node is extracted from the priority queue, its shortest distance is known and will not improve.

```
dist = {start: 0, every other node: ∞}
pq = PriorityQueue()
pq.push(start, priority=0)
parent = {}

while pq is not empty:
    current, cost = pq.pop_min()     // cheapest known node

    if current == goal:
        return reconstruct_path(parent, goal), cost

    for each neighbor, edge_cost of current:
        new_cost = dist[current] + edge_cost
        if new_cost < dist[neighbor]:
            dist[neighbor] = new_cost
            parent[neighbor] = current
            pq.push(neighbor, priority=new_cost)
```

### Why the Priority Queue

BFS uses a plain FIFO queue because all edges cost 1 — nodes discovered earlier are always closer. With variable costs, insertion order tells you nothing about total cost. The priority queue ensures that when you process a node, you are processing the globally cheapest unfinished node — which is what guarantees optimality.

When a cheaper route to a neighbor is discovered, its priority in the queue is updated (or a new entry added and the old one ignored when popped). This "relaxation" operation is the core of the algorithm: every time you find a cheaper path to a node, you update its known cost and propagate that outward.

### Why It Never Goes Back

Once a node is popped from the priority queue with cost C, there is no path to it cheaper than C — because every node still in the queue has cost ≥ C (the queue is ordered), and edge costs are non-negative, so any path through those nodes would cost at least C. This is why Dijkstra requires non-negative edge weights: negative weights break the guarantee that popping the minimum gives you the final answer.

### Complexity

With a binary heap: O((V + E) log V). With a Fibonacci heap: O(E + V log V). In practice, binary heap is used almost everywhere — Fibonacci heaps have high constant factors that make them slower on real inputs despite better asymptotic complexity.

## Playground

Paint terrain with different movement costs, then run Dijkstra. Each visited cell shows its `dist[]` value — the total cost to reach it from start. Watch how the algorithm avoids expensive terrain even when it means taking more steps. The path shown is not the shortest by hops — it is the cheapest by total cost.

## Where Dijkstra Is Used

### GPS Navigation

Every GPS system and mapping application routes on a weighted graph of road segments. The weight is not distance — it is estimated travel time, which accounts for speed limits, road type, and live traffic data. A highway covers more distance than a city street but costs less in time per kilometer. Dijkstra (or a Contraction Hierarchies variant) finds the minimum-time path through this graph.

### Network Routing — OSPF

Open Shortest Path First, the dominant interior gateway protocol for enterprise and ISP networks, runs Dijkstra on the network topology graph. Each router maintains a complete map of the network (the link-state database) and runs its own Dijkstra to compute shortest paths to all destinations. Edge weights are link metrics: combinations of bandwidth, delay, reliability, and load configured by network operators.

### Game AI — Unit Pathfinding on Terrain

In real-time strategy games, units move through terrain with different traversal costs: roads are fast, plains are standard, forest and water are slow or impassable. Pathfinding on this cost map is Dijkstra (or A* on the same cost map). Age of Empires, Civilization, and virtually every tile-based strategy game with terrain types implement some variant of this.

### Airline Route Planning

Flight route optimization between hub airports uses Dijkstra on a graph where nodes are airports and edge weights are fuel cost, flight time, or a combination. Connecting flight itineraries — find the cheapest total-cost path from city A to city B with any number of layovers — are shortest-path queries on this graph.

### Neural Networks — The Indirect Descendant

Backpropagation in neural networks is not Dijkstra, but the conceptual lineage is traceable. Dijkstra's contribution of propagating cost updates along graph edges — the relaxation step — is structurally similar to how gradient information flows backward through computation graphs during training.

## Dijkstra vs BFS

| | Dijkstra | BFS |
|---|---|---|
| Edge weights | Any non-negative | Must be uniform |
| Data structure | Priority queue (min-heap) | Queue (FIFO) |
| Expansion order | By cumulative cost | By hop count |
| Optimal? | Yes (non-negative weights) | Yes (uniform weights) |
| Time complexity | O((V+E) log V) | O(V+E) |
| BFS as special case? | Yes — Dijkstra with all weights = 1 is BFS | — |

BFS is Dijkstra with all edge weights set to 1. The priority queue degenerates to a FIFO queue when all priorities are equal, and cumulative cost equals hop count. Dijkstra is the generalization; BFS is the special case.
