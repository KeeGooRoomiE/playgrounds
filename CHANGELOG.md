# Changelog

All notable changes to Playgrounds are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [Semantic Versioning](https://semver.org/).

---

## [0.11.0] — 2026-09-16

### Added
- Index page opens with a **Start here** block: three doors chosen for what happens in the first five seconds without reading (pour sand, grow a tree, recognise Perlin noise in the Minecraft palette), plus a line on the shape every page follows and a line on who made this and why.
- JSON-LD on every page — `WebSite` + `ItemList` on the index, `LearningResource` per playground. Invisible to readers; it tells a search engine these are interactive learning materials rather than a product page.
- `thumbnailAlt` frontmatter field, filled in for all thirteen playgrounds. Card images had `alt=""`, which kept them out of image search entirely.

### Fixed
- `robots.txt` pointed at a sitemap under the repository's old name (`playgrounds-lab`), so the URL 404'd. It is now generated from the build config (`src/pages/robots.txt.ts`) instead of being a static file that can go stale. The sitemap itself was always correct.

## [0.10.0] — 2026-09-16

### Added
- **Conway's Game of Life** playground, at the `game-of-life` slug the Sandbox page already links to. Deliberately finite: an `Edges` switch runs the board with dead space outside or as a torus, and the copy uses the difference. Draw cells or stamp patterns (glider, LWSS, blinker, toad, pulsar, Gosper glider gun, R-pentomino, acorn), switch between Life, HighLife and Day & Night, and watch a hash-based detector announce still lifes, oscillator periods and extinction. Three skins: Classic, Age (colour by how long a cell has lived) and Trails.

## [0.9.0] — 2026-09-15

### Added
- **Sandbox** playground — a falling-sand cellular automaton you pour into and erase from (mouse buttons, or a pour/erase switch on touch), with per-grain friction that raises the angle of repose, Perlin-noise terrain generation (normalised, cut above 0.75), and five skins: Desert, Sand bottle, Gradient, Light sand and What moves. Links ahead to a Game of Life page at `../game-of-life/`, which doesn't exist yet.

### Fixed
- `capture-thumbnail.mjs` removes Astro's dev toolbar before the screenshot. Captured against `npm run dev`, the toolbar floats over the bottom of the page and landed in the Sandbox thumbnail; the existing thumbnails were re-captured and came out byte-identical, so none of them had it.

## [0.8.0] — 2026-09-15

### Added
- **Sorting Algorithms** playground — insertion, merge, quick, heap and radix sort on one page, played out on pixel-art playing cards drawn entirely from string bitmaps (no sprites). Each algorithm is a generator yielding one captioned step at a time; the same hand is kept across algorithms so comparison and move counts line up. Deals for shuffled, nearly sorted, reversed and many-ties hands, a suit-then-rank key that makes radix sort deal twice, original-order badges and a stability readout that flags equal cards that changed order, heap-tree arcs, merge buffer row and radix piles.

## [0.7.0] — 2026-09-14

### Added
- **Brownian Tree** playground — diffusion-limited aggregation on a lattice, with a distance map and safe long hops so thousands of particles grow in seconds. Five seed shapes (point, ground line, inward ring, window frame, scattered seeds), tap-to-plant, stickiness and wind, colouring by arrival time or branch weight, a one-particle mode that draws a true random walk, live tip-extension and rough fractal-dimension readouts, and six skins: Coral, Lichtenberg figure, Lightning strike, Frosty window, Fungal spread, Mineral dendrite. Growth is independent of skin and speed for a given seed.

## [0.6.0] — 2026-09-14

### Added
- **Hamiltonian Path** playground — backtracking search for a path or cycle through every open cell of a grid, with Warnsdorff ordering, connectivity/dead-end pruning, and an optional checkerboard parity proof that rejects impossible boards before any search. Random fields with an optional solvability guarantee, tap-to-edit blocks and start, and three skins (Snake, Line puzzle, Graph). Board is a fixed N×N with an adaptive cell size rather than the usual `CELL = 20`, since the search is exponential.

## [0.5.0] — 2026-09-11

### Added
- **Kruskal's Algorithm** playground — the minimum spanning tree algorithm run as a maze generator, with a disjoint-set union visualised by colouring each cell by its current component, so merges show as colours collapsing into one. Three interchangeable skins (Maze, City streets, Circuit board) change the palette only, never the grid or the edge order. First playground authored directly in this repo rather than migrated from a standalone one.

### Changed
- `sourceRepo` is now optional. The detail page printed "Originally built as a standalone project" beside it unconditionally, which is false for a playground written here; the line is now skipped when the field is absent.

## [0.4.0] — 2026-08-26

### Added
- `scripts/make-og-image.mjs` + `og-image.config.json` — the site-root link-preview card is now generated by a committed, config-driven script instead of a throwaway one. Wording, colours and an optional icon are content edits; any field can be overridden per-run with a flag.
- `.github/workflows/og-image.yml` — dispatchable regeneration with optional title/tagline/icon/accent overrides. Always uploads an artifact; commits to main only when explicitly asked. Icon paths are validated to stay inside the repo.
- `npm run check` (`astro check`, with `@astrojs/check` + `typescript` as devDependencies) wired into `ci.yml` — catches mistyped frontmatter access and stale component props, which an Astro build passes straight through. Currently 0 errors, 0 warnings.

### Fixed
- `thumbnails.yml` failed on its first two real runs, both only visible by dispatching it. The preview server was started with a bare `&` in its own step and died with that step's shell, so the wait step found nothing listening; start and wait now happen in one step, detached with `nohup`, and a failure prints the server's own log rather than a bare timeout. Then the run revealed that the `GITHUB_REPOSITORY: ""` override added to strip the base path is a no-op — GitHub reserves the `GITHUB_` prefix and re-injects those variables — so capture is now pointed at the base path instead of trying to remove it. Verified end to end: the workflow now completes and uploads a correct artifact.

## [0.3.0] — 2026-08-26

### Added
- `ci.yml` — builds every pull request (nothing validated PRs before; `deploy.yml` only runs on push to main) and runs a content integrity check for problems the build can't catch: a `thumbnail` pointing at an uncommitted file, an unregistered `island` key, a `category` missing from its own `tags`, or a missing `og-image.png`.
- `.github/dependabot.yml` — monthly grouped updates for GitHub Actions and npm.

### Changed
- All actions bumped to current majors (`checkout@v7`, `setup-node@v7`, `cache@v6`, `upload-artifact@v7`, `upload-pages-artifact@v5`, `deploy-pages@v5`); they were 2–3 majors behind, which is what produced the "Node.js 20 is deprecated" warnings on every run.
- Permissions are now per-job and default-deny (`permissions: {}` at workflow level) instead of one workflow-wide grant that also handed Pages write access to the Telegram job.
- `persist-credentials: false` on every checkout, so no usable token sits in `.git/config` while `npm ci` runs dependency lifecycle scripts.
- Telegram notification uses `curl --fail-with-body` and discards the response body, so an API error fails the step loudly instead of passing silently, and the chat id stops being echoed into the log.

### Fixed
- **Command injection in `thumbnails.yml`**: the dispatch input was interpolated straight into the shell (`npm run thumbnail -- ${{ ... }}`). Interpolation happens before the shell parses the script, so a dispatched value could run arbitrary commands on the runner. Now passed via `env:`, quoted, and validated against `^[a-z0-9][a-z0-9-]*$` plus an existence check.
- `thumbnails.yml` could never have worked: its default input `all` was passed as a literal slug (the script's flag is `--all`), and the runner's automatic `GITHUB_REPOSITORY` made `astro preview` serve under `/<repo>/` while the capture script requested root-level URLs — every capture would have 404'd. Both fixed.

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
