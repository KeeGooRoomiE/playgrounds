import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

const repo = process.env.GITHUB_REPOSITORY;
const [owner, name] = repo ? repo.split('/') : [null, null];

export default defineConfig({
  site: owner ? `https://${owner}.github.io` : 'http://localhost:4321',
  base: name ? `/${name}` : undefined,

  // Content bodies use ``` blocks for pseudocode/formulas, not real syntax to
  // highlight — Shiki's default theme (github-dark) was injecting inline
  // dark styles that fought the site's light theme. Plain <pre><code> lets
  // src/styles/global.css fully control it instead, matching TEMPLATE.html's
  // original flat #f0f0f0 code blocks.
  markdown: {
    syntaxHighlight: false,
  },

  integrations: [sitemap()]
});
