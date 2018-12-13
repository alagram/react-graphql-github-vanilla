export const GET_ISSUES_OF_REPOSITORY = `
  query ($organization: String!, $repository: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        id
        name
        url
        stargazers {
          totalCount
        }
        viewerHasStarred
        issues(first: 3, after: $cursor, states: [OPEN]) {
          edges {
            node {
              id
              title
              url
              reactions(first: 3) {
                edges {
                  node {
                    id
                    content
                    reactable {
                      reactions(content: THUMBS_UP) {
                        viewerHasReacted
                      }
                    }
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

export const ADD_STAR = `
  mutation ($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

export const REMOVE_STAR = `
  mutation ($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

export const ADD_REACTION = `
  mutation ($issueId: ID!, $reactionContent: String!) {
    addReaction(input: { subjectId: $issueId, content: $reactionContent }) {
      reaction {
        id
        content
        reactable {
          id
        }
      }
    }
  }
`;
