/**
 * Deterministic RNG for islands that use randomness (boids' initial layout,
 * bfs/dfs's maze carving, dijkstra's terrain generation). Reading `?seed=`
 * from the URL and swapping in a seeded PRNG is what makes CI thumbnail
 * capture reproducible — see scripts/capture-thumbnail.mjs, which always
 * navigates with `?seed=kgrm_s121` so a fresh capture never needs a human to
 * re-run it until a good-looking result shows up. A normal visitor without
 * that query param still gets Math.random() — nothing changes for them.
 */

export function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h >>> 0;
}

export function makeRng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return function rand() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export function getSeedParam(): string | null {
  if (typeof location === 'undefined') return null;
  return new URLSearchParams(location.search).get('seed');
}

/** `Math.random`-compatible: seeded if `?seed=` is present, otherwise real randomness. */
export function getRandom(): () => number {
  const seedParam = getSeedParam();
  return seedParam ? makeRng(hashSeed(seedParam)) : Math.random;
}

/**
 * True when the page was loaded for a thumbnail screenshot (`?thumbnail=1`,
 * set by scripts/capture-thumbnail.mjs). Islands read this to render their
 * best "cover" frame instead of their normal first-load state — e.g.
 * pathfinding islands skip straight to a solved path instead of an empty
 * grid, Perlin fills the frame edge-to-edge instead of leaving its usual
 * interactive margin. A normal visitor never sets this param, so nothing
 * about the live interactive experience changes.
 */
export function isThumbnailMode(): boolean {
  if (typeof location === 'undefined') return false;
  return new URLSearchParams(location.search).get('thumbnail') === '1';
}
