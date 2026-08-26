# Playgrounds

![Deploy](https://github.com/KeeGooRoomiE/playgrounds/actions/workflows/deploy.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
![Astro](https://img.shields.io/badge/built%20with-Astro-ff5d01)
[![Last Commit](https://img.shields.io/github/last-commit/KeeGooRoomiE/playgrounds?color=blue)](https://github.com/KeeGooRoomiE/playgrounds/commits/main)
![Stars](https://img.shields.io/github/stars/KeeGooRoomiE/playgrounds?style=flat)

**A hub of interactive algorithm playgrounds — learn by tweaking, not just reading.**

🌐 **Live demo:** https://keegooroomie.github.io/playgrounds/

📋 **Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

## Get it running in a minute

```bash
git clone https://github.com/KeeGooRoomiE/playgrounds.git
cd playgrounds
npm install
npm run dev
```

Open `http://localhost:4321`.

## What you get

| | |
|---|---|
| 🧩 | One page per algorithm — a self-contained interactive canvas plus a write-up |
| 🗂️ | A list page generated from content, sorted and tag-filterable |
| 🔗 | A stable, shareable URL per playground with rich Telegram/OG link previews |
| 🚀 | Static output, deployed to GitHub Pages via GitHub Actions |
| 🛠️ | No CMS, no accounts, no backend — content is markdown files in the repo |

## Why This Exists

Each playground here started as its own tiny standalone repo — one `index.html`, one idea, one live demo link to drop in a Telegram post. That worked, but the ideas add up: no shared navigation, no consistent design, and no easy way to browse "what's here." This hub keeps every playground's own public URL and OG preview (so a single link still works for sharing) while giving them one home, one look, and one place to add the next one.

## Inspiration

This project is aiming squarely at the niche staked out by two sites, and they set the bar for everything here:

- **[3Blue1Brown](https://www.3blue1brown.com/)** — Grant Sanderson's work on building visual intuition *before* formalism. The lesson taken from it: the animation is not decoration attached to an explanation, it *is* the explanation, and the prose exists to point at the right part of it.
- **[dynamicmath.xyz](https://dynamicmath.xyz)** — interactive math widgets where the reader manipulates the object directly instead of watching it move. Named as the original inspiration in the first Algorithms Lab brief: *simple rules, big numbers, beautiful interactions*.

The gap this hub tries to fill relative to both: those are primarily *watch and read*; every entry here is meant to be *grabbed* — the parameters are live, and breaking the demo on purpose is the intended way to use it.

For where the design system, the 165 ms step tick, and the writing standards came from, see [`docs/ORIGINS.md`](docs/ORIGINS.md).

## Adding a Playground

1. Copy `docs/PLAYGROUND_TEMPLATE.md` to `src/content/playgrounds/<slug>.md` and fill it in.
2. Build the island component under `src/islands/<PascalSlug>.astro` — `npm run scaffold -- <slug> <path-to-source-index.html>` drafts one from an existing standalone repo if you have one.
3. Register the island in `src/islands/index.ts`.
4. `npm run dev`, sanity-check the page.
5. `npm run thumbnail -- <slug>` to generate its card image.

Full guide (mandatory content structure, embedding, thumbnail lifecycle): [`docs/CREATING_A_PLAYGROUND.md`](docs/CREATING_A_PLAYGROUND.md). Field-by-field frontmatter reference: [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md).

## Customization

Design tokens live in `src/styles/global.css` as CSS custom properties:

```css
:root {
  --accent: #3b82f6;
  --bg: #070a10;
  --r-lg: 18px;
  /* ... */
}
```

There's one theme, no theme switcher. A playground can opt into its own decorative page background via the `background` frontmatter field — see `src/components/backgrounds/`.

## How to Deploy

1. Push to `main` — the `deploy.yml` workflow builds and publishes to GitHub Pages automatically. Enable Pages in the repo settings (Source: GitHub Actions) once, on the first push.
2. `site`/`base` in `astro.config.mjs` resolve from `GITHUB_REPOSITORY` at build time, so forks work without editing config.

## CLI Reference

```bash
npm run dev         # local dev server
npm run build        # production build to dist/
npm run preview      # preview the production build
npm run scaffold -- <slug> <source-index.html>   # draft a new playground from a standalone repo
npm run thumbnail -- <slug> | --all              # capture card thumbnail(s) (needs `npm run dev` running)
```

## Project Structure

```
playgrounds/
├── src/
│   ├── content.config.ts             # `playgrounds` collection schema
│   ├── content/playgrounds/          # one .md per playground
│   ├── components/                   # Layout, Footer, PlaygroundCard, CategoryNav, backgrounds/
│   ├── islands/                      # one self-contained .astro per playground
│   ├── pages/                        # index (list) + [slug] (detail, e.g. /boids/)
│   └── styles/global.css
├── public/thumbnails/                # committed card images
├── scripts/                          # scaffold-playground.mjs, capture-thumbnail.mjs
├── docs/                             # CONTENT_GUIDE.md + per-playground internal notes
└── .github/workflows/deploy.yml
```

## Tech Stack

- [Astro](https://astro.build) — static site generation, content collections
- TypeScript
- [Playwright](https://playwright.dev) — local thumbnail capture only, not part of the build
- [IBM Plex Sans / Mono](https://www.ibm.com/plex/) via [Fontsource](https://fontsource.org) — self-hosted, no CDN request
- GitHub Pages + GitHub Actions

## Documentation

| Doc | What's in it |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, folder structure, data pipeline, routing, CI/CD |
| [docs/CREATING_A_PLAYGROUND.md](docs/CREATING_A_PLAYGROUND.md) | Full workflow: how a playground works, mandatory content structure, embedding, thumbnail/preview lifecycle |
| [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) | Field-by-field frontmatter reference |
| [docs/ORIGINS.md](docs/ORIGINS.md) | The original Algorithms Lab brief, and which of its conventions the hub kept, changed, or dropped |
| [docs/playgrounds/](docs/playgrounds/) | Internal migration notes per playground |

## If This Is Useful

```
⭐ Star it if you'd use this pattern for your own playgrounds
🍴 Fork it and swap in your own algorithms
🐛 Found a bug? Open an issue
```

## License

Source code: MIT. See [LICENSE](LICENSE).
