import React, { Component } from "react";
import axios from "axios";
import { GET_ORGANIZATION } from "./queries";

const axiosGithubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`
  }
});

const TITLE = "React GraphQL Github Client";

class App extends Component {
  state = {
    path: "the-road-to-learn-react/the-road-to-learn-react"
  };

  componentDidMount() {
    this.onFetchFromGuthub();
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  };

  onSubmit = event => {
    // fetch data

    event.preventDefault();
  };

  onFetchFromGuthub = () => {
    axiosGithubGraphQL
      .post("", { query: GET_ORGANIZATION })
      .then(result => console.log(result));
  };

  render() {
    const { path } = this.state;
    return (
      <div>
        <h1>{TITLE}</h1>

        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">Show open issues for https://github.com/</label>
          <input
            id="url"
            type="text"
            value={path}
            onChange={this.onChange}
            style={{ width: "300px" }}
          />
          <button type="submit">Search</button>
        </form>
      </div>
    );
  }
}

export default App;
