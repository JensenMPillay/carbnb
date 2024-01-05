import prisma from "@/prisma/prisma";
import { Role } from "@prisma/client";
import { createGraphQLError } from "graphql-yoga";
import { builder } from "../builder";

// Role
builder.enumType(Role, {
  name: "Role",
});

// User Object
builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    emailVerified: t.expose("emailVerified", { type: "Date", nullable: true }),
    role: t.expose("role", { type: Role }),
    name: t.exposeString("name", { nullable: true }),
    phone: t.exposeString("phone", { nullable: true }),
    image: t.exposeString("image", { nullable: true }),
    cars: t.relation("cars"),
    bookings: t.relation("bookings"),
    createdAt: t.expose("createdAt", { type: "Date" }),
  }),
});

// GET Route
builder.queryField("getUser", (t) =>
  t.prismaField({
    type: "User",
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

      return dbUser;
    },
  }),
);

// POST Route
builder.mutationField("registerUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      email: t.arg.string({ required: true }),
      name: t.arg.string({ required: true }),
      phone: t.arg.string({ required: true }),
      role: t.arg({ type: Role, required: true }),
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

      if (dbUser) throw createGraphQLError("User already exists.");

      const userPrisma = await prisma.user.create({
        ...query,
        data: {
          id: (await ctx).user?.id,
          email: args.email,
          name: args.name,
          phone: args.phone,
          role: args.role,
        },
      });

      const userSupabase = await (
        await ctx
      ).supabase?.auth.updateUser({
        email: args.email,
        data: { name: args.name, phone: args.phone, role: args.role },
      });

      if (!userPrisma || !userSupabase)
        throw createGraphQLError(
          "An error occurred while updating the user information.",
        );

      return userPrisma;
    },
  }),
);

// POST Route
builder.mutationField("updateUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      email: t.arg.string({ required: false }),
      password: t.arg.string({ required: false }),
      name: t.arg.string({ required: false }),
      phone: t.arg.string({ required: false }),
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

      const userPrisma = await prisma.user.update({
        ...query,
        where: {
          id: (await ctx).user?.id,
        },
        data: {
          email: args.email ?? undefined,
          name: args.name ?? undefined,
          phone: args.phone ?? undefined,
        },
      });

      const userSupabase = await (
        await ctx
      ).supabase?.auth.updateUser({
        email: args.email ?? undefined,
        password: args.password ?? undefined,
        data: { name: args.name ?? undefined, phone: args.phone ?? undefined },
      });

      if (!userPrisma || !userSupabase)
        throw createGraphQLError(
          "An error occurred while updating the user information.",
        );

      return userPrisma;
    },
  }),
);

// POST Route
builder.mutationField("deleteUser", (t) =>
  t.prismaField({
    type: "User",
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

      const userPrisma = await prisma.user.delete({
        ...query,
        where: {
          id: (await ctx).user?.id,
        },
      });

      if (!userPrisma)
        throw createGraphQLError("An error occurred while deleting the user.");

      return userPrisma;
    },
  }),
);
