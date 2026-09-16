---
title: Sandbox
order: 120
tags: [simulation, emergence, cellular-automaton]
category: simulation
description: A literal sandbox — pour and erase grains that follow one falling-sand rule, and watch dunes, slopes and avalanches appear.
thumbnail: /thumbnails/sandbox.png
thumbnailAlt: "A pale dune of pixel sand settled along the bottom of a sky-blue frame."
island: sandbox
thumbnailQuery: "seed=42&skin=desert&threshold=0.61&frames=150"
---

## What Is a Falling-Sand Simulation?

Divide the screen into a grid of cells. Each cell is either empty or holds one
grain of sand. Every frame, every grain looks at the cells directly beneath it
and decides where to go. Nothing else — no physics engine, no velocities, no
collisions. Yet pour enough grains and you get piles with clean slopes, sand
that pours off ledges, and avalanches when you dig out a foundation.

That's a **cellular automaton**: a grid where each cell changes according to a
small local rule about its neighbours. The most famous one is
[Conway's Game of Life](../game-of-life/); falling sand is a far more physical
cousin.

It also has a whole game genre behind it. The earliest known example is *Hell
of Sand*, a Japanese Java applet from December 2005; rehosted and expanded as the
*Falling Sand Game*, it gave the genre its name. Dan-Ball's *Powder Game* (2007)
started with a single powder and grew into one of the best-known versions, and
inspired the open-source *Powder Toy* and the browser toy *Sandspiel* (2018). *Noita*
(Nolla Games) took the idea to its limit: a whole game world in which every
pixel is simulated, dug through, burned and melted.

To find out more, you can read the Wikipedia article on [Falling-sand game](https://en.wikipedia.org/wiki/Falling-sand_game).

## How It Works

```
for every row, from the bottom up:
    for every grain in the row:
        if the cell below is empty:           fall
        else if both lower diagonals are free: slide to a random one
        else if one lower diagonal is free:    slide to it
        else:                                  stay put
```

**Why bottom-up.** A grain that falls lands in a row that has already been
processed this frame, so it can't fall again. Going top-down, a grain would drop
through the whole column in a single frame. Each row is also scanned in
alternating directions, so neighbours racing for the same gap don't always
settle it the same way.

**Friction.** On its own, the rule always makes 45° slopes: a grain slides
whenever the next column is one cell lower. With friction, some grains refuse to
slide unless the drop is two or three cells, and the piles stand steeper, like
damp sand.

**Generate** fills the grid from [Perlin noise](../perlin-noise/): the noise is
normalised to 0–1, and every cell above 0.75 becomes sand. The result is a sky
full of floating clumps, which the rule immediately brings down.

## Key Concepts

### Cellular automata

Simple local rules, applied everywhere at once, producing large-scale behaviour
nobody wrote down. No line of the rule says "make a pyramid".

### Update order

A grid can't really update every cell at the same instant, so the order you
visit cells in becomes part of the rule. Get it wrong and grains teleport or
drift sideways.

### Angle of repose

The steepest slope a granular material will hold without sliding. Dry sand sits
around 30–35°, wet sand much steeper; the friction slider plays the same role.

### Sleeping cells

Almost all the sand is at rest almost all the time; only the surface moves.
*What moves* lights up exactly that, and large simulations like Noita's skip the
sleeping regions entirely.

## Real-World Applications

### Games

Falling-sand rules power the whole genre above, from *Powder Game* to *Noita*,
and simpler versions of them run destructible terrain in many other games.

### Granular engineering

Silos, hoppers and conveyor belts are designed around how grains flow and pile.
Angle of repose decides how steep a stockpile can be and how a hopper must be
shaped so it empties.

### Hourglasses and dunes

An hourglass works because sand flows at a steady rate regardless of how much
is above it. Dunes build and collapse at their own angle of repose as wind drops
grains on the crest.

### Avalanches and criticality

The Bak–Tang–Wiesenfeld sandpile model (1987) adds grains one at a time and
watches the avalanches: most are tiny, a few are huge, with no typical size.
It became a founding example of self-organised criticality, used to think about
earthquakes and forest fires.

## Playground

Drag on the canvas to pour sand; the right mouse button erases, and on a touch
screen **Drag or tap to** switches between the two. **Brush** sets the size.
**Friction** makes piles stand steeper — raise it before pouring, then drop it
back to zero and watch the steep piles slump. **Generate from noise** makes a
fresh Perlin landscape and **Clear** empties the box. **Skin** only repaints:
*Sand bottle* colours each pour in bands so the layers show, and *What moves*
highlights the grains in motion.
