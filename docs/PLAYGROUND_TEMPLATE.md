---
# Copy this file to src/content/playgrounds/<slug>.md and fill in every field below.
# It lives here under docs/, not in the content collection, so it's never at risk
# of being picked up as a real entry.
# Full guide: docs/CREATING_A_PLAYGROUND.md · field reference: docs/CONTENT_GUIDE.md

# Short, matches the source's <title>/hero <h1> in spirit.
title: Algorithm Name

# List/prev-next position. Leave gaps of 10 (10, 20, 30…) so new
# entries can be inserted later without renumbering everything.
order: 999

# Reuse existing tags before inventing a new one — check the other
# .md files in this folder for the current vocabulary.
tags: [tag-one, tag-two]

# REQUIRED. The one category this files under in the index page's left rail
# (which groups entries and shows a per-category count). Must also be present
# in `tags` above. The build fails loudly if this is missing.
category: tag-one

# One to two sentences — card copy and the Telegram/OG preview text.
description: One or two sentences describing what this playground shows.

# Generated via `npm run thumbnail -- <slug>`, not a hand-made screenshot.
thumbnail: /thumbnails/algorithm-name.png

# The original standalone repo this was migrated from.
# Optional. Only for a playground migrated from its own standalone repo —
# the page prints "Originally built as a standalone project" next to it.
# Delete this line for one written directly here.
sourceRepo: https://github.com/KeeGooRoomiE/algorithm-name-playground

# Lookup key into src/islands/index.ts — must match an exported entry.
island: algorithm-name

# Optional. Lookup key into src/components/backgrounds/index.ts.
# Omit to use the default background (most playgrounds should omit this).
# background: default

# Optional. Extra query params appended to the URL when capturing this
# entry's thumbnail (npm run thumbnail), e.g. a seed that looks better than
# the shared default. Omit unless the default capture actually looks bad.
# thumbnailQuery: "seed=17"
---

<!--
  Body section order below is REQUIRED, not a suggestion — every playground
  follows the same shape so the hub reads consistently. "Key Concepts" and
  "Real-World Applications" may be split into more/fewer ### subsections as
  the algorithm needs, but the six ## headings themselves and their order
  stay fixed. See docs/CREATING_A_PLAYGROUND.md for what belongs in each.
-->

## What Is X?

Introduce the algorithm in plain terms: what it does, who came up with it, why it exists.

REQUIRED, as the last line of this section — a plain in-text Wikipedia link, not
a pill or button. Look the article up when adding the playground. If this one is
an original construction with no article of its own, link the technique it's
built on and say so, rather than omitting the link or linking a near-match.

To find out more, you can read the Wikipedia article on [X](https://en.wikipedia.org/wiki/X).

## How It Works

Explain the mechanism. Code/pseudocode blocks are welcome here.

## Playground

REQUIRED. Describe the interactive part itself, in prose — not the code, the
*behavior a visitor sees*:
- What each control does and its valid range/conditions (e.g. "Speed: 0.2–2.0,
  clamped; values above 1.5 visibly break the cohesion rule").
- What a visitor should try first, and what they should expect to observe.
- Any invariant the simulation holds (deterministic seed, bounded canvas, etc.).

## Mobile Behavior

REQUIRED. Every island must be usable on a narrow, touch viewport — this
section records how *this* island specifically behaves there, so a reviewer
can check it against the real thing instead of guessing:
- Does the controls panel stack above or below the canvas at the `960px`
  breakpoint (it should — `.playground` already does this by default; only
  document here if this island overrides that)?
- Does the canvas itself resize/rescale, or does it stay fixed-size and
  become horizontally scrollable? Either is fine — say which.
- Any control that depends on a mouse-only interaction (hover, click-drag)
  needs a touch equivalent, or an explicit note here that it's degraded
  gracefully on touch (e.g. "cursor-repel in Boids simply has no effect on
  touch — the simulation still runs").
- Minimum width you actually tested at.

## Key Concepts

### Concept One

### Concept Two

## Real-World Applications

### Application One

### Application Two
