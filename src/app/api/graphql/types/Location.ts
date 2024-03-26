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
    postalCode: t.exposeString("postalCode"),
    state: t.exposeString("state"),
    country: t.exposeString("country"),
    formatted_address: t.exposeString("formatted_address"),
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
    resolve: async (query, _parent, args) => {
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
      id: t.arg.string({ required: true }),
      latitude: t.arg.float({ required: true }),
      longitude: t.arg.float({ required: true }),
      address: t.arg.string({ required: true }),
      city: t.arg.string({ required: true }),
      postalCode: t.arg.string({ required: true }),
      state: t.arg.string({ required: true }),
      country: t.arg.string({ required: true }),
      formatted_address: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args) => {
      const dbLocation = await prisma.location.findUnique({
        where: {
          id: args.id,
        },
      });

      if (dbLocation) return dbLocation;

      const locationPrisma = await prisma.location.create({
        ...query,
        data: {
          id: args.id,
          latitude: args.latitude,
          longitude: args.longitude,
          address: args.address,
          city: args.city,
          postalCode: args.postalCode,
          state: args.state,
          country: args.country,
          formatted_address: args.formatted_address,
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
