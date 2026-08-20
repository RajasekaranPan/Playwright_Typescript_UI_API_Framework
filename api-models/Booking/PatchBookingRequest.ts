import { z } from 'zod';

export const PatchBookingRequestSchema = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  totalprice: z.number().optional(),
  depositpaid: z.boolean().optional(),
  bookingdates: z
    .object({
      checkin: z.iso.date(),
      checkout: z.iso.date(),
    })
    .optional(),
  additionalneeds: z.string().optional(),
});

export type PatchBookingRequest = z.infer<typeof PatchBookingRequestSchema>;
