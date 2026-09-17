# Easing Curves — internal notes

**Source repo:** none — written directly in the hub. DOM ids are `ez-` prefixed.
Slug `easing`, `order: 140`, category `animation` — a new one-member category,
chosen knowingly (nothing existing fits; the other candidate was `curves`).

The request read "Изинг" as *easing*, not the Ising model; the page follows that.

## Two canvases

- **Plot** (`#ez-plot`): up to 460px wide, portrait. Time on x, progress on y.
  The vertical range follows the curve (`curveRange()`, eased 20% per frame) so
  overshooting curves fit, and it is frozen while a handle is dragged so the
  handle doesn't slide away from the pointer. `touch-action: none` only here.
- **Race** (`#ez-race`): full width, ten lanes. The track leaves 12% of its
  length before the start and ~38% after the end, so back-in undershoot and
  back-out / elastic overshoot stay on the canvas.

Both are resized from their wrappers inside the continuous rAF loop, so there
is no resize handler and nothing can blank.

## Maths

- `coord(s, a, b)` is one coordinate of a cubic Bézier from 0 to 1 with inner
  control values a, b; `coordSlope` its derivative.
- `solve(t, bez)`: Newton from s = t (up to 8 iterations, tolerance 1e-6), bail
  out on a near-zero slope or leaving [0, 1], then bisection (≤ 40 steps).
  Checked for 1,001 values of t on every preset: |x(s) − t| ≤ 1e-6, Newton alone
  on all presets; `cubic-bezier(1, 0, 0, 1)` needs bisection on 498 of them,
  which is the "try it" in the copy. `ease` at t = 0.5 gives 0.8024, the known
  CSS value.
- de Casteljau is drawn at the solved s, so the orange point is always the
  current progress.
- Bounce and elastic are Penner's formulas (`FUNCTIONS`). For them the handles
  and construction are hidden, `s` reads "—", and the CSS box shows a 21-stop
  `linear()` sampled evenly in time, drawn dashed over the true curve.

CSS detail worth keeping straight: x1/x2 outside [0, 1] make `cubic-bezier()`
**invalid**, not clamped. The handles are clamped in the UI to stay valid.

## Thumbnail

`thumbnailQuery: "curve=ease-in-out&t=0.35&steps=1"` — the island reads
`curve`, `t` and `steps`; thumbnail mode starts paused. The plot is portrait,
so in thumbnail mode the canvas is widened to 4:3 (`ox` offset) rather than
losing its top and bottom to the card crop. Captures the construction and the
uneven equal-s ticks together.

## Page structure

Full six-section template this time, including *Mobile Behavior* — the handle
hit area and touch-action are real mobile content here.

## Verified

- Presets, dragging P1 (switches the select to Custom and updates the CSS text),
  bounce/elastic `linear()` output, race overshoot margins.
- 320px (touch emulation): plot and race 286px wide, no horizontal overflow, no
  console errors.
