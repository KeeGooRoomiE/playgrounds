/**
 * capture-thumbnail.mjs
 *
 * Screenshots a playground's <canvas> and saves it as its card thumbnail.
 * Requires a running dev/preview server (npm run dev) at BASE_URL.
 *
 * Every capture navigates with `?seed=<SEED>&thumbnail=1` — islands read
 * `thumbnail=1` (src/lib/seed.ts isThumbnailMode()) to render their best
 * "cover" frame instead of their normal first-load state (pathfinding
 * islands jump straight to a solved path, Perlin fills the frame edge to
 * edge). A per-entry `thumbnailQuery` field in the content frontmatter can
 * append extra params (e.g. `seed=17`) to override the shared default for
 * just that one playground.
 *
 * Usage:
 *   npm run thumbnail -- <slug>          capture one playground
 *   npm run thumbnail -- --all           capture every playground in src/content/playgrounds
 *
 * Output:
 *   public/thumbnails/<slug>.png
 */

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('.');
const CONTENT_DIR = path.join(ROOT, 'src/content/playgrounds');
const OUTPUT_DIR = path.join(ROOT, 'public/thumbnails');
const BASE_URL = process.env.PLAYGROUNDS_BASE_URL || 'http://localhost:4321';

// Default seed for islands that use randomness (boids, bfs, dfs, dijkstra —
// see src/lib/seed.ts). Makes capture reproducible with zero manual re-runs;
// override with PLAYGROUNDS_THUMBNAIL_SEED if you ever want a different look.
const SEED = process.env.PLAYGROUNDS_THUMBNAIL_SEED || 'kgrm_s121';

function allSlugs() {
  return fs.readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => f.replace(/\.md$/, ''));
}

// Frontmatter is simple flat YAML here, so a targeted regex for one optional
// field is enough — not worth a full YAML parser dependency for this.
function readThumbnailQuery(slug) {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/^thumbnailQuery:\s*["']?([^"'\n]+?)["']?\s*$/m);
  return match ? match[1] : null;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: npm run thumbnail -- <slug> | --all');
  process.exit(1);
}

const slugs = args.includes('--all') ? allSlugs() : args;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function run() {
  ensureDir(OUTPUT_DIR);

  const browser = await chromium.launch(process.env.CI ? { channel: 'chrome' } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  for (const slug of slugs) {
    // Built with URLSearchParams (not string concat) specifically so a
    // `thumbnailQuery` override — e.g. a different `seed` — replaces the
    // shared default instead of appending a duplicate key next to it, which
    // URLSearchParams.get() would silently resolve to the wrong one of.
    const params = new URLSearchParams({ thumbnail: '1', seed: SEED });
    const extra = readThumbnailQuery(slug);
    if (extra) {
      for (const [key, value] of new URLSearchParams(extra)) params.set(key, value);
    }
    const url = `${BASE_URL}/${slug}/?${params.toString()}`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const canvas = page.locator('canvas').first();
    const outPath = path.join(OUTPUT_DIR, `${slug}.png`);
    await canvas.screenshot({ path: outPath });

    console.log(`✔ ${outPath}`);
  }

  await browser.close();
  console.log('\nDone.');
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
