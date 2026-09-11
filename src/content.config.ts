import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const playgrounds = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/playgrounds' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    tags: z.array(z.string()).default([]),
    // The one category this playground files under in the index rail. Always
    // also present in `tags` — `tags` is the many-to-many filter, `category`
    // is the single home. Required on purpose: picking it is an editorial
    // call, and falling back to `tags[0]` would silently depend on array order.
    category: z.string(),
    description: z.string(),
    thumbnail: z.string(),
    // Only for playgrounds migrated from their own standalone repo — the
    // detail page prints "Originally built as a standalone project" next to
    // it, which is false for one written here. Omit it in that case.
    sourceRepo: z.string().url().optional(),
    island: z.string(),
    background: z.string().optional(),
    // Extra query-string params appended to the URL scripts/capture-thumbnail.mjs
    // screenshots for this entry's card image, e.g. "seed=17" to override the
    // shared default capture seed for just this one playground. Every island
    // already gets `&thumbnail=1` automatically — see src/lib/seed.ts.
    thumbnailQuery: z.string().optional(),
  }),
});

export const collections = { playgrounds };
