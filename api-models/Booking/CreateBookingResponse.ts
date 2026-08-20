import { z } from 'zod';
import { BookingSchema } from './BookingSchema';

export const CreateBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: BookingSchema,
});

//Typescript type - equalent to interface?
export type CreateBookingResponse = z.infer<typeof CreateBookingResponseSchema>;
