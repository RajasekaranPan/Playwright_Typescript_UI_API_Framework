import { z } from 'zod';
import { BookingSchema } from './BookingSchema';

export const GetBookingResponseSchema = BookingSchema;

export type GetBookingResponse = z.infer<typeof GetBookingResponseSchema>;
