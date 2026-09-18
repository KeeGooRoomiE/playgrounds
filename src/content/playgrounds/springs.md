---
title: Springs
order: 150
tags: [animation, simulation, physics]
category: animation
description: Animation driven by a force instead of a clock — stiffness and damping, three regimes side by side, the interruption that breaks easing curves, and the integrator bug that makes a stiff spring explode.
thumbnail: /thumbnails/springs.png
thumbnailAlt: "Five horizontal lanes: an orange and a violet ball have shot past a dashed target on zigzag springs, a critically damped ball is just arriving, an overdamped one lags behind, and a teal eased ball has barely left the start."
island: springs
thumbnailQuery: "frames=14"
---

## What Is a Spring Animation?

An [easing curve](../easing/) is a plan made in advance: go from here to there
in 800 milliseconds, following this shape. A **spring** makes no plan. It has a
position, a velocity and a target, and every frame it applies one rule — pull
toward the target, harder the further away you are, minus a little friction —
and lets the motion come out of that.

The difference shows the moment you change your mind. Retarget an easing
animation halfway and it has to start a new curve from zero speed, with a
visible jolt. Retarget a spring and nothing special happens: it's already moving,
and it simply bends toward the new target, keeping its momentum. That's why
interfaces have been moving from curves to springs; at WWDC 2023 Apple devoted
a session to animating with springs and recommended them over fixed curves.

The rule is 350 years old. In 1676 Robert Hooke published it as an anagram,
*ceiiinosssttuv*, to claim priority without giving it away, and revealed the
answer two years later: *ut tensio, sic vis* — "as the extension, so the
force".

To find out more, you can read the Wikipedia article on [Hooke's law](https://en.wikipedia.org/wiki/Hooke%27s_law).

## How It Works

```
every frame, with time step dt:
    force     = −k · (position − target)  −  c · velocity
    velocity += force · dt
    position += velocity · dt
```

**k** is stiffness: how hard the spring pulls. **c** is damping: how much the
motion is resisted. (Mass is fixed at 1, so force and acceleration are the same
number.)

### Three regimes

What matters is not k or c alone but their balance, the **damping ratio**
ζ = c / (2√k):

- **ζ < 1 — underdamped.** It overshoots and rings before settling. Bouncy.
- **ζ = 1 — critically damped.** The fastest possible settle with no overshoot.
- **ζ > 1 — overdamped.** No overshoot, but it creeps in slowly.

The three reference lanes use your stiffness with exactly those ratios, so
moving the stiffness slider changes their speed but never their character.

### The integrator

The code above is a numerical approximation, and the order of the last two
lines matters more than it looks. **Semi-implicit Euler** updates the velocity
first and moves with the new one. **Explicit Euler** moves with the old velocity
and updates it afterwards. The explicit version quietly adds a little energy
every step, and on a stiff spring with a big step that energy compounds until
the spring flies apart.

### The timestep

If dt is simply "however long the last frame took", the same spring behaves
differently at 30, 60 and 144 frames per second. The fix, made famous by Glenn
Fiedler's 2004 article *Fix Your Timestep!*, is to run physics in fixed steps —
here 1/120 s — and let each frame consume as many of them as its time allows.

## Playground

**Stiffness** (5–800) and **Damping** (0–60) set your spring; the readouts give
its damping ratio, regime, settle time and overshoot. Four spring lanes and an
**easing lane** run side by side. With **Flip the target** on, the target swaps
ends every 0.9 seconds — before the slow ones have arrived — or **tap a lane**
to move the target yourself. Watch the easing ball restart from a standstill
each time while the springs carry their speed through.

The **step response** plot below shows your spring released from 0 toward 1,
simulated at 30, 60 and 144 Hz over the exact solution. Things worth trying:

- Set stiffness to about 400 and damping to 4, then switch the **Integrator**
  to explicit Euler. The 30 Hz and 60 Hz traces blow up; 144 Hz survives, for
  now. Switch back to semi-implicit: nothing blows up.
- Leave it semi-implicit and look at *30 Hz vs 144 Hz gap* — the same spring
  lands in visibly different places. Now set **Timestep** to fixed: the three
  traces become one and the gap drops to zero.
- Explicit Euler with a fixed step still misbehaves on a stiff spring: a fixed
  step makes the result consistent, not correct.
- **Frame rate** also changes how often the lanes above are stepped, so you can
  watch 30 Hz look and behave differently.

## Key Concepts

### State, not time

An easing animation is a function of elapsed time; to change it you must replace
it. A spring is a function of its current state — position and velocity — so
any change is just a new target for the same state. That makes springs
naturally interruptible, and it's also why they have no fixed duration.

### Damping ratio

Stiffness sets how fast a spring wants to move; damping sets how much it's
allowed to. Their ratio alone decides whether it bounces, glides or crawls,
which is why spring APIs often ask for "bounce" and "duration" rather than raw
k and c.

### Numerical stability

Every simulation replaces continuous time with steps, and some methods of doing
that leak energy in or out. Explicit Euler leaks it in; semi-implicit Euler
keeps it bounded, which is why games use it. A method can be stable and still
inaccurate — the traces show both kinds of error.

### Frame-rate independence

A simulation stepped with the frame time gives different results on different
hardware. Fixed steps with an accumulator make it deterministic: same input,
same result, on any display.

## Real-World Applications

### Interfaces

SwiftUI, Jetpack Compose, React Native and web animation libraries such as React
Spring and Framer Motion all offer spring animations, largely because gestures
interrupt constantly — a flick, a drag released mid-flight, a sheet pulled back.

### Game physics

Game engines simulate rigid bodies, ropes, cloth and vehicle suspensions as
networks of springs and constraints, stepped with fixed timesteps for exactly
the reasons in the Timestep section.

### Cameras and follow behaviour

A camera that tracks a player through a critically damped spring follows
smoothly without overshooting — a small formula doing a lot of what feels like
polish.

### Engineering

Car suspensions, building dampers and measuring instruments are tuned by
damping ratio: too low and they oscillate, too high and they respond sluggishly.
