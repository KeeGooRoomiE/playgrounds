# Springs — internal notes

**Source repo:** none — written directly in the hub. DOM ids are `sp-` prefixed.
Slug `springs`, `order: 150`, category `animation` (with Easing Curves).

## Model

Mass 1, `a = −k·(x − target) − c·v`. Stiffness is a log slider 5 → 800
(`5·160^(v/100)`), damping linear 0–60. Damping ratio `ζ = c / (2√k)`.

`step()` is the only place the integrators differ: explicit Euler moves with
the old velocity, semi-implicit updates velocity first. A body is marked dead
once it's non-finite or more than 12 move-lengths from the target, and stays
dead until Reset or a settings change.

`frameStep()` applies the timestep mode: variable = one step of the frame's
dt; fixed = accumulate dt and consume 1/120 s steps.

## Lanes

Four springs (yours, and ζ = 0.25 / 1 / 2 at your stiffness) plus an 800 ms
ease-in-out lane. The easing lane restarts its curve from its current position
with zero velocity whenever the target moves — what an interrupted CSS
transition does — which is the contrast the page is built around. Auto-flip
swaps the target between 0 and 1 every 0.9 s, deliberately before the slow
lanes arrive. Tapping a lane sets the target and turns auto-flip off.

The track displays −0.6 → 1.6 so overshoot and undershoot stay visible (an
earlier −0.3 → 1.3 still clipped the ζ = 0.25 lane).

The live lanes are stepped at the selected simulated frame rate (30/60/144 Hz)
from the real rAF clock, independent of the display's refresh rate.

## Step-response plot

Computed offline whenever k, c, integrator or timestep change: a unit step from
rest for 2.5 s at 30, 60 and 144 Hz, over the exact analytic solution
(underdamped, critical within |ζ − 1| < 1e-3, overdamped).

The traces record the **physics state at every physics step, stamped with
physics time** — not frame-sampled positions. The first version sampled at frame
times and reported a 42% "gap" between 30 Hz and 144 Hz even with a fixed
timestep, purely from comparing positions at different instants. With physics
timestamps and linear interpolation, the fixed-step gap is exactly 0.0%, which
is the claim the copy makes.

## Measured

- Defaults (k 170, c 8, semi-implicit, variable): gap 16.4%.
- k 393 (slider 86, "about 400"), c 4, explicit, variable: 30 Hz and 60 Hz blow
  up, 144 Hz survives 2.5 s. Semi-implicit at the same settings: all stable.
- Explicit + fixed at k 393, c 4: gap 0.0%, but inaccurate; at k 800, c 2 it
  blows up even with a fixed step.

## Thumbnail

`thumbnailQuery: "frames=14"` — 14 frames at 60 Hz after release: the two
underdamped lanes have overshot, critical is arriving, overdamped lags, the
eased ball has barely started. In thumbnail mode the lanes canvas is stretched
to 4:3 (taller lanes) so the card crop keeps the labels.

## Page structure

No *Mobile Behavior* section — the user dropped it as redundant. Links to
`../easing/`.

320px: both canvases 286px wide, no horizontal overflow, no console errors.
