import { z } from 'zod';
export const ArtistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slugName: z.string().min(1, 'Slug is required'),
  biographyShort: z.string().max(160, 'Max 160 characters'),
  biographyMedium: z.string().max(500, 'Max 500 characters'),
  biographyLong: z.string(),
  achievements: z.array(z.string()).optional(),
  speakingProfile: z.string().optional(),
  profileImageUrl: z.string().url('Must be a valid URL'),
  socialLinks: z
    .object({
      instagram: z.string().url().optional(),
      youtube: z.string().url().optional(),
      spotify: z.string().url().optional(),
      twitter: z.string().url().optional(),
    })
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});
export type ArtistInput = z.infer<typeof ArtistSchema>;
