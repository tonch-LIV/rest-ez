import { expect, test } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';

import App from './App';

test('renders safely before a response exists and defaults to GET', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: 'RESTy' }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'GET' }),
  ).toHaveAttribute('aria-pressed', 'true');

  expect(
    screen.getByRole('button', { name: 'GO!' }),
  ).toBeEnabled();

  expect(
    screen.queryByRole('region', { name: 'Response' }),
  ).not.toBeInTheDocument();

  expect(
    screen.queryByLabelText('JSON body'),
  ).not.toBeInTheDocument();
});

test.each(['GET', 'DELETE'])(
  'submits %s and displays loading followed by response headers and body',
  async (method) => {
    render(<App />);

    const urlInput = screen.getByLabelText('URL');
    const goButton = screen.getByRole('button', { name: 'GO!' });

    fireEvent.change(urlInput, {
      target: { value: 'https://example.com/items' },
    });

    fireEvent.click(screen.getByRole('button', { name: method }));
    fireEvent.click(goButton);

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
    expect(urlInput).toBeDisabled();
    expect(goButton).toBeDisabled();

    expect(
      screen.getByRole('button', { name: method }),
    ).toBeDisabled();

    const summary = screen.getByRole('region', {
      name: 'Request summary',
    });

    expect(
      within(summary).getByText(`Request Method: ${method}`),
    ).toBeInTheDocument();

    expect(
      within(summary).getByText('URL: https://example.com/items'),
    ).toBeInTheDocument();

    const response = await screen.findByRole(
      'region',
      { name: 'Response' },
      { timeout: 2000 },
    );

    expect(
      within(response).getByRole('heading', { name: 'Headers' }),
    ).toBeInTheDocument();

    expect(
      within(response).getByRole('heading', { name: 'Body' }),
    ).toBeInTheDocument();

    const headers = within(response).getByText(/"content-type"/);
    const body = within(response).getByText(/fake thing 1/);

    expect(headers.textContent).toContain(
      '\n  "content-type": "application/json"\n',
    );

    expect(body).toHaveTextContent('"count": 2');
    expect(body).toHaveTextContent('fake thing 2');

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(goButton).toBeEnabled();
    expect(urlInput).toBeEnabled();
  },
);

test.each(['POST', 'PUT'])(
  'submits a %s body and excludes it from a later GET request',
  async (method) => {
    render(<App />);

    const urlInput = screen.getByLabelText('URL');
    const goButton = screen.getByRole('button', { name: 'GO!' });
    const requestBody = '{"name":"practice"}';

    fireEvent.change(urlInput, {
      target: { value: 'https://example.com/items' },
    });

    fireEvent.click(screen.getByRole('button', { name: method }));

    expect(
      screen.getByRole('button', { name: method }),
    ).toHaveAttribute('aria-pressed', 'true');

    const bodyInput = screen.getByLabelText('JSON body');

    fireEvent.change(bodyInput, {
      target: { value: requestBody },
    });

    fireEvent.click(goButton);

    expect(bodyInput).toBeDisabled();

    const summary = screen.getByRole('region', {
      name: 'Request summary',
    });

    expect(
      within(summary).getByText(requestBody),
    ).toBeInTheDocument();

    await screen.findByRole(
      'region',
      { name: 'Response' },
      { timeout: 2000 },
    );

    fireEvent.change(urlInput, {
      target: { value: 'https://example.com/changed' },
    });

    expect(
      within(summary).getByText('URL: https://example.com/items'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'GET' }));

    expect(
      screen.queryByLabelText('JSON body'),
    ).not.toBeInTheDocument();

    fireEvent.click(goButton);

    expect(
      screen.queryByRole('region', { name: 'Response' }),
    ).not.toBeInTheDocument();

    expect(
      within(summary).queryByRole('heading', { name: 'Request body' }),
    ).not.toBeInTheDocument();

    expect(
      within(summary).getByText('URL: https://example.com/changed'),
    ).toBeInTheDocument();

    await screen.findByRole(
      'region',
      { name: 'Response' },
      { timeout: 2000 },
    );
  },
);