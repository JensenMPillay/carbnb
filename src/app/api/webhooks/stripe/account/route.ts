import prisma from "@/prisma/prisma";
import { stripe } from "@/src/config/stripe";
import { Database } from "@/src/lib/supabase/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

import type { CookieOptions } from "@supabase/ssr";
import type Stripe from "stripe";

/**
 * POST function for handling POST requests from Stripe webhook events about connected accounts.
 * @param {Request} request - The request object containing the webhook event.
 * @returns {Promise<Response>} A promise that resolves to a response indicating the success or failure of processing the webhook event.
 */
export async function POST(request: Request) {
  // Supabase Client
  const cookieStore = cookies();

  const supabaseApiServerClient = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ADMIN_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );

  const body = await request.text();
  const signature = headers().get("Stripe-Signature") ?? "";

  //   Retrieve Stripe Event
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_ACCOUNT_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Webhook signature verification failed."}`,
      { status: 400 },
    );
  }

  // Handle the event
  switch (event.type) {
    // Lender Stripe Account Updated
    case "account.updated": {
      const accountUpdated = event.data.object;
      if (
        !accountUpdated.metadata ||
        !accountUpdated.metadata.userId ||
        !accountUpdated.details_submitted
      )
        return new Response(
          `Webhook Error: "No metadata or details are submitted to update user."`,
          { status: 400 },
        );
      try {
        // Update User & Create Stripe Data
        await prisma.user.update({
          where: {
            id: accountUpdated.metadata.userId,
          },
          data: {
            stripeVerified: new Date(),
          },
        });

        // Update Supabase Session
        await supabaseApiServerClient.auth.admin.updateUserById(
          accountUpdated.metadata.userId,
          {
            user_metadata: {
              stripeVerified: new Date(),
            },
          },
        );
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : "Update user failed.",
        );
        return new Response(
          `Webhook Error: ${error instanceof Error ? error.message : "Update user failed."}`,
          { status: 500 },
        );
      }
      break;
    }
    default:
      // Unexpected event type
      console.error(`Unhandled event type ${event.type}.`);
      return new Response(
        `Webhook Error: Unhandled event type ${event.type}.`,
        { status: 400 },
      );
  }

  // Response
  return new Response(null, { status: 200 });
}
