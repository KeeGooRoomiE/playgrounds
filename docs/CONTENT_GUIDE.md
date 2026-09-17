# Content guide — filling in a playground

Every playground is one file: `src/content/playgrounds/<slug>.md`. Copy `docs/PLAYGROUND_TEMPLATE.md` to start a new one — it has the same fields below with inline comments, plus a body skeleton. It lives under `docs/`, not inside the collection folder, so it's never at risk of being picked up as a real entry.

This page is the field-by-field reference. For the full picture — how a playground works end to end, mandatory content structure, embedding, the thumbnail/preview lifecycle — see [`CREATING_A_PLAYGROUND.md`](CREATING_A_PLAYGROUND.md).

## Frontmatter fields

| Field | Type | Notes |
|---|---|---|
| `title` | string | Short, matches the source repo's `<title>`/hero `<h1>` in spirit. Shown in the card, the page `<title>`, and `og:title`. |
| `order` | number | Position in the list page and in prev/next. Leave gaps of **10** between entries (10, 20, 30…) so a new playground can be inserted later without renumbering everything else. |
| `category` | string | **Required.** The single category this playground files under in the index page's left rail, which groups entries and shows a count per category (`Graph (5)`). Must also appear in `tags` — `tags` is the many-to-many filter, `category` is the one home. Reuse an existing category before starting a new one: a one-member group like `Procedural (1)` reads as "there's only one procedural playground" when the `procedural` tag filter shows four. Current homes: `graph` for BFS/DFS/Dijkstra/A*/Kruskal/Hamiltonian Path, `noise` for Perlin, `fractal` for L-Systems and Brownian Tree, `simulation` for Boids, Sandbox and Game of Life, `sampling` for Galaxy Sampler, `sorting` for Sorting Algorithms, `animation` for Easing Curves. Because categories share the tag vocabulary, a category's count can still be lower than the same word's tag count (`Simulation (1)` vs three `simulation` tags) — that's the trade-off of one home per playground. Categories appear in the rail in `order` sequence, not alphabetically. |
| `tags` | string[] | A playground can carry several. Reuse existing tags before inventing a new one — check the other `.md` files in this folder for the current vocabulary. In active use as of the last playground added: `simulation`, `behavior`, `emergence`, `procedural`, `pathfinding`, `graph`, `weighted`, `fractal`, `recursion`, `noise`, `sampling`, `backtracking`, `sorting`, `cellular-automaton`, `animation`, `curves`, `interpolation`. |
| `description` | string | One to two sentences, no more — this is card-list copy and the `og:description`/`twitter:description` Telegram will show, not the full write-up. |
| `thumbnail` | string | Path under `/thumbnails/`, e.g. `/thumbnails/boids.png`. Generate it with `npm run thumbnail -- <slug>` (Playwright, screenshots the built page) rather than a hand-cropped screenshot — keeps every card visually consistent. |
| `thumbnailAlt` | string (optional) | What the thumbnail *shows*, for screen readers and image search — describe the picture ("a snake filling an 8x8 board, weaving around grey blocks"), not the playground ("Hamiltonian path preview"). Quote the value if it contains a colon. Falls back to `"<title> playground"`, which is weak; write a real one. |
| `sourceRepo` | string (URL, optional) | Link to the original standalone GitHub repo the playground was migrated from. **Omit it for a playground written directly in this repo** — the detail page prints "Originally built as a standalone project" beside it, which would be untrue, and the line is skipped entirely when the field is absent. |
| `island` | string | The lookup key for this playground's component — matches an entry in the `islands` map used by `src/pages/[slug].astro`. |
| `background` | string (optional) | Lookup key into `src/components/backgrounds/`. Omit it to use the default background — most playgrounds should omit it. |
| `thumbnailQuery` | string (optional) | Extra query-string params appended to the URL when capturing this entry's thumbnail, e.g. `"seed=17"`. Only needed when the shared default (`?seed=kgrm_s121&thumbnail=1`) doesn't produce a good result for this one playground — see the "Preview lifecycle" section in `CREATING_A_PLAYGROUND.md`. Omit it otherwise. |

## Body

The markdown body is the long-form write-up, rendered below the interactive island. The section order is **mandatory** — six `##` headings, same order, every playground: `What Is X?` → `How It Works` → `Playground` → `Mobile Behavior` → `Key Concepts` → `Real-World Applications`. `Playground` and `Mobile Behavior` are new sections you write yourself (not usually present in a migrated source repo's prose) — see `CREATING_A_PLAYGROUND.md` for what belongs in each. `What Is X?` must close with a plain in-text Wikipedia link (`To find out more, you can read the Wikipedia article on [X](…)`) — look it up per playground. When migrating from an existing standalone repo, the first two/last two sections' prose often already exists inside that repo's `index.html` — carry that text over rather than rewriting from scratch.

## Internal notes per playground

Alongside the live content entry, each migrated playground also has `docs/playgrounds/<slug>.md` — an internal, repo-only record (not rendered on the site) of where it came from and what changed during migration: source repo, id-namespacing prefix used, any cleanup (dead code removed, markup reused from shared CSS classes), and the original repo's README preserved for reference. Add one of these for every new playground, migrated or original.

## Adding a playground

Short version — see `CREATING_A_PLAYGROUND.md` for the full walkthrough and the mandatory island checklist:

1. `npm run scaffold -- <slug> <path-to-source-index.html>` — drafts `src/content/playgrounds/<slug>.md` and `src/islands/<PascalSlug>.astro` from the source file. Not fully automatic — the script does not namespace DOM ids for you.
2. Open the drafted island: prefix every `id` (and the matching `getElementById`/`querySelector` calls in its script) with the slug, e.g. `id="canvas"` → `id="<slug>-canvas"`. This is required — several source repos reuse identical generic ids (`canvas`, `btnStep`, …) that would collide if left as-is.
3. Fill in `category`, `tags`, `order`, and `description` in the frontmatter by hand, and write the `Playground`/`Mobile Behavior` body sections. Look up the playground's Wikipedia article and close `What Is X?` with an in-text link to it.
4. `npm run dev`, open the new page, sanity-check the island actually renders and responds — including at a narrow viewport width.
5. `npm run thumbnail -- <slug>` to capture the card image.
