import PrismaTypes from "@/prisma/pothos-types";
import prisma from "@/prisma/prisma";
import { supabaseContext } from "@/src/context/supabaseContext";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import RelayPlugin from "@pothos/plugin-relay";
import { DateTimeResolver } from "graphql-scalars";

// Sync Builder to Prisma
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
