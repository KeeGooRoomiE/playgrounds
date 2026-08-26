# L-Systems — internal notes

- **Source repo:** https://github.com/KeeGooRoomiE/l-system-playground
- **Migrated:** 2026-08-25
- **Content entry:** `src/content/playgrounds/l-system.md`
- **Island:** `src/islands/LSystem.astro`

## Migration notes

DOM ids namespaced with an `ls-` prefix. Of the seven source repos, this one was closest to the original blank template's own vocabulary (`.grid-2`/`.card`/`.form-group`/`.value-display`/`.symbol-ref`/`.presets-grid`/`.preset-btn`) rather than the `.playground`/`.controls` vocabulary the other six converged on. Restructured the control markup onto the shared `.playground`/`.controls`/`.control-group` pattern for visual consistency across the hub: `.symbol-ref` became a reuse of the existing `.info-box` class, `.presets-grid`/`.preset-btn` became a small scoped `.ls-presets-grid`/`.ls-preset-btn` override. A `.breadcrumb` CSS rule existed in the source but was never referenced by any element (dead CSS) — dropped. Inline `onclick` attributes converted to `addEventListener`.

Same class of resize bug as [BFS](bfs.md): `window.addEventListener('resize', resizeCanvas)` reset the canvas bitmap (clearing it and its transform) without redrawing the tree, so a post-load `resize` event (scrollbar appearing) left the canvas blank. Fixed by having the handler call `resizeCanvas(); generate();` together.

## Original README

```markdown
# L-System Playground

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://keegooroomie.github.io/l-system-playground/)

An interactive playground for exploring Lindenmayer Systems (L-Systems) — recursive rewriting algorithms capable of generating surprisingly complex organic structures from a handful of simple rules.

🌐 **Live Demo:** https://keegooroomie.github.io/l-system-playground/


---


## What Are L-Systems?

L-systems were introduced by biologist Aristid Lindenmayer in 1968 to model plant growth.

An L-system is defined by four components:

- **Axiom** — the initial string
- **Production Rule** — how symbols are replaced
- **Iterations** — how many times rules are applied
- **Angle** — rotation used during drawing

A tiny rule can produce thousands of drawing instructions after only a few iterations.

---

## How It Works

Starting configuration:

```text
Axiom: F
Rule: F → F[+F]F[-F]F
```

Expansion process:

```text
Iteration 0
F

Iteration 1
F[+F]F[-F]F

Iteration 2
F[+F]F[-F]F[+F[+F]F[-F]F]F[+F]F[-F]F[-F]F[+F]F[-F]F
```

After expansion, the resulting string is interpreted by a turtle graphics renderer.

---

## Symbol Reference


| Symbol | Meaning                          |
| ------ | -------------------------------- |
| F      | Move forward and draw            |
| A / B  | Alternative drawing symbols      |
| +      | Rotate right                     |
| -      | Rotate left                      |
| [      | Save current position and angle  |
| ]      | Restore saved position and angle |

The bracket system is what enables branching structures such as trees, bushes, roots, and coral-like forms.

---

## Turtle Graphics Model

The renderer maintains:

- Current position `(x, y)`
- Current direction
- State stack

Execution example:

```text
F[+F][-F]
```

1. Draw forward
2. Save position
3. Turn right and draw branch
4. Restore position
5. Turn left and draw another branch

This simple mechanism creates hierarchical growth patterns.

---

## Included Presets

### Tree

```text
Axiom: F
Rule: F[+F]F[-F]F
Angle: 25°
```

Classic branching tree.

### Fern

```text
Axiom: F
Rule: F[+F][--F][-F]
Angle: 25°
```

Produces fern-like structures with asymmetric growth.

### Bush

```text
Axiom: F
Rule: F[+F][-F]F[-F][+F]F
Angle: 20°
```

Dense multi-branch vegetation.

### Fractal Plant

```text
Axiom: F
Rule: F[+F]F[-F][F]
Angle: 22°
```

Balanced recursive branching pattern.

---

## Complexity Growth

L-systems grow exponentially.

Example rule:

```text
F → F[+F]F[-F]F
```

Approximate command count:


| Iterations | Growth |
| ---------- | ------ |
| 1          | 11     |
| 2          | 61     |
| 3          | 311    |
| 4          | 1561   |
| 5          | 7811   |

This is why even simple rules quickly generate complex structures.

---

## Things To Experiment With

Try changing:

- Branch density
- Rotation angle
- Iteration count
- Symmetry
- Nested branches

Examples:

```text
F[++F][--F]
```

```text
F[-F]F[+F]F
```

```text
F[+F[-F]]
```

Small changes often produce dramatically different results.

---

## Real-World Applications

### Procedural Generation

- Trees
- Vegetation
- Roots
- Coral structures
- Alien flora

### Computer Graphics

- Fractal art
- Organic modeling
- Environmental generation

### Scientific Simulation

- Plant morphology
- Branching systems
- Growth pattern research

---

## Why This Project Exists

This playground is designed as a practical way to understand:

- Recursive rewriting systems
- Turtle graphics
- Procedural content generation
- Emergent complexity

Open the page, modify a rule, press Generate, and immediately see how a tiny algorithmic change affects the resulting structure.
```
