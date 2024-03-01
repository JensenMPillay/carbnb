import prisma from "@/prisma/prisma";
import { stripe } from "@/src/config/stripe";
import { Role } from "@prisma/client";
import { createGraphQLError } from "graphql-yoga";
import Stripe from "stripe";
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
    stripeCustomerId: t.exposeString("stripeCustomerId", { nullable: true }),
    stripeVerified: t.expose("stripeVerified", {
      type: "Date",
      nullable: true,
    }),
    role: t.expose("role", { type: Role }),
    name: t.exposeString("name", { nullable: true }),
    phone: t.exposeString("phone", { nullable: true }),
    image: t.exposeString("image", { nullable: true }),
    cars: t.relation("cars"),
    bookings: t.relation("bookings"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("updatedAt", { type: "Date" }),
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

      // Create Stripe Account
      let stripeAccount: Stripe.Response<Stripe.Account> | undefined;

      if (args.role === "LENDER") {
        try {
          stripeAccount = await stripe.accounts.create({
            type: "express",
            country: "FR",
            email: args.email,
            business_type: "individual",
            business_profile: {
              name: args.name,
              support_email: args.email,
              support_phone: args.phone,
              mcc: "5712",
              product_description: "Lend Car",
            },
            capabilities: {
              card_payments: {
                requested: true,
              },
              transfers: {
                requested: true,
              },
            },
            metadata: {
              userId: (await ctx).user?.id ?? "",
              name: args.name,
              email: args.email,
              phone: args.phone,
            },
          });
        } catch (error) {
          console.error(error);
          throw createGraphQLError(
            "An error occurred while creating the user stripe account",
          );
        }
      }

      const userPrisma = await prisma.user.create({
        ...query,
        data: {
          id: (await ctx).user?.id,
          email: args.email,
          emailVerified: new Date(),
          stripeCustomerId: stripeAccount?.id,
          name: args.name,
          phone: args.phone,
          role: args.role,
        },
      });

      // Sync User Supabase & User Database
      const userSupabaseAdmin = await (
        await ctx
      ).supabase?.auth.admin.updateUserById((await ctx).user?.id!, {
        email: args.email,
        email_confirm: true,
      });

      const userSupabase = await (
        await ctx
      ).supabase?.auth.updateUser({
        data: {
          name: args.name,
          phone: args.phone,
          role: args.role,
          stripeCustomerId: stripeAccount?.id,
        },
      });

      if (!userPrisma || userSupabaseAdmin?.error || userSupabase?.error)
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
      role: t.arg({ type: Role, required: false }),
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

      // Create Stripe Account
      let stripeAccount: Stripe.Response<Stripe.Account> | undefined;

      if (args.role === "LENDER" && !dbUser.stripeCustomerId) {
        try {
          stripeAccount = await stripe.accounts.create({
            type: "express",
            country: "FR",
            email: dbUser.email,
            business_type: "individual",
            business_profile: {
              name: dbUser.name ?? "",
              support_email: dbUser.email,
              support_phone: dbUser.phone ?? "",
              mcc: "5712",
              product_description: "Lend Car",
            },
            capabilities: {
              card_payments: {
                requested: true,
              },
              transfers: {
                requested: true,
              },
            },
            metadata: {
              userId: (await ctx).user?.id ?? "",
              name: dbUser.name ?? "",
              email: dbUser.email,
              phone: dbUser.phone ?? "",
            },
          });
        } catch (error) {
          console.error(error);
          throw createGraphQLError(
            "An error occurred while creating the user stripe account",
          );
        }
      }

      const userPrisma = await prisma.user.update({
        ...query,
        where: {
          id: (await ctx).user?.id,
        },
        data: {
          email: args.email ?? undefined,
          stripeCustomerId: stripeAccount?.id,
          name: args.name ?? undefined,
          phone: args.phone ?? undefined,
          role: args.role ?? undefined,
        },
      });

      const userSupabaseAdmin = await (
        await ctx
      ).supabase?.auth.admin.updateUserById((await ctx).user?.id!, {
        email: args.email ?? undefined,
        password: args.password ?? undefined,
      });

      const userSupabase = await (
        await ctx
      ).supabase?.auth.updateUser({
        data: {
          name: args.name ?? undefined,
          phone: args.phone ?? undefined,
          role: args.role ?? undefined,
          stripeCustomerId: stripeAccount?.id,
        },
      });

      if (!userPrisma || userSupabaseAdmin?.error || userSupabase?.error)
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

      const userSupabaseAdmin = await (
        await ctx
      ).supabase?.auth.admin.deleteUser((await ctx).user?.id!);

      if (!userPrisma || userSupabaseAdmin?.error)
        throw createGraphQLError("An error occurred while deleting the user.");

      return userPrisma;
    },
  }),
);
