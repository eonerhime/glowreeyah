import { z } from 'zod';
export const SongSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  albumId: z.string().min(1, 'Album is required'),
  trackNumber: z.number().optional(),
  description: z.string().optional(),
  lyrics: z.string().optional(),
  storyBehindSong: z.string().optional(),
  audioUrl: z.string().url('Must be a valid URL').optional(),
  videoUrl: z.string().url('Must be a valid URL').optional(),
  coverImageUrl: z.string().url('Must be a valid URL').optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(true),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});
export type SongInput = z.infer<typeof SongSchema>;
