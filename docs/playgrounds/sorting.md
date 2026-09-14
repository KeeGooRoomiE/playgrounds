# Sorting Algorithms — internal notes

**Source repo:** none — written directly in the hub. DOM ids are `so-` prefixed.
One page, five algorithms, selected with a dropdown rather than five entries.

## Cards

Pixel art from string bitmaps, drawn with `fillRect` at an integer scale `s`:

- Card 38×52 art pixels, two-pixel corner cut, ink border, paper fill, drop
  shadow baked in. Each distinct rank/suit/scale is rendered once into an
  offscreen canvas (`cardCache`) and blitted.
- 3×5 font (`A`, `0`–`9`), 5×5 index suits, 7×7 pips; the ace uses its pip at 2×.
- Pip layouts use three columns (x = 8, 15, 22). The side columns sit far enough
  apart that the centre column never overlaps them, which is what forced the
  38-pixel width.
- **Nothing is drawn upside down.** An earlier exploration found that a small
  inverted heart reads as a spade; the same goes for index digits (an inverted 9
  is a 6, an inverted 4 an h), so the bottom-right index is upright too.
- No face cards. A–10 in four suits (bridge order ♣ ♦ ♥ ♠), dealt from two decks
  so a 20-card hand and a many-ties hand are both possible.

Scale: `s = min(4, avail / (0.8·n) / 38, 0.3·520 / 52)`, so cards may overlap by
about a fifth before shrinking. Past that they overlap like a fanned hand; the
top-left index of each stays visible. Badges are hidden when the slot is under
18px.

## Algorithms

Each is a generator over `main` / `aux` / `piles` that mutates in place and
`yield`s a caption per visible step; `marks` (compare / key / pivot), `placed`,
`range` and `heapSize` are set before the yield for drawing. Cards have display
positions tweened toward targets recomputed every frame from wherever they now
live, so no algorithm has to know about animation.

- Insertion: adjacent swaps (the key card visibly slides left).
- Merge: top-down; merged cards go down to the `aux` row, then the whole range
  goes back up. Tie takes the left card (stable).
- Quick: Lomuto, last card as pivot, deliberately no randomisation so sorted and
  reversed deals show the quadratic case.
- Heap: standard sift-down; arcs under the row connect parents to children for
  the unsorted heap region.
- Radix: LSD over rank (10 piles), then suit (4 piles) when sorting by suit;
  zero comparisons.

Switching algorithm calls `restore()` (same hand); changing deal, key or card
count deals a new hand. Stability is checked at the end over adjacent equal
keys, comparing each card's `order`.

Two-row algorithms (merge, radix) keep the row at the top; the others centre it
vertically.

## Resize

Continuous `requestAnimationFrame` loop; layout is recomputed from
`canvas.width` every frame, so the resize handler only resizes the canvas.

## Thumbnail

`thumbnailQuery: "seed=42&alg=quick&deal=shuffled&key=rank&cards=5&order=0&steps=3"`
— settings chosen by the user. The island reads `alg`, `deal`, `key`, `cards`,
`order=0` (hides the original-order badges) and `steps`; thumbnail mode runs
that many steps instantly. Step 3 shows a card being compared against the
pivot, both highlighted. In thumbnail mode the table is laid out in a centred
4:3 band so the card-grid crop doesn't cut the end cards.

## Page structure

Follows the shorter layout the user settled on for Brownian Tree: no *Mobile
Behavior* section, *Playground* last and brief.

## Measured (seed 42, 16 cards; comparisons / moves)

| Deal | Insertion | Merge | Quick | Heap | Radix |
|---|---|---|---|---|---|
| Shuffled | 66 / 53 | 42 / 128 | 44 / 24 | 76 / 43 | 0 / 32 |
| Nearly sorted | 15 / 1 | 32 / 128 | 63 / 10 | 81 / 52 | 0 / 32 |
| Reversed | 113 / 104 | 37 / 128 | 83 / 32 | 70 / 37 | 0 / 32 |
| Few ranks | 68 / 55 | 47 / 128 | 55 / 25 | 67 / 35 | 0 / 32 |

Equal cards kept their order under insertion, merge and radix on every deal,
and changed order under quick and heap on every deal.

320px: 286px canvas, 20 cards fan at scale 1, no horizontal overflow.
