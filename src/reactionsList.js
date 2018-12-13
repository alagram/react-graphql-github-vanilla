import React from "react";

const ReactionsList = ({ reaction, issue, onIssueReaction }) => {
  const { viewerHasReacted } = reaction.node.reactable.reactions;
  const { content } = reaction.node;

  return (
    <React.Fragment>
      <li>
        {content} &nbsp;
        <button
          type="button"
          onClick={() => onIssueReaction(issue.node.id, content)}
        >
          Give {content}
        </button>
      </li>
    </React.Fragment>
  );
};

export default ReactionsList;
