# Claude Working Instructions — Playgrounds (playgrounds)

Project copy, derived from the global template and reconciled with how this project is actually run.
Keep this file lean.

---

## Project context

- **Project:** Playgrounds — a hub of interactive algorithm playgrounds (Perlin noise, boids, pathfinding, L-systems, procedural generation…), each with its own public page/URL and OG preview for sharing. Static Astro site, deployed to GitHub Pages.
- **Stack:** Astro 5, TypeScript, markdown content collections, GitHub Actions. No backend, no runtime JS beyond each island's own vanilla-canvas script.
- **Entry points:**
  - `src/content.config.ts` — the `playgrounds` collection schema (Content Layer API, `glob()` loader over `src/content/playgrounds/*.md`, excluding `_`-prefixed files)
  - `src/content/playgrounds/` — one `.md` per playground (frontmatter + prose body); template lives at `docs/PLAYGROUND_TEMPLATE.md`, outside the collection
  - `src/islands/` — one self-contained `.astro` component per playground, registered in `src/islands/index.ts`
  - `src/pages/index.astro` (list + tag filter), `src/pages/[slug].astro` (detail, identical structure for every entry — final URL is `keegooroomie.github.io/playgrounds/<slug>`, no `/playgrounds/` segment)
  - `scripts/scaffold-playground.mjs`, `scripts/capture-thumbnail.mjs`
- **Key invariants:**
  - Every island's DOM ids must be namespaced (slug-prefixed) — several source repos reused identical generic ids (`canvas`, `btnStep`, …) that would collide if copied as-is.
  - Island `<script>` tags are ES modules — inline `onclick`/`oninput` HTML attributes don't resolve; wire events with `addEventListener` instead. Plain `.astro` components never take a `client:*` directive (that's for framework components only) — an island's script just runs at normal page load.
  - Any island with a one-shot draw (not a continuous `requestAnimationFrame` loop) **must** regenerate its content in its `resize` handler, not just resize the canvas — a bare canvas-size reset wipes content, and a `resize` event reliably fires right after first paint on pages with a sidebar (scrollbar appearing shifts viewport width). This bit BFS/DFS/Dijkstra/L-Systems during migration; see `docs/playgrounds/bfs.md` for the full story.
  - `docs/playgrounds/<slug>.md` (source repo, migration notes, original README) exists for every playground — add one for new playgrounds too, not just migrated ones.

---

## Language

Chat in **Russian**. Repo content (code, docs, comments, commit text) stays **English**.

---

## Orientation docs

Read when relevant; don't announce it.

- `ARCHITECTURE.md` (root) — stack, folder structure, data pipeline, routing, CI/CD
- `docs/CONTENT_GUIDE.md` — field-by-field reference for a playground's frontmatter + body
- `docs/ORIGINS.md` — the original standalone-repo brief; explains where the 165 ms tick, `CELL = 20`, the amber path colour and the writing standards came from. Read before changing any of those "arbitrary" numbers
- `docs/playgrounds/*.md` — per-playground migration notes + preserved original README

### What is committed vs local

- **Committed:** `CLAUDE.md`, all repo docs (`ARCHITECTURE.md`, `CHANGELOG.md`, `README.md`, `CONTRIBUTING.md`, `docs/*`).
- **Gitignored / local:** everything inside `.claude/` (this behaviour file itself stays committed, only the directory's contents don't) and `.env`.

---

## Environment variables

Project-specific override of the general "don't store tokens" default: for this repo, secrets/tokens actually needed for the project (e.g. a Telegram bot token for deploy notifications) get written to the local, gitignored `.env` as they're provided in chat, so they stay visible/reusable across the session instead of being used once and discarded. Never write them anywhere that gets committed — `.env.example` documents *which* vars exist, never real values. GitHub Actions secrets (`PIPLINE_BOT_SECRET`, `CHAT_ID`) are configured separately in the repo's GitHub settings, not read from this file — `.env` has no effect on CI.

---

## Documentation maintenance

Keep the doc base current proactively. After a significant change:
- **`ARCHITECTURE.md`** — update when a component/route/data-flow/CI convention changes.
- **`docs/CONTENT_GUIDE.md`** — update when the collection schema or authoring workflow changes.

Adding/editing a single playground's copy, tags, or thumbnail doesn't need a doc update.

---

## Compaction log

On context compaction, write `.claude/compacts/YYYY-MM-DD.md` (gitignored): what was being worked on, decisions made, what's unfinished, key context for next session.

---

## Git

- Read operations are free: `git status`, `git log`, `git diff`, `git show`, `git branch`, `git remote -v`.
- Any write (`commit`, `push`, `merge`, `rebase`, `reset`, `tag`, worktree add/remove) needs explicit confirmation first.
- **Absolute prohibition:** `git push --force[-with-lease]`, deleting remote branches, rewriting published history.
- Local branch is the source of truth; never auto-sync to remote.
- GitHub API/token: ask for a per-session token when needed; don't store it beyond what's noted under Environment variables above.

---

## Changelog discipline

- `CHANGELOG.md` records project/code changes only — not routine content edits (a playground's copy, tags, ordering).
- Group a version's entries **Added → Changed → Fixed → Removed**.

---

## Build & verify

- After code changes: `npm run build` (add `GITHUB_REPOSITORY="KeeGooRoomiE/playgrounds"` as an env var to reproduce the production base path).
- After adding/editing an island: `npm run dev` and actually open the page — canvas bugs (like the resize issue above) don't show up in a build log, only in the browser.

---

## File system

- Read freely.
- Confirm before deleting/overwriting a file you didn't create or that isn't clearly disposable.

---

## Code style

- Match the surrounding code's idiom, naming, and comment density (near-none — see the migrated islands for the target style).
- Don't refactor code outside the request's scope.
- No test suite exists; don't invent one unprompted.

---

## Secrets and tokens

- See **Environment variables** above for this project's specific rule.
- Nothing from chat enters committed files — no hardcoded secrets, not even realistic-looking placeholders, anywhere that gets committed.

---

## MCP / agents

Prefer native tools (bash, read, grep, edit) over spawning an agent or MCP tool. If one is genuinely needed, say what and why a simpler path fails first.

---

## Response format

Russian, concise, structured. Report what was done and the verification result — no filler.
