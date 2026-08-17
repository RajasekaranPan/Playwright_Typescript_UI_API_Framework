export const ApiRoutes = {
    auth: '/auth',

    booking: {
        base: '/booking',
        byId: (bookingId: number) => `/booking/${bookingId}`
    }
} as const;