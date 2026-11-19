import { expect, test, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import App from '../App';
import { API_URL, responseBody, server } from '../test/server';

/**
 * Enters request values and submits through the rendered form.
 * @param {object} options - Form values.
 * @param {string} options.method - HTTP method.
 * @param {string} options.url - Endpoint URL.
 * @param {string} [options.body] - Optional JSON text.
 * @returns {void}
 */
function submitRequest({
  method = 'GET',
  url = API_URL,
  body,
} = {}) {
  fireEvent.change(screen.getByLabelText('URL'), {
    target: { value: url },
  });

  fireEvent.click(screen.getByRole('button', { name: method }));

  if (body !== undefined) {
    fireEvent.change(screen.getByLabelText('JSON body'), {
      target: { value: body },
    });
  }

  fireEvent.click(screen.getByRole('button', { name: 'GO!' }));
}

test('renders safely before submission and defaults to GET', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: 'RESTy' }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'GET' }),
  ).toHaveAttribute('aria-pressed', 'true');

  expect(
    screen.queryByRole('region', { name: 'Response' }),
  ).not.toBeInTheDocument();

  expect(
    screen.queryByLabelText('JSON body'),
  ).not.toBeInTheDocument();
});

test.each(['GET', 'DELETE'])(
  'submits %s and displays the complete response after loading',
  async (method) => {
    render(<App />);

    submitRequest({ method });

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');

    expect(screen.getByLabelText('URL')).toBeDisabled();

    expect(
      screen.getByRole('button', { name: 'GO!' }),
    ).toBeDisabled();

    expect(
      screen.getByRole('button', { name: method }),
    ).toBeDisabled();

    const body = await screen.findByRole('region', { name: 'Body' });
    const headers = screen.getByRole('region', { name: 'Headers' });

    expect(screen.getByText('HTTP Status: 200')).toBeInTheDocument();

    expect(headers).toHaveTextContent('application/json');
    expect(headers).toHaveTextContent('msw');

    expect(body).toHaveTextContent('fake thing 1');
    expect(body).toHaveTextContent('fake thing 2');
    expect(body).toHaveTextContent('count');
    expect(body).toHaveTextContent('next');
    expect(body).toHaveTextContent('previous');
    expect(body).toHaveTextContent(responseBody.next);

    const summary = screen.getByRole('region', {
      name: 'Request summary',
    });

    expect(summary).toHaveTextContent(`Request Method: ${method}`);
    expect(summary).toHaveTextContent(`URL: ${API_URL}`);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'GO!' }),
    ).toBeEnabled();
  },
);

test.each(['POST', 'PUT'])(
  'sends a %s JSON body and excludes it from a later GET',
  async (method) => {
    render(<App />);

    submitRequest({
      method,
      body: '{"name":"practice"}',
    });

    expect(screen.getByLabelText('JSON body')).toBeDisabled();

    const response = await screen.findByRole('region', { name: 'Body' });

    expect(response).toHaveTextContent('received');
    expect(response).toHaveTextContent('practice');
    expect(response).toHaveTextContent(method);

    const summary = screen.getByRole('region', {
      name: 'Request summary',
    });

    expect(
      within(summary).getByText('{"name":"practice"}'),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('URL'), {
      target: { value: `${API_URL}?page=2` },
    });

    expect(summary).toHaveTextContent(`URL: ${API_URL}`);
    expect(summary).not.toHaveTextContent(`URL: ${API_URL}?page=2`);

    fireEvent.click(screen.getByRole('button', { name: 'GET' }));

    expect(
      screen.queryByLabelText('JSON body'),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'GO!' }));

    expect(
      screen.queryByRole('region', { name: 'Body' }),
    ).not.toBeInTheDocument();

    expect(
      within(summary).queryByRole('heading', { name: 'Request body' }),
    ).not.toBeInTheDocument();

    const getResponse = await screen.findByRole('region', {
      name: 'Body',
    });

    expect(getResponse).toHaveTextContent('fake thing 1');
    expect(getResponse).not.toHaveTextContent('received');
    expect(summary).toHaveTextContent(`URL: ${API_URL}?page=2`);
  },
);

test('rejects invalid JSON before calling fetch', async () => {
  const fetchSpy = vi.spyOn(globalThis, 'fetch');

  render(<App />);

  submitRequest({
    method: 'POST',
    body: '{bad json}',
  });

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Invalid request:',
  );

  expect(fetchSpy).not.toHaveBeenCalled();

  expect(
    screen.getByRole('button', { name: 'GO!' }),
  ).toBeEnabled();
});

test('displays an HTTP error and its response body', async () => {
  server.use(
    http.get(API_URL, () => (
      HttpResponse.json(
        { message: 'Temporarily unavailable' },
        { status: 503 },
      )
    )),
  );

  render(<App />);
  submitRequest();

  expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 503');

  expect(
    screen.getByRole('region', { name: 'Body' }),
  ).toHaveTextContent('Temporarily unavailable');
});

test('displays a connection failure and ends loading', async () => {
  server.use(
    http.get(API_URL, () => HttpResponse.error()),
  );

  render(<App />);
  submitRequest();

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Request failed:',
  );

  expect(screen.queryByRole('status')).not.toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'GO!' }),
  ).toBeEnabled();
});