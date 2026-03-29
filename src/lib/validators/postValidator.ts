import { z } from 'zod';
export const PostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['blog', 'devotional', 'story']).default('blog'),
  body: z.string().min(1, 'Body is required'),
  excerpt: z.string().max(300).optional(),
  coverImageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});
export type PostInput = z.infer<typeof PostSchema>;
