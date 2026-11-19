import { useState } from 'react';

import './Form.scss';

/**
 * Collects request values and submits them to App.
 * @param {object} props - Component properties.
 * @param {Function} props.onSubmitRequest - Receives submitted values.
 * @param {boolean} props.loading - Whether a request is running.
 * @returns {import('react').ReactElement} Request form.
 */
function Form({ onSubmitRequest, loading }) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');

  const hasBody = method === 'POST' || method === 'PUT';

  /**
   * Passes current form values to App without navigating.
   * @param {import('react').SyntheticEvent<HTMLFormElement>} event - Submit event.
   * @returns {void}
   */
  function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    onSubmitRequest({
      method,
      url,
      body: hasBody ? body : null,
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