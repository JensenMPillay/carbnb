import { createYoga } from "graphql-yoga";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { supabaseContext } from "./context";
import { schema } from "./schema";

/**
 * Defines a handler function for the GraphQL API endpoint with schema, context, endpoint and correct req/res configuration.
 * @returns The response for the GraphQL API endpoint.
 */
const { handleRequest } = createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  schema,
  context: supabaseContext,
  // Configure Yoga to use the correct endpoint
  graphqlEndpoint: "/api/graphql",
  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Request: NextRequest, Response: NextResponse },
});

export {
  handleRequest as GET,
  handleRequest as OPTIONS,
  handleRequest as POST,
};
