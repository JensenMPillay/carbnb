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
          return;
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
        if (
          paymentIntentSucceeded.status != "succeeded" ||
          !paymentIntentSucceeded.metadata?.bookingId
        )
          return;
        // Update Booking
        await prisma.booking.update({
          where: {
            id: paymentIntentSucceeded.metadata.bookingId,
          },
          data: {
            paymentStatus: "SUCCEEDED",
          },
        });
        break;
      case "payment_intent.canceled":
        const paymentIntentCanceled = event.data.object;
        if (
          paymentIntentCanceled.status != "canceled" ||
          !paymentIntentCanceled.metadata?.bookingId
        )
          return;
        // Update Booking
        await prisma.booking.update({
          where: {
            id: paymentIntentCanceled.metadata.bookingId,
          },
          data: {
            paymentStatus: "CANCELED",
          },
        });
        break;
      case "charge.captured":
        const chargeCaptured = event.data.object;
        if (
          chargeCaptured.status != "succeeded" ||
          !chargeCaptured.metadata?.bookingId
        )
          return;
        // Update Booking
        await prisma.booking.update({
          where: {
            id: chargeCaptured.metadata.bookingId,
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
          !chargeSucceeded.metadata?.bookingId
        )
          return;
        // Update Booking
        await prisma.booking.update({
          where: {
            id: chargeSucceeded.metadata.bookingId,
          },
          data: {
            paymentStatus: "SUCCEEDED",
          },
        });
        break;
      case "charge.failed":
        const chargeFailed = event.data.object;
        if (
          chargeFailed.status != "failed" ||
          !chargeFailed.metadata?.bookingId
        )
          return;
        // Update Booking
        await prisma.booking.update({
          where: {
            id: chargeFailed.metadata.bookingId,
          },
          data: {
            paymentStatus: "FAILED",
          },
        });
        break;
      case "charge.expired":
        const chargeExpired = event.data.object;
        if (
          chargeExpired.status != "failed" ||
          !chargeExpired.metadata?.bookingId
        )
          return;
        // Update Booking
        await prisma.booking.update({
          where: {
            id: chargeExpired.metadata.bookingId,
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
          chargeRefundUpdated.status != "succeeded" ||
          !chargeRefundUpdated.metadata?.bookingId
        )
          return;
        // Update Booking
        await prisma.booking.update({
          where: {
            id: chargeRefundUpdated.metadata.bookingId,
          },
          data: {
            paymentStatus: "REFUNDED",
          },
        });
        break;
      case "charge.refunded":
        const chargeRefunded = event.data.object;
        if (
          chargeRefunded.status != "succeeded" ||
          !chargeRefunded.metadata?.bookingId
        )
          return;
        // Update Booking
        await prisma.booking.update({
          where: {
            id: chargeRefunded.metadata.bookingId,
          },
          data: {
            paymentStatus: "REFUNDED",
          },
        });
        break;
      case "refund.updated":
        const refundUpdated = event.data.object;
        if (
          refundUpdated.status != "succeeded" ||
          !refundUpdated.metadata?.bookingId
        )
          return;
        // Update Booking
        await prisma.booking.update({
          where: {
            id: refundUpdated.metadata.bookingId,
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
