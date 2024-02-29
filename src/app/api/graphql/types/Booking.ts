import prisma from "@/prisma/prisma";
import { stripe } from "@/src/config/stripe";
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

// GET Route
builder.queryField("getLenderBookings", (t) =>
  t.prismaField({
    type: ["Booking"],
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user)
        throw createGraphQLError(
          "You have to be logged in to perform this action.",
        );

      const dbLenderCars = await prisma.car.findMany({
        where: {
          userId: (await ctx).user?.id,
        },
        select: {
          id: true,
        },
      });

      const lenderCarIds = dbLenderCars.map((car) => car.id);

      const dbBookings = await prisma.booking.findMany({
        ...query,
        where: {
          carId: {
            in: lenderCarIds,
          },
          status: {
            not: "PENDING",
          },
        },
      });

      return dbBookings;
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

      const dbLenderCar = await prisma.car.findUnique({
        where: {
          id: args.carId,
        },
      });

      if (!dbLenderCar) throw createGraphQLError("Car does not exist.");

      const numberOfDays = differenceInCalendarDays(
        args.endDate,
        args.startDate,
      );

      const totalPrice = dbLenderCar.pricePerDay * (numberOfDays + 1);

      const bookingPrisma = await prisma.booking.create({
        ...query,
        data: {
          startDate: args.startDate,
          endDate: args.endDate,
          totalPrice: totalPrice,
          status: "PENDING",
          paymentStatus: "PENDING",
          userId: dbUser.id,
          carId: dbLenderCar.id,
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

// POST Route
builder.mutationField("updateBooking", (t) =>
  t.prismaField({
    type: "Booking",
    args: {
      id: t.arg.string({ required: true }),
      status: t.arg({ type: BookingStatus, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user)
        throw createGraphQLError(
          "You have to be logged in to perform this action.",
        );
      const bookingPrisma = await prisma.booking.update({
        ...query,
        where: {
          id: args.id,
        },
        data: {
          status: args.status,
        },
      });

      if (!bookingPrisma || !bookingPrisma.stripePaymentId)
        throw createGraphQLError(
          "An error occurred while updating the booking. Please try again later.",
        );

      switch (args.status) {
        case "ACCEPTED":
          // Capture Payment
          try {
            await stripe.paymentIntents.capture(bookingPrisma.stripePaymentId);
          } catch (error) {
            throw createGraphQLError(
              error instanceof Error
                ? error.message
                : "An Error occured during update payment intent.",
            );
          }
          break;
        case "REFUSED":
          // Cancel Payment
          try {
            await stripe.paymentIntents.cancel(bookingPrisma.stripePaymentId);
          } catch (error) {
            throw createGraphQLError(
              error instanceof Error
                ? error.message
                : "An Error occured during update payment intent.",
            );
          }
          break;
        default:
          break;
      }

      return bookingPrisma;
    },
  }),
);
