import { createYoga } from "graphql-yoga";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { supabaseContext } from "./context";
import { schema } from "./schema";

// Router
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
