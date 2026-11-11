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
  const [loading, setLoading] = useState(false);

  /**
   * Records a submitted request and starts the loading state.
   * @param {object} params - Submitted method, URL, and body.
   * @returns {void}
   */
  function startRequest(params) {
    setRequestParams(params);
    setData(null);
    setLoading(true);
  }

  /**
   * Stores the mock response and ends the loading state.
   * @param {object} response - Completed response.
   * @param {object} response.headers - Mock response headers.
   * @param {object} response.body - Mock response body.
   * @returns {void}
   */
  function completeRequest(response) {
    setData(response);
    setLoading(false);
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

      <Form
        onRequestStart={startRequest}
        onRequestComplete={completeRequest}
        loading={loading}
      />
      <Results data={data} loading={loading} />
      <Footer />
    </>
  );
}

export default App;