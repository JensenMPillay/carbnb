import prisma from "@/prisma/prisma";
import { stripe } from "@/src/config/stripe";
import { Database } from "@/src/lib/supabase/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

import type { CookieOptions } from "@supabase/ssr";
import type Stripe from "stripe";

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
    case "account.updated":
      console.log(event.data.object);
      const stripeAccount = event.data.object;
      if (!stripeAccount || !stripeAccount.metadata) break;
      try {
        // Update User & Create Stripe Data
        await prisma.user.update({
          where: {
            id: stripeAccount.metadata.userId,
          },
          data: {
            stripeVerified: new Date(),
          },
        });

        // Update Supabase Session
        await supabaseApiServerClient.auth.admin.updateUserById(
          stripeAccount.metadata.userId,
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
          `Webhook Error: ${error instanceof Error ? error.message : "Webhook signature verification failed."}`,
          { status: 400 },
        );
      }
      break;
    default:
      // Unexpected event type
      console.error(`Unhandled event type ${event.type}.`);
  }

  // Response
  return new Response(null, { status: 200 });
}
