import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '*/blog/**/*.md',
    base: './src/content',
    generateId: ({ entry }) => {
      // entry is like "es/blog/sobre-poder-y-gobernanza.md"
      // Strip locale prefix and .md extension
      const match = entry.match(/[^/]+\/blog\/(.+)\.md$/);
      if (match) return match[1];
      return entry;
    },
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    footnote: z.string().optional(),
  }),
});

export const collections = { blog };
