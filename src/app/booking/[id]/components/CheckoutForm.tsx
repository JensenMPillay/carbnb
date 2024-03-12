import { BookingQuery } from "@/src/@types/queries.types";
import { StripeApiResponse } from "@/src/app/api/stripe/route";
import { Button } from "@/src/components/ui/button";
import Check from "@/src/components/ui/check";
import { Loader } from "@/src/components/ui/loader";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripeError } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
  booking: BookingQuery;
};

const CheckoutForm = ({ booking }: CheckoutFormProps) => {
  // Stripe Loaded State
  const [ready, setReady] = useState<boolean>(false);

  //   Payment State
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  //   Router
  const router = useRouter();

  //   Stripe Hooks
  const stripe = useStripe();
  const elements = useElements();

  const { name, email, phone } = booking.user;

  //   Error Handling
  const handleError = (error: StripeError) => {
    setLoading(false);
    showErrorNotif({
      description: error.message ?? error.code ?? error.type ?? "",
    });
    console.error("Mutation Error : ", error);
  };

  //   Success Handling
  const handleSuccess = () => {
    setLoading(false);
    setSuccess(true);
    showNotif({
      description: "Your Payment has been done successfully",
    });
    router.push("/dashboard/renterspace");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    // Loading...
    setLoading(true);

    // Get Errors
    const { error: submitError } = await elements.submit();

    // Error on Submit
    if (submitError) {
      handleError(submitError);
      return;
    }

    // Create the PaymentMethod using the details collected by the Payment Element
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: {
          name: name ?? undefined,
          email: email,
          phone: phone ?? undefined,
        },
        metadata: {
          bookingId: booking.id,
        },
      },
    });

    // Error on Payment
    if (error) {
      handleError(error);
      return;
    }

    // Create the PaymentIntent (SERVER)
    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: booking.id,
        paymentMethodId: paymentMethod.id,
      }),
    });

    // Result
    const data = await res.json();

    // Handle any next actions or errors. See the Handle any next actions step for implementation.
    handleServerResponse(data);
  };

  const handleServerResponse = async (response: StripeApiResponse) => {
    if (!stripe) return;
    if ("error" in response && response.error)
      return handleError(response.error);
    if (
      "status" in response &&
      response.status === "requires_action" &&
      response.client_secret
    ) {
      //   Handle 3D Secure etc...
      const { error, paymentIntent } = await stripe.handleNextAction({
        clientSecret: response.client_secret,
      });

      if (error) return handleError(error);
    }
    return handleSuccess();
  };

  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={(event) => handleSubmit(event)}
    >
      <PaymentElement onLoaderStart={() => setReady(true)} />
      {ready && (
        <Button type="submit" disabled={!stripe || loading || success}>
          {loading ? (
            <Loader />
          ) : success ? (
            <Check className="size-8" />
          ) : (
            `Pay ${booking.totalPrice} €`
          )}
        </Button>
      )}
    </form>
  );
};

export default CheckoutForm;
