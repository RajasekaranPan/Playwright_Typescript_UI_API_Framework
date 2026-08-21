import { test, expect, APIRequestContext } from '@playwright/test';

const baseUrl = process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';

async function createAuthToken(request: APIRequestContext) {
  const url = `${baseUrl}/auth`;
  const payload = {
    username: 'admin',
    password: 'password123',
  };

  const response = await request.post(url, {
    data: payload,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('token');
  expect(typeof body.token).toBe('string');
  expect(body.token.length).toBeGreaterThan(10);

  return body.token as string;
}

async function createBooking(request: any) {
  const url = `${baseUrl}/booking`;
  const payload = {
    firstname: 'Helper',
    lastname: 'Method',
    totalprice: 300,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-08-16',
      checkout: '2026-08-20',
    },
    additionalneeds: 'Breakfast',
  };

  const response = await request.post(url, {
    data: payload,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty('bookingid');
  expect(typeof body.bookingid).toBe('number');

  return body.bookingid as number;
}

async function getBooking(request: any, bookingId: number) {
  const url = `${baseUrl}/booking/${bookingId}`;
  const response = await request.get(url);

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.firstname).toBe('Helper');
  expect(body.lastname).toBe('Method');

  return body;
}

async function updateBooking(request: any, bookingId: number, token: string) {
  const url = `${baseUrl}/booking/${bookingId}`;
  const payload = {
    firstname: 'Updated',
    lastname: 'UsingHelpers',
    totalprice: 450,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-08-21',
      checkout: '2026-08-26',
    },
    additionalneeds: 'Dinner',
  };

  const response = await request.put(url, {
    data: payload,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: `token=${token}`,
      Authorization: `Bearer ${token}`,
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.firstname).toBe('Updated');
  expect(body.lastname).toBe('UsingHelpers');
  expect(body.totalprice).toBe(450);

  return body;
}

async function patchBooking(request: any, bookingId: number, token: string) {
  const url = `${baseUrl}/booking/${bookingId}`;
  const payload = {
    firstname: 'Patched',
    additionalneeds: 'Lunch',
  };

  const response = await request.patch(url, {
    data: payload,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: `token=${token}`,
      Authorization: `Bearer ${token}`,
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.firstname).toBe('Patched');
  expect(body.additionalneeds).toBe('Lunch');

  return body;
}

async function deleteBooking(request: any, bookingId: number, token: string) {
  const url = `${baseUrl}/booking/${bookingId}`;
  const response = await request.delete(url, {
    headers: {
      Accept: 'application/json',
      Cookie: `token=${token}`,
      Authorization: `Bearer ${token}`,
    },
  });

  expect(response.status()).toBe(201);
  const text = await response.text();
  expect(text.length).toBeGreaterThan(0);
}

test.describe('Restful Booker - helper methods stage', () => {
  test('create token, create booking, get, update, patch, delete using helper methods', async ({
    request,
  }) => {
    // Step 2: we still use direct URL + direct body data,
    // but the repetitive work is extracted into helper methods.
    const token = await createAuthToken(request);
    const bookingId = await createBooking(request);

    await getBooking(request, bookingId);
    await updateBooking(request, bookingId, token);
    await patchBooking(request, bookingId, token);
    await deleteBooking(request, bookingId, token);

    const afterDeleteResponse = await request.get(`${baseUrl}/booking/${bookingId}`);
    expect(afterDeleteResponse.status()).toBe(404);
  });
});
