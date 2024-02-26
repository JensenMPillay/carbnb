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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
      process.env.STRIPE_PAYMENT_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Webhook signature verification failed."}`,
      { status: 400 },
    );
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.amount_capturable_updated":
      const paymentIntentAmountCapturableUpdated = event.data.object;
      console.log(event.data.object);
      // Then define and call a function to handle the event payment_intent.amount_capturable_updated
      break;
    case "payment_intent.requires_action":
      const paymentIntentRequiresAction = event.data.object;
      console.log(event.data.object);
      // Then define and call a function to handle the event payment_intent.requires_action
      break;
    case "transfer.created":
      const transferCreated = event.data.object;
      console.log(event.data.object);
      // Then define and call a function to handle the event transfer.created
      break;
    case "transfer.reversed":
      const transferReversed = event.data.object;
      console.log(event.data.object);
      // Then define and call a function to handle the event transfer.reversed
      break;
    case "transfer.updated":
      const transferUpdated = event.data.object;
      console.log(event.data.object);
      // Then define and call a function to handle the event transfer.updated
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Response
  return new Response(null, { status: 200 });
}
