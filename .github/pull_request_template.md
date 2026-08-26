<!--
  pull_request_template.md
  Playgrounds

  Keep it short — fill in what applies and delete the rest.
-->

## Summary

<!-- What does this PR change, and why? One or two sentences is plenty. -->

## Type of change

- [ ] `fix` — bug fix
- [ ] `feat` — new playground or feature
- [ ] `docs` — documentation only
- [ ] `style` — styling / visual only
- [ ] `refactor` — no behaviour change

## How I tested

- [ ] `npm run dev` — verified locally
- [ ] `GITHUB_REPOSITORY="KeeGooRoomiE/playgrounds" npx astro build` — build passes

## Checklist

- [ ] **Changelog** — code/project changes are recorded in `CHANGELOG.md`, grouped **Added → Changed → Fixed → Removed**.
      *Content-only edits (a playground's copy, tags, thumbnail) don't need a changelog entry.*
- [ ] **No hardcoded base path** — internal links and assets go through `BASE_URL`, never a literal `/playgrounds/`.
- [ ] **New island (if added)** — DOM ids are namespaced (no generic `id="canvas"`), registered in `src/islands/index.ts`, and has a `docs/playgrounds/<slug>.md` internal-notes file.
- [ ] **New playground (if added)** — frontmatter has a `category` (also present in `tags`), and `What Is X?` closes with an in-text Wikipedia link.
- [ ] **Thumbnail** — regenerated via `npm run thumbnail -- <slug>` if the playground's visuals changed.
- [ ] **Docs** — updated `ARCHITECTURE.md` / `docs/CONTENT_GUIDE.md` if this changes architecture, routing, CI, or a convention.

## Screenshots

<!-- For any visual change, before/after helps a lot. Delete if not applicable. -->

## Related issues

<!-- e.g. Closes #12 -->
