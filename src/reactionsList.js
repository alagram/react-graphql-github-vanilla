import React from "react";

const ReactionsList = ({ contentCountMap, issueId, onIssueReaction }) => {
  const renderVal = Object.keys(contentCountMap).map((content, idx) => (
    <React.Fragment key={idx}>
      <p>
        {contentCountMap[content]} {content} given
        <button type="button" onClick={() => onIssueReaction(issueId, content)}>
          Give {content}
        </button>
      </p>
    </React.Fragment>
  ));

  return renderVal;
};

export default ReactionsList;
