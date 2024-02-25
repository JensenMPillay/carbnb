import { BookingQuery } from "@/src/@types/queries.types";
import getStripe from "@/src/lib/stripe/get-stripe";
import { hslToHex } from "@/src/lib/utils";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";

type CheckoutWrapperProps = {
  booking: BookingQuery;
};

const CheckoutWrapper = ({ booking }: CheckoutWrapperProps) => {
  // Sync Theme w/ Stripe Component
  const theme = useTheme();
  const [style, setStyle] = useState<CSSStyleDeclaration | null>(null);

  // Get Stripe Instance
  const stripePromise = getStripe();

  // Stripe Options
  const options: StripeElementsOptions = {
    mode: "payment",
    amount: booking.totalPrice * 100,
    currency: "eur",
    captureMethod: "manual",
    paymentMethodTypes: ["card", "paypal"],
    paymentMethodCreation: "manual",
    appearance: {
      theme: "stripe",
      variables: style
        ? {
            colorPrimary: hslToHex(style.getPropertyValue("--primary")),
            colorBackground: hslToHex(style.getPropertyValue("--background")),
            colorText: hslToHex(style.getPropertyValue("--foreground")),
            colorDanger: hslToHex(style.getPropertyValue("--destructive")),
            fontFamily: "Ideal Sans, system-ui, sans-serif",
            fontSizeBase: "16px",
            spacingUnit: "2px",
            borderRadius: style.getPropertyValue("--radius"),
          }
        : undefined,
      labels: "floating",
    },
  };

  // Handle Theme Changing w/ Stripe Component
  useEffect(() => {
    // Get Theme Appearance
    const root = document.documentElement;
    setStyle(getComputedStyle(root));

    return () => {};
  }, [theme]);

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm booking={booking} />
    </Elements>
  );
};

export default CheckoutWrapper;
