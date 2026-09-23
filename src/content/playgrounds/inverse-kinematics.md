---
title: Inverse Kinematics
order: 180
tags: [animation, simulation]
category: animation
description: Point at where the hand should be and let the arm work out the rest — FABRIK reaches a target by moving points to the right distances, twice per pass, with no angles and no trigonometry.
thumbnail: /thumbnails/inverse-kinematics.png
thumbnailAlt: "Three tentacles in teal, blue and indigo rise from a floor and curl toward a single orange crosshair target between them."
island: inverse-kinematics
thumbnailQuery: "skin=tentacle&chains=3&tx=0.72&ty=0.22&reach=0"
---

## What Is Inverse Kinematics?

**Forward** kinematics is the easy direction: give every joint an angle and the
hand ends up wherever it ends up. **Inverse** kinematics is the question you
actually want answered — *the hand should be here; what should the joints do?*

For two bones you can solve it with a triangle. For a tentacle with twenty, the
algebra is hopeless and there are infinitely many answers anyway, because a long
chain can reach the same point in countless poses.

**FABRIK** — Forward And Backward Reaching Inverse Kinematics, published by
Andreas Aristidou and Joan Lasenby in 2011 — sidesteps the whole thing. It
never computes an angle. It moves points to the right *distances*, twice per
pass, and lets the pose fall out:

> Put the tip on the target and drag the rest along. Then pin the base back
> where it belongs and rebuild the chain from there. Repeat.

It's young for a standard algorithm, and it spread fast: it's simple, it
converges in a handful of passes, and the poses it produces look natural
without anyone tuning them.

To find out more, you can read the Wikipedia article on [Inverse kinematics](https://en.wikipedia.org/wiki/Inverse_kinematics).

## How It Works

```
backward pass — from the tip:
    put the last joint exactly on the target
    for each joint back toward the base:
        move it onto the line to its successor, at its bone length

forward pass — from the base:
    put the first joint exactly back on the base
    for each joint out toward the tip:
        move it onto the line to its predecessor, at its bone length
```

After the backward pass the chain reaches the target but has come unstuck from
its base; after the forward pass it's attached again but has drifted off the
target. Each pass is a smaller correction than the last, and two or three passes
are usually enough to land within a pixel.

That's the whole method. No angles, no trigonometry, no matrices — just
"move this point to that distance", which is the same move the cloth in
[Verlet Cloth](../verlet/) makes when it fixes a link. Both are **relaxation**:
satisfy one constraint at a time, repeatedly, and let the system settle.

**Out of reach** needs no iteration at all: if the target is further away than
all the bones added together, the answer is a straight line pointing at it, and
the solver says so.

**Joint limits** are the one thing FABRIK needs help with. After placing a joint,
clamp its bone to within some angle of the previous one and carry on. That turns
a tentacle into an elbow — and makes the solve harder, because a constrained
chain sometimes cannot reach at all.

## Key Concepts

### There is no single answer

A chain with more than two joints has infinitely many poses that reach the same
point. FABRIK picks the one closest to the pose it started in, which is why the
motion looks continuous rather than snapping between solutions.

### Relaxation again

Like cloth, like a rope, like the constraint solvers in physics engines: apply
each constraint in turn, accept that fixing one disturbs another, and iterate.
Simple to write, stable, and it degrades into "nearly right" rather than
exploding.

### Constraints cost convergence

Unconstrained, the chain reaches almost anything inside its circle. Add joint
limits and some targets become unreachable, and the solver will spend its whole
pass budget getting as close as it can.

### Iteration budget is a design choice

Every pass costs one walk of the chain in each direction. Games cap the passes
per frame and accept a small miss; a robot arm solving offline can iterate until
the error is microscopic.

## Real-World Applications

### Games

Foot placement on uneven ground is the classic use: the animation plays as
authored, then IK bends the leg so the foot lands on the actual slope instead of
hovering. Hands on ladders and steering wheels work the same way.

### Animation rigs

Animators pose a hand or a foot and let the rig solve the limb. Character rigs
usually offer both, switching between forward and inverse kinematics per shot.

### Robotics

A manipulator is told where the gripper must be; the controller solves for joint
angles, with limits and obstacle avoidance layered on top. FABRIK's speed makes
it attractive for chains with many joints.

### VR and motion capture

A headset and two controllers give three known points. The avatar's arms, spine
and neck in between are inferred, every frame, by an IK solver.

## Playground

Move the pointer and the chain follows it. **Bones** sets how many segments the
chain has, **Chains** puts one, three or five of them on the floor reaching for
the same target, and **Skin** dresses them as a tentacle, a robot arm, a desk
lamp or the plain bones-and-joints view.

- **Ghost of each pass** draws the chain as it was after every pass, so a single
  solve becomes visible: the first ghost swings wildly, the rest are small
  corrections.
- Turn **Target follows the pointer** off, click to place the target, then press
  **One pass** repeatedly and watch the chain crawl toward it — base and tip
  taking turns.
- **Max bend per joint** clamps each joint. At 180° it's free; wind it down to
  40° and the tentacle stiffens into a mechanical arm that curves in wide arcs
  and often reports it is still converging — *Miss distance* stops reaching zero.
- Push the pointer past the dashed **reach circle**: the chain straightens and
  points, because there is nothing better it can do.

**Passes used** is the honest cost readout. With the pointer moving smoothly the
chain starts from where it already was, so it usually needs one or two passes
per frame; straighten it with **Straighten** and the first solve takes six or
seven.
