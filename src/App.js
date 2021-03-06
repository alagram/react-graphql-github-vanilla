import React, { Component } from "react";
import axios from "axios";
import {
  GET_ISSUES_OF_REPOSITORY,
  ADD_STAR,
  REMOVE_STAR,
  ADD_REACTION
} from "./queries";
import Organization from "./organization";

const axiosGithubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${
      process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
    }`
  }
});

const TITLE = "React GraphQL Github Client";

const getIssuesOfRepository = (path, cursor) => {
  const [organization, repository] = path.split("/");

  return axiosGithubGraphQL.post("", {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { organization, repository, cursor }
  });
};

const resolveIssuesQuery = (queryResult, cursor) => state => {
  const { data, errors } = queryResult.data;

  if (!cursor) {
    return {
      organization: data.organization,
      errors
    };
  }

  const { edges: oldIssues } = state.organization.repository.issues;
  const { edges: newIssues } = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    organization: {
      ...data.organization,
      repository: {
        ...data.organization.repository,
        issues: {
          ...data.organization.repository.issues,
          edges: updatedIssues
        }
      }
    },
    errors
  };
};

const addStarToRepository = repositoryId => {
  return axiosGithubGraphQL.post("", {
    query: ADD_STAR,
    variables: { repositoryId }
  });
};

const removeStarFromRepository = repositoryId => {
  return axiosGithubGraphQL.post("", {
    query: REMOVE_STAR,
    variables: { repositoryId }
  });
};

const addReactionToIssue = (issueId, reactionContent) => {
  return axiosGithubGraphQL.post("", {
    query: ADD_REACTION,
    variables: { issueId, reactionContent }
  });
};

const resolveAddReactionMutation = mutationResult => state => {
  // const { data } = mutationResult.data;

  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        issues: { ...state.organization.repository.issues }
      }
    }
  };
};

const resolveAddStarMutation = mutationResult => state => {
  const { viewerHasStarred } = mutationResult.data.data.addStar.starrable;

  const { totalCount } = state.organization.repository.stargazers;

  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount + 1
        }
      }
    }
  };
};

const resolveRemoveStarMutation = mutationResult => state => {
  const { viewerHasStarred } = mutationResult.data.data.removeStar.starrable;

  const { totalCount } = state.organization.repository.stargazers;

  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount - 1
        }
      }
    }
  };
};

class App extends Component {
  state = {
    path: "the-road-to-learn-react/the-road-to-learn-react",
    organization: null,
    errors: null
  };

  componentDidMount() {
    this.onFetchFromGuthub(this.state.path);
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  };

  onSubmit = event => {
    this.onFetchFromGuthub(this.state.path);

    event.preventDefault();
  };

  onFetchFromGuthub = async (path, cursor) => {
    try {
      const queryResult = await getIssuesOfRepository(path, cursor);

      this.setState(resolveIssuesQuery(queryResult, cursor));
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  onFetchMoreIssues = () => {
    const { endCursor } = this.state.organization.repository.issues.pageInfo;

    this.onFetchFromGuthub(this.state.path, endCursor);
  };

  onStarRepository = async (repositoryId, viewerHasStarred) => {
    if (viewerHasStarred) {
      const mutationResult = await removeStarFromRepository(repositoryId);
      this.setState(resolveRemoveStarMutation(mutationResult));
    } else {
      const mutationResult = await addStarToRepository(repositoryId);
      this.setState(resolveAddStarMutation(mutationResult));
    }
  };

  onIssueReaction = async (issueId, reactionContent) => {
    const mutationResult = await addReactionToIssue(issueId, reactionContent);
    this.setState(resolveAddReactionMutation(mutationResult));
  };

  render() {
    const { path, organization, errors } = this.state;

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

        <hr />

        {organization ? (
          <Organization
            organization={organization}
            errors={errors}
            onFetchMoreIssues={this.onFetchMoreIssues}
            onStarRepository={this.onStarRepository}
            onIssueReaction={this.onIssueReaction}
          />
        ) : (
          <p>No information yet...</p>
        )}
      </div>
    );
  }
}

export default App;
