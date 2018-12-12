import React from "react";
import Repository from "./repository";

const Organization = ({
  organization,
  errors,
  onFetchMoreIssues,
  onStarRepository,
  onIssueReaction
}) => {
  if (errors) {
    return (
      <p>
        <strong>Something went wrong:</strong>
        {errors.map(error => error.messgae).join(" ")}
      </p>
    );
  }

  return (
    <div>
      <p>
        <strong>Issues from Organization:</strong>
        <a href={organization.url}>{organization.name}</a>
      </p>
      <Repository
        repository={organization.repository}
        onFetchMoreIssues={onFetchMoreIssues}
        onStarRepository={onStarRepository}
        onIssueReaction={onIssueReaction}
      />
    </div>
  );
};

export default Organization;
