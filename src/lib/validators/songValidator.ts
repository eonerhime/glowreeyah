import { z } from 'zod'

export const SongSchema = z.object({
  title:           z.string().min(1, 'Title is required'),
  albumId:         z.string().optional(),
  trackNumber:     z.number().optional(),
  description:     z.string().optional(),
  lyrics:          z.string().optional(),
  storyBehindSong: z.string().optional(),
  audioUrl:        z.string().url('Must be a valid URL').optional().or(z.literal('')),
  videoUrl:        z.string().url('Must be a valid URL').optional().or(z.literal('')),
  coverImageUrl:   z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags:            z.array(z.string()).optional(),
  isPublished:     z.boolean().default(true),
  seo:             z.object({
    metaTitle:       z.string().optional(),
    metaDescription: z.string().optional(),
  }).optional(),
})

export type SongInput = z.infer<typeof SongSchema>