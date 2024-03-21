"use server";
import { stripe } from "@/src/config/stripe";
import { absoluteUrl } from "../utils";

/**
 * Generates an account link URL for Stripe onboarding.
 * @param {string} stripeCustomerId - The Stripe customer ID.
 * @return {Promise<string>} A promise resolving to the URL of the account link.
 * @example
 * const accountLinkURL = await getAccountLink(stripeCustomerId);
 * // Output: A promise resolving to the URL of the account link.
 */
const getAccountLink = async (stripeCustomerId: string) => {
  const accountLink = await stripe.accountLinks.create({
    account: stripeCustomerId,
    refresh_url: absoluteUrl("/dashboard/profile"),
    return_url: absoluteUrl("/dashboard/profile"),
    type: "account_onboarding",
  });
  return accountLink.url;
};

export default getAccountLink;
