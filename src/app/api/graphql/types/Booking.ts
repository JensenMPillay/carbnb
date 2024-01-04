import { PaymentStatus } from "@prisma/client";
import { builder } from "../builder";

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
    paymentStatus: t.expose("paymentStatus", { type: PaymentStatus }),
    stripePaymentId: t.exposeString("stripePaymentId"),
    user: t.relation("User"),
    car: t.relation("Car"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("updatedAt", { type: "Date" }),
  }),
});
