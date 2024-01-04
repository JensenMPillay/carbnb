import { builder } from "../builder";

// Location Object
builder.prismaObject("Location", {
  fields: (t) => ({
    id: t.exposeID("id"),
    address: t.exposeString("address"),
    city: t.exposeString("city"),
    country: t.exposeString("country"),
    cars: t.relation("cars"),
  }),
});
