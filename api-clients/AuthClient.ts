import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHeaders } from '../api-config/api.headers';
import { ApiRoutes } from '../api-config/api.endpoints';

export class AuthClient {
    constructor(
        private readonly request: APIRequestContext
    ) {}

    async createToken(api_username: string, api_password: string): Promise<APIResponse> {
        return await this.request.post(ApiRoutes.auth, {
            data: {
                username: api_username,
                password: api_password
            },
            headers: {
                ...ApiHeaders.commonHeaders
            }
        });
    }
}