import React from 'react';

import './App.scss';

// Let's talk about using index.js and some other name in the component folder.
// There's pros and cons for each way of doing this...
// OFFICIALLY, we have chosen to use the Airbnb style guide naming convention. 
// Why is this source of truth beneficial when spread across a global organization?
import Header from './Components/Header';
import Footer from './Components/Footer';
import Form from './Components/Form';
import Results from './Components/Results';

/**
 * Owns request state and coordinates the application components.
 * @extends React.Component
 */
class App extends React.Component {

  /**
 * Initializes response data and request parameters.
 * @param {object} props - Component properties.
 */
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      requestParams: {},
    };
  }

  /**
 * Stores submitted request parameters and a mock response.
 * @param {object} requestParams - Submitted request details.
 * @param {string} requestParams.method - HTTP method.
 * @param {string} requestParams.url - Endpoint URL.
 * @returns {void}
 */
  callApi = (requestParams) => {
    // mock output
    const data = {
      count: 2,
      results: [
        {name: 'fake thing 1', url: 'http://fakethings.com/1'},
        {name: 'fake thing 2', url: 'http://fakethings.com/2'},
      ],
    };
    this.setState({data, requestParams});
  }

  /**
 * Displays the application using its current state.
 * @returns {import('react').ReactElement} Application interface.
 */
  render() {
    return (
      <React.Fragment>
        <Header />
        <div>Request Method: {this.state.requestParams.method}</div>
        <div>URL: {this.state.requestParams.url}</div>
        <Form handleApiCall={this.callApi} />
        <Results data={this.state.data} />
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
