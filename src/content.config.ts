import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared shape — both sections want the same frontmatter fields for now.
// If they diverge later (e.g. dsa wants a `difficulty` field), give each
// collection its own schema instead of forcing one shape on both.
const postSchema = ({ image }: any) => z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  author: z.string().default('Srikanth Bolla'),
  heroImage: image().optional(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional().default(false),
});

export const collections = {
  dsa: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/dsa' }),
    schema: postSchema,
  }),

  mechSympathy: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/mech-sympathy' }),
    schema: postSchema,
  }),
};
