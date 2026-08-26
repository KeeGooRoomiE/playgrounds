/**
 * make-og-image.mjs
 *
 * Renders public/og-image.png — the link-preview card for the site root.
 * Playground pages use their own thumbnail; only the index needs this one.
 *
 * Everything visible is driven by og-image.config.json, so changing the
 * wording or colours is a content edit, not a code edit. Any field can be
 * overridden per-run with a flag, which is what the workflow's dispatch
 * inputs feed into.
 *
 * Usage:
 *   npm run og                                  # straight from the config
 *   npm run og -- --title "Playgrounds Lab"     # override one field
 *   npm run og -- --icon assets/logo.svg        # add/replace the icon
 *   npm run og -- --out public/og-alt.png       # write somewhere else
 *
 * Output:
 *   public/og-image.png (1200×630 — the size Telegram/Twitter/Discord expect)
 */

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('.');
const CONFIG_PATH = path.join(ROOT, 'og-image.config.json');
const DEFAULT_OUT = path.join(ROOT, 'public/og-image.png');

const WIDTH = 1200;
const HEIGHT = 630;

// Same variable font the site itself loads, read straight out of node_modules
// so the card can never drift from the pages it advertises.
const FONT_FILE = path.join(
  ROOT,
  'node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2',
);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

const MIME = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

/** Inlined as a data URI — the page is rendered from a string, so it has no base URL to resolve a relative path against. */
function iconDataUri(iconPath) {
  const abs = path.isAbsolute(iconPath) ? iconPath : path.join(ROOT, iconPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`icon not found: ${iconPath}`);
  }
  const mime = MIME[path.extname(abs).toLowerCase()];
  if (!mime) {
    throw new Error(`unsupported icon type: ${path.extname(abs)} (use svg, png, jpg or webp)`);
  }
  return `data:${mime};base64,${fs.readFileSync(abs).toString('base64')}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(cfg, fontUri, icon) {
  const dots = (cfg.dots ?? [])
    .map((c) => `<i style="background:${escapeHtml(c)}"></i>`)
    .join('');

  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: 'PlexOG';
    src: url('${fontUri}') format('woff2-variations');
    font-weight: 100 700;
    font-display: block;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    background: ${escapeHtml(cfg.background)};
    font-family: 'PlexOG', sans-serif;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 88px;
    position: relative;
  }
  .rule { width: 96px; height: 5px; background: ${escapeHtml(cfg.accent)}; border-radius: 3px; margin-bottom: 44px; }
  .icon { height: 92px; width: auto; margin-bottom: 30px; display: block; }
  h1 {
    font-size: 82px; font-weight: 700; letter-spacing: -2px;
    color: ${escapeHtml(cfg.titleColor)};
  }
  p.tag {
    font-size: 31px; line-height: 1.45; margin-top: 22px; max-width: 900px;
    color: ${escapeHtml(cfg.taglineColor)};
  }
  .foot {
    position: absolute; left: 88px; bottom: 64px;
    font-size: 21px; letter-spacing: .3px;
    color: ${escapeHtml(cfg.footerColor)};
  }
  .dots { position: absolute; right: 76px; bottom: 70px; display: flex; gap: 13px; }
  .dots i { width: 15px; height: 15px; border-radius: 50%; display: block; }
</style></head>
<body>
  ${icon ? `<img class="icon" src="${icon}" alt="">` : '<div class="rule"></div>'}
  <h1>${escapeHtml(cfg.title)}</h1>
  ${cfg.tagline ? `<p class="tag">${escapeHtml(cfg.tagline)}</p>` : ''}
  ${cfg.footer ? `<div class="foot">${escapeHtml(cfg.footer)}</div>` : ''}
  ${dots ? `<div class="dots">${dots}</div>` : ''}
</body></html>`;
}

async function run() {
  const args = parseArgs(process.argv.slice(2));

  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`missing ${path.relative(ROOT, CONFIG_PATH)}`);
  }
  const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

  // Flags win over the config file; empty strings are treated as "not set" so
  // an unfilled workflow input doesn't blank a field.
  for (const key of ['title', 'tagline', 'footer', 'background', 'accent', 'titleColor', 'taglineColor', 'footerColor', 'icon']) {
    if (typeof args[key] === 'string' && args[key].trim() !== '') cfg[key] = args[key];
  }
  if (typeof args.dots === 'string' && args.dots.trim() !== '') {
    cfg.dots = args.dots.split(',').map((d) => d.trim()).filter(Boolean);
  }

  if (!cfg.title || String(cfg.title).trim() === '') {
    throw new Error('title is required — it is the only text a small preview is guaranteed to show');
  }

  if (!fs.existsSync(FONT_FILE)) {
    throw new Error(`font missing at ${path.relative(ROOT, FONT_FILE)} — run npm ci first`);
  }
  const fontUri = `data:font/woff2;base64,${fs.readFileSync(FONT_FILE).toString('base64')}`;

  const icon = cfg.icon ? iconDataUri(cfg.icon) : null;

  const outPath = typeof args.out === 'string' ? path.resolve(args.out) : DEFAULT_OUT;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const browser = await chromium.launch(process.env.CI ? { channel: 'chrome' } : {});
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  await page.setContent(buildHtml(cfg, fontUri, icon), { waitUntil: 'load' });
  // font-display: block above means text stays invisible until the face is
  // ready, so waiting here is what stops a fallback-font card being captured.
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: outPath });
  await browser.close();

  console.log(`✔ ${path.relative(ROOT, outPath)}  (${WIDTH}×${HEIGHT})`);
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
