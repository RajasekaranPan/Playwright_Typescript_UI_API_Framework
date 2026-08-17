import z from "zod";
import { BookingDatesSchema } from "./BookingdatesSchema";

export const BookingSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    totalprice: z.number(),
    depositpaid: z.boolean(),
    bookingdates: BookingDatesSchema,
    additionalneeds: z.string(),
});

//Typescript type - equalent to interface? 
export type BookingSchema =
    z.infer<typeof BookingSchema>;