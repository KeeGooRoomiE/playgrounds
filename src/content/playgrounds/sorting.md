---
title: Sorting Algorithms
order: 110
tags: [sorting]
category: sorting
description: Five ways to put a hand of cards in order — insertion, merge, quick, heap and radix sort — played out on pixel-art cards, with every comparison and move on show.
thumbnail: /thumbnails/sorting.png
thumbnailAlt: "Five pixel-art playing cards on green felt; the six of clubs is outlined amber as it is compared against the violet-outlined nine of clubs pivot."
island: sorting
thumbnailQuery: "seed=42&alg=quick&deal=shuffled&key=rank&cards=5&order=0&steps=3"
---

## What Is Sorting?

Putting things in order is the most studied problem in computing. It sounds
trivial until you notice how many different ways there are to do it, and how
differently they behave: one method flies through a nearly ordered list and
crawls on a reversed one, another takes the same time no matter what, a third
never compares two items at all.

Sorting also sits underneath almost everything else. Searching, removing
duplicates, merging records and drawing a scene back to front are all easier or
only possible once the data is in order. This page deals the same hand of cards
to five classic algorithms, so their differences show up side by side.

To find out more, you can read the Wikipedia article on [Sorting algorithm](https://en.wikipedia.org/wiki/Sorting_algorithm).

## How It Works

### Insertion sort

The way most people sort a hand of cards: take the next card and slide it left
past every bigger one. Fast when the hand is almost in order, slow when it's
reversed.

```
for each card from the second onward:
    while the card to its left is bigger: swap them
```

### Merge sort

Split the hand in half, sort each half, then merge them by repeatedly taking the
smaller front card. John von Neumann described it in 1945. Always about
*n* log *n* comparisons, at the price of a second row of space.

```
sort(left half); sort(right half)
merge: take the smaller front card until both halves are empty
```

### Quicksort

Pick a pivot, put everything smaller on its left and everything else on its
right, then sort both sides. Tony Hoare invented it in 1959 as a visiting
student at Moscow State University. Usually the fastest in practice, but a bad
pivot on an already ordered hand makes it quadratic.

```
pivot = last card
move every card below the pivot to the left; drop the pivot after them
sort(left side); sort(right side)
```

### Heapsort

Treat the row as a binary tree — the children of position *i* are at 2*i*+1 and
2*i*+2 — and rearrange it so every parent beats its children. The biggest card
is then at the root: swap it to the end, repair the tree, repeat. J. W. J.
Williams published it in 1964.

```
build a max-heap
repeat: swap root with last unsorted card; sift the new root down
```

### Radix sort

No comparisons at all. Deal the cards into piles by rank, pick the piles up in
order, and the hand is sorted. For several keys, deal by the least important one
first. Punched-card sorting machines, descended from Herman Hollerith's
tabulators for the 1890 US census, worked exactly this way, one column per pass.

```
for each key, least important first:
    deal cards into piles by that key; pick the piles up in order
```

## Key Concepts

### Comparisons and moves

The two costs of a sort. Comparisons decide the order; moves do the work of
rearranging. On a shuffled hand of 16, merge sort and quicksort compare about as
often, but merge sort moves cards five times as much.

### The n log n barrier

Any sort that only compares cards needs about *n* log₂ *n* comparisons in the
worst case, because it has to tell apart all *n*! possible orderings. Radix
sort escapes the limit by never comparing.

### Stability

A stable sort keeps equal cards in their original order. That's what lets you
sort by rank, then by suit, and still have each suit in rank order. Insertion, merge
and radix sort are stable; quicksort and heapsort aren't.

### Adaptivity

An adaptive sort does less work on input that is already nearly in order.
Insertion sort is the extreme case; heapsort doesn't notice at all.

## Real-World Applications

### Standard libraries

Real sorts are hybrids. Python and Java sort objects with Timsort, which finds
runs that are already in order, extends short ones with insertion sort and
merges them. C++ and Go use quicksort variants that fall back to heapsort when
the pivots go wrong and to insertion sort on small ranges.

### Databases

When data doesn't fit in memory, databases sort it in chunks and merge the
sorted chunks from disk. That's merge sort, and the reason it's still
everywhere.

### Priority queues

A heap does not need to be fully sorted to give you the largest item next.
Schedulers, event simulations and Dijkstra's shortest-path algorithm all run on
one.

### GPUs and fixed-size keys

Radix sort parallelises well and needs no comparisons, so it's the standard
choice for sorting millions of integers or keys of fixed length on a graphics
card.

## Playground

Pick an **Algorithm** and press **Sort**, or step through with **Next step**;
the caption says what just happened. Switching algorithms keeps the same hand,
so the **Comparisons** and **Moves** counters compare fairly. **Deal** sets the
starting order: try *Nearly sorted* with insertion sort and quicksort, or
*Reversed* with quicksort and merge sort. **Show original order** puts each
card's starting position above it; with *Few ranks* dealt, the *Equal cards*
readout and red numbers show which algorithms let equal cards trade places.
**Sort by** *Suit, then rank* makes radix sort deal twice.
