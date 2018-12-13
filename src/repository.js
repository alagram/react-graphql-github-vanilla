import React from "react";
import ReactionsList from "./reactionsList";

const Repository = ({
  repository,
  onFetchMoreIssues,
  onStarRepository,
  onIssueReaction
}) => (
  <div>
    <p>
      <strong>In Repository: </strong>
      <a href={repository.url}>{repository.name}</a>
    </p>

    <button
      type="button"
      onClick={() =>
        onStarRepository(repository.id, repository.viewerHasStarred)
      }
    >
      {repository.stargazers.totalCount} &nbsp;
      {repository.viewerHasStarred ? "Unstar" : "Star"}
    </button>

    <ul>
      {repository.issues.edges.map(issue => (
        <li key={issue.node.id}>
          <a href={issue.node.url}>{issue.node.title}</a> &nbsp;
          <ul>
            {issue.node.reactions.edges.map(reaction => (
              <ReactionsList
                key={reaction.node.id}
                reaction={reaction}
                issue={issue}
                onIssueReaction={onIssueReaction}
              />
            ))}
          </ul>
        </li>
      ))}
    </ul>

    <hr />

    {repository.issues.pageInfo.hasNextPage && (
      <button onClick={onFetchMoreIssues}>More</button>
    )}
  </div>
);

export default Repository;
