# Splines & Arc Length — internal notes

**Source repo:** none — written directly in the hub. DOM ids are `sl-` prefixed.
Slug `splines`, `order: 170`, category `animation` (with Easing Curves and
Springs). Links to `../easing/`, and the easing page gained a Key Concepts entry
linking back here.

## Curve

`segment()` is Catmull–Rom in Barry–Goldman form so the knot exponent α works
(0 uniform, 0.5 centripetal, 1 chordal); α = 0 takes the direct uniform
formula. `pointAt(u)` treats u as segment index plus fraction, wrapping the
control indices for a closed loop and clamping for an open one.

## Arc length

`buildTable(perSegment)` walks the curve and stores cumulative chord length
against parameter; `paramAtLength()` binary-searches it and interpolates. A
dense 200-per-segment table is built alongside as the reference length, and the
*Table error* readout is how much the visible table undercounts — always short,
because chords cut corners.

The two travellers are one line each: `pointAt(t · segments)` and
`pointAt(paramAtLength(t · total))`.

## Speed measurement

`speedAt(u)` wraps the sample around the loop; the first version clamped at the
end and reported a near-zero speed at the seam, which inflated the
fastest/slowest ratio.

The ratio the default shape shows is real, though. The first default layout had
a key point whose two neighbours were almost coincident, so the Catmull–Rom
tangent there nearly vanished and the ratio read 52× with the traveller visibly
stalling — accurate, but it looks broken. The current loop is tuned to about 3×
(2.7 uniform / 3.0 centripetal / 3.1 chordal) with a total length of ~1,400px.

## Strobe

30 marks per lap, offset along the curve normal (red inside, blue outside) so
the two spacings can be compared side by side. Offsetting them vertically, as
the first version did, made them overlap along the top and bottom of a loop.

## Skins

`line` is the bare curve. `track` strokes the same path three times — kerb,
asphalt, dashed centre line — and draws the travellers as top-down cars rotated
by the tangent (`headingAt`). Strobe marks move out to a 26px offset on the
track skin so they sit off the asphalt.

The arc-length runner can be hidden (`blue=0` / the *The arc-length runner*
toggle), which also drops its strobe marks and the link line.

## Extra canvas

Left: speed by parameter against the constant arc-length speed. Right: two dials
interpolating 350° → 10°, naive (340° the long way) and short-way (20°, the
difference normalised into ±180°). The 3D version — slerp, quaternions — is
mentioned in the copy but deliberately left to a future page.

## Thumbnail

`thumbnailQuery: "t=0.62"` — thumbnail mode starts paused and `t` sets the
clock. At 0.62 the two travellers are clearly apart on the lower edge.

## Page structure

No *Mobile Behavior* section. Touch: pointer events, `touch-action: none` on
the spline canvas, 22px grab radius on key points. 320px: canvases 286px wide,
no overflow.
