import { z } from 'zod';
import { UpdateBookingRequestSchema } from './UpdateBookingRequest';

export const UpdateBookingResponseSchema =
    UpdateBookingRequestSchema;

export type UpdateBookingResponse =
    z.infer<typeof UpdateBookingResponseSchema>;