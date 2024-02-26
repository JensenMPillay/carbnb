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
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err) {
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 },
    );
  }

  //   Session Stripe
  const session = event.data.object as Stripe.Checkout.Session;

  //   No User
  if (!session?.metadata?.userId) {
    return new Response(null, {
      status: 200,
    });
  }

  //  Lender Account Updated
  if (event.type === "account.updated") {
    // Retrieve Stripe Subscription Data
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    // Update User & Create Stripe Data
    await prisma.user.update({
      where: {
        id: session.metadata.userId,
      },
      data: {
        stripeVerified: new Date(),
      },
    });

    // Update Supabase Session
    await supabaseApiServerClient.auth.updateUser({
      data: {
        stripeVerified: new Date(),
      },
    });
  }

  return new Response(null, { status: 200 });
}
