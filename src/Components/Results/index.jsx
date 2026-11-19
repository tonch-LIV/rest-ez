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

          <h3>Headers</h3>
          <pre>{JSON.stringify(data.headers, null, 2)}</pre>

          <h3>Body</h3>
          <pre>{JSON.stringify(data.body, null, 2)}</pre>
        </>
      )}
    </section>
  );
}

export default Results;