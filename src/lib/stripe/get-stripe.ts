import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
/**
 * Initializes and returns a Stripe instance.
 * @return {Promise<Stripe | null>} A promise resolving to a Stripe instance.
 * @example
 * const stripePromise = getStripe();
 * // Output: A promise resolving to a Stripe instance.
 */
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY!,
    );
  }
  return stripePromise;
};

export default getStripe;
