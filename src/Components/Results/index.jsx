import JsonView from '@uiw/react-json-view';

import './Results.scss';

/**
 * Displays request status, errors, and complete response data.
 * @param {object} props - Component properties.
 * @param {object|null} props.data - Response status, headers, and body.
 * @param {boolean} props.loading - Whether a request is running.
 * @param {string|null} props.error - Request error message.
 * @returns {import('react').ReactElement|null} Request output.
 */
function Results({ data, loading, error }) {
  if (loading) {
    return <p role="status">Loading...</p>;
  }

  if (!data && !error) {
    return null;
  }

  return (
    <section className="results" aria-label="Response">
      <h2>Response</h2>

      {error && <p role="alert">{error}</p>}

      {data && (
        <>
          <div>HTTP Status: {data.status}</div>

          <section aria-labelledby="response-headers-heading">
            <h3 id="response-headers-heading">Headers</h3>
            <JsonView
              className="response-json"
              value={data.headers}
              collapsed={false}
              shortenTextAfterLength={0}
              displayDataTypes={false}
              enableClipboard={false}
            />
          </section>

          <section aria-labelledby="response-body-heading">
            <h3 id="response-body-heading">Body</h3>

            {data.body !== null && typeof data.body === 'object' ? (
              <JsonView
                className="response-json"
                value={data.body}
                collapsed={false}
                shortenTextAfterLength={0}
                displayDataTypes={false}
                enableClipboard={false}
              />
            ) : (
              <pre>{JSON.stringify(data.body, null, 2)}</pre>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default Results;