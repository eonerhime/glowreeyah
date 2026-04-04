import { z } from 'zod';

export const EventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  externalLink: z.string().url().optional().or(z.literal('')),
  isUpcoming: z.boolean().default(true),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
});
export type EventInput = z.infer<typeof EventSchema>;
