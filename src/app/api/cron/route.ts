import prisma from "@/prisma/prisma";
import { stripe } from "@/src/config/stripe";
import { Booking } from "@prisma/client";
import { compareAsc } from "date-fns";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * GET function for handling GET requests to process bookings and update their status.
 * @param {NextRequest} request - The Next.js request object.
 * @returns {Promise<NextResponse>} A promise that resolves to a Next.js response object.
 */
export async function GET(request: NextRequest) {
  // Verification
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // Get Date
  const currentDay = new Date().toDateString();

  // Delete Pending Bookings
  await prisma.booking.deleteMany({
    where: {
      status: "PENDING",
    },
  });

  // Retrieve Bookings
  const bookings = await prisma.booking.findMany({
    where: {
      status: {
        in: ["WAITING", "ACCEPTED", "IN_PROGRESS"],
      },
    },
  });

  // Process Bookings
  async function processBookings(bookings: Booking[]) {
    for (const booking of bookings) {
      const { id, startDate, endDate, status, paymentStatus, stripePaymentId } =
        booking;
      if (!stripePaymentId) return false;
      // Start Date Comparison
      const dateStartDiff = compareAsc(currentDay, startDate.toDateString());
      switch (status) {
        case "WAITING":
          if (dateStartDiff < 0) break;
          //   Update Booking State
          await prisma.booking.update({
            where: { id: id },
            data: {
              status: "CANCELED",
            },
          });
          // Cancel Payment
          if (paymentStatus === "VALIDATED") {
            await stripe.paymentIntents.cancel(stripePaymentId);
          }
          break;
        case "ACCEPTED":
          if (dateStartDiff >= 0) {
            // Update Booking State
            await prisma.booking.update({
              where: { id: id },
              data: {
                status: "IN_PROGRESS",
              },
            });
            break;
          }
        case "IN_PROGRESS":
          // End Date Comparison
          const dateEndDiff = compareAsc(currentDay, endDate.toDateString());
          if (dateEndDiff >= 0) {
            // Update Booking State
            await prisma.booking.update({
              where: { id: id },
              data: {
                status: "COMPLETED",
              },
            });
            break;
          }
        default:
          break;
      }
    }
    return true;
  }

  // Process Bookings
  try {
    await processBookings(bookings);
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "An Error occured during update booking state",
    });
  }

  return NextResponse.json({ ok: true });
}
