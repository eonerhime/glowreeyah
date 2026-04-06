import { z } from 'zod';

export const InitiativeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  body: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  externalLink: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
});
export type InitiativeInput = z.infer<typeof InitiativeSchema>;
