import { faker } from '@faker-js/faker';
import { BookingSchema } from '../api-models/Booking/BookingSchema';

type BookingDataOverrides =
    Partial<Omit<BookingSchema, 'bookingdates'>> & {
        bookingdates?: Partial<BookingSchema['bookingdates']>;
    };

export class BookingDataFactory {

    private static readonly ADDITIONAL_NEEDS = [
        'Breakfast',
        'Lunch',
        'Dinner',
        'ACRoom',
        'NonSmokingRoom',
        'Pet Free'
    ];

    private static formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    public static createBooking(
        overrides: BookingDataOverrides = {}
    ): BookingSchema {

        const checkinDate = faker.date.soon({
            days: 180
        });

        const checkoutDate = new Date(checkinDate);

        checkoutDate.setDate(
            checkoutDate.getDate() +
            faker.number.int({ min: 1, max: 14 })
        );

        const defaultBooking: BookingSchema = {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),

            totalprice: faker.number.int({
                min: 100,
                max: 5000
            }),

            depositpaid: faker.datatype.boolean(),

            bookingdates: {
                checkin: this.formatDate(checkinDate),
                checkout: this.formatDate(checkoutDate)
            },

            additionalneeds: faker.helpers.arrayElement(
                this.ADDITIONAL_NEEDS
            )
        };

        return {
            ...defaultBooking,
            ...overrides,

            bookingdates: {
                ...defaultBooking.bookingdates,
                ...overrides.bookingdates
            }
        };
    }
}