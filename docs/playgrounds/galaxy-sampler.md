# Galaxy Sampler — internal notes

- **Source repo:** https://github.com/KeeGooRoomiE/galaxy-sampler-playground
- **Migrated:** 2026-08-25
- **Content entry:** `src/content/playgrounds/galaxy-sampler.md`
- **Island:** `src/islands/GalaxySampler.astro`

## Migration notes

DOM ids namespaced with a `gx-` prefix. This is the only one of the seven source repos with a dark `.canvas-container` background (`#00000f`, for the space visuals) instead of the hub's default white canvas card — kept as a scoped override. Also the only one of the seven with a continuous `requestAnimationFrame` loop that isn't step/toggle-driven (stars are sampled once per parameter change via `regen()`, only rotation animates continuously). Inline `oninput`/`onclick` attributes converted to `addEventListener`.

Not migrated: `assets/repo/sample.mov`, a ~109 MB screen recording in the source repo. Too large to bring into a static-site git history as-is; skipped. If a demo clip is wanted later, re-host it externally (e.g. as a Telegram post attachment) rather than committing it here.

## Original README

```markdown
# Galaxy Sampler Playground

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://keegooroomie.github.io/galaxy-sampler-playground/)

Interactive playground for a parametric sampler on multidimensional polar distribution with power function — a procedural galaxy generator originally written in GML at age 17 and sold on the YoYo Games Marketplace for $5.

🌐 **Live Demo:** https://keegooroomie.github.io/galaxy-sampler-playground/

---

## What This Is

A point distribution algorithm that generates spiral galaxies by sampling star positions from a shaped probability density in polar coordinates. Two power-law transforms control radial density and arm width independently. The result looks like a galaxy because the math describes how stellar density actually behaves — not because anything was hand-tuned to look good.

Part of the [keegooroomie Algorithms Lab](https://github.com/KeeGooRoomiE) series.

---

## The Algorithm

### Radial Sampling

Uniform sampling in polar coordinates produces a ring, not a disk — area element r·dr·dθ means the outer edge is overrepresented. The fix is inverse transform sampling from a power-law CDF:

```
F(x) = (x / R)^α   →   x = R · u^(1/α),   u ~ Uniform(0,1)

randomInterval = galaxyRadius ^ (1 / bunching)
dist = (rand() × randomInterval) ^ bunching
```

`bunching < 1` concentrates stars near the center. `bunching > 1` pushes them outward. Functionally equivalent to the Sérsic profile used in observational photometry.

### Logarithmic Spiral Arms

Each star's angular position is derived from its radial distance — this is the definition of a logarithmic spiral:

```
armSpacing = 2π / numArms
angle = dist × 2 × spiralTightness + arm × armSpacing
```

`spiralTightness` controls pitch angle. The Milky Way's arms sit around 12°. Higher values wind more tightly; lower values produce open, swept-back arms.

### Perpendicular Displacement

A second power-sampled displacement scatters each star perpendicular to the arm axis, with spread scaling by distance:

```
disp = (rand() × randomInterval2) ^ bunching2 / ‖(dx,dy)‖ × dist ^ fanRate

x = cos(angle) × dist + dx × disp
y = sin(angle) × dist + dy × disp
```

`fanRate` controls arm flaring: 0 = thin wire spiral, 1 = linearly expanding arms, >1 = strongly flared outer disk.

---

## Parameters

| Parameter | Effect | Range |
|-----------|--------|-------|
| `stars` | Total star count | 200–5000 |
| `arms` | Number of spiral arms | 1–8 |
| `spiralTightness` | Pitch angle of the logarithmic spiral | 0.05–1.2 |
| `bunching` | Radial density exponent (Sérsic analog) | 0.3–2.0 |
| `armSpread` | Max perpendicular displacement factor | 0.02–0.6 |
| `fanRate` | Arm width growth with distance | 0.1–1.2 |
| `radius` | Galaxy size as fraction of canvas | 0.1–0.7 |
| `rotationSpeed` | Angular velocity multiplier | 0–5× |

---

## History

Written in GameMaker Language in 2016 as a background generator for a space shooter. The core insight was applying inverse transform sampling to a power-law distribution — sampling from a CDF whose inversion is just exponentiation. At the time there were no procedural galaxy tools on the YoYo Games Marketplace, so it sold as a documented utility script for $5.

The same algorithm, ported to TypeScript in 2026, runs as the animated background of [cv_hub](https://github.com/KeeGooRoomiE/cv_hub) with no mathematical changes. Same LCG seed, same galaxy, two languages, ten years apart.

The algorithm is domain-agnostic. With different parameters it generates: asteroid fields, coral branching patterns, root systems, city street networks radiating from a historical center. The galaxy framing is the most photogenic application.

---

## Technical Notes

- Vanilla JS + Canvas API, zero dependencies
- Seeded LCG (`s = (s × 1664525 + 1013904223) & 0xffffffff`) for deterministic output
- 3 parallax depth layers for visual depth
- Nebula blobs placed along arm paths using the same spiral formula
- Core glow via radial gradient, brightness per star via power-law falloff
- Color: warm yellow-white core (old giant stars) → blue-cyan arms (OB associations)
```
