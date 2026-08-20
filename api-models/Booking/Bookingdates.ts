import z from 'zod';
import { BookingDatesSchema } from './BookingdatesSchema';

export type BookingDates = z.infer<typeof BookingDatesSchema>;
