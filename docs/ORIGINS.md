# Origins — where the conventions came from

Before this hub existed, each playground was its own standalone repo: one
`index.html`, vanilla JS + Canvas, zero dependencies, deployed to its own GitHub
Pages URL. That series ran under the working name **Algorithms Lab**, and it had
a written brief that fixed the design system, the interaction norms, and the
writing standards.

This file preserves that brief and reconciles it with what the hub actually
does now. It exists because a lot of the numbers in the current codebase — the
165 ms tick, `CELL = 20`, the amber path colour — look arbitrary unless you know
they were decided once, deliberately, and carried over on purpose.

---

## Still true (carried over verbatim)

These were verified against the current source, not just copied across:

| Convention | Where it lives now |
|---|---|
| Step tick **165 ms**, chained `setTimeout`, never `setInterval` — stops cleanly on reset, no drift | `Bfs.astro:297`, `Dfs.astro:307`, `Dijkstra.astro:407` |
| `CELL = 20`, `COLS = floor(containerWidth / CELL)`, `ROWS = floor(520 / CELL)` | `init()` in all three pathfinding islands |
| Canvas sized via `getBoundingClientRect()` × `devicePixelRatio`, never raw `canvas.width` | every island's `resizeCanvas()` / `init()` |
| Maze via recursive backtracker; start/end placed in opposite halves to maximise distance | `generateMaze()` / `findOpenSide()` |
| Per-algorithm accent so pages don't look alike: BFS `#bfdbfe`/`#60a5fa`, DFS `#fecaca`/`#f87171` | `const C = {…}` in each island |
| **Path is always amber `#f59e0b`** — one shared visual word across the series | all three pathfinding islands |
| Reset order: cancel anims → clear `autoStepId` → null state → reset grid → render → reset stats | `clearPath()` / `generateMaze()` / `run*()` |
| Palette `#f5f5f5` / `#fff` / `#ddd` / `#0066cc` / `#1a1a1a`, `.playground` grid `260–280px \| 1fr`, controls stacking above canvas on narrow screens | `src/styles/global.css` tokens + `.playground` |
| Writing standards: concrete dates and places over "mid-20th century"; named real-world uses (OSPF, StarCraft, Kiva) over "used in games"; complexity at the end of the mechanics section | `docs/CREATING_A_PLAYGROUND.md` |

## Deliberately changed

| Brief said | Hub does | Why |
|---|---|---|
| Playgrounds stay in their own repos; the hub is a card wall that **redirects out** to each GitHub Pages deploy | Playgrounds are **migrated into** the hub as content entries + islands; each gets a real page at `/<slug>/` | The brief's own "obsolete" section names the failure: the design system was copied by hand and drifted between pages. Redirecting out keeps that drift. One codebase ends it, and each playground still keeps a public URL and OG preview, which was the reason for separate repos in the first place |
| Each playground has a header linking to the hub and a footer with series navigation (`← BFS · DFS →`) | No header at all; prev/next pager plus a category rail in the left margin | Once the pages live in one site, a per-page "back to hub" header is redundant chrome. The rail does the same job and shows the whole series at once |
| One `index.html` per playground, design system copied in full into each file | One shared `global.css`; islands carry only what is genuinely theirs | Same anti-drift reason |
| `font Monaco`, system sans | IBM Plex Sans + IBM Plex Mono, self-hosted | `Monaco` only exists on macOS — every other visitor silently got a fallback. See the Fonts row in `ARCHITECTURE.md` |
| Category cards + search on the hub | Category rail + tag filter, no search | Search isn't worth an index at this scale; the brief's own scoping note agrees |

## Not carried over yet

The brief lists eight finished pages. The hub has seven — these two never made
the migration:

- **A\*** — no local repo found under `~/Documents/GitHub`. Referenced from the
  BFS and Dijkstra write-ups as the natural next step, so its absence is
  visible to a reader. Worth finding or rebuilding.
- **RuleHunt** — the repo exists (`github.com/KeeGooRoomiE/rulehunt`) but is not
  an `index.html`-style playground like the other seven, so migrating it is a
  larger job than running `npm run scaffold`.

---

## The brief, as written

Preserved as the historical record. Where it contradicts the tables above, the
tables win — this is the starting point, not the current spec.

> ## Что это такое
>
> Algorithms Lab — серия интерактивных страниц, каждая из которых объясняет один
> алгоритм через текст + живую визуализацию. Вдохновение — dynamicmath.xyz:
> простые правила, большие числа, красивые взаимодействия. Каждая страница —
> самостоятельный GitHub Pages деплой, связанный с единым хабом.
>
> Готовые страницы: Perlin Noise, Boids (бактерии, микроскопный стиль), Galaxy
> Sampler, BFS, DFS, Dijkstra, A\*, RuleHunt.
>
> ## Структура страницы
>
> ```
> Hero (название + subtitle)
> ├── Секция 1 — История / происхождение
> │   Кто придумал, когда, при каких обстоятельствах. Конкретика: год, место,
> │   контекст. Без Wikipedia-пересказа — детали, которые делают человека человеком.
> ├── Секция 2 — Как работает
> │   Объяснение механики + псевдокод. Подсекции по ключевым свойствам.
> │   Complexity в конце секции.
> ├── Playground (интерактив)
> │   Левая колонка — контролы (260–280px). Правая — canvas.
> │   Под canvas — строка статуса шагового режима.
> ├── Секция 3 — Применения
> │   3–5 подсекций с конкретными примерами. Не "используется в играх" — а
> │   "StarCraft pathfinding bug — прямое следствие кодировки terrain costs в граф".
> ├── Секция 4 — Сравнение / ограничения (опционально)
> └── Footer
> ```
>
> ## Playground — контролы
>
> ```
> [Кнопка генерации карты / параметров]
> [Секция Mode]
>   toggle: Animate traversal    (default: on)
>   toggle: Step-by-step 165ms  (активирует animate автоматически)
>   toggle: [специфичные для алго]
> [Кнопки действий]
>   ▶ Run [Algo]   — primary button
>   → Next step    — disabled пока не запущен step-режим
>   Clear path     — убирает оверлей, оставляет карту
> [Stats box]
>   Operations / Cells visited / Path length / Status: Ready · Running · Found ✓ · No path
> [Legend]
> ```
>
> ## Пошаговый режим — технические нормативы
>
> - Тик: **165ms** — `setTimeout(fn, 165)`, chained (не `setInterval`)
> - Почему chained, не interval: корректно останавливается при сбросе, нет drift
> - `autoStepId` — `clearTimeout` перед любым сбросом / повторным запуском
> - Stale entries в priority queue (Dijkstra) — пропускаются через проверку
>   visited set при pop
>
> ## Текст — нормативы
>
> **Историческая секция:** конкретная дата, место, обстоятельства (не "в
> середине XX века"); кто ещё был причастен, знали ли друг о друге; одна
> необычная деталь.
>
> **Техническая:** псевдокод с комментариями; подсекция "Почему X гарантирует
> Y" — центральное доказательство интуиции; complexity в конце.
>
> **Применения:** 4–5 применений, каждое с реальным именем (LinkedIn, OSPF,
> StarCraft, Kiva, DARPA OFFSET). Не "используется в GPS" — а механизм: какой
> граф, какие веса, что именно считается. Личная деталь от автора — одна на
> страницу.
>
> **Tone:** академический, но живой. Не Wikipedia, не учебник для студентов.
> Конкретные числа вместо прилагательных.
>
> ## Устаревший подход (obsolete)
>
> До перехода на хаб каждый плейграунд деплоился как полностью независимая
> страница в отдельном репо без связи с другими. Навигация между ними
> отсутствовала. Дизайн-система копировалась вручную и начинала расходиться
> между страницами.
