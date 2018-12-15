import React from "react";
import ReactionsList from "./reactionsList";

const Repository = ({
  repository,
  onFetchMoreIssues,
  onStarRepository,
  onIssueReaction
}) => {
  const issuesReactionCountMap = {};
  const { edges: issues } = repository.issues;

  issues.forEach(issue => {
    let innerObj = {};
    issue.node.reactions.edges.forEach(reaction => {
      let { content } = reaction.node;
      issuesReactionCountMap[issue.node.id] = innerObj;
      if (content in innerObj) {
        issuesReactionCountMap[issue.node.id][content]++;
      } else {
        issuesReactionCountMap[issue.node.id][content] = 1;
      }
    });
  });

  return (
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
              <ReactionsList
                key={issue.node.id}
                contentCountMap={issuesReactionCountMap[issue.node.id]}
                issueId={issue.node.id}
                onIssueReaction={onIssueReaction}
              />
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
};

export default Repository;
