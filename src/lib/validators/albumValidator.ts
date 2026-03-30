import { z } from 'zod';
export const AlbumSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  releaseYear: z.number({ message: 'Release year is required' }),
  coverImageUrl: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});
export type AlbumInput = z.infer<typeof AlbumSchema>;
