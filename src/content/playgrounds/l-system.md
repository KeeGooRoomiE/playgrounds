---
title: L-Systems
order: 20
tags: [fractal, procedural, recursion]
category: fractal
description: Lindenmayer's recursive rewriting rules — a handful of symbols that expand into trees, ferns, and coral-like branching structures.
thumbnail: /thumbnails/l-system.png
thumbnailAlt: "A thin brown fractal plant grown by an L-system, branching from a single vertical stem."
sourceRepo: https://github.com/KeeGooRoomiE/l-system-playground
island: l-system
---

## What Are L-Systems?

L-systems were introduced by biologist Aristid Lindenmayer in 1968 to model plant growth. They use recursive rewriting rules to generate surprisingly complex structures from simple initial conditions.

An L-system is defined by four components:

- **Axiom** — the initial string
- **Production Rule** — how symbols are replaced
- **Iterations** — how many times rules are applied
- **Angle** — rotation used during drawing

To find out more, you can read the Wikipedia article on [L-systems](https://en.wikipedia.org/wiki/L-system).

## How It Works

A tiny rule can produce thousands of drawing instructions after only a few iterations.

### Example

```
Axiom: F
Rule: F → F[+F]F[-F]F
```

### String Expansion

```
Iteration 0
F

Iteration 1
F[+F]F[-F]F

Iteration 2
F[+F]F[-F]F[+F[+F]F[-F]F]F[+F]F[-F]F[-F]F[+F]F[-F]F
```

After expansion, the resulting string is interpreted by a turtle graphics renderer that draws the visual structure.

## Symbol Reference

| Symbol | Meaning |
|---|---|
| `F` | Move forward and draw |
| `A` / `B` | Alternative drawing symbols |
| `+` | Rotate right by angle |
| `-` | Rotate left by angle |
| `[` | Save current position and angle |
| `]` | Restore saved position and angle |

The bracket system `[` and `]` is what enables branching structures like trees, bushes, roots, and coral forms.

## Turtle Graphics Model

The renderer maintains the current position (x, y), direction, and a state stack to handle branching.

### Execution Example

```
F[+F][-F]
```

1. Draw forward
2. Save position
3. Turn right and draw branch
4. Restore position
5. Turn left and draw another branch

This simple mechanism creates hierarchical growth patterns found in nature.

## Included Presets

### Tree

```
Axiom: F
Rule: F[+F]F[-F]F
Angle: 25°
```

Classic symmetric branching structure. Each branch splits into two.

### Fern

```
Axiom: F
Rule: F[+F][--F][-F]
Angle: 25°
```

Asymmetric branching creates leaf-like patterns.

### Bush

```
Axiom: F
Rule: F[+F][-F]F[-F][+F]F
Angle: 20°
```

Dense multi-branch vegetation with complex structure.

### Algae

```
Axiom: A
Rule: AB
```

Lindenmayer's original algae model. Shows pure string expansion (Fibonacci pattern).

### Fractal

```
Axiom: F
Rule: F[+F]F[-F][F]
Angle: 22°
```

Balanced recursive branching pattern creating mathematical beauty.

## Exponential Growth

L-systems grow exponentially. Even simple rules produce huge strings:

| Iteration | Approximate Command Count |
|---|---|
| 1 | 11 |
| 2 | 61 |
| 3 | 311 |
| 4 | 1,561 |
| 5 | 7,811 |

This is why even tiny rules quickly generate intricate, detailed structures.

## Things To Experiment With

Try changing these in the playground:

- Branch density (more brackets = more branches)
- Rotation angle (smaller angles = tighter spirals)
- Iteration count (more iterations = more detail)
- Rule symmetry (asymmetric rules = organic forms)
- Nested brackets (enable complex hierarchies)

### Example Rules

```
F[++F][--F]
F[-F]F[+F]F
F[+F[-F]]
F[+F][+F][+F]
```

Small changes often produce dramatically different results.

## Real-World Applications

### Procedural Generation

Trees, vegetation, roots, coral structures, alien flora in video games and movies.

### Computer Graphics

Fractal art, organic 3D modeling, environmental generation for VFX and games.

### Scientific Simulation

Plant morphology research, branching system analysis, growth pattern studies in biology.

### Procedural Content

SpeedTree uses L-systems to generate millions of unique trees with minimal memory overhead.
