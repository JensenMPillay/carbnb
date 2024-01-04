import { Category, FuelType, Transmission } from "@prisma/client";
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
  }),
});
