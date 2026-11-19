import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const API_URL = 'https://rest-ez.test/items';

export const responseBody = {
  count: 2,
  next: `${API_URL}?page=2`,
  previous: null,
  results: [
    { id: 1, name: 'fake thing 1' },
    { id: 2, name: 'fake thing 2' },
  ],
};

/**
 * Returns a paginated JSON response after a short simulated delay.
 * @returns {Promise<Response>} Mock response.
 */
async function listResponse() {
  await delay(50);

  return HttpResponse.json(responseBody, {
    headers: { 'x-test-source': 'msw' },
  });
}

/**
 * Echoes the JSON body received from a POST or PUT request.
 * @param {object} info - MSW request information.
 * @param {Request} info.request - Intercepted request.
 * @returns {Promise<Response>} Mock response containing submitted data.
 */
async function echoResponse({ request }) {
  const received = await request.json();
  await delay(50);

  return HttpResponse.json({
    method: request.method,
    received,
  });
}

export const server = setupServer(
  http.get(API_URL, listResponse),
  http.delete(API_URL, listResponse),
  http.post(API_URL, echoResponse),
  http.put(API_URL, echoResponse),
);