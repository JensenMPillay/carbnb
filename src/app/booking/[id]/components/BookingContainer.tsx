"use client";
import BookingInfoCard from "@/src/components/BookingInfoCard";
import CarCard from "@/src/components/CarCard";
import { SVGDeal } from "@/src/components/VectorImages";
import { Skeleton } from "@/src/components/ui/skeleton";
import { GET_BOOKING_QUERY } from "@/src/lib/graphql/booking";
import { showErrorNotif } from "@/src/lib/notifications/toasters";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useParams } from "next/navigation";
import CheckoutWrapper from "./CheckoutWrapper";

/**
 * BookingContainer component for rendering a booking container with booking details, car information, and a checkout wrapper.
 * @component
 * @example
 * <BookingContainer />
 */
const BookingContainer = () => {
  // Params ID
  const params = useParams();
  const bookingId = params.id as string;

  // Get Query
  const { loading, error, data } = useQuery(GET_BOOKING_QUERY, {
    variables: { id: bookingId },
    // notifyOnNetworkStatusChange: true,
    // onCompleted: async (data) => {},
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Query Error : ", error);
    },
  });

  return (
    <div className="flex flex-1 flex-col-reverse items-center p-2 md:flex-row md:space-x-4 md:p-3 lg:p-4 xl:p-5">
      {loading ? (
        <>
          <Skeleton className="h-[50dvh] w-full md:w-1/2" />
          <Skeleton className="h-[50dvh] w-full md:w-1/2" />
        </>
      ) : error || data.getBooking.paymentStatus != "PENDING" ? (
        <p className="text-center text-xl font-semibold">
          Apologies, it seems there is an issue with this booking. <br />
          Please try making another booking.
        </p>
      ) : (
        data && (
          <>
            <div className="my-4 w-full space-y-2 md:my-0 md:w-1/2">
              <SVGDeal className="mx-auto hidden md:block md:h-1/2 md:w-1/2" />
              <CheckoutWrapper booking={data.getBooking} />
            </div>
            <div className="w-full md:w-1/2">
              <CarCard car={data.getBooking.car} />
              <BookingInfoCard
                address={data.getBooking.car.location.formatted_address}
                startDate={data.getBooking.startDate}
                endDate={data.getBooking.endDate}
                size="lg"
              />
            </div>
          </>
        )
      )}
    </div>
  );
};

export default BookingContainer;
