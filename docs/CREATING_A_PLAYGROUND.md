# Creating a Playground

This is the full workflow doc: how a playground actually works end to end, how to build a new one, how it gets embedded into the site, and how its preview image is built and kept up to date. For a quick field-by-field reference of the frontmatter, see [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) — this doc is the "why and how," that one's the "what goes in each box."

---

## How a playground actually works

A playground is three things tied together by one string — its **slug**:

1. **`src/content/playgrounds/<slug>.md`** — frontmatter (title, tags, description, thumbnail, source repo, `island` key) + a markdown body (the write-up). This is the only file `content.config.ts` validates; it drives the card on the list page, the OG/Telegram preview, and the prose on the detail page.
2. **`src/islands/<PascalSlug>.astro`** — the interactive part. Self-contained markup + scoped `<style>` + a `<script>` that runs the canvas/simulation. Registered under a key in `src/islands/index.ts`.
3. **The `island` field** in the `.md` file's frontmatter — the string that connects (1) to (2). `src/pages/[slug].astro` looks it up: `islands[entry.data.island]`.

There is exactly one page template, `src/pages/[slug].astro`, used for every playground — it is not copied per playground. It:
- reads the `.md` entry for the current slug via `getStaticPaths()`,
- resolves the island component from the `island` key,
- resolves an optional page background from the `background` key (see below),
- renders `Layout` (which sets the `<title>`, OG/Twitter meta, and canonical URL from the frontmatter) → a "← Back to all playgrounds" link → hero → the markdown body → the island → a link back to the source repo.

**Final URL:** a playground's slug *is* its path segment directly under the site root — no `/playgrounds/` prefix. Once deployed, Boids will be at:

```
https://keegooroomie.github.io/playgrounds/boids/
```

That URL is what you drop into a Telegram post — the page's `og:title`, `og:description`, and `og:image` (built from `thumbnail`) are what Telegram/Discord/etc. render as the link preview card. This is why `description` and `thumbnail` are not optional decoration — they're the actual public face of the link.

---

## Creating a new playground, step by step

1. **Copy the template.**
   ```bash
   cp docs/PLAYGROUND_TEMPLATE.md src/content/playgrounds/<slug>.md
   ```
   Fill in every frontmatter field (see `CONTENT_GUIDE.md`).

2. **Write the body**, following the mandatory section order below — this is not a style suggestion, every playground uses the same shape.

3. **Build the island.** If you're porting an existing standalone `index.html`, `npm run scaffold -- <slug> <path-to-index.html>` drafts one — it does **not** namespace ids or convert inline event handlers for you, you still have to do that by hand (see the checklist below). If you're starting fresh, look at an existing island (`src/islands/Boids.astro` is a good, simple reference) for the shape: root `<div>` markup, a scoped `<style>` for anything not already covered by `src/styles/global.css`, and a `<script>` with no inline `onclick`/`oninput` HTML attributes.

4. **Register it** in `src/islands/index.ts`:
   ```ts
   import MyThing from './MyThing.astro';
   export const islands: Record<string, any> = {
     // ...
     'my-thing': MyThing,
   };
   ```

5. **Run it.** `npm run dev`, open `http://localhost:4321/<slug>/`. Actually interact with every control — a clean build does not mean the canvas works (see the resize-bug story in `docs/playgrounds/bfs.md` for exactly the kind of bug that only shows up live).

6. **Capture the thumbnail** (see the Preview lifecycle section below).

7. **Write `docs/playgrounds/<slug>.md`** — internal notes: source repo (if migrated), what you changed and why, anything a future editor needs to know. Every playground has one of these, not just migrated ones.

### Mandatory island checklist

- [ ] Every DOM `id` is namespaced with the slug (`id="canvas"` → `id="<slug>-canvas"`). Generic ids collide the moment two islands share a page context or get copy-pasted from a common source.
- [ ] No inline `onclick`/`oninput`/`onchange` HTML attributes — an island's `<script>` is an ES module, not global scope; wire events with `addEventListener`.
- [ ] No `client:*` directive on the island usage in `[slug].astro` — those only apply to framework components (React/Vue/etc). A plain `.astro` island's script just runs at normal page load.
- [ ] If the island draws once and stops (not a continuous `requestAnimationFrame` loop), its `resize` handler must **regenerate** content, not just resize the canvas. A bare resize wipes the canvas to blank, and a `resize` event reliably fires right after first paint on this site (sidebar + long body text → scrollbar appears → viewport width changes). This is not hypothetical — it broke 4 of the first 7 migrated islands.
- [ ] Mobile behavior documented (see the `## Mobile Behavior` section, mandatory in the content body) and actually tested at a narrow width, not just assumed from the CSS.

---

## The bar

Two sites define the niche this project is aiming at, and they're the reference
when judging whether a new playground is good enough to publish:

- **[3Blue1Brown](https://www.3blue1brown.com/)** — visual intuition before
  formalism. The test it implies: if you deleted the prose, would the visual
  still teach the idea? If the answer is no, the visual is decoration and the
  playground isn't done.
- **[dynamicmath.xyz](https://dynamicmath.xyz)** — the reader manipulates the
  object directly rather than watching a fixed animation. This is the site the
  original Algorithms Lab brief named as its inspiration, so it's the oldest
  reference the project has.

Where this hub deliberately differs: those are mostly *watch and read*. Here
every parameter is live and the reader is explicitly invited to break the demo.
That's why `## Playground` and `## Mobile Behavior` are mandatory sections —
they're the part the references don't have to write, and the part that makes an
entry here more than an embedded video.

## Mandatory content structure

`PLAYGROUND_TEMPLATE.md`'s body has six `##` headings, in this order, and every playground follows it:

1. **`## What Is X?`** — plain-language introduction. **Must end with a Wikipedia link** as a plain in-text sentence, not a pill/button: `To find out more, you can read the Wikipedia article on [X](https://en.wikipedia.org/wiki/X).` Look the article up when adding the playground — most classic algorithms have one. If the playground is an original construction with no article of its own (as with Galaxy Sampler), link the underlying technique instead and say so in the sentence, rather than dropping the link entirely or pointing at something that only half-matches.
2. **`## How It Works`** — the mechanism, with pseudocode/code blocks as needed.
3. **`## Playground`** *(required)* — not the code, the *experience*: what each control does and its valid range/conditions, what to try first, what a visitor should expect to observe, any invariant the simulation holds.
4. **`## Mobile Behavior`** *(required)* — how this specific island behaves on a narrow/touch viewport: does the controls panel stack above the canvas (it does by default via `.playground`'s `960px` breakpoint — only document here if this island overrides that), does the canvas rescale or stay fixed-size, does any mouse-only interaction (hover, click-drag) have a touch equivalent or a documented graceful degradation, and the minimum width actually tested.
5. **`## Key Concepts`** — as many `###` subsections as the algorithm needs.
6. **`## Real-World Applications`** — same.

`## Playground` and `## Mobile Behavior` exist because they're easy to skip when you're focused on getting the canvas working — and they're exactly the two things a visitor on a phone, mid-scroll, actually needs answered.

---

## Embedding

**Inside the hub:** covered above — `island` key → `src/islands/index.ts` → mounted by `src/pages/[slug].astro`. There is no other embedding mechanism inside the project; every playground goes through this one path.

**Outside the hub:** a playground's page is a normal static page with no framing restrictions set, so it works as an iframe embed as-is:
```html
<iframe src="https://keegooroomie.github.io/playgrounds/boids/" width="100%" height="800"></iframe>
```
There's no dedicated "embed mode" (a stripped-down, chrome-less view) yet — embedding pulls in the full page, footer included. If that's ever needed, it would be a new `?embed=1`-style param read in `Layout.astro` to conditionally hide `Footer` and the back-link; not built now because nothing currently needs it.

---

## Preview (thumbnail) lifecycle

The card thumbnail and the `og:image` used for link previews are the same file: `public/thumbnails/<slug>.png`, referenced by the `thumbnail` frontmatter field. It is a **committed, static file** — never regenerated automatically during `npm run build` or the deploy workflow. That's deliberate: capture is a screenshot of a live canvas, and even with deterministic seeding (below) a change to an island's code, styling, or the shared theme changes what gets captured. Re-running it automatically on every build would silently swap in a new image on every deploy with no review step; requiring a deliberate `npm run thumbnail` + commit means someone actually looked at the result before it went live.

### Building it locally

```bash
npm run dev                      # needs a running server to screenshot against
npm run thumbnail -- <slug>      # one playground
npm run thumbnail -- --all       # every playground
```

This drives Playwright against your local dev server, screenshots the island's `<canvas>` element specifically (not the full page), and writes `public/thumbnails/<slug>.png`. Commit the result normally.

### Rebuilding it in CI

`.github/workflows/thumbnails.yml` — manually triggered (`workflow_dispatch`, from the Actions tab, optionally pass a slug or leave it as `all`). It builds the site, boots a preview server, runs the same capture script against it, and uploads the result as a downloadable **artifact** — it does **not** commit automatically, for the same non-determinism reason as above. Download the artifact, look at the results, copy the ones you actually want into `public/thumbnails/`, and commit deliberately.

Use the CI path when you want a clean-room capture (no local state, exactly what a fresh clone would produce) or you're on a machine without Playwright set up. Use the local path for everything else — it's faster to iterate on.

### When to regenerate

- After any change to an island's visuals: new colors, new default parameter values, layout changes to the controls panel that show up in the captured region, etc.
- **Not** needed for content-only edits (`description`, `tags`, prose body) — the thumbnail only ever depends on what's on the canvas.

### Determinism (`?seed=`)

Four islands seed their canvas with randomness on load — boids (initial flock layout), and the maze/terrain generators in bfs, dfs, and dijkstra. Each reads a `seed` query param via `src/lib/seed.ts`'s `getRandom()`: if the page URL has `?seed=<anything>`, every random call in that island is replaced with a seeded PRNG derived from that string, so the same seed always produces the same maze/flock/terrain. Without the param (the normal visitor experience), it's real `Math.random()` — nothing changes for a regular page load.

`capture-thumbnail.mjs` always navigates with `?seed=kgrm_s121` (override via `PLAYGROUNDS_THUMBNAIL_SEED`), so both local and CI capture are fully reproducible — no re-running until a good-looking maze shows up. If an island's *default* visual output needs to change, change its logic or defaults, not the seed; the seed only pins randomness, it doesn't curate the result.

### Capture-only framing (`?thumbnail=1`)

Every capture also navigates with `&thumbnail=1`. Islands read this via `isThumbnailMode()` (also in `src/lib/seed.ts`) to render their best "cover" frame instead of whatever they'd normally show on first load — a regular visitor never sets this param, so nothing about the live interactive page changes. Two examples already in use:

- **bfs/dfs/dijkstra** jump straight to a solved, fully-drawn path (animation toggled off, run triggered immediately) instead of capturing an empty, unsolved grid.
- **perlin-noise** fills the canvas edge-to-edge along its larger side instead of the interactive view's smaller centered texture with margin around it — the margin looks right when you're tweaking sliders, but reads as empty white bars in a small card image.

If a new island's default first-load frame doesn't make a good thumbnail, give it the same treatment: `import { isThumbnailMode } from '../lib/seed'` and branch on it wherever the "what should be on screen right now" decision gets made.

### Per-playground overrides (`thumbnailQuery`)

For a one-off case where the shared default seed/framing still isn't the right *state* — a pathfinding maze that happens to look bad with `kgrm_s121`, or a case where you want the write-up's screenshot to reflect a specific parameter combination — set `thumbnailQuery` in that entry's frontmatter (see `CONTENT_GUIDE.md`). It's raw query-string content appended to the capture URL, e.g. `thumbnailQuery: "seed=17"`. Nothing needs this today; it exists so a future one-off doesn't need a code change to solve.
