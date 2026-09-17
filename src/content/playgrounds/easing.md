---
title: Easing Curves
order: 140
tags: [animation, curves, interpolation]
category: animation
description: Why "ease-in-out" feels right — cubic Bézier curves built by de Casteljau's repeated lerp, the equation you have to solve before you can use one, and a race of ten curves on a single clock.
thumbnail: /thumbnails/easing.png
thumbnailAlt: "A white S-shaped easing curve on a dark plot, with cyan, violet and orange construction lines meeting at an orange point, and cyan ticks bunching unevenly along the time axis."
island: easing
thumbnailQuery: "curve=ease-in-out&t=0.35&steps=1"
---

## What Is Easing?

Move a box across the screen at constant speed and it looks mechanical: it
starts at full speed from a dead stop and slams to a halt. Real things
accelerate and slow down. **Easing** is the curve that maps *time* to
*progress* so a motion can do the same — slow at first, faster in the middle,
gentle at the end.

The idea is older than computers. "Slow in and slow out" is one of the twelve
principles of animation Disney's animators worked out, written down by Frank
Thomas and Ollie Johnston in *The Illusion of Life* (1981). The vocabulary
everyone uses now — ease-in, ease-out, bounce, elastic — comes from Robert
Penner's easing equations, published for Flash in the early 2000s.

The curve CSS uses to do it has a better story still. Paul de Casteljau worked
out how to draw these curves at Citroën in 1959, but the company kept it secret.
Pierre Bézier developed the same curves independently at Renault in the early
1960s to design car bodies, and he published — so they carry his name. The
mathematics underneath, the Bernstein polynomials, dates from 1912. From car
bodies, to fonts, to the `cubic-bezier()` in a stylesheet: it's the same curve.

To find out more, you can read the Wikipedia article on [Bézier curve](https://en.wikipedia.org/wiki/B%C3%A9zier_curve).

## How It Works

A cubic Bézier curve has four points. For easing, the first is fixed at (0, 0)
and the last at (1, 1); the two in between, **P1** and **P2**, are the handles
you drag, and the four numbers of `cubic-bezier(x1, y1, x2, y2)` are their
coordinates.

### de Casteljau: one operation, three times

A point on the curve is found by linear interpolation — `lerp`, "go a fraction
*s* of the way from one point to another" — applied over and over:

```
lerp the 3 edges of P0 P1 P2 P3 by s  → 3 points   (cyan)
lerp the 2 edges between those       → 2 points   (violet)
lerp the last edge                    → 1 point    (orange) — on the curve
```

Sweep *s* from 0 to 1 and that last point traces the whole curve. That's all
the shape is: interpolation between interpolations. The construction on the
plot is drawn live at every moment of the animation.

### The parameter is not time

Here's the step most explanations skip. The curve's own parameter *s* produces
both coordinates: x(s) and y(s). But when a browser animates, what it knows is
the *time* t — and time is **x**, not *s*. So to find the progress at time t it
must first solve

```
x(s) = t      then      progress = y(s)
```

There's no neat formula for that, so it's solved numerically. The playground
uses Newton's method — guess, look at the slope, correct — and falls back to
halving the interval (bisection) when the slope is too flat to trust. The
*Solving x(s) = t* readout shows which one ran and how many steps it took.

## Playground

**Drag P1 and P2** and watch the curve, the `cubic-bezier()` value and the race
change together. Pick a starting **Curve** from the CSS keywords, the "back"
curves that undershoot and overshoot, or bounce and elastic.

**Play** runs the clock; the **Time** slider scrubs it by hand. On the plot the
construction follows along: the orange point is where the three lerps meet at
this moment's *s*.

**Equal steps in s** marks eleven points spaced evenly in *s* on the curve and
drops them to the time axis. They land unevenly — bunched where the curve is
slow, spread where it's fast. That gap between *s* and t is the reason the
equation above has to be solved at all.

The **race** below runs ten curves against one clock. **Strobe marks** show
where each ball is at every tenth of the time, so spacing is speed: wide gaps
are fast, bunched marks are slowing down. Things worth trying:

- Watch `linear` and `ease-in-out` side by side: they arrive together, but only
  one of them looks like it moved.
- Drag P1 to (1, 0) and P2 to (0, 1). The curve goes nearly flat in the middle,
  and the solver switches from Newton to bisection.
- Pick **back-out** and look where the ball stops: past the end, then back.
- Pick **bounce** — the handles vanish, because no cubic Bézier can draw it.

## Mobile Behavior

The controls stack above the plot below `960px`. The plot fits the column up to
460px wide and the race stretches across the full width, both redrawn every
frame from their container's size, so rotating the phone just reflows them.

The handles are the one thing that needs a finger. Dragging uses pointer events,
so mouse, pen and touch all work the same way, and the plot turns off the
browser's own touch scrolling so dragging a handle doesn't drag the page. Each
handle accepts a touch anywhere within 22px of its centre — a 44px target, the
size a fingertip can actually hit, even though the dot drawn is much smaller.
The Time slider covers scrubbing on touch. Tested down to 320px, where the plot
is 286px wide and both handles stay grabbable.

## Key Concepts

### Linear interpolation

`lerp(a, b, s) = a + (b − a) · s`. Every Bézier curve is nothing but this,
nested: three lerps for a cubic, two for a quadratic.

### Why x is limited and y isn't

CSS only accepts x1 and x2 between 0 and 1. That keeps x(s) always increasing,
so every moment of time corresponds to exactly one *s* and the equation has one
answer. Let x loop back and the same moment would have two progresses. y has no
such job, so it's free: push y past 1 and the animation overshoots its target,
push it below 0 and it pulls back first. That's what the "back" curves are.

### Newton and bisection

Newton's method converges in two or three steps on ordinary curves but can wander
off where the slope is almost zero. Bisection never fails but needs about twenty
steps for the same precision. Real implementations do exactly what this one
does: try Newton, fall back to bisection.

### What one cubic can't do

A cubic Bézier turns back at most twice, so it can't bounce three times or
wobble like a spring. Penner's bounce and elastic are separate formulas. CSS
answers with the `linear()` easing function, which joins many points with
straight lines — the dashed line on the plot for bounce and elastic, with the
exact value in the box above.

## Real-World Applications

### Interfaces

Every CSS transition and animation, and the animation systems in iOS, Android
and game engines, runs on easing curves. The CSS keywords are named cubic
Béziers; springs and bounces use `linear()` or a physics simulation.

### Fonts

Letter outlines are Bézier curves: TrueType fonts use quadratic ones, CFF-based
OpenType fonts cubic ones. Every glyph on this page is de Casteljau underneath.

### Vector graphics

SVG paths, the pen tool in design software and PostScript and PDF drawing are
built from the same cubic curves, joined end to end.

### Cameras and motion

Games and film tools move cameras along Bézier paths and ease the timing along
them — two curves at once, one for where and one for when.
