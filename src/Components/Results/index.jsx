import './Results.scss';

/**
 * Displays loading status or formatted response data (headers and body).
 * @param {object} props - Component properties.
 * @param {object|null} props.data - Response data (headers and body), or null before submission.
 * @param {boolean} props.loading - depends if request is running
 * @returns {import('react').ReactElement|null} Results section; Status, response, or nothing.
 */
function Results({ data, loading }) {
  if (loading) {
    return <p role="status">Loading...</p>;
  }

  if (!data) {
    return null;
  }

  return (
    <section className="results" aria-label="Response">
      <h2>Response</h2>

      <h3>Headers</h3>
      <pre>{JSON.stringify(data.headers, null, 2)}</pre>

      <h3>Body</h3>
      <pre>{JSON.stringify(data.body, null, 2)}</pre>
    </section>
  );
}

export default Results;