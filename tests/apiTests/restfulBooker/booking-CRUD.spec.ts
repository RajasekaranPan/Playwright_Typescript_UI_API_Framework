import { test, expect } from '../../../api-fixtures/api-fixture'

import { CreateBookingRequest } from '../../../api-models/Booking/CreateBookingRequest';
import { CreateBookingResponseSchema } from '../../../api-models/Booking/CreateBookingResponse';

import { GetBookingResponseSchema } from '../../../api-models/Booking/GetBookingResponse';

import { UpdateBookingRequest } from '../../../api-models/Booking/UpdateBookingRequest';
import { UpdateBookingResponseSchema } from '../../../api-models/Booking/UpdateBookingResponse';

import { PatchBookingRequest } from '../../../api-models/Booking/PatchBookingRequest';
import { PatchBookingResponseSchema } from '../../../api-models/Booking/PatchBookingResponse';
import { CreateTokenResponseSchema } from '../../../api-models/Auth/CreateTokenResponse';
import { BookingDataFactory } from '../../../api-datafactory/BookingDataFactory';



test('Validate Auth Token ', async ({ authClient }) => {

const api_username = process.env.API_USERNAME;
const api_password = process.env.API_PASSWORD;

if (!api_username || !api_password) {
    throw new Error(
        'API_USERNAME and API_PASSWORD must be configured'
    );
}

        const response = await authClient.createToken(
           api_username, 
           api_password
        );


console.log('Auth status:', response.status());
console.log('Auth body:', await response.text());


expect(response.headers()['content-type'])
    .toContain('application/json');

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.token).not.toBeNull();
        expect(responseBody.token.length).toBeGreaterThan(10);


        //Schema validation

        const responseBody1 =
    CreateTokenResponseSchema.parse(
        await response.json()
    );
expect(responseBody1.token.length).toBeGreaterThan(10);


});

test('Booking CRUD', async ({ bookingClient }) => {

    // Create
// const booking: CreateBookingRequest = {
//     firstname: 'Helper',
//     lastname: 'Method',
//     totalprice: 300,
//     depositpaid: true,
//     bookingdates: {
//         checkin: '2026-08-16',
//         checkout: '2026-08-20'
//     },
//     additionalneeds: 'Breakfast'
// };

//const booking = BookingDataFactory.createBooking() as CreateBookingRequest;

const booking = BookingDataFactory.createBooking(
      { depositpaid: true, totalprice: 500,  additionalneeds: 'NonSmokingRoom',
        bookingdates: {
        checkin: '2026-09-01',
        checkout: '2026-09-10'
    }
       }
) as CreateBookingRequest;


console.log(booking);

    const createResponse =
        await bookingClient.createBooking(booking);

    expect(createResponse.status()).toBe(200);

    //Schema validation
    const createBody =  CreateBookingResponseSchema.parse(await createResponse.json());

    const bookingId = createBody.bookingid;

    expect(bookingId).toBeGreaterThan(0);

    expect(createBody.booking.firstname)
        .toBe(booking.firstname);

    expect(createBody.booking.lastname)
        .toBe(booking.lastname);
       
    console.log("Newly created booking id is: ", bookingId);

    // Get
    const getResponse =
        await bookingClient.getBooking(bookingId);

    expect(getResponse.status()).toBe(200);

    const getResponseData = GetBookingResponseSchema.parse(await getResponse.json());
    expect(getResponseData['firstname']).toEqual(booking.firstname);


    // Update
    const updateBooking: UpdateBookingRequest = {
        ...booking,
        firstname: 'Rajasekaran'
    };


    const updateResponse =
        await bookingClient.updateBooking(
            bookingId,
            updateBooking
        );

    expect(updateResponse.status()).toBe(200);
    const updatedData = await updateResponse.json();
    expect(updatedData.firstname).toBe('Rajasekaran');
    expect(updatedData['firstname']).toBe('Rajasekaran');


    //Schema validation
    const updateBody =
        UpdateBookingResponseSchema.parse(
            await updateResponse.json()
        );

    expect(updateBody.firstname)
        .toBe(updateBooking.firstname);

    expect(updateBody.lastname)
        .toBe(updateBooking.lastname);

    expect(updateBody.totalprice)
        .toBe(updateBooking.totalprice);

    // Patch
    const patchResponse =
        await bookingClient.patchBooking(
            bookingId,
            {
                firstname: 'Patched'
            }
        );

    expect(patchResponse.status()).toBe(200);

    const patchBody =
        PatchBookingResponseSchema.parse(
            await patchResponse.json()
        );

    expect(patchBody.firstname)
        .toBe("Patched");

    // Delete
    const deleteResponse =
        await bookingClient.deleteBooking(
            bookingId
        );

    expect(deleteResponse.status()).toBe(201);
    expect(await deleteResponse.text()).toBe("Created");

    // Verify deletion
    const responseAfterDelete =
        await bookingClient.getBooking(bookingId);

    expect(responseAfterDelete.status()).toBe(404);
    expect(await responseAfterDelete.text()).toEqual("Not Found");
});

