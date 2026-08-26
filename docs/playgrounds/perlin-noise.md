# Perlin Noise — internal notes

- **Source repo:** https://github.com/KeeGooRoomiE/perlin-noise-playground
- **Migrated:** 2026-08-25
- **Content entry:** `src/content/playgrounds/perlin-noise.md`
- **Island:** `src/islands/PerlinNoise.astro`

## Migration notes

DOM ids namespaced with a `pn-` prefix (source repo used generic ids: `canvas`, `seed`, `octaves`, `scale`, `palette`, `amplitude`, `viewLabel`). Inline `onclick`/`oninput`/`onchange` attributes converted to `addEventListener` calls — Astro island `<script>` tags are ES modules, not global scope, so inline handlers referencing top-level functions would not resolve. No logic changes beyond that; the noise/render code is a direct port.

## Original README

```markdown
# Perlin Noise Playground

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://keegooroomie.github.io/perlin-noise-playground/)

An interactive playground for exploring Perlin Noise — the gradient noise algorithm behind procedural generation in Minecraft, No Man's Sky, and virtually every roguelike ever made.

🌐 **Live Demo:** https://keegooroomie.github.io/perlin-noise-playground/

---

## The Origin

In 1983, Ken Perlin was working on visual effects for *Tron*. He needed textures that didn't look hand-drawn. Drawing manually was slow, so he wrote a function.

That function now underlies almost every procedural generation you've ever seen.

---

## What Is Perlin Noise?

Perlin Noise is a gradient noise function. For any point `(x, y)` it returns a smooth value between 0 and 1, where neighboring points produce similar values and distant points diverge.

Unlike `random()` which gives pure chaos, Perlin Noise gives **structured randomness** — variation that feels organic rather than scattered.

---

## How It Works

### Core Algorithm

For each point, find the surrounding grid cell and interpolate between gradient vectors at each corner:

```text
f(t) = 6t⁵ − 15t⁴ + 10t³    // smooth fade curve

xi = floor(x),  xf = x - xi   // integer + fractional parts
u = fade(xf),   v = fade(yf)

n = lerp(
  lerp(hash(xi,   yi),   hash(xi+1, yi),   u),
  lerp(hash(xi, yi+1),   hash(xi+1, yi+1), u),
  v
)
```

The key insight: instead of random per-pixel values, each grid corner has a **gradient**, and the noise value is an interpolated dot product. This guarantees continuity.

### Octaves

A single noise layer gives gentle, uniform variation. To get terrain-like detail, stack multiple layers:

```text
value = 0
amplitude = 1.0
frequency = 1.0

for each octave:
    value     += noise(x * frequency, y * frequency) * amplitude
    amplitude *= 0.5      // each layer quieter (persistence)
    frequency *= 2.0      // each layer more detailed (lacunarity)

value /= total_amplitude  // normalize to [0, 1]
```

| Octave | Contribution | Effect |
|--------|-------------|--------|
| 1st    | 50%         | Large terrain features |
| 2nd    | 25%         | Hills and valleys |
| 3rd    | 12.5%       | Ridges and bumps |
| 4th+   | <12.5%      | Fine surface detail |

---

## Playground Parameters

### Seed
A string or number that deterministically initializes the noise field. The same seed always produces the same world. This is how Minecraft encodes entire universes in a single integer.

### Scale
How "zoomed in" you are on the noise field.

| Scale | Effect |
|-------|--------|
| 5–15  | Coarse, continental shapes |
| 20–40 | Natural terrain-scale features |
| 40–50 | Fine detail, nearly uniform at canvas size |

### Octaves
Number of noise layers stacked together. More octaves add detail but have diminishing visual returns after ~5.

### Palette
Color mapping applied to noise values [0, 1]:

- **Monochrome** — honest grayscale, 0 = black, 1 = white
- **Minecraft** — water → sand → grass → stone gradient
- **Gradient** — blue to orange lerp
- **Random** — HSL hue mapped to noise value

### Amplitude (3D only)
Controls vertical deformation of the isometric plane. At 0, the plane is flat — just the noise image projected in isometry. Increasing amplitude pushes high-value regions up and low-value regions down, like cloth being shaped by an invisible hand.

---

## 3D View

The 3D visualization renders the noise field as a deformable plane using isometric projection:

```text
screenX = (gx - gy) * cos(30°) * scale
screenY = (gx + gy) * sin(30°) * scale - noiseValue * amplitude
```

Each grid quad is a filled polygon. At amplitude 0 it's a flat diamond. As amplitude increases, the surface warps into terrain. The render order is back-to-front (painter's algorithm) to avoid depth artifacts.

---

## Real-World Applications

### Terrain Generation
Elevation, moisture, and temperature are each a separate noise field. Their combination determines biomes. Minecraft's overworld uses this exact approach.

### Texture Synthesis
Marble, wood grain, clouds, fire — classical shader techniques feed noise into color ramps. Ken Perlin himself used it for the Tron light cycles in 1982.

### Procedural Placement
Using noise for object placement instead of `random()` gives spatial structure — natural clustering, density gradients, clearings. This is how forests, rock formations, and enemy spawns work in most open-world games.

### Animation & Motion
Sample noise over time (treating `t` as a third axis) to get smooth, organic-looking camera shake, NPC wandering paths, or wind effects on foliage.

---

## Performance

Perlin Noise is cheap. A single sample is O(1) regardless of world size.

| Operation | Cost | Notes |
|-----------|------|-------|
| Single sample, 1 octave | O(1) | ~20 float ops |
| Single sample, N octaves | O(N) | Linear in octave count |
| 128×128 grid, 3 octaves | ~50k ops | Instant on CPU |
| 1024×1024 grid, 6 octaves | ~6M ops | ~10ms CPU, ~0.1ms GPU |

For real-time applications, noise runs in fragment shaders — the entire field computes in a single draw call.

---

## Things to Experiment With

- Set octaves to **1** to see the base layer, then increase to watch detail emerge
- Set scale to **5** for blocky Minecraft-style terrain, **50** for smooth gradients
- In 3D, try amplitude **50** with the **Minecraft** palette
- Change the seed while in 3D view — same shape, different topology
- Try typing words as seeds: `minecraft`, `tron`, `noise`

---

## Why This Project Exists

This playground is part of the [keegooroomie Algorithms Lab](https://github.com/KeeGooRoomiE) — interactive visualizations for algorithms covered in the Telegram channel.

The goal: understand the algorithm by playing with it, not just reading about it.
```
