/**
 * scaffold-playground.mjs
 *
 * Semi-automated migration helper: drafts a content entry + island component
 * from a standalone playground's index.html. NOT fully automatic — the
 * drafted island still needs manual DOM-id namespacing and a behavior
 * review. See docs/CONTENT_GUIDE.md for the full checklist.
 *
 * Usage:
 *   npm run scaffold -- <slug> <path-to-source-index.html>
 *
 * Output:
 *   src/content/playgrounds/<slug>.md   (draft)
 *   src/islands/<PascalSlug>.astro      (draft)
 */

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: npm run scaffold -- <slug> <path-to-source-index.html>');
  process.exit(1);
}

const [slug, sourcePath] = args;
const ROOT = path.resolve('.');
const html = fs.readFileSync(sourcePath, 'utf-8');

function toPascalCase(s) {
  return s.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

function extract(re, fallback = '') {
  const m = html.match(re);
  return m ? m[1].trim() : fallback;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '').trim();
}

const title = extract(/<title>([^<]*)<\/title>/i, slug);
const heroSubtitle = stripTags(extract(/<p class="hero-subtitle">([\s\S]*?)<\/p>/i));

// Prose sections: every <section>...<h2>Title</h2>...</section> block.
const sectionRe = /<section>\s*<h2>([^<]*)<\/h2>([\s\S]*?)<\/section>/gi;
let body = '';
let match;
while ((match = sectionRe.exec(html))) {
  const [, heading, content] = match;
  body += `## ${heading.trim()}\n\n`;
  body += `${stripTags(content).replace(/\n{3,}/g, '\n\n')}\n\n`;
}

const styleBlock = extract(/<style>([\s\S]*?)<\/style>/i);
const scriptBlock = extract(/<script>([\s\S]*?)<\/script>/i);
const playgroundMarkup = extract(/<div class="playground">([\s\S]*?)<\/div>\s*<\/section>/i);

const contentMd = `---
title: ${title}
order: 999
tags: []
description: ${heroSubtitle || 'TODO'}
thumbnail: /thumbnails/${slug}.png
sourceRepo: https://github.com/KeeGooRoomiE/${slug}-playground
island: ${slug}
---

${body.trim()}
`;

const islandAstro = `---
---
<div class="playground">
${playgroundMarkup || '  <!-- TODO: paste controls + canvas markup from source, namespace every id -->'}
</div>

<style>
  /* TODO: keep only rules NOT already in src/styles/global.css */
${styleBlock}
</style>

<script>
  // TODO: namespace every id referenced below (getElementById('canvas') -> a slug-prefixed id),
  // and replace any inline onclick/oninput HTML attributes with addEventListener calls —
  // this script runs as an ES module, not global scope.
${scriptBlock}
</script>
`;

const contentPath = path.join(ROOT, 'src/content/playgrounds', `${slug}.md`);
const islandPath = path.join(ROOT, 'src/islands', `${toPascalCase(slug)}.astro`);

fs.writeFileSync(contentPath, contentMd);
fs.writeFileSync(islandPath, islandAstro);

console.log(`✔ ${contentPath}`);
console.log(`✔ ${islandPath}`);
console.log('\nDraft only — review docs/CONTENT_GUIDE.md before publishing:');
console.log('  1. Namespace every DOM id in the island and its script.');
console.log('  2. Convert inline onclick/oninput/onchange to addEventListener.');
console.log('  3. Add the island to src/islands/index.ts.');
console.log('  4. Fill in tags/order/description by hand.');
console.log(`  5. npm run thumbnail -- ${slug}`);
