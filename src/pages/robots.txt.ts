import type { APIRoute } from 'astro';

/**
 * Generated rather than kept in public/, because the hand-written copy pointed
 * at a sitemap under the repository's old name for months after the rename.
 * Both the origin and the base path come from the build config here.
 */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin = (site?.toString() ?? 'http://localhost:4321/').replace(/\/$/, '');
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${origin}${base}/sitemap-index.xml`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
