import z from "zod";
import { BookingSchema } from "./BookingSchema";

export const CreateBookingRequestSchema = BookingSchema;

//Typescript type - equalent to interface? 
export type CreateBookingRequest =
    z.infer<typeof CreateBookingRequestSchema>;