import prisma from "@/prisma/prisma";
import { Category, FuelType, Transmission } from "@prisma/client";
import { createGraphQLError } from "graphql-yoga";
import { builder } from "../builder";

// Category
builder.enumType(Category, {
  name: "Category",
});

// Transmission
builder.enumType(Transmission, {
  name: "Transmission",
});

// Fuel Type
builder.enumType(FuelType, {
  name: "FuelType",
});

// Car Object
builder.prismaObject("Car", {
  fields: (t) => ({
    id: t.exposeID("id"),
    category: t.expose("category", { type: Category }),
    brand: t.exposeString("brand"),
    model: t.exposeString("model"),
    year: t.exposeInt("year", { nullable: true }),
    transmission: t.expose("transmission", { type: Transmission }),
    fuelType: t.expose("fuelType", { type: FuelType }),
    pricePerDay: t.exposeFloat("pricePerDay"),
    available: t.exposeBoolean("available"),
    user: t.relation("User"),
    location: t.relation("Location"),
    bookings: t.relation("bookings"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("updatedAt", { type: "Date" }),
  }),
});

// GET Route
builder.queryField("getCar", (t) =>
  t.prismaField({
    type: "Car",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user)
        throw createGraphQLError(
          "You have to be logged in to perform this action.",
        );

      const dbCar = await prisma.car.findUnique({
        ...query,
        where: {
          id: args.id,
        },
      });

      if (!dbCar) throw createGraphQLError("Car does not exist.");

      return dbCar;
    },
  }),
);

// POST Route
builder.mutationField("registerCar", (t) =>
  t.prismaField({
    type: "Car",
    args: {
      category: t.arg({ type: Category, required: true }),
      brand: t.arg.string({ required: true }),
      model: t.arg.string({ required: true }),
      year: t.arg.int({ required: false }),
      transmission: t.arg({ type: Transmission, required: true }),
      fuelType: t.arg({ type: FuelType, required: true }),
      pricePerDay: t.arg.float({ required: true }),
      available: t.arg.boolean({ required: false }),
      locationId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user)
        throw createGraphQLError(
          "You have to be logged in to perform this action.",
        );

      const dbUser = await prisma.user.findUnique({
        ...query,
        where: {
          id: (await ctx).user?.id,
        },
      });

      if (!dbUser) throw createGraphQLError("User does not exists.");

      const dbLocation = await prisma.location.findUnique({
        where: {
          id: args.locationId,
        },
      });

      if (!dbLocation) throw createGraphQLError("Location does not exists.");

      const carPrisma = await prisma.car.create({
        ...query,
        data: {
          category: args.category,
          brand: args.brand,
          model: args.model,
          year: args.year ?? undefined,
          transmission: args.transmission,
          fuelType: args.fuelType,
          pricePerDay: args.pricePerDay,
          available: args.available ?? false,
          userId: dbUser.id,
          locationId: dbLocation.id,
        },
      });

      if (!carPrisma)
        throw createGraphQLError(
          "An error occurred while updating the car information.",
        );

      return carPrisma;
    },
  }),
);

// POST Route
builder.mutationField("updateCar", (t) =>
  t.prismaField({
    type: "Car",
    args: {
      id: t.arg.int({ required: true }),
      category: t.arg({ type: Category, required: false }),
      brand: t.arg.string({ required: false }),
      model: t.arg.string({ required: false }),
      year: t.arg.int({ required: false }),
      transmission: t.arg({ type: Transmission, required: false }),
      fuelType: t.arg({ type: FuelType, required: false }),
      pricePerDay: t.arg.float({ required: false }),
      available: t.arg.boolean({ required: false }),
      locationId: t.arg.string({ required: false }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user)
        throw createGraphQLError(
          "You have to be logged in to perform this action.",
        );

      const dbUser = await prisma.user.findUnique({
        ...query,
        where: {
          id: (await ctx).user?.id,
        },
      });

      if (!dbUser) throw createGraphQLError("User does not exist.");

      const dbCar = await prisma.car.findUnique({
        ...query,
        where: {
          id: args.id,
        },
      });

      if (!dbCar) throw createGraphQLError("Car does not exist.");

      const dbLocation = args.locationId
        ? await prisma.location.findUnique({
            where: {
              id: args.locationId,
            },
          })
        : null;

      const carPrisma = await prisma.car.update({
        ...query,
        where: {
          id: args.id,
        },
        data: {
          category: args.category ?? undefined,
          brand: args.brand ?? undefined,
          model: args.model ?? undefined,
          year: args.year ?? undefined,
          transmission: args.transmission ?? undefined,
          fuelType: args.fuelType ?? undefined,
          pricePerDay: args.pricePerDay ?? undefined,
          available: args.available ?? undefined,
          userId: dbUser.id,
          locationId: dbLocation?.id ?? undefined,
        },
      });

      if (!carPrisma)
        throw createGraphQLError(
          "An error occurred while updating the car information.",
        );

      return carPrisma;
    },
  }),
);

// POST Route
builder.mutationField("deleteCar", (t) =>
  t.prismaField({
    type: "Car",
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user)
        throw createGraphQLError(
          "You have to be logged in to perform this action.",
        );

      const dbUser = await prisma.user.findUnique({
        ...query,
        where: {
          id: (await ctx).user?.id,
        },
      });

      if (!dbUser) throw createGraphQLError("User does not exist.");

      const carPrisma = await prisma.car.delete({
        ...query,
        where: {
          id: args.id,
        },
      });

      if (!carPrisma)
        throw createGraphQLError("An error occurred while deleting the car.");

      return carPrisma;
    },
  }),
);
