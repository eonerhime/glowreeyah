import { z } from 'zod';

export const ArtistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slugName: z.string().optional(),
  biographyShort: z.string().max(160, 'Max 160 characters').optional(),
  biographyMedium: z.string().max(500, 'Max 500 characters').optional(),
  biographyLong: z.string().optional(),
  achievements: z.array(z.string()).optional(),
  speakingProfile: z.string().optional(),
  profileImageUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  socialLinks: z
    .object({
      instagram: z.string().url().optional().or(z.literal('')),
      youtube: z.string().url().optional().or(z.literal('')),
      spotify: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
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
