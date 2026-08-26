# Boids — internal notes

- **Source repo:** https://github.com/KeeGooRoomiE/boids-playground
- **Migrated:** 2026-08-25
- **Content entry:** `src/content/playgrounds/boids.md`
- **Island:** `src/islands/Boids.astro`

## Migration notes

DOM ids namespaced with a `bd-` prefix. Removed dead code: the source defined full predator (`C`) and prey (`B`) species — coccus (spherical) rendering, `chaseNearest`/extra `fleeFrom` logic, per-species config block — but `resetSim()` only ever populated the `A` (bacilli) array; `boidsB`/`boidsC` stayed empty arrays for the lifetime of the page, so those branches never executed. Simplified `Boid` to a single species. This is behavior-preserving: since the removed code paths were unreachable, the visible simulation (the bacilli colony) is unaffected. Inline `onclick`/`oninput` attributes converted to `addEventListener`.

## Original README

```markdown
# Boids Playground

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://keegooroomie.github.io/boids-playground/)

An interactive simulation of bacterial flocking behavior based on Craig Reynolds' Boids model (1986). Demonstrates emergent collective motion from three local steering rules — separation, alignment, cohesion — with no central coordination.

🌐 **Live Demo:** https://keegooroomie.github.io/boids-playground/

---

## What Is This

A colony of rod-shaped bacteria (bacilli) rendered in microscope-slide style — translucent bodies with nucleoids and animated flagella — exhibiting classical flocking dynamics. Move the cursor over the field to introduce a repellent stimulus and observe evasion and reformation behavior.

Part of the [keegooroomie Algorithms Lab](https://github.com/KeeGooRoomiE) series of interactive algorithm visualizations.

---

## The Three Rules

Each agent evaluates three forces per frame against neighbors within its perception radius:

| Rule | Effect |
|------|--------|
| **Separation** | Steer away from neighbors that are too close |
| **Alignment** | Match the average heading of nearby neighbors |
| **Cohesion** | Steer toward the local center of mass |

No agent knows the shape of the flock. No agent knows the flock exists. Global order emerges from local arithmetic.

---

## Controls

| Control | Effect |
|---------|--------|
| **Count** slider | Number of bacteria in the colony |
| **Speed** slider | Maximum velocity per agent |
| **Cursor repel radius** | Radius of the repellent field around the cursor |
| **Mouse hover** | Repels bacteria within radius |
| **Reset** | Reinitialize the colony |

---

## Visual Details

Each bacterium is rendered as a microscope specimen:

- **Pill-shaped body** with radial gradient simulating membrane light refraction
- **Nucleoid** — darker elliptical mass offset inside the cell body
- **Flagella** — 2–4 animated sine-wave filaments at the tail, wave frequency proportional to movement speed
- **Highlight** — specular ellipse simulating transmitted light
- **Background** — warm off-white glass slide with subtle vignette

---

## Technical Notes

- Vanilla JS + Canvas API, zero dependencies
- `O(n²)` neighbor search per frame — sufficient for < 100 agents at 60fps
- Soft boundary repulsion (no hard wrapping) keeps agents on screen
- Flagella animation driven by global frame counter + per-agent phase offset

---

## Real-World Applications

Boids-derived models are used in:

- **Game AI** — crowd simulation in Assassin's Creed Unity, swarm enemies in Left 4 Dead
- **VFX** — Batman Returns (1992) bat and penguin crowds, one of the first production uses
- **Drone swarms** — DARPA OFFSET program, 250+ autonomous UAVs with local-only coordination
- **Warehouse robotics** — Amazon Kiva units navigating shared space without central path planning
- **Traffic modeling** — stop-and-go wave emergence in the Intelligent Driver Model
- **Biology** — Cavagna et al. (2010) confirmed real starlings use topological (not metric) neighborhoods, matching boids predictions

---

## Things to Try

- Set count to **60** and watch density-driven subgroup formation
- Slow speed to **0.2** — cohesion dominates, the colony clumps tightly
- Fast speed at **1.5** — alignment dominates, long directional streams appear
- Hold cursor in the center — observe encirclement and gap-filling after you move away
- Reset mid-motion to see how quickly order re-emerges from random initial positions
```
