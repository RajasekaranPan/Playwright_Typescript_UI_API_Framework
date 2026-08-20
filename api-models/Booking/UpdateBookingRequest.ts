import { z } from 'zod';
import { BookingSchema } from './BookingSchema';

export const UpdateBookingRequestSchema = BookingSchema;

export type UpdateBookingRequest = z.infer<typeof UpdateBookingRequestSchema>;
