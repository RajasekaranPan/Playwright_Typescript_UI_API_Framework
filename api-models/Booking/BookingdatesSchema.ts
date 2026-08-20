import { z } from 'zod';

export const BookingDatesSchema = z.object({
  checkin: z.iso.date(),
  checkout: z.iso.date(),
});
