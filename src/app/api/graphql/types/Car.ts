import prisma from "@/prisma/prisma";
import { IMAGE_ANGLES, IMAGE_BUCKET } from "@/src/config/supabase";
import { getFileFromUrl } from "@/src/lib/utils";
import { Brand, Category, Color, FuelType, Transmission } from "@prisma/client";
import { randomUUID } from "crypto";
import { createGraphQLError } from "graphql-yoga";
import { builder } from "../builder";

// Category
builder.enumType(Category, {
  name: "Category",
});

// Brand
builder.enumType(Brand, {
  name: "Brand",
});

// Color
builder.enumType(Color, {
  name: "Color",
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
    brand: t.expose("brand", { type: Brand }),
    model: t.exposeString("model"),
    year: t.exposeInt("year"),
    primaryColor: t.expose("primaryColor", { type: Color }),
    trueColor: t.exposeString("trueColor"),
    transmission: t.expose("transmission", { type: Transmission }),
    fuelType: t.expose("fuelType", { type: FuelType }),
    imageUrl: t.exposeStringList("imageUrl"),
    pricePerDay: t.exposeInt("pricePerDay"),
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
      id: t.arg.string({ required: true }),
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
      brand: t.arg({ type: Brand, required: true }),
      model: t.arg.string({ required: true }),
      year: t.arg.int({ required: true }),
      primaryColor: t.arg({ type: Color, required: true }),
      trueColor: t.arg.string({ required: true }),
      transmission: t.arg({ type: Transmission, required: true }),
      fuelType: t.arg({ type: FuelType, required: true }),
      imageUrl: t.arg.string({ required: true }),
      pricePerDay: t.arg.int({ required: true }),
      available: t.arg.boolean({ required: false }),
      locationId: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user)
        throw createGraphQLError(
          "You have to be logged in to perform this action.",
        );

      const dbUser = await prisma.user.findUnique({
        where: {
          id: (await ctx).user?.id,
        },
      });

      if (!dbUser) throw createGraphQLError("User does not exist.");

      const dbLocation = await prisma.location.findUnique({
        where: {
          id: args.locationId,
        },
      });

      if (!dbLocation) throw createGraphQLError("Location does not exist.");

      // Car Id
      const carId = randomUUID();

      // Upload Files (Different Angles)
      const uploadedFileUrls = await Promise.all(
        IMAGE_ANGLES.map(async (angle) => {
          // Same URL
          const imageUrl = new URL(args.imageUrl);

          // Add Different Angle
          imageUrl.searchParams.append("angle", `${angle}`);

          // Get Blob
          const fileBlob = await getFileFromUrl(imageUrl);

          // Set Name
          const fileName = `${carId}/${angle}`;

          // Upload
          const uploadFile = await (await ctx).supabase?.storage
            .from(IMAGE_BUCKET)
            .upload(fileName, fileBlob, {
              upsert: true,
            });

          if (uploadFile?.error) {
            throw createGraphQLError(
              "An error occurred while uploading the car image.",
            );
          }

          // Get File URL
          const uploadedFileUrl = (await ctx).supabase?.storage
            .from(IMAGE_BUCKET)
            .getPublicUrl(fileName);

          if (!uploadedFileUrl) {
            throw createGraphQLError(
              "An error occurred while retrieving the car image url.",
            );
          }

          return uploadedFileUrl.data.publicUrl as string;
        }),
      );

      // Register Car
      const carPrisma = await prisma.car.create({
        ...query,
        data: {
          id: carId,
          category: args.category,
          brand: args.brand,
          model: args.model,
          year: args.year,
          primaryColor: args.primaryColor,
          trueColor: args.trueColor,
          transmission: args.transmission,
          fuelType: args.fuelType,
          imageUrl: uploadedFileUrls,
          pricePerDay: args.pricePerDay,
          available: args.available ?? true,
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
      id: t.arg.string({ required: true }),
      category: t.arg({ type: Category, required: false }),
      brand: t.arg({ type: Brand, required: false }),
      model: t.arg.string({ required: false }),
      year: t.arg.int({ required: false }),
      primaryColor: t.arg({ type: Color, required: false }),
      trueColor: t.arg.string({ required: false }),
      transmission: t.arg({ type: Transmission, required: false }),
      fuelType: t.arg({ type: FuelType, required: false }),
      imageUrl: t.arg.string({ required: false }),
      pricePerDay: t.arg.int({ required: false }),
      available: t.arg.boolean({ required: false }),
      locationId: t.arg.string({ required: false }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user)
        throw createGraphQLError(
          "You have to be logged in to perform this action.",
        );

      const dbUser = await prisma.user.findUnique({
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

      // Upload File
      let uploadedFileUrls: string[] = [];

      if (args.imageUrl) {
        // Upload Files (Different Angles)
        uploadedFileUrls = await Promise.all(
          IMAGE_ANGLES.map(async (angle) => {
            // Same URL
            const imageUrl = new URL(args.imageUrl as string);

            // Add Different Angle
            imageUrl.searchParams.append("angle", `${angle}`);

            // Get Blob
            const fileBlob = await getFileFromUrl(imageUrl);

            // Set Name
            const fileName = `${dbCar.id}/${angle}`;

            // Upload
            const uploadFile = await (await ctx).supabase?.storage
              .from(IMAGE_BUCKET)
              .upload(fileName, fileBlob, {
                upsert: true,
              });

            if (uploadFile?.error) {
              throw createGraphQLError(
                "An error occurred while uploading the car image.",
              );
            }

            // Get File URL
            const uploadedFileUrl = (await ctx).supabase?.storage
              .from(IMAGE_BUCKET)
              .getPublicUrl(fileName);

            if (!uploadedFileUrl) {
              throw createGraphQLError(
                "An error occurred while retrieving the car image url.",
              );
            }

            return uploadedFileUrl.data.publicUrl as string;
          }),
        );
      }

      // Update Car
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
          primaryColor: args.primaryColor ?? undefined,
          trueColor: args.trueColor ?? undefined,
          transmission: args.transmission ?? undefined,
          fuelType: args.fuelType ?? undefined,
          imageUrl: uploadedFileUrls.length > 0 ? uploadedFileUrls : undefined,
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
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user)
        throw createGraphQLError(
          "You have to be logged in to perform this action.",
        );

      const dbUser = await prisma.user.findUnique({
        where: {
          id: (await ctx).user?.id,
        },
      });

      if (!dbUser) throw createGraphQLError("User does not exist.");

      // Delete Car
      const carPrisma = await prisma.car.delete({
        ...query,
        where: {
          id: args.id,
        },
      });

      if (!carPrisma)
        throw createGraphQLError("An error occurred while deleting the car.");

      // Remove File
      const removeFile = await (await ctx).supabase?.storage
        .from(IMAGE_BUCKET)
        .remove(carPrisma.imageUrl);

      if (removeFile?.error)
        throw createGraphQLError(
          "An error occurred while deleting the car image.",
        );

      return carPrisma;
    },
  }),
);
