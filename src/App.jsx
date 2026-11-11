import { useState } from 'react';

import './App.scss';

import Header from './Components/Header';
import Footer from './Components/Footer';
import Form from './Components/Form';
import Results from './Components/Results';

/**
 * Owns the submitted request and mock response.
 * @returns {import('react').ReactElement} Application interface.
 */
function App() {
  const [data, setData] = useState(null);
  const [requestParams, setRequestParams] = useState(null);
  

  /**
   * Stores submitted values and generates a mock response.
   * @param {object} params - Submitted request.
   * @param {string} params.method - Selected HTTP method.
   * @param {string} params.url - Entered endpoint.
   * @param {string|null} params.body - JSON text for POST or PUT.
   * @returns {void}
   */
  function callApi(params) {
    setRequestParams(params);

    setData({
      count: 2,
      results: [
        { name: 'fake thing 1', url: 'http://fakethings.com/1' },
        { name: 'fake thing 2', url: 'http://fakethings.com/2' },
      ],
    });
  }

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

      <Form handleApiCall={callApi} />
      <Results data={data} />
      <Footer />
    </>
  );
}

export default App;