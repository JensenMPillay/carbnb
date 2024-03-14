import prisma from "@/prisma/prisma";
import { stripe } from "@/src/config/stripe";
import { headers } from "next/headers";

import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  //   Retrieve Stripe Event
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_PAYMENT_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Webhook signature verification failed."}`,
      { status: 400 },
    );
  }

  // Handle events
  try {
    switch (event.type) {
      case "payment_intent.requires_action":
        const paymentIntentRequiresAction = event.data.object;
        break;
      case "payment_intent.amount_capturable_updated":
        const paymentIntentAmountCapturableUpdated = event.data.object;
        if (
          paymentIntentAmountCapturableUpdated.status != "requires_capture" ||
          !paymentIntentAmountCapturableUpdated.metadata?.bookingId
        )
          throw new Error("No metadata submitted");

        // Update Booking
        await prisma.booking.update({
          where: {
            id: paymentIntentAmountCapturableUpdated.metadata.bookingId,
          },
          data: {
            stripePaymentId: paymentIntentAmountCapturableUpdated.id,
            paymentStatus: "VALIDATED",
            status: "WAITING",
          },
        });
        break;
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        if (paymentIntentSucceeded.status === "succeeded")
          // Update Booking
          await prisma.booking.update({
            where: {
              stripePaymentId: paymentIntentSucceeded.id,
            },
            data: {
              paymentStatus: "SUCCEEDED",
            },
          });
        break;
      case "payment_intent.canceled":
        const paymentIntentCanceled = event.data.object;
        if (paymentIntentCanceled.status === "canceled")
          // Update Booking
          await prisma.booking.update({
            where: {
              stripePaymentId: paymentIntentCanceled.id,
            },
            data: {
              paymentStatus: "CANCELED",
            },
          });
        break;
      case "charge.captured":
        const chargeCaptured = event.data.object;
        if (
          chargeCaptured.status === "succeeded" &&
          chargeCaptured.payment_intent
        )
          // Update Booking
          await prisma.booking.update({
            where: {
              stripePaymentId: chargeCaptured.payment_intent.toString(),
            },
            data: {
              paymentStatus: "SUCCEEDED",
            },
          });
        break;
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        if (
          chargeSucceeded.status != "succeeded" ||
          !chargeSucceeded.payment_intent
        )
          break;
        // Find Booking "CANCELED"
        const canceledBooking = await prisma.booking.findUnique({
          where: {
            stripePaymentId: chargeSucceeded.payment_intent.toString(),
          },
        });

        if (canceledBooking?.status === "CANCELED")
          // Update Booking
          await prisma.booking.update({
            where: {
              stripePaymentId: chargeSucceeded.payment_intent.toString(),
            },
            data: {
              paymentStatus: "REFUNDED",
            },
          });
        break;
      case "charge.failed":
        const chargeFailed = event.data.object;
        if (chargeFailed.status === "failed" && chargeFailed.payment_intent)
          // Update Booking
          await prisma.booking.update({
            where: {
              stripePaymentId: chargeFailed.payment_intent.toString(),
            },
            data: {
              paymentStatus: "FAILED",
            },
          });
        break;
      case "charge.expired":
        const chargeExpired = event.data.object;
        if (chargeExpired.status != "failed" || !chargeExpired.payment_intent)
          break;
        // Update Booking
        await prisma.booking.update({
          where: {
            stripePaymentId: chargeExpired.payment_intent.toString(),
          },
          data: {
            paymentStatus: "CANCELED",
          },
        });
        break;
      case "charge.updated":
        const chargeUpdated = event.data.object;
        break;
      case "charge.refund.updated":
        const chargeRefundUpdated = event.data.object;
        if (
          chargeRefundUpdated.status === "succeeded" &&
          chargeRefundUpdated.payment_intent
        )
          // Update Booking
          await prisma.booking.update({
            where: {
              stripePaymentId: chargeRefundUpdated.payment_intent.toString(),
            },
            data: {
              paymentStatus: "REFUNDED",
            },
          });
        break;
      case "charge.refunded":
        const chargeRefunded = event.data.object;
        if (
          chargeRefunded.status === "succeeded" &&
          chargeRefunded.payment_intent
        )
          // Update Booking
          await prisma.booking.update({
            where: {
              stripePaymentId: chargeRefunded.payment_intent.toString(),
            },
            data: {
              paymentStatus: "REFUNDED",
            },
          });
        break;
      case "refund.updated":
        const refundUpdated = event.data.object;
        if (
          refundUpdated.status === "succeeded" &&
          refundUpdated.payment_intent
        )
          // Update Booking
          await prisma.booking.update({
            where: {
              stripePaymentId: refundUpdated.payment_intent.toString(),
            },
            data: {
              paymentStatus: "REFUNDED",
            },
          });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Update booking failed."}`,
      { status: 400 },
    );
  }

  // Response
  return new Response(null, { status: 200 });
}
