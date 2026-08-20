import { APIRequestContext } from '@playwright/test';

export class AuthenticatedApiContext {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async dispose(): Promise<void> {
    await this.request.dispose();
  }
}
