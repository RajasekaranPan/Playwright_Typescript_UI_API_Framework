import { z } from 'zod';
import { BookingSchema } from './BookingSchema';

export const PatchBookingResponseSchema = BookingSchema;

export type PatchBookingResponse = z.infer<typeof PatchBookingResponseSchema>;
