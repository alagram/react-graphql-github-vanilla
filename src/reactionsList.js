import React from "react";

const ReactionsList = ({ reaction }) => {
  const { viewerHasReacted } = reaction.node.reactable.reactions;
  return <li>{reaction.node.content}</li>;
};

export default ReactionsList;
