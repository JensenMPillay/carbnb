import prisma from "@/prisma/prisma";
import { Role } from "@prisma/client";
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

// GET Routes
builder.queryField("user", (t) =>
  t.prismaField({
    type: "User",
    resolve: async (query, _parent, _args, ctx) => {
      if (!(await ctx).user) {
        throw new Error("You have to be logged in to perform this action");
      }

      const user = await prisma.user.findUnique({
        ...query,
        where: {
          email: (await ctx).user?.email,
        },
      });

      if (!user) throw Error("User does not exist" + (await ctx).user?.id);

      return user;
    },
  }),
);

// GET Routes
builder.mutationField("signUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      id: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
      role: t.arg({ type: Role, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user) {
        throw new Error("You have to be logged in to perform this action");
      }

      let user = await prisma.user.findUnique({
        ...query,
        where: {
          email: (await ctx).user?.email,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          ...query,
          data: {
            id: args.id,
            email: args.email,
            role: args.role,
          },
        });
      }

      return user;
    },
  }),
);
