---
title: Galaxy Sampler
order: 70
tags: [procedural, sampling, simulation]
category: sampling
description: A parametric sampler on a shaped polar distribution — two power-law transforms turn uniform randomness into spiral galaxies, asteroid fields, or root systems.
thumbnail: /thumbnails/galaxy-sampler.png
sourceRepo: https://github.com/KeeGooRoomiE/galaxy-sampler-playground
island: galaxy-sampler
---

## Why Not Just Use Random?

If you scatter stars by picking a random X and Y inside a circle, you get noise — a uniform cloud with no structure. Real galaxies aren't like that. They have arms, a bright dense core, and a gradual fade toward the edge. To generate something that looks like a galaxy rather than static, you need a sampler that knows where stars are likely to be: close to the center, along specific curved paths, with width that grows outward.

The algorithm does exactly this: it samples star positions from a shaped probability distribution in polar coordinates, where the shape is controlled by a handful of parameters. Adjust them and you go from a tight grand-design spiral to a loose irregular dwarf galaxy. The math underneath is inverse transform sampling — a standard technique for drawing from any distribution you can write down a formula for.

This sampler is its own thing rather than a named, textbook algorithm, so there's no Wikipedia article for it directly — but to find out more about the technique underneath it, you can read the Wikipedia article on [inverse transform sampling](https://en.wikipedia.org/wiki/Inverse_transform_sampling).

## The Problem with Uniform Sampling

If you scatter stars by drawing a random angle θ ∈ [0, 2π) and a random radius r ∈ [0, R], you don't get a disk — you get a ring. The area element in polar coordinates is r·dr·dθ, so uniform sampling in (r, θ) space underrepresents the center and overrepresents the edge. Real galaxies have the opposite profile: extremely high stellar density at the core, falling off toward the periphery.

The naive fix — sampling r from a uniform distribution and squaring it — gives a correct uniform disk but still no radial clustering. What you need is a sampler whose probability density function matches the observed luminosity profile of a spiral galaxy: heavy-tailed, arm-structured, with a steep central concentration.

This is the problem the algorithm solves. The full name — parametric sampler on multidimensional polar distribution with power function — is a precise description of the method, not marketing. It samples in polar space using a power-law transform that shapes the radial density, then applies a second power-sampled displacement in the perpendicular direction to produce arm width. Two power functions, two bunching exponents, one galaxy.

> Written at 17 in GameMaker Language and sold on the YoYo Games Marketplace for $5. Ported to TypeScript/Canvas in 2026 and running as the background of [cv_hub](https://github.com/KeeGooRoomiE/cv_hub).

## How It Works

### Radial Sampling via Power Transform

The central technique is inverse transform sampling applied to a power-law distribution. To sample a random variable X with CDF F(x) = (x/R)^α, we draw u ~ Uniform(0,1) and compute x = R · u^(1/α). In the implementation this becomes:

```
randomInterval = galaxyRadius ^ (1 / bunching)   // = R^(1/α)
dist = (rand() * randomInterval) ^ bunching        // = (u · R^(1/α))^α
```

With bunching α < 1, the distribution concentrates near 0 — most stars land close to the center. With α > 1, the distribution spreads toward R. The name "bunching" describes this directly: it controls how tightly stars bunch around the galactic core.

This is functionally equivalent to the Sérsic profile used in observational astronomy to describe galaxy luminosity distributions, where the Sérsic index n plays the role of the bunching exponent.

### Logarithmic Spiral Arm Placement

Each star is assigned to an arm index in [0, numArms). The arm determines an angular offset, and the star's angle on that arm is derived directly from its radial distance:

```
armSpacing = 2π / numArms
angle = dist × 2 × spiralTightness + arm × armSpacing
```

This is the parametric form of a logarithmic (equiangular) spiral: r = a·e^(b·θ), rearranged so that θ grows linearly with r. The pitch angle of the spiral — how tightly it winds — is controlled by `spiralTightness`. Real spiral galaxies have pitch angles between 5° and 35°; the Milky Way's arms sit around 12°.

The reason this produces a spiral rather than a circle is that stars at different distances are placed at different angular offsets from the arm baseline. A star at r=100 is rotated further around the center than a star at r=50, causing the arm to trail behind as distance increases.

### Perpendicular Displacement with Fan Rate

A perfect logarithmic spiral is mathematically clean and visually unconvincing. Real arms have width, and that width increases with distance from the center — arms "fan out." This is handled by a second power-sampled displacement applied perpendicular to the arm direction:

```
randomInterval2 = (galaxyRadius × displacementFactor) ^ (1 / bunching2)
disp = (rand() × randomInterval2) ^ bunching2 / ‖(dx,dy)‖ × dist ^ fanRate

x = cos(angle) × dist + dx × disp
y = sin(angle) × dist + dy × disp
```

The `dist ^ fanRate` term is the key: it scales displacement proportionally to distance, so inner stars are tightly constrained to the arm axis while outer stars spread freely. `fanRate = 0` gives a thin wire spiral; `fanRate = 1` gives arms that expand linearly; values above 1 produce strongly flared outer disks.

The direction vector (dx, dy) is drawn uniformly from the unit disk and normalized, so displacement is isotropic in the plane — no preferred scatter direction.

### Brightness and Color

Each star's luminosity is mapped from its normalized distance to center: `brightness = 0.3 + 0.7 × (1 − normDist)^1.5`. The exponent 1.5 produces a sharp central peak matching the de Vaucouleurs r^(1/4) law qualitatively. Color follows the standard stellar population gradient: warm yellow-white at the core (old giant stars), blue-cyan in the arms (young OB associations and HII regions).

## Parameters Reference

| Parameter | Effect | Real Analog |
|---|---|---|
| `arms` | Number of spiral arms | Milky Way has 4; NGC 4622 has 2 |
| `spiralTightness` | How fast arms wind with distance | Controls pitch angle of the logarithmic spiral |
| `bunching` | Density falloff exponent | Sérsic index in real galaxy photometry |
| `armSpread` | Perpendicular scatter from arm axis | Arm width — loose in flocculent spirals, tight in grand design |
| `fanRate` | How much arms widen at outer edge | Flaring of outer disk |
| `radius` | Overall galaxy size as fraction of canvas | — |

## History and Generalization

The script was written in GameMaker Language in 2016, originally for a space shooter background. At the time procedural galaxy generation in GML required either a physics engine or hand-tuned particle systems; there was no standard utility approach. The power-transform method came from thinking about how to invert a CDF without knowing the closed form — the answer being that for power-law distributions, inversion is just exponentiation.

It sold on the YoYo Games Marketplace as a reusable script for $5 with documented parameters. The documentation had to explain what "bunching" meant to game developers who had never encountered inverse transform sampling, which turned out to be a useful exercise in finding the right analogy. "How tightly the stars clump around the center" is accurate and requires no probability theory to act on.

The algorithm has no structural dependency on galaxies. It generates any point distribution where points cluster along curved paths with a radial density gradient. The same code with different parameters produces: asteroid fields (low arm count, high spread, low tightness), coral growth patterns (high arm count, low radius, high fanRate), root systems (arms = 1, high tightness, very high bunching), and city layouts radiating from a historical center. The galaxy framing is the most photogenic application, but the underlying sampler is domain-agnostic.

In 2026 the GML source was ported to TypeScript/Canvas for cv_hub with no algorithmic changes. The LCG seed function was preserved — same seed, same galaxy, across two languages and ten years.
