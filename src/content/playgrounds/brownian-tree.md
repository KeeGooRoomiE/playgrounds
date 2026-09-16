---
title: Brownian Tree
order: 100
tags: [fractal, simulation, emergence]
category: fractal
description: Particles wander at random and stick where they touch — and out of pure chance grows a branching fractal, the same shape as lightning, frost and mineral dendrites.
thumbnail: /thumbnails/brownian-tree.png
thumbnailAlt: "Five densely branched Brownian trees with white trunks fading to violet twigs, grown on black."
island: brownian-tree
thumbnailQuery: "seed=42&skin=lichtenberg&seedShape=multi&colour=weight"
---

## What Is a Brownian Tree?

Start with a single particle stuck in place. Release another one somewhere
nearby and let it wander completely at random, one step at a time. The moment it
touches the first particle, it sticks. Release the next. Repeat a few thousand
times.

That is the entire rule, and nothing in it mentions branches. Yet what grows is
unmistakably a tree: a branching, lacy structure with arms that split into
twigs that split again. It's called a **Brownian tree**, after the random jitter
of pollen grains in water that Robert Brown observed in 1827. The physics behind
it has a plainer name: **diffusion-limited aggregation**, or DLA.

Thomas Witten and Leonard Sander introduced the model in 1981 to explain how
metal dust clumps into soot-like clusters. It turned out to describe much more.
The same shape appears in lightning, in frost creeping across a window, in the
burnt tracery of a high-voltage discharge, in copper growing out of a solution,
and in the dark "fossil ferns" that turn out to be minerals on the surface of
rocks. None of those things know about each other. They share the rule.

To find out more, you can read the Wikipedia article on [Diffusion-limited aggregation](https://en.wikipedia.org/wiki/Diffusion-limited_aggregation).


## How It Works

```
occupy(seed)
repeat:
    release a walker away from the tree
    step it randomly until it touches the tree
    occupy its cell
```

**Why branches appear.** A walker coming in from outside hits whatever sticks
out long before it finds its way into a gap. Tips catch more, grow further out,
and catch even more. This runaway is called **screening**, and the *Tip
extensions* counter shows it: about three in four new particles land on the end
of a branch.

**Why it's fast.** Walkers start just outside the tree, and ones that wander off
are replaced. A distance map tells each walker how far the nearest particle is;
if that's *d* cells, it can safely jump *d − 2* cells in one move. Single steps
only happen close to the tree, where the outcome is decided.

## Key Concepts

### Random walk

Independent random steps with no direction. After *n* steps a walker is
typically only √*n* cells from where it started, which is why unassisted growth
is so slow.

### Screening

Exposed parts catch more of whatever arrives from outside, grow, and become more
exposed. It's why the tree never fills in, and why lightning branches.

### Fractal dimension

Mass grows as radius to the power *D*: 1 for a line, 2 for a disc, about
**1.71** for a Brownian tree. *Rough dimension* estimates it as ln(particles) ÷
ln(radius) and reads a little high at this size, around 1.8–1.9.

### Lattice anisotropy

Walkers move in four directions only, so a large tree turns faintly
cross-shaped along the grid axes — an artefact of the square grid, not physics.

## Real-World Applications

### Lightning and Lichtenberg figures

A discharge advances fastest from its own tips, just like DLA. High voltage
through acrylic or wood freezes that branching into a Lichtenberg figure.

### Frost and snow

Water vapour diffuses onto cold glass and freezes on contact, growing ferns from
the window's edges. Snowflakes are the same growth with sixfold symmetry.

### Electrodeposition and mineral dendrites

Metal plated out of a salt solution grows as a DLA tree, and manganese seeping
through rock cracks leaves black dendrites often mistaken for fossil plants.

### Fungi and bacteria

Colonies on scarce food spread in branching fingers because the tips eat first.
It's the creeping look of the title sequence of *The Last of Us*, which the
*Fungal spread* skin nods to.

### Generative art and games

Lightning, cracks, river networks, alien vegetation: cheap to grow, never the
same twice, and natural-looking because it follows a natural rule.

## Playground

**Grow** starts and pauses, **Reset** clears, and **Speed** never changes the
shape. **Seed** picks what grows — a point, a ground line, a ring, a window frame
or five scattered seeds — and a tap on the canvas plants more. Lower
**Stickiness** thickens the branches; the tree grows *into* the **Wind**.
**Colour by** shows arrival time or branch weight, and **Skin** changes only the
look: try *Lightning strike* with a ground line, or *Frosty window* with the
window frame. **One particle at a time** draws a single walker's true random
walk and says where it landed — turn it on once a point tree has a few hundred
particles and see how rarely a walker reaches the centre.
