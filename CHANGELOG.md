# Changelog

All notable changes to Playgrounds are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [Semantic Versioning](https://semver.org/).

---

## [0.2.0] — 2026-08-26

### Added
- IBM Plex Sans (variable) + IBM Plex Mono, self-hosted via `@fontsource` npm packages — no CDN request. Stacks live in `--font-sans` / `--font-mono`.
- Category rail (`CategoryNav.astro`) grouping entries by a new required `category` frontmatter field, with per-category counts and collapsible `<details>` groups.
- `thumbnailQuery` frontmatter field and `?thumbnail=1` capture mode, so each playground can define the exact state its card image is shot in.
- Wikipedia link closing the first section of every playground, and a rule requiring one for new entries.
- `docs/ORIGINS.md` — the original Algorithms Lab brief plus a reconciliation of which conventions the hub kept, changed, or dropped.
- Inspiration credited in `README.md` and `docs/CREATING_A_PLAYGROUND.md`: 3Blue1Brown and dynamicmath.xyz.

### Changed
- Playground pages are a single vertical column: title → full prose → island → pager. The category rail sits in the outer margin, not inside the reading column.
- Index page: hero, tag filter and card grid share one left edge; the rail moved to the margin outside them. Card grid goes to three columns on wide viewports.
- CI pinned to Node 24 (Node 20 reached EOL in April 2026), and `engines.node` declared as `>=22.19.0`.
- Deploy workflow installs with `--omit=dev`, skipping Playwright, which only the thumbnails workflow needs.
- Content template moved out of the collection folder to `docs/PLAYGROUND_TEMPLATE.md`, so it can never be picked up as a real entry.

### Fixed
- Markdown code blocks rendered dark-on-dark: Astro's default Shiki theme injected inline styles that overrode the light stylesheet. Syntax highlighting disabled — the blocks are pseudocode, not real syntax.
- Perlin Noise thumbnail had white bars; 3D view used a fixed scale independent of canvas size. Both now fill the frame in capture mode.
- BFS and DFS thumbnails were near-identical; they now use distinct capture seeds, and the canvas panel background is wall-coloured so grid remainder doesn't read as a gap.
- `capture-thumbnail.mjs` built its URL by string concatenation, so a `thumbnailQuery` seed override was appended as a duplicate key and silently ignored. Now built with `URLSearchParams`.
- `ARCHITECTURE.md` claimed islands mount with `client:visible` (they take no directive — that's framework-components only) and described a dark theme with `cv_hub` tokens (the theme is light, tokens come from `TEMPLATE.html`).

### Removed
- Site header. It held two links to the same destination, and the category rail plus its back link now cover navigation.

## [0.1.0] — 2026-08-25

### Added
- Initial Astro hub: content collection, list page with tag filter, per-playground detail page with prev/next navigation.
- Seven playgrounds migrated from standalone repos: Perlin Noise, L-Systems, Boids, BFS, DFS, Dijkstra, Galaxy Sampler.
- `scripts/scaffold-playground.mjs` and `scripts/capture-thumbnail.mjs` CLI helpers.
- `docs/CONTENT_GUIDE.md` and per-playground internal migration notes under `docs/playgrounds/`.
- GitHub Actions deploy workflow to GitHub Pages.
