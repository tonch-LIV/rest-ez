import './Form.scss';

/**
 * Displays request form and submits the starter's fixed parameters.
 * @param {object} props - Component properties.
 * @param {Function} props.handleApiCall - Callback that updates App state.
 * @returns {import('react').ReactElement} Request form.
 */
function Form({ handleApiCall }) {
  /**
   * Prevents navigation and sends mock request parameters to App.
   * @param {import('react').SyntheticEvent<HTMLFormElement>} event - Submit event.
   * @returns {void}
   */
  function handleSubmit(event) {
    event.preventDefault();

    const formData = {
      method: 'GET',
      url: 'https://pokeapi.co/api/v2/pokemon',
    };

    handleApiCall(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <span>URL: </span>
        <input name="url" type="text" />
        <button type="submit">GO!</button>
      </label>

      <label className="methods">
        <span id="get">GET</span>
        <span id="post">POST</span>
        <span id="put">PUT</span>
        <span id="delete">DELETE</span>
      </label>
    </form>
  );
}

export default Form;