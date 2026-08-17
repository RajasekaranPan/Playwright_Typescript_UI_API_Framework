import { APIRequestContext, APIResponse } from '@playwright/test';
import { Booking } from '../api-models/Booking';
import { ApiHeaders } from '../api-config/api.headers';
import { ApiRoutes } from '../api-config/api.endpoints';

export class BookingClient {

    constructor(
        private readonly request: APIRequestContext
    ) {}

    async createBooking(
        booking: Booking
    ): Promise<APIResponse> {

        return await this.request.post(
            ApiRoutes.booking.base,
            {
                data: booking,
                headers: {
                    ...ApiHeaders.commonHeaders
                }
            }
        );
    }

    async getBooking(
        bookingId: number
    ): Promise<APIResponse> {

        return await this.request.get(
            ApiRoutes.booking.byId(bookingId),
            {
                headers: {
                    ...ApiHeaders.onlyAcceptJson
                }
            }
        );
    }

    async updateBooking(
        bookingId: number,
        booking: Booking,
    ): Promise<APIResponse> {

        return await this.request.put(
            ApiRoutes.booking.byId(bookingId),
            {
                data: booking,
                headers: {
                    ...ApiHeaders.commonHeaders
                }
            }
        );
    }

    async patchBooking(
        bookingId: number,
        booking: Partial<Booking>
    ): Promise<APIResponse> {

        return await this.request.patch(
            ApiRoutes.booking.byId(bookingId),
            {
                data: booking,
                headers: {
                    ...ApiHeaders.commonHeaders                }
            }
        );
    }

    async deleteBooking(
        bookingId: number
    ): Promise<APIResponse> {

        return await this.request.delete(
             ApiRoutes.booking.byId(bookingId),
            {
                headers: {
                    ...ApiHeaders.onlyAcceptJson
                }
            }
        );
    }
}