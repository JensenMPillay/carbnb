import prisma from "@/prisma/prisma";
import { stripe } from "@/src/config/stripe";
import { absoluteUrl } from "@/src/lib/utils";
import { PaymentIntent, StripeError } from "@stripe/stripe-js";
import { headers } from "next/headers";
import { NextRequest, NextResponse, userAgent } from "next/server";

export type StripeApiSuccessResponse = {
  client_secret: string | null;
  status: PaymentIntent.Status;
};
export type StripeApiErrorResponse = {
  error: StripeError;
};

export type StripeApiResponse =
  | StripeApiSuccessResponse
  | StripeApiErrorResponse;

/**
 * POST function for handling POST requests to create a payment intent and process a payment.
 * @param {NextRequest} request - The Next.js request object.
 * @param {NextResponse} response - The Next.js response object.
 * @returns {Promise<NextResponse>} A promise that resolves to a Next.js response object.
 */
export async function POST(request: NextRequest, response: NextResponse) {
  // User Info
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") || "121.0.0.1";
  const ua = userAgent(request).ua;

  //   PaymentMethod ID sent by Client
  const body = await request.json();
  const paymentMethodId = body.paymentMethodId;
  const bookingId = body.bookingId;

  // Database Verification
  const dbBooking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      paymentStatus: "PENDING",
    },
  });

  // No Booking
  if (!dbBooking)
    return new NextResponse(
      JSON.stringify(
        {
          error: {
            code: "500",
            message: "This booking does not exist.",
          },
        } as StripeApiErrorResponse,
        null,
        2,
      ),
    );

  const dbLenderCar = await prisma.car.findUnique({
    where: {
      id: dbBooking.carId,
    },
  });

  // No Booking
  if (!dbLenderCar)
    return new NextResponse(
      JSON.stringify(
        {
          error: {
            code: "500",
            message: "This car does not exist.",
          },
        } as StripeApiErrorResponse,
        null,
        2,
      ),
    );

  const dbLender = await prisma.user.findUnique({
    where: {
      id: dbLenderCar.userId,
    },
  });

  // No Booking
  if (!dbLender || !dbLender.stripeCustomerId)
    return new NextResponse(
      JSON.stringify(
        {
          error: {
            code: "500",
            message: "This lender does not exist.",
          },
        } as StripeApiErrorResponse,
        null,
        2,
      ),
    );

  // Payment Intent
  try {
    const intent = await stripe.paymentIntents.create({
      confirm: true,
      amount: dbBooking.totalPrice * 100,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      capture_method: "manual",
      payment_method: paymentMethodId ?? undefined,
      return_url: absoluteUrl("/dashboard"),
      use_stripe_sdk: true,
      expand: ["latest_charge"],
      // payment_method_options: {
      //   card: {
      //     request_extended_authorization: "if_available",
      //   },
      // },
      mandate_data: {
        customer_acceptance: {
          type: "online",
          online:
            ip && ua
              ? {
                  ip_address: ip,
                  user_agent: ua,
                }
              : undefined,
        },
      },
      transfer_data: {
        amount: dbBooking.totalPrice * 100,
        destination: dbLender.stripeCustomerId,
      },
      metadata: {
        bookingId: bookingId,
      },
    });

    return new NextResponse(
      JSON.stringify(
        {
          client_secret: intent.client_secret,
          status: intent.status,
        } as StripeApiSuccessResponse,
        null,
        2,
      ),
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify(
        {
          error: error,
        } as StripeApiErrorResponse,
        null,
        2,
      ),
    );
  }
}
