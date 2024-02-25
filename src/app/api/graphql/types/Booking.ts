import prisma from "@/prisma/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";
import { createGraphQLError } from "graphql-yoga";
import { builder } from "../builder";

// Booking Status
builder.enumType(BookingStatus, {
  name: "BookingStatus",
});

// Payment Status
builder.enumType(PaymentStatus, {
  name: "PaymentStatus",
});

// Booking Object
builder.prismaObject("Booking", {
  fields: (t) => ({
    id: t.exposeID("id"),
    startDate: t.expose("startDate", { type: "Date" }),
    endDate: t.expose("endDate", { type: "Date" }),
    totalPrice: t.exposeFloat("totalPrice"),
    status: t.expose("status", { type: BookingStatus }),
    paymentStatus: t.expose("paymentStatus", { type: PaymentStatus }),
    stripePaymentId: t.exposeString("stripePaymentId", { nullable: true }),
    user: t.relation("User"),
    car: t.relation("Car"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("updatedAt", { type: "Date" }),
  }),
});

// GET Route
builder.queryField("getBooking", (t) =>
  t.prismaField({
    type: "Booking",
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user)
        throw createGraphQLError(
          "You have to be logged in to perform this action.",
        );

      const dbBooking = await prisma.booking.findUnique({
        ...query,
        where: {
          id: args.id,
        },
      });

      if (!dbBooking) throw createGraphQLError("Booking does not exist.");

      return dbBooking;
    },
  }),
);

// POST Route
builder.mutationField("initBooking", (t) =>
  t.prismaField({
    type: "Booking",
    args: {
      startDate: t.arg({ type: "Date", required: true }),
      endDate: t.arg({ type: "Date", required: true }),
      carId: t.arg.string({ required: true }),
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

      const carPrisma = await prisma.car.findUnique({
        where: {
          id: args.carId,
        },
      });

      if (!carPrisma) throw createGraphQLError("Car does not exist.");

      const numberOfDays = differenceInCalendarDays(
        args.endDate,
        args.startDate,
      );

      const totalPrice = carPrisma.pricePerDay * (numberOfDays + 1);

      const bookingPrisma = await prisma.booking.create({
        ...query,
        data: {
          startDate: args.startDate,
          endDate: args.endDate,
          totalPrice: totalPrice,
          status: "PENDING",
          paymentStatus: "PENDING",
          userId: dbUser.id,
          carId: carPrisma.id,
        },
      });

      if (!bookingPrisma)
        throw createGraphQLError(
          "An error occurred while creating the booking. Please try again later.",
        );

      return bookingPrisma;
    },
  }),
);
