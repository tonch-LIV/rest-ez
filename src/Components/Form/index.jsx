import { useState } from 'react';

import './Form.scss';

/**
 * Collects request values and performs a simulated request.
 * @param {object} props - Component properties.
 * @param {Function} props.onRequestStart - Receives submitted parameters.
 * @param {Function} props.onRequestComplete - Receives the mock response.
 * @param {boolean} props.loading - Whether a request is running.
 * @returns {import('react').ReactElement} Request form.
 */
function Form({ onRequestStart, onRequestComplete, loading }) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');

  const hasBody = method === 'POST' || method === 'PUT';

  /**
   * Submits current values and waits for a simulated response.
   * @param {import('react').SyntheticEvent<HTMLFormElement>} event - Submit event.
   * @returns {Promise<void>} Resolves when the mock request finishes.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const params = {
      method,
      url,
      body: hasBody ? body : null,
    };

    onRequestStart(params);

    await new Promise((resolve) => setTimeout(resolve, 500));

    onRequestComplete({
      headers: {
        'content-type': 'application/json',
      },
      body: {
        count: 2,
        results: [
          { name: 'fake thing 1', url: 'http://fakethings.com/1' },
          { name: 'fake thing 2', url: 'http://fakethings.com/2' },
        ],
      },
    });
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <label htmlFor="request-url">
        URL
        <input
          id="request-url"
          name="url"
          type="url"
          required
          disabled={loading}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      </label>

      <fieldset className="methods" disabled={loading}>
        <legend>Method</legend>

        {['GET', 'POST', 'PUT', 'DELETE'].map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={method === option}
            className={method === option ? 'active' : ''}
            onClick={() => setMethod(option)}
          >
            {option}
          </button>
        ))}
      </fieldset>

      {hasBody && (
        <label htmlFor="request-body">
          JSON body
          <textarea
            id="request-body"
            name="body"
            rows={6}
            disabled={loading}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </label>
      )}

      <button type="submit" disabled={loading}>GO!</button>
    </form>
  );
}

export default Form;