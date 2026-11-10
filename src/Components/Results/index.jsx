import './Results.scss';

/**
 * Displays formatted mock response data.
 * @param {object} props - Component properties.
 * @param {object|null} props.data - Response data, or null before submission.
 * @returns {import('react').ReactElement} Results section.
 */
function Results({ data }) {
  return (
    <section className="results">
      <pre>{data ? JSON.stringify(data, undefined, 2) : null}</pre>
    </section>
  );
}

export default Results;