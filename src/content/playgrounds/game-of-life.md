---
title: Conway's Game of Life
order: 130
tags: [simulation, cellular-automaton, emergence]
category: simulation
description: Four rules, no players, and a board that runs itself — the cellular automaton that grew into a field of study, played here on a finite board with edges that matter.
thumbnail: /thumbnails/game-of-life.png
thumbnailAlt: "A Gosper glider gun at the top left of a dark grid, with a diagonal stream of cyan gliders trailing to the lower right."
island: game-of-life
thumbnailQuery: "seed=42&pattern=gun&gens=160&skin=age"
---

## What Is the Game of Life?

A grid of cells, each alive or dead. Every generation, each cell counts its
eight neighbours and follows four rules: a live cell with two or three live
neighbours survives, any other live cell dies, and a dead cell with exactly
three live neighbours comes alive. That's the whole game. There are no players
and no turns — you set the first generation and watch.

John Horton Conway devised it in 1970, and Martin Gardner's column in
*Scientific American* that October turned it into a phenomenon: people burned
mainframe time on it for years. The reason it stuck is that such a plain rule
produces so much: shapes that sit still, shapes that blink, shapes that walk
across the board, and shapes that manufacture other shapes. Conway offered $50
for a pattern that grows forever, and Bill Gosper won it the same year with the
**glider gun** — the pattern on this page's cover, firing a glider every 30
generations.

Life is also **Turing-complete**: patterns exist that compute anything a
computer can. And it inherits a hard limit from that — there's no general way
to predict what a pattern will do except to run it.

To find out more, you can read the Wikipedia article on [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

## How It Works

```
for every cell:
    n = number of live neighbours (of 8)
    if alive:  survives if n is 2 or 3, otherwise dies
    if dead:   comes alive if n is exactly 3
```

Every cell is updated from the **same** old generation — that's why the rule is
applied to a copy, not in place. Update cells one by one on the live board and
you get a different automaton, one where the top-left corner sees the future.

That rule is written **B3/S23**: born on 3, survives on 2 or 3. Change the
digits and you get a different world. *HighLife* (B36/S23) adds birth on six
neighbours, which is enough for a pattern that copies itself. *Day & Night*
(B3678/S34678) is symmetric between alive and dead.

### A finite board

Real Life runs on an infinite plane. This board doesn't, and the **Edges**
switch decides what that means:

- **Walls** — everything outside is permanently dead. A glider flying into the
  corner crashes and leaves a 2×2 block behind; on this board it happens at
  generation 68.
- **Wrap** — the left edge is glued to the right and the top to the bottom, so
  the board is a torus. The same glider leaves one side and comes back on the
  other, travelling forever.

Neither is the real thing, and that's worth knowing: a pattern that grows
without bound on the infinite plane will eventually hit something here.

## Key Concepts

### Emergence

Gliders, blinkers and guns aren't in the rule; nothing in "count your
neighbours" mentions movement. They're what the rule does at scale.

### Pattern zoo

Life's shapes have names: **still lifes** never change, **oscillators** repeat
with a period (a blinker is 2, a pulsar 3), **spaceships** repeat but move, and
**methuselahs** like the R-pentomino stay chaotic for hundreds of generations
from a handful of cells.

### Undecidability

There is no shortcut that tells you whether a given pattern dies out, stabilises
or grows forever. The only general method is simulation — this playground's
period detector can say "it repeated", never "it never will".

### Simultaneous update

A cellular automaton updates every cell at once, from one snapshot. Sequential
updates are a different rule — the same trap the falling sand in the
[Sandbox](../sandbox/) has to work around.

## Real-World Applications

### Modelling

Cellular automata model forest fires, epidemics, traffic jams, crystal growth
and fluid flow — anywhere a large system is made of identical parts that only
talk to their neighbours.

### Procedural generation

Games grow cave systems by filling a grid with noise and running a Life-like
smoothing rule for a few generations: isolated walls die, clusters fill in.

### Computing on a grid

Life is Turing-complete, and so is Rule 110, a one-dimensional automaton with
just eight cases. Both are standard examples that computation doesn't need a
processor, only a rule and a grid — the idea behind systolic arrays and much
GPU work.

### Conway's own view

Conway, who died in 2020, was famously ambivalent about Life: it overshadowed
the deeper mathematics he cared about, including surreal numbers and group
theory.

## Playground

Drag to draw cells and the right mouse button erases; on touch, drag draws. Pick
a pattern in **Click the board to** and a click stamps it — try the glider gun
near the top-left, or an R-pentomino in open space. **Run** and **One
generation** control time, **Speed** goes from 1 to 60 generations per second,
and **Random fill** drops a soup at the chosen density. The **State** readout
watches for repeats and stops the run when the board freezes, starts repeating or
dies out. **Rule** switches to HighLife or Day & Night, **Edges** between walls
and a torus, and **Skin** paints the same board differently: *Age* colours cells
by how long they've been alive, *Trails* leaves a fading mark where a cell died.
