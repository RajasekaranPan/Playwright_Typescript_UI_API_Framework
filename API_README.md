# Playwright TypeScript REST API Automation Framework

## 1. Project Overview

This is a **REST API automation testing framework** built with **Playwright**, **TypeScript**, and **Zod** for testing the **RestfulBooker API**. The framework provides a clean separation of concerns with dedicated layers for API clients, request/response models, test data generation, and runtime schema validation.

**Technology Stack:**
- **Playwright** – Modern browser/API automation
- **TypeScript** – Strongly-typed test code
- **Zod** – Runtime schema validation for API responses
- **Faker** – Dynamic test data generation
- **Playwright APIRequestContext** – HTTP client for REST API testing

---

## 2. Framework Architecture

```
Test Case
   ↓
Playwright Test Fixture
   ↓
API Client (AuthClient, BookingClient)
   ↓
API Routes + Headers + Test Data Factory
   ↓
Playwright APIRequestContext
   ↓
REST API (RestfulBooker)
   ↓
HTTP Response
   ↓
Zod Schema Validation
   ↓
Business Assertions
```

**Layer Responsibilities:**
- **Test Case**: Orchestrates test flow and business assertions.
- **Fixture**: Provides pre-configured API clients and authentication tokens.
- **API Client**: Encapsulates HTTP operations (POST, GET, PUT, PATCH, DELETE).
- **Routes & Headers**: Centralized endpoint paths and common request headers.
- **Test Data Factory**: Generates dynamic, scenario-specific booking data.
- **APIRequestContext**: Low-level HTTP client from Playwright.
- **Zod Schemas**: Parse and validate API response structure at runtime.

---

## 3. Project Structure

```
project/
├── tests/
│   ├── global.setup.ts
│   └── apiTests/
│       └── restfulBooker/
│           └── booking-CRUD.spec.ts
├── api-clients/
│   ├── AuthClient.ts
│   └── BookingClient.ts
├── api-models/
│   ├── Booking.ts
│   ├── Auth/
│   │   ├── CreateTokenRequest.ts
│   │   └── CreateTokenResponse.ts
│   └── Booking/
│       ├── BookingSchema.ts
│       ├── CreateBookingRequest.ts
│       ├── CreateBookingResponse.ts
│       ├── GetBookingResponse.ts
│       ├── UpdateBookingRequest.ts
│       ├── PatchBookingRequest.ts
│       └── PatchBookingResponse.ts
├── api-fixtures/
│   └── api-fixture.ts
├── api-datafactory/
│   └── BookingDataFactory.ts
├── api-config/
│   ├── api.config.ts
│   ├── api.endpoints.ts
│   └── api.headers.ts
├── api-context/
│   └── AuthenticatedApiContext.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── env-files/
    └── .env.qa (not committed)
```

**Key Folders:**
- **tests**: Actual test specifications using Playwright.
- **api-clients**: HTTP client classes for different API resources (Auth, Booking).
- **api-models**: TypeScript types and Zod schemas for requests/responses.
- **api-fixtures**: Reusable test dependencies (clients, tokens).
- **api-datafactory**: Test data generators with Faker.
- **api-config**: Centralized routes, headers, and environment configuration.

---

## 4. Key Framework Components

| Component | Purpose |
|-----------|---------|
| **AuthClient** | Handles authentication and token generation |
| **BookingClient** | CRUD operations on booking resource |
| **API Fixtures** | Provides authClient, bookingClient, and authentication token to tests |
| **Request Models** | TypeScript types for API request payloads (e.g., `CreateBookingRequest`) |
| **Response Models** | TypeScript types for API responses (e.g., `GetBookingResponse`) |
| **Zod Schemas** | Runtime validation schemas for response contracts (e.g., `CreateBookingResponseSchema`) |
| **ApiRoutes** | Centralized endpoint paths (`/auth`, `/booking/{id}`) |
| **ApiHeaders** | Common request headers (Accept, Content-Type) |
| **BookingDataFactory** | Dynamic booking data generation with Faker and scenario overrides |

---

## 5. Dynamic Test Data

The **BookingDataFactory** generates realistic, randomized booking data using Faker. Tests can override specific fields for scenario-based testing.

**Basic Usage:**
```typescript
const booking = BookingDataFactory.createBooking();
// Generates: firstName, lastName, totalprice, depositpaid, bookingdates, additionalneeds
```

**Scenario-Based Overrides:**
```typescript
const booking = BookingDataFactory.createBooking({
    depositpaid: true,
    totalprice: 500,
    additionalneeds: 'NonSmokingRoom',
    bookingdates: {
        checkin: '2026-09-01',
        checkout: '2026-09-10'
    }
});
```

Faker generates default random values for all fields. Tests override only the fields needed for a specific scenario, keeping test data concise and maintainable.

---

## 6. Writing an API Test

Here's a realistic example demonstrating the full CRUD flow with validation:

```typescript
import { test } from '../../../api-fixtures/api-fixture';
import { CreateBookingRequest } from '../../../api-models/Booking/CreateBookingRequest';
import { CreateBookingResponseSchema } from '../../../api-models/Booking/CreateBookingResponse';
import { GetBookingResponseSchema } from '../../../api-models/Booking/GetBookingResponse';
import { BookingDataFactory } from '../../../api-datafactory/BookingDataFactory';

test('Booking CRUD: Create, Read, Update, Delete', async ({ bookingClient }) => {
    // 1. Generate dynamic test data with scenario override
    const booking = BookingDataFactory.createBooking({
        depositpaid: true,
        totalprice: 500
    }) as CreateBookingRequest;

    // 2. Call API client
    const createResponse = await bookingClient.createBooking(booking);

    // 3. Validate HTTP response
    expect(createResponse.status()).toBe(200);

    // 4. Validate response using Zod schema
    const createBody = CreateBookingResponseSchema.parse(
        await createResponse.json()
    );
    const bookingId = createBody.bookingid;

    // 5. Business assertion: verify created data
    expect(bookingId).toBeGreaterThan(0);
    expect(createBody.booking.firstname).toBe(booking.firstname);
    expect(createBody.booking.totalprice).toBe(500);

    // 6. Read: retrieve created booking
    const getResponse = await bookingClient.getBooking(bookingId);
    expect(getResponse.status()).toBe(200);
    const getBody = GetBookingResponseSchema.parse(
        await getResponse.json()
    );
    expect(getBody.firstname).toBe(booking.firstname);
});
```

---

## 7. Request Data Handling

**Path Parameters:**
```typescript
// Endpoint: /booking/{bookingId}
const response = await bookingClient.getBooking(123);
```

**Request Body:**
```typescript
// POST /booking with booking payload
const booking = BookingDataFactory.createBooking({ depositpaid: true });
await bookingClient.createBooking(booking);
```

**Headers:**
```typescript
// Managed centrally in ApiHeaders
// commonHeaders: { Accept: 'application/json', 'Content-Type': 'application/json' }
```

Endpoint paths, request models, headers, and test data are **separated from test logic**. Tests remain focused on business behavior, not HTTP details.

---

## 8. Response Validation

API responses are validated in layers:

```
HTTP Status → Check Status Code
   ↓
JSON Body → Parse with Zod Schema
   ↓
Type-Safe Object → Business Assertions
```

**Example Zod Validation:**
```typescript
import { z } from 'zod';
import { BookingSchema } from './BookingSchema';

export const CreateBookingResponseSchema = z.object({
    bookingid: z.number(),
    booking: BookingSchema
});

// Parse and validate
const responseBody = CreateBookingResponseSchema.parse(await response.json());
// Now responseBody is type-safe: { bookingid: number, booking: BookingSchema }
```

**Why Zod Validation?**
Zod provides runtime contract validation. It ensures the API response structure matches expectations before the test proceeds. This catches API contract violations early and prevents runtime type errors.

---

## 9. Authentication

Authentication is handled by the **api-fixture**:

```typescript
// Fixture automatically:
// 1. Calls AuthClient.createToken(username, password)
// 2. Validates response status is 200
// 3. Extracts and stores the token
// 4. Injects token into authenticated API context

const response = await authClient.createToken(api_username, api_password);
// Returns: { token: 'abc123xyz' }
```

Tests receive authenticated clients automatically. Credentials are loaded from environment variables (not hardcoded).

---

## 10. Environment Setup

**Requirements:**
- **Node.js** (LTS recommended)
- **.env configuration** in `env-files/.env.qa`

**Installation:**
```bash
npm install
```

**Environment Configuration:**
Create `env-files/.env.qa` with required variables:
```
API_BASE_URL=https://restfulbooker.herokuapp.com
API_USERNAME=<your-username>
API_PASSWORD=<your-password>
```

Do NOT commit credentials to source control. Use a secret management tool (Infisical, HashiCorp Vault, AWS Secrets Manager) in CI/CD.

---

## 11. Running Tests

**Run all API tests:**
```bash
npm run test:qa
```

**Run with headed browser (debug mode):**
```bash
npm run test:qa:hd:report:html
```

**Run headless with HTML report:**
```bash
npm run test:qa:headless:report:html
```

**Debug with Playwright Inspector:**
```bash
npm run test:debug
```

**Open HTML report:**
```bash
npm run test:report:open
```

---

## 12. Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Run all tests | `npm run test:qa` |
| Run tests in headed mode | `npm run test:qa:hd:report:html` |
| Debug with Inspector | `npm run test:debug` |
| View HTML report | `npm run test:report:open` |
| Generate booking data | `BookingDataFactory.createBooking()` |
| Override scenario data | `BookingDataFactory.createBooking({ depositpaid: true })` |
| Validate API response | `CreateBookingResponseSchema.parse(json)` |

---

## 13. Best Practices

1. **Keep HTTP implementation inside API clients.** Tests call client methods, not HTTP directly.
2. **Do not hardcode endpoint paths or headers in tests.** Use `ApiRoutes` and `ApiHeaders`.
3. **Use request/response models.** Define TypeScript types for all API contracts.
4. **Validate responses with Zod schemas.** Catch API contract violations at runtime.
5. **Use the data factory for test data.** Leverage Faker for dynamic, realistic values.
6. **Override only required fields.** Keep test data concise and intent-clear.
7. **Keep secrets outside source code.** Load credentials from environment variables.
8. **Reuse fixtures and clients.** Avoid redundant setup; leverage Playwright fixtures.
9. **Keep tests focused on business behavior.** Assert business rules, not implementation details.
10. **Use meaningful fixture composition.** Let Playwright fixtures handle dependency injection.

---

## Getting Help

- **Playwright Docs**: https://playwright.dev
- **Zod Docs**: https://zod.dev
- **Faker Docs**: https://fakerjs.dev
- **RestfulBooker API**: https://restfulbooker.herokuapp.com/apidoc/index.html
