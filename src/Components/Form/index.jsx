import { useState } from 'react';

import './Form.scss';

/**
 * Collects request values and submits them to App.
 * @param {object} props - Component properties.
 * @param {Function} props.handleApiCall - Receives the submitted request.
 * @returns {import('react').ReactElement} Request form.
 */
function Form({ handleApiCall }) {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [body, setBody] = useState('');

  const hasBody = method === 'POST' || method === 'PUT';

  /**
   * Sends the current form values to App without navigating.
   * @param {import('react').SyntheticEvent<HTMLFormElement>} event - Submit event.
   * @returns {void}
   */
  function handleSubmit(event) {
    event.preventDefault();

    handleApiCall({
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
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      </label>

      <fieldset className="methods">
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
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </label>
      )}

      <button type="submit">GO!</button>
    </form>
  );
}

export default Form;