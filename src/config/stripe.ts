import Stripe from "stripe";

/**
 * Stripe Instance with Key & Version.
 */
export const stripe = new Stripe(process.env.STRIPE_API_KEY ?? "", {
  apiVersion: "2023-10-16",
  typescript: true,
});
