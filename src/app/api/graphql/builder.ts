import PrismaTypes from "@/prisma/pothos-types";
import prisma from "@/prisma/prisma";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import RelayPlugin from "@pothos/plugin-relay";
import { DateTimeResolver } from "graphql-scalars";
import { supabaseContext } from "./context";

/**
 * Defines a schema builder instance for GraphQL schema construction using Pothos, with Prisma integration, Relay plugin, and scalar type definitions.
 */
export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: ReturnType<typeof supabaseContext>;
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {},
  prisma: {
    client: prisma,
    onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
  },
});

// Test
// builder.queryType({
//   description: "The query root type.",
//   fields: (t) => ({
//     ok: t.boolean({ resolve: () => true }),
//   }),
// });

// Initialization of Queries & Mutations
builder.queryType({});

builder.mutationType({});

// => Handle Date
builder.addScalarType("Date", DateTimeResolver, {});
