---
title: Hamiltonian Path
order: 90
tags: [graph, backtracking]
category: graph
description: Visit every cell exactly once — the puzzle behind a perfect game of Snake, solved by backtracking and, surprisingly often, settled by colouring a chessboard.
thumbnail: /thumbnails/hamiltonian.png
thumbnailAlt: "A snake filling an 8x8 board, its body shading from dark green at the head to pale green at the tail, weaving around grey blocks."
island: hamiltonian
---

## What Is a Hamiltonian Path?

Take a graph — dots joined by lines. A **Hamiltonian path** is a route along
the lines that visits every dot exactly once. If the route also ends next to
where it started, so it can close into a loop, it's a **Hamiltonian cycle**.

The name comes from William Rowan Hamilton, who in 1857 turned the question
into a parlour game, the *Icosian game*: find a round trip along the edges of a
dodecahedron that passes through each of its twenty corners once. Thomas
Kirkman had studied the same problem a couple of years earlier, but the game
got the name.

It sounds like a close cousin of a much older puzzle — Euler's bridges of
Königsberg, where you cross every *line* exactly once — and the two look almost
identical on paper. They are not remotely alike to solve. Euler's version has a
one-line test: count the dots with an odd number of lines. Hamilton's has no
such test that anyone knows of. It's one of the classic NP-complete problems,
which in practice means that for large graphs, the only general method is
trying routes and backing out of the ones that fail.

If you've played Snake, you've met it. A snake that grows until it fills the
whole board has traced a Hamiltonian path through the grid, and the simplest
unbeatable Snake bot just follows a precomputed Hamiltonian cycle forever.

To find out more, you can read the Wikipedia article on [Hamiltonian path](https://en.wikipedia.org/wiki/Hamiltonian_path).

## How It Works

Here the graph is a grid: every open cell is a dot, joined to the open cells
directly above, below, left and right. Blocks are cells removed from the graph.

The search is **backtracking**. Extend the path one cell at a time; when you
get stuck with cells still unvisited, step back and try the next option at the
last place that had one.

```
search(path):
    if path covers every cell:
        return found              # (for a cycle: and last cell touches start)
    for each unvisited neighbour n of the head:
        add n to path
        if the rest is still completable:
            if search(path): return found
        remove n from path        # backtrack
    return not found
```

Pure backtracking is exponential, so two cheap ideas do most of the work.

**Warnsdorff's rule** decides the order. Try the neighbour with the *fewest*
onward exits first. Cells in tight corners get visited while they can still be
reached, instead of being left for later and stranded. H. C. von Warnsdorff
published it in 1823 for the knight's tour, a Hamiltonian path on a chessboard
with knight moves, and it still works remarkably well on grids.

**Pruning** refuses a move that has already made the puzzle impossible, before
spending any time exploring behind it. After each move the search checks:

```
every empty cell is still reachable from the head        # not cut in two
every empty cell has at least 2 ways in and out          # it has to be passed through
    ...except at most one, which can be the final cell   # (a path has one far end)
```

A move that fails either check is refused on the spot. One refusal here saves
the entire subtree of doomed routes behind it.

### The chessboard argument

Colour the grid like a chessboard. Every move goes to an adjacent cell, and
adjacent cells are always opposite colours — so any route alternates
dark, light, dark, light.

- A **cycle** has to come back to its starting colour, so it needs exactly as
  many dark cells as light ones.
- A **path** can be off by at most one, and if it is, it must start and end on
  the more common colour.

That's why a 5×5 board can never hold a Hamiltonian cycle (13 dark, 12 light),
and why a single block in the wrong place can make a whole board unsolvable.
It's a proof of impossibility that takes one count instead of an exhaustive
search, and the playground can use it or not.

## Playground

**Skin** changes the look only — Snake, Line puzzle, Graph. The board, the
start and the order of the search are identical. The Graph skin is the honest
one: it draws the dots and the lines between them, so you can see that the
puzzle was a graph all along.

**Goal** switches between a path (every cell once, end anywhere) and a cycle
(every cell once, and finish next to the start).

**Random field** draws a new board of the chosen **Board size** (4×4 to
10×10) with roughly the chosen share of **Blocks** (0–30%). With **Guarantee
solvable** on, it quietly draws and solves boards until it finds one that
works, and picks a start on the right colour. Turn it off and you get whatever
comes out — often impossible, which is half the fun.

**Tap a cell** to toggle a block, or switch the menu to move the start. Any edit
clears the current path.

**Fill the board** runs the search. With **Animate search** on you watch the
path grow, bump into dead ends (flashed red) and retreat. It starts slow and
speeds up if the search turns into a long grind. **Step-by-step (165 ms)**
narrates every move: which cell it entered, which move it refused and why, and
where it backed up to.

**Check parity first** runs the chessboard count and the other cheap checks
before searching at all. **Show parity colours** tints the dark squares so you
can do the count yourself.

Things worth trying:

- Turn **Guarantee solvable** off and hit **Random field** a few times. Most
  boards get rejected instantly with the reason spelled out under the canvas.
- On one of those impossible boards, turn **Check parity first** off and run
  again. The search has no idea the colours are unbalanced. It grinds through
  thousands of dead ends — watch *Backtracks* climb — until it either exhausts
  every option or gives up. Same answer, a count versus a brute force.
- Set **Goal** to *Cycle* on a 5×5 or 7×7 board with no blocks. Impossible, and
  now you know why. Then block one dark corner.
- Watch *Pruned early* next to *Backtracks*. Every pruned move is a dead end the
  search never had to walk into.

## Mobile Behavior

The controls stack above the canvas below `960px`, as everywhere here — no
override. The board keeps its size in cells; only the cell size shrinks, so a
10×10 board is still 10×10 on a phone, just smaller. Rotating or resizing
rescales and redraws the board without cancelling a search in progress, since
the grid doesn't depend on the screen width.

Editing works by tap: the canvas listens for clicks, which touch screens send on
a tap, so blocks and the start can be placed without a mouse. There's no drag
or hover anywhere. Tested down to 320px, where a 10×10 board still leaves each
cell a comfortable tap target.

## Key Concepts

### Backtracking

Build a solution one choice at a time, and undo the most recent choice the
moment it can't lead anywhere. It's depth-first search over the space of
partial solutions rather than over a map, and it's how Sudoku solvers, the
eight-queens puzzle and most constraint puzzles get solved by computer. Its
cost depends entirely on how early you notice a dead end.

### Pruning

Noticing that dead end early. A good pruning rule is cheap to check and throws
away a large part of the search at once. The playground's two — "don't cut the
board in two" and "don't leave a cell you can't pass through" — are what make a
10×10 board finish in a blink instead of minutes.

### Parity

An invariant that no amount of cleverness can get around. Many "is this
possible?" questions about grids, from tiling a chessboard with dominoes to
sliding-tile puzzles, are settled the same way: find a colouring or count that
every move preserves, and check whether the goal breaks it.

### Hamilton versus Euler

Euler: use every *line* once. Hamilton: visit every *dot* once. Euler's problem
has a fast exact test; Hamilton's has none known, and it's NP-complete even
restricted to grids with holes, like the ones here. The difference between the
two is one of the cleanest illustrations there is of how a small change to a
question can change its difficulty completely.

## Real-World Applications

### Snake

The perfect Snake game is a Hamiltonian cycle. A bot that follows one never runs
into itself, because the cycle never crosses itself, and it eventually covers
every cell, so it always reaches the food. It's also painfully slow, so
practical bots follow the cycle but take shortcuts across it whenever the
shortcut provably can't trap the tail. The parity argument shows up here too:
on a board with an odd number of cells there is no cycle to follow.

### Grid puzzles: LinkedIn's Zip and friends

LinkedIn's daily puzzle **Zip** asks you to draw a single line through every
cell of a grid, passing numbered cells in order. That's a Hamiltonian path with
checkpoints. **Numbrix** and **Hidato** are the pen-and-paper version: fill the
grid with consecutive numbers so each is next to the one before, which is the
same thing again written in digits.

Plenty of casual mobile games are built on the same rule — "fill every square
with one stroke", "slide the block through every tile" — and hand-tuned levels
are usually designed by starting from a known Hamiltonian path and hiding it.
The *Guarantee solvable* toggle here works along similar lines: it only hands
you boards it has already solved.

Beware the look-alikes. "Draw this shape without lifting your pen" puzzles use
every *line* once, and those are Euler's problem, not Hamilton's.

### Routing and scheduling

The travelling salesman problem — visit every city once, return home, as
cheaply as possible — is a Hamiltonian cycle with costs attached. Delivery
routes, drilling holes in circuit boards and planning a telescope's night of
observations are all versions of it.

### Genome assembly

Early DNA assemblers modelled overlapping sequence fragments as a graph and
looked for a Hamiltonian path through it: an order that uses every fragment
once. It worked, but it scaled badly, and modern assemblers reframe the same
data so that the answer is an Eulerian path instead — trading Hamilton's hard
problem for Euler's easy one.
