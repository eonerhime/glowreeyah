import { z } from 'zod';
export const BookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Must be a valid email'),
  organisation: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});
export type BookingInput = z.infer<typeof BookingSchema>;
