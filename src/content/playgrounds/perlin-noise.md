---
title: Perlin Noise
order: 10
tags: [noise, procedural]
category: noise
description: Ken Perlin's gradient noise function — the algorithm behind Minecraft terrain, cloud textures, and organic motion.
thumbnail: /thumbnails/perlin-noise.png
thumbnailAlt: "A 3D landscape of Perlin noise drawn as a grid of quads, coloured in vivid blues, greens and magentas."
sourceRepo: https://github.com/KeeGooRoomiE/perlin-noise-playground
island: perlin-noise
thumbnailQuery: "view=3d&palette=random&octaves=3&scale=33&amplitude=50"
---

## What Is Perlin Noise?

In 1983, Ken Perlin was working on visual effects for *Tron*. He needed textures that didn't look hand-drawn. Drawing by hand was slow, so he wrote a function.

That function is now called Perlin Noise. It underlies almost every procedural generation you've ever seen — not just in games.

The idea is simple: take a point's coordinates, run them through an interpolation function, get a number from 0 to 1. Neighboring points produce similar numbers, distant points diverge. The result is smooth noise — not random static, but structured randomness.

To find out more, you can read the Wikipedia article on [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise).

## How It Works

For any point `(x, y)`, Perlin Noise finds the surrounding grid cell, generates gradient vectors at each corner, and interpolates between them using a smooth fade curve.

### The Core Formula

```
// Fade curve (smoothstep)
f(t) = 6t⁵ − 15t⁴ + 10t³

// For point (x, y):
xi = floor(x),  xf = x - xi   // integer + fractional parts
u = fade(xf),   v = fade(yf)

// Interpolate between 4 corners
n = lerp(
  lerp(hash(xi,   yi),   hash(xi+1, yi),   u),
  lerp(hash(xi, yi+1),   hash(xi+1, yi+1), u),
  v
)
```

### Octaves

A single noise layer gives you a gentle landscape. Stack several layers with different frequencies and amplitudes — those are called **octaves**. The first octave defines large-scale terrain, the second adds hills, the third adds detail:

```
value = 0
amplitude = 1
frequency = 1

for each octave:
    value     += noise(x * frequency, y * frequency) * amplitude
    amplitude *= 0.5      // each layer quieter
    frequency *= 2.0      // each layer more detailed
```

> Four lines of code, and you already have something that looks like a landscape. This is exactly how terrain generation works in Minecraft, No Man's Sky, and virtually every roguelike.

## Key Concepts

### Seed

The same seed always produces the same noise field. This is how games generate deterministic worlds — the entire Minecraft world is encoded in a single number. Change one digit and you get a completely different universe.

### Scale

Controls how "zoomed in" you are on the noise field. Low scale = large features (continents). High scale = fine detail (pebbles). Most generators use multiple scales at once via octaves.

### Persistence & Octaves

Persistence controls how much each successive octave contributes. With persistence = 0.5, each octave is half as loud as the previous. More octaves = more detail, but diminishing returns quickly.

## Understanding the Parameters

### Octaves

Try setting octaves to 1 — you'll see very smooth, gentle variation. Increase to 4–5 and sharp details emerge. Each additional octave doubles the frequency and halves the contribution. Beyond 5–6 octaves the visual difference becomes negligible but the computation keeps growing.

### Scale

Think of scale as a zoom level over the noise field. Low values (5–15) give you coarse, continental shapes. High values (40–50) zoom in so close that the whole canvas shows just a tiny patch — everything looks uniform and smooth.

### Amplitude (3D)

At zero, the plane is perfectly flat — just the noise colors projected onto an isometric surface. As amplitude increases, the plane deforms like a cloth being pushed from below. High-value regions rise, low-value regions sink.

## Real-World Applications

### Terrain & World Generation

Minecraft, No Man's Sky, Dwarf Fortress — all use layered noise for terrain. Elevation, moisture, temperature: each is a separate noise field. Their combination determines biomes.

### Texture Synthesis

Marble, wood grain, clouds, fire — classic shader techniques that feed noise into color ramps. Ken Perlin himself used it for the Tron light cycles in 1982.

### Animation & Motion

Camera shake, NPC wandering paths, wind effects on foliage — smooth random motion without abrupt jumps. Sample noise over time instead of 2D space and you get organic-looking animation curves.

### Procedural Placement

Pure `random()` gives you chaos; noise gives you structure that looks alive — clusters, clearings, density gradients.

## Complexity & Performance

Perlin Noise is cheap. A single sample is O(1) — a handful of multiplications and a table lookup. The cost scales with octaves and resolution, not with the size of the world being generated.

| Operation | Cost | Notes |
|---|---|---|
| Single sample (1 octave) | O(1) | ~20 float ops |
| Single sample (N octaves) | O(N) | Each octave doubles frequency |
| Full 128×128 grid, 3 octaves | ~50k ops | Instant on modern hardware |
| Full 1024×1024 grid, 6 octaves | ~6M ops | ~10ms on CPU, ~0.1ms on GPU |

For real-time applications, noise is typically computed on the GPU in a fragment shader — the entire operation collapses to a single draw call regardless of resolution.
