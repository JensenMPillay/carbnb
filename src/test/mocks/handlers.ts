import { graphql, HttpResponse } from "msw";

const allPosts = new Map([
  [
    "e82f332c-a4e7-4463-b440-59bc91792634",
    {
      id: "e82f332c-a4e7-4463-b440-59bc91792634",
      title: "Introducing a new JavaScript runtime",
    },
  ],
  [
    "64734573-ce54-435b-8528-106ac03a0e11",
    {
      id: "64734573-ce54-435b-8528-106ac03a0e11",
      title: "Common software engineering patterns",
    },
  ],
]);

export const handlers = [
  graphql.query("ListPosts", () => {
    return HttpResponse.json({
      data: {
        // Convert all posts to an array
        // and return as the "posts" root-level property.
        posts: Array.from(allPosts.values()),
      },
    });
  }),
  graphql.mutation("CreatePost", ({ variables }) => {
    // Read the "post" variable on the mutation.
    const { post } = variables;

    // Push the new post to the list of all posts.
    allPosts.set(post.id, post);

    // Respond with the body matching the mutation.
    return HttpResponse.json({
      data: {
        createPost: {
          id: post.id,
        },
      },
    });
  }),
  graphql.mutation("DeletePost", ({ variables }) => {
    const { postId } = variables;
    const deletedPost = allPosts.get(postId);

    // Respond with a GraphQL error when trying
    // to delete a post that doesn't exist.
    if (!deletedPost) {
      return HttpResponse.json({
        errors: [
          {
            message: `Cannot find post with ID "${postId}"`,
          },
        ],
      });
    }

    allPosts.delete(postId);

    return HttpResponse.json({
      data: {
        deletePost: deletedPost,
      },
    });
  }),
];
