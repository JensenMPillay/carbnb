import { supabaseContext } from "@/src/context/graphql";
import { createYoga } from "graphql-yoga";
import { NextApiRequest, NextApiResponse } from "next";
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
  fetchAPI: { Request: Request, Response: Response },
});

export {
  handleRequest as GET,
  handleRequest as OPTIONS,
  handleRequest as POST,
};
