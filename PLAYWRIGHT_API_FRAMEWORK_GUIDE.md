# Playwright API Testing Framework Guide

This project extends the existing Playwright TypeScript UI automation framework with a dedicated API automation layer built around Playwright’s `APIRequestContext`. 

The goal is to keep UI and API tests independent while reusing the same test runner, TypeScript setup, and project conventions. The API layer is structured for maintainability, authentication management, schema validation, and clean test isolation.

## 1. Framework File Structure

The main structure is as follows:

- [playwright.config.ts](playwright.config.ts)  
  Central Playwright config. It defines projects, test matching, browser settings, and environment loading. The API suite is separated into its own project so it can run independently without the UI storage-state setup.

- [fixtures/api-fixtures.ts](fixtures/api-fixtures.ts)  
  Supplies API fixtures such as `apiContext`, `apiClient`, `authApi`, `bookingApi`, `tokenManager`, `apiAssertions`, and `bookingDataFactory`. This is the dependency injection layer for API tests.

- [api/clients/ApiClient.ts](api/clients/ApiClient.ts)  
  Base HTTP transport wrapper. It owns request execution, common headers, query params, timeout handling, and a consistent response model.

- [api/clients/AuthApiClient.ts](api/clients/AuthApiClient.ts)  
  Auth-specific API client for `/auth` operations. It encapsulates token creation and keeps authentication logic out of tests.

- [api/clients/BookingApiClient.ts](api/clients/BookingApiClient.ts)  
  Domain client for booking CRUD operations. It exposes methods like `createBooking`, `getBooking`, `updateBooking`, and `deleteBooking`.

- [api/endpoints/RestfulBookerEndpoints.ts](api/endpoints/RestfulBookerEndpoints.ts)  
  Centralizes path constants and avoids hard-coded URLs in tests.

- [api/models/AuthModels.ts](api/models/AuthModels.ts) and [api/models/BookingModels.ts](api/models/BookingModels.ts)  
  TypeScript contracts for request and response payloads. These keep API data strongly typed and readable.

- [api/auth/ApiTokenManager.ts](api/auth/ApiTokenManager.ts)  
  Manages token lifecycle. It stores and reuses tokens where appropriate, preventing duplicate token generation and keeping credentials out of tests.

- [api/assertions/ApiAssertions.ts](api/assertions/ApiAssertions.ts)  
  Centralizes API validation logic like status checks, headers, JSON checks, and schema validation.

- [api/utils/SchemaValidator.ts](api/utils/SchemaValidator.ts)  
  Compiles JSON schemas and validates API payloads using AJV. It returns useful path-based validation errors.

- [api/utils/ApiLogger.ts](api/utils/ApiLogger.ts) and [api/utils/ApiResponseUtils.ts](api/utils/ApiResponseUtils.ts)  
  Handle sanitized logging and response parsing without exposing secrets or noisy payloads.

- [api/builders/BookingRequestBuilder.ts](api/builders/BookingRequestBuilder.ts)  
  Generates dynamic booking payloads using Faker. This reduces duplication and improves data realism.

- [api/schemas](api/schemas)  
  Contains JSON schemas for auth and booking responses. Schemas are contract checks, while tests validate business behavior.

- [tests/apiTests/restfulBooker](tests/apiTests/restfulBooker)  
  Houses the API tests, grouped by domain and operation type. Each spec is focused on one concern instead of mixing all CRUD behavior into a single file.

- [utils/EnvironmentManager.ts](utils/EnvironmentManager.ts) and [utils/CredentialsManager.ts](utils/CredentialsManager.ts)  
  Existing framework utilities reused for environment and credential access. These keep config management centralized and aligned with current practices.

## 2. Beginner’s Cheat Sheet

### Core APIRequestContext usage

```ts
const response = await request.get('https://restful-booker.herokuapp.com/booking');
const body = await response.json();
console.log(response.status());
```

In this framework, the request layer is wrapped by `ApiClient`, so tests usually do not call raw `request` directly.

### Common HTTP methods

```ts
await apiClient.get('/booking');
await apiClient.post('/auth', { body: payload });
await apiClient.put('/booking/123', { body: payload });
await apiClient.patch('/booking/123', { body: partialPayload });
await apiClient.delete('/booking/123');
```

### Typical request pattern

```ts
const response = await bookingApi.createBooking(payload);
await apiAssertions.expectStatus(response, 200);
await apiAssertions.expectSchema(response, 'booking/createBookingResponse.schema.json');
```

### Assertions to know

- `expectStatus(response, 200)`
- `expectSuccessStatus(response)`
- `expectContentType(response, 'application/json')`
- `expectJson(response)`
- `expectSchema(response, 'booking/booking.schema.json')`
- `expectFieldExists(response, 'booking.firstname')`
- `expectFieldEquals(response, 'booking.totalprice', 500)`

### Dynamic test data

```ts
const booking = bookingDataFactory.validBooking();
const bookingWithOverrides = bookingDataFactory.validBooking({
  firstname: 'API',
  totalprice: 500,
});
```

### Authentication pattern

```ts
const token = await tokenManager.createToken();
const response = await bookingApi.apiClient.put(`/booking/${id}`, {
  headers: {
    Cookie: `token=${token}`,
    Authorization: `Bearer ${token}`,
  },
  body: payload,
});
```

### Useful execution commands

```bash
npx playwright test --project=api
npx playwright test --project=api --grep=@Smoke
npx playwright test tests/apiTests/restfulBooker/auth/createToken.spec.ts
npm run test:api
```

### Good habits

- Keep tests business-readable.
- Use existing endpoint constants instead of literal strings.
- Validate contract schema and business data separately.
- Clean up created bookings in CRUD tests.
- Keep credentials in environment files, not in code.

## 3. UI-to-API Framework Adaptation

Converting an existing UI framework to an API-first or hybrid test setup should be incremental and non-destructive.

### A. Preserve the existing UI structure

Do not replace the current UI model. Keep the current browser-based projects, page objects, fixtures, and storage-state login flow intact. The UI layer still relies on `global.setup.ts`, browser projects, and a saved authentication state. This is especially important for OrangeHRM-style flows where login cookies must be reused.

### B. Add a separate API project in the config

In [playwright.config.ts](playwright.config.ts), create a dedicated `api` project that ignores browser-specific setup and targets only files under `[tests/apiTests](tests/apiTests)`. This allows API automation to run without using storage state or global browser auth.

Example configuration concept:

```ts
projects: [
  {
    name: 'api',
    testMatch: '**/apiTests/**/*.spec.ts',
    use: { baseURL: process.env.API_BASE_URL }
  },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/globalStorageState.json' },
    dependencies: ['setup']
  }
]
```

### C. Add API fixtures next to UI fixtures

Create a dedicated fixture file like [fixtures/api-fixtures.ts](fixtures/api-fixtures.ts). This follows the same Playwright `base.extend` style as the UI fixture layer, but supplies API-only objects instead of page objects. This keeps the test authoring pattern consistent across the project.

### D. Introduce API-specific folders without disturbing UI folders

Add new folders for:

- `api/clients`
- `api/endpoints`
- `api/models`
- `api/schemas`
- `api/builders`
- `api/auth`
- `api/assertions`
- `api/utils`

This separation prevents the UI framework from becoming crowded with HTTP concerns.

### E. Position API data outside the UI setup

Use a dedicated API environment file such as [env-files/.env.api](env-files/.env.api). The UI project continues using [env-files/.env.qa](env-files/.env.qa). This keeps secrets and endpoint targets separate, and allows each suite to run without cross-contamination.

### F. Keep test execution independent

The most important adaptation is to ensure the API project is not coupled to the UI project’s lifecycle. API tests should not depend on browser state, storage files, or page objects. UI tests should not need the API test files either. This division makes local runs, CI jobs, and reporting independent and much easier to troubleshoot.

### G. Final principle

The right hybrid framework is not a re-write; it is an extension. Existing UI patterns stay intact, while API clients, schemas, builders, and fixtures are added as parallel layers. This gives a clean architecture: UI automation for browser workflows and API automation for service-level validation, both under the same Playwright test runner.

This structure is the best balance of maintainability, interview-readiness, and production-style test design.
