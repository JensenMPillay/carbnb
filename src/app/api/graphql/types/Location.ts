import prisma from "@/prisma/prisma";
import { createGraphQLError } from "graphql-yoga";
import { builder } from "../builder";

// Location Object
builder.prismaObject("Location", {
  fields: (t) => ({
    id: t.exposeID("id"),
    latitude: t.exposeFloat("latitude", { nullable: true }),
    longitude: t.exposeFloat("longitude", { nullable: true }),
    address: t.exposeString("address"),
    city: t.exposeString("city"),
    country: t.exposeString("country"),
    cars: t.relation("cars"),
  }),
});

// GET Route
builder.queryField("getLocation", (t) =>
  t.prismaField({
    type: "Location",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const dbLocation = await prisma.location.findUnique({
        ...query,
        where: {
          id: args.id,
        },
      });

      if (!dbLocation) throw createGraphQLError("Location does not exist.");

      return dbLocation;
    },
  }),
);

// POST Route
builder.mutationField("registerLocation", (t) =>
  t.prismaField({
    type: "Location",
    args: {
      latitude: t.arg.float({ required: true }),
      longitude: t.arg.float({ required: true }),
      address: t.arg.string({ required: true }),
      city: t.arg.string({ required: true }),
      country: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const locationPrisma = await prisma.location.create({
        ...query,
        data: {
          latitude: args.latitude,
          longitude: args.longitude,
          address: args.address,
          city: args.city,
          country: args.country,
        },
      });

      if (!locationPrisma)
        throw createGraphQLError(
          "An error occurred while updating the location information.",
        );

      return locationPrisma;
    },
  }),
);
