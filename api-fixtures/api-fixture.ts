import { test as base } from '@playwright/test';
import { AuthClient } from '../api-clients/AuthClient';
import { BookingClient } from '../api-clients/BookingClient';
import { AuthenticatedApiContext } from '../api-context/AuthenticatedApiContext';
import { apiConfig } from '../api-config/api.config';
import { ApiHeaders } from '../api-config/api.headers';

//Playwright fixtures don't have a special private keyword. The practical approach is to use fixture composition and naming so tests consume only the public capabilities.
type ApiFixtures = {
    authClient: AuthClient;
    bookingClient: BookingClient;
};

type ApiInternalFixtures = {
    token: string;
    authenticatedApiContext: AuthenticatedApiContext;
};

export const test = base.extend<ApiFixtures & ApiInternalFixtures>({
    authClient: async ({ request }, use) => {
        const authClient = new AuthClient(request);
        await use(authClient);
    },

    token: async ({ authClient }, use) => {

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

        if (!response.ok()) {
            throw new Error(
                `Authentication failed. Status: ${response.status()}`
            );
        }

        const body = await response.json();

        if (!body.token) {
            throw new Error('Authentication response did not contain a token');
        }

        await use(body.token);
    },

    authenticatedApiContext: async ({ playwright, token }, use) => {

        const baseUrl = apiConfig.baseUrl;

        const request = await playwright.request.newContext(
            {
                baseURL: baseUrl,
                extraHTTPHeaders: {
                    ...ApiHeaders.commonHeaders,
                    Cookie: `token=${token}`
                }
            })

        const authenticatedAPIRequest = new AuthenticatedApiContext(request);
        await use(authenticatedAPIRequest);

        await authenticatedAPIRequest.dispose();


    },

    bookingClient: async ({ authenticatedApiContext }, use) => {

        const bookingClient = new BookingClient(authenticatedApiContext.request);

        await use(bookingClient);
    },






});

export { expect } from '@playwright/test';