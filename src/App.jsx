import { useEffect, useState } from 'react';

import './App.scss';

import Header from './Components/Header';
import Footer from './Components/Footer';
import Form from './Components/Form';
import Results from './Components/Results';

/**
 * Coordinates submitted requests, live responses, and request status.
 * @returns {import('react').ReactElement} Application interface.
 */
function App() {
  const [data, setData] = useState(null);
  const [requestParams, setRequestParams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Validates submitted values and schedules a request through state.
   * @param {object} params - Submitted request.
   * @param {string} params.url - Endpoint URL.
   * @param {string} params.method - HTTP method.
   * @param {string|null} params.body - Optional JSON request text.
   * @returns {void}
   */
  function submitRequest(params) {
    setData(null);
    setError(null);

    try {
      const target = new URL(params.url);

      if (!['http:', 'https:'].includes(target.protocol)) {
        throw new Error('Use an HTTP or HTTPS URL.');
      }

      if (params.body?.trim()) {
        JSON.parse(params.body);
      }

      setRequestParams({ ...params });
      setLoading(true);
    } catch (cause) {
      setError(`Invalid request: ${cause.message}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!requestParams) {
      return;
    }

    const controller = new AbortController();

    /**
     * Fetches and stores the complete response for this submitted request.
     * @returns {Promise<void>} Resolves after request processing finishes.
     */
    async function sendRequest() {
      try {
        const options = {
          method: requestParams.method,
          signal: controller.signal,
        };

        if (requestParams.body?.trim()) {
          options.headers = {
            'Content-Type': 'application/json',
          };
          options.body = requestParams.body;
        }

        const response = await fetch(requestParams.url, options);
        const text = await response.text();
        const contentType = response.headers.get('content-type') || '';

        const body = !text
          ? null
          : contentType.includes('json')
            ? JSON.parse(text)
            : text;

        if (controller.signal.aborted) {
          return;
        }

        setData({
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          body,
        });

        if (!response.ok) {
          setError(`Request returned HTTP ${response.status}.`);
        }
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(`Request failed: ${cause.message}`);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    sendRequest();

    return () => controller.abort();
  }, [requestParams]);

  return (
    <>
      <Header />

      {requestParams && (
        <section aria-label="Request summary">
          <h2>Request</h2>
          <div>Request Method: {requestParams.method}</div>
          <div>URL: {requestParams.url}</div>

          {requestParams.body !== null && (
            <>
              <h3>Request body</h3>
              <pre>{requestParams.body}</pre>
            </>
          )}
        </section>
      )}

      <Form onSubmitRequest={submitRequest} loading={loading} />
      <Results data={data} loading={loading} error={error} />
      <Footer />
    </>
  );
}

export default App;