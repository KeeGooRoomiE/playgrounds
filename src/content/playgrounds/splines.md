---
title: Splines & Arc Length
order: 170
tags: [animation, curves, interpolation]
category: animation
description: A curve through your points, and the trap underneath it — the curve's parameter isn't distance, so an object moving evenly in the parameter speeds up and slows down on its own.
thumbnail: /thumbnails/splines.png
thumbnailAlt: "A closed spline loop through six orange key points, with a red dot and a blue dot at different places on it, red marks bunched together along the slow parts of the curve and blue marks evenly spaced."
island: splines
thumbnailQuery: "t=0.62"
---

## What Is a Spline?

A **spline** is a smooth curve through a set of points. Not near them, like the
control points of a [Bézier curve](../easing/) — *through* them. Drop six key
points on a map and a spline gives you the road that visits all six.

The one here is **Catmull–Rom**, published by Edwin Catmull and Raphael Rom in
1974. Its rule is local and almost embarrassingly simple: at each key point, aim
the curve along the line joining its two neighbours, then run a cubic between
consecutive points that matches those directions. Move one point and only the
nearby curve changes. Catmull went on to co-found Pixar, which is a reasonable
indication of where this kind of curve ended up.

The [easing page](../easing/) ends on a warning: a curve's parameter is not
time. This page is the next floor up: **a curve's parameter is not distance
either.** Send something along a spline at a steady rate of parameter and it
will visibly race through the long stretches and crawl through the short ones,
without anyone asking it to.

To find out more, you can read the Wikipedia article on [Centripetal Catmull–Rom spline](https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline).

## How It Works

Each piece of the curve looks at four key points — the two it runs between, plus
one on either side for direction:

```
segment i runs from P[i+1] to P[i+2]
its tangents come from P[i+2] − P[i]  and  P[i+3] − P[i+1]
that's a cubic: four numbers in, one smooth piece out
```

### Why the parameter isn't distance

The segment parameter goes 0 → 1 whatever the segment's shape. A long, straight
stretch and a short, tight one both take exactly one unit of parameter, so
covering them at the same parameter rate means covering them at wildly different
speeds. The default loop here runs about **3× faster** at its quickest than at
its slowest, and the speed graph under the canvas shows the whole profile.

### The arc-length table

There's no tidy formula for the length of a cubic curve, so the fix is a table.
Walk the curve in small steps, add up the straight-line distances, and store
*distance so far* against *parameter*:

```
u:  0.0   0.25  0.5   0.75  1.0   1.25 ...
s:  0     38    71    96    118   162  ...
```

To move at constant speed, take the distance you want (time × total ÷ lap),
binary-search the table for the two entries around it, and interpolate the
parameter between them. That's the blue traveller. The table is approximate —
it cuts every curve into chords — so it always reports slightly *less* length
than the curve really has, and the *Table error* readout shows by how much.

### Knot spacing

There's one more knob, the exponent α on the distance between key points:
**uniform** (α = 0), **centripetal** (α = 0.5) and **chordal** (α = 1). Uniform
is the original; it can loop or form a cusp when two key points sit close
together. Centripetal provably never does, which is why it's the default
everywhere now.

## Playground

**Drag the key points** — the curve follows and every readout updates. Two
travellers run the same loop: the **red** one advances evenly in the curve's
parameter, the **blue** one evenly in arc length, and the thin line between them
is how far apart those two ideas have drifted. **Strobe marks** drop a dot every
thirtieth of the lap: red inside the curve, blue outside. The blue ones are
evenly spaced by construction; the red ones bunch up wherever the curve is slow.

**Skin** switches between the bare line and a **race track** — same curve, same
two runners, drawn as cars on asphalt. And the arc-length runner can be switched
off entirely, leaving one car to lap the circuit at its own uneven pace, which
is how this looks in a project that never fixed it.

Things worth trying:

- Drag one key point far away from its neighbours. The red dot sprints through
  the new long stretch while the blue one holds its pace, and *Fastest / slowest*
  climbs.
- Pull two key points almost on top of each other with **Uniform (α = 0)**
  selected — the curve loops back on itself. Switch to centripetal and the loop
  disappears.
- Turn **Arc-length table** on and drag **Arc-length samples** down to 2 or 3.
  The dashed chords the table actually measures become visible, the error climbs
  past half a per cent, and the blue traveller starts to stutter — its idea of
  distance no longer matches the curve.
- Turn off **Closed loop** to run the spline as an open path.

The two dials on the right interpolate an angle from 350° to 10°. The naive
version takes the 340° journey the numbers imply; the short-way version notices
that the difference wrapped past 180° and covers 20° instead.

## Key Concepts

### Interpolating vs approximating

Bézier curves are pulled toward their control points; Catmull–Rom passes through
its key points. That makes splines the natural fit for "go here, then here",
which is why they show up in every path and camera tool.

### Arc-length parameterisation

Re-expressing a curve so its parameter *is* distance. Exact solutions exist only
for special cases, so real implementations build a table exactly like this one,
sometimes refining with Newton's method.

### Precision costs memory

More table entries mean a smaller error and more memory per curve. A few dozen
per segment is usually plenty — you can watch the error fall off a cliff over
the first few samples and then barely improve.

### Angles wrap

An angle is not a plain number: 350° and 10° are 20° apart, not 340°. Any
interpolation of angles has to normalise the difference into ±180° first. In
three dimensions the same problem is solved by Ken Shoemake's 1985 **slerp** on
quaternions — the algebra William Rowan Hamilton carved into a Dublin bridge in
1843.

## Real-World Applications

### Cameras and cutscenes

A camera flies along a spline through hand-placed key points, and the timing is
done in arc length so it doesn't lurch between them. Every game engine ships
this pair.

### Motion graphics and maps

The animated line that traces a route across a map, or a logo drawn along a
path, is a spline with an arc-length lookup — otherwise the drawing hand would
speed up on straights.

### Machining and 3D printing

A toolpath has to hold a commanded feed rate along the curve, not per parameter,
or the cut depth changes with the geometry. Controllers do arc-length
interpolation for exactly this reason.

### Robotics

Trajectories are planned as splines and then re-timed by arc length, so speed
limits can be applied in the units that matter: metres per second, not parameter
per second.
