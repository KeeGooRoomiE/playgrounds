---
title: Verlet Cloth
order: 160
tags: [simulation, physics]
category: simulation
description: Cloth and rope with no forces in sight — points that remember where they were, links that only insist on a distance, and a few passes of nudging that add up to fabric you can tear.
thumbnail: /thumbnails/verlet.png
thumbnailAlt: "A grey mesh of cloth hanging from orange pins along the top, draping in folds, with a small torn hole near the middle where it was pulled."
island: verlet
thumbnailQuery: "scene=cloth&steps=220&pull=0.5,9"
---

## What Is Verlet Integration?

Most physics code stores a position and a velocity, and pushes them around with
forces. Verlet integration stores something stranger: **the position, and where
the position was last frame**. The difference between the two *is* the velocity,
so it never has to be written down — which means you can grab a point, move it
wherever you like, and the motion carries on sensibly from there.

That one property makes the rest possible. A piece of cloth here is just points,
plus **links** that say "these two points should be *L* apart". Every frame the
simulation walks the list of links and nudges each pair back toward its length,
a few times over. Nothing computes a force, a stiffness, or a spring constant.
Yet the result drapes, swings, folds and — if you pull hard enough — tears.

The integrator is named after Loup Verlet, who used it for molecular dynamics in
1967, though Carl Størmer had used the same scheme decades earlier to compute
the paths of charged particles in the aurora. It reached games through Thomas
Jakobsen's *Advanced Character Physics* (2001), which described how the ragdolls
and ropes in *Hitman: Codename 47* worked.

To find out more, you can read the Wikipedia article on [Verlet integration](https://en.wikipedia.org/wiki/Verlet_integration).

## How It Works

```
move every point:
    velocity = position − previous position
    previous = position
    position += velocity · drag + acceleration · dt²

then, several times over:
    for every link (a, b) with rest length L:
        d = distance(a, b)
        move a and b half the error each, along the line between them

points that are pinned never move
```

The first block is Verlet integration. The second is **relaxation**: it doesn't
solve the constraints, it just improves them, and repeating it improves them
more. One pass leaves the cloth rubbery, six make it convincing, twenty make it
stiff. That slider is the whole "stiffness" control, and it costs exactly one
more sweep of the link list per pass.

**Tearing** is one extra line. If a link is stretched past some multiple of its
rest length, delete it. There is no fracture model, no material science — a
list with one fewer entry in it.

Two details make it behave:

- **Order matters, and that's fine.** Fixing link 5 breaks link 4 slightly. It
  doesn't matter, because the next pass fixes it again. The system is always
  slightly wrong and always getting less wrong.
- **Pinned points are absolute.** They're excluded from every correction, which
  is how anything hangs from anything.

## Playground

**Scene** picks a rope, a hanging cloth or a flag on a pole (which brings its
own lighter gravity and a gusting wind). **Drag or tap** grabs a point and pulls
— the right mouse button always cuts, and the tool menu covers touch. Cutting
sweeps through links like scissors; pinning fixes a point in the air.

Things worth trying:

- Pull the cloth down hard until it rips, then keep pulling and watch the tear
  run along the fabric as each surviving link takes more of the load.
- Drop **Relaxation passes** to 1. The cloth turns to rubber and sags; it may
  even tear under its own weight, because a single pass can't keep up. Push it
  to 20 and it goes board-stiff.
- Raise **Tears at** to 400% and pull: it stretches like chewing gum. Turn
  **Tearing allowed** off and it's unbreakable.
- Cut a horizontal slash across the middle of the cloth and watch the bottom
  half fall away.
- On the flag, drop the wind to zero and it becomes a cloth again.

**Skin** repaints the same simulation. *Fishing net* draws the links. *Load map*
fills each cell by how far its edges are from their rest length — red where the
fabric is carrying weight, blue where it hangs slack — so on a hanging cloth the
top row glows red and the bottom goes blue, and on the flag the load sits at the
pole. *Dark squares* is the quiet version, *Silk* shades cells by how narrow
they have been squeezed so folds catch the light, and *Chainmail* hangs a ring
on every point. In every filled skin a torn cell simply disappears.

**Colour the net by stretch** paints each link by how far it is from its rest
length — blue where the fabric is slack, dark at rest, red where it's about to
give — on the *Fishing net* skin. *Worst stretch* and *Distance checks / frame* in the readout show what the
passes are actually doing — the check count is links × passes, and it's the
honest price of stiffness.

## Key Concepts

### Position-based, not force-based

Because the state is two positions, you can move a point by hand and the
simulation absorbs it. Force-based systems fight that: you have to invent a
force that would have produced the motion you wanted. This is the idea that grew
into **position-based dynamics**, which most modern cloth and soft-body solvers
use.

### Relaxation

Repeatedly nudging a system toward satisfying its constraints, instead of
solving them exactly. It's Gauss–Seidel iteration wearing a costume: cheap per
pass, converging with more passes, and stable even when the constraints
contradict each other.

### Stiffness is iteration count

There is no stiffness parameter. How rigid the cloth feels is decided by how
many passes you can afford per frame, which is why cloth in games is a budget
decision as much as an art one.

### Inverse kinematics is the same trick

Pulling a chain of links toward a target with the same "fix each link in turn"
loop is FABRIK, the standard inverse-kinematics solver for arms and legs. The
rope here is that chain with no target, under gravity.

## Real-World Applications

### Games

Rope, chains, cloth, hair, banners and ragdolls have run on Verlet and its
descendants since *Hitman*. Cheap, forgiving, and it fails gracefully — a
too-stretched simulation looks rubbery rather than exploding, which is not true
of stiff spring systems.

### Cloth and soft bodies

Position-based dynamics, a direct descendant, powers cloth in engines like
Unreal and Unity and in most real-time soft-body and fluid demos.

### Molecular dynamics

The original use, and still current: velocity Verlet integrates the motion of
atoms in simulations of proteins and materials, chosen for the same reason games
chose it — it stays stable over huge numbers of steps.
