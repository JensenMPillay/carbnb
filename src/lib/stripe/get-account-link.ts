"use server";
import { stripe } from "@/src/config/stripe";
import { absoluteUrl } from "../utils";

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
