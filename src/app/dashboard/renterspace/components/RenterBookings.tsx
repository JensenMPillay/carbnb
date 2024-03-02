"use client";
import { BookingQuery } from "@/src/@types/queries.types";
import BookingInfoCard from "@/src/components/BookingInfoCard";
import CarCard from "@/src/components/CarCard";
import { Skeleton } from "@/src/components/ui/skeleton";
import { GET_RENTER_BOOKINGS_QUERY } from "@/src/lib/graphql/booking";
import { showErrorNotif } from "@/src/lib/notifications/toasters";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import BookingButton from "../../../../components/BookingButton";
import BookingStatusBadge from "../../lenderspace/components/lenderbookings/BookingStatusBadge";

type Props = {};

const RenterBookings = (props: Props) => {
  // Get Query
  const { loading, error, data } = useQuery(GET_RENTER_BOOKINGS_QUERY, {
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Query Error : ", error);
    },
  });
  return (
    <div className="flex h-full w-full flex-col">
      <div className="grid grid-cols-1 place-content-center gap-4 p-2 md:grid-cols-2 md:p-3 lg:grid-cols-3 lg:p-4 xl:grid-cols-3">
        {loading && (
          <>
            <Skeleton className="h-[50dvh] w-full" />
            <Skeleton className="h-[50dvh] w-full" />
            <Skeleton className="h-[50dvh] w-full" />
          </>
        )}
        {data && !data.getRenterBookings.length && (
          <p className="col-span-1 text-center text-xl font-semibold md:col-span-2 lg:col-span-3">
            No Booking found. <br />
          </p>
        )}
        {data &&
          data.getRenterBookings.map((booking: BookingQuery) => (
            <div key={booking.id}>
              <CarCard car={booking.car}>
                <BookingButton bookingId={booking.id} action="CANCELED" />
                <BookingStatusBadge status={booking.status} />
              </CarCard>
              <BookingInfoCard
                address={booking.car.location.formatted_address}
                startDate={booking.startDate}
                endDate={booking.endDate}
              />
            </div>
          ))}
        {error && (
          <p className="col-span-1 text-center text-xl font-semibold md:col-span-2 lg:col-span-3">
            An error occurred while retrieving bookings. <br />
            Please try again later.
          </p>
        )}
      </div>
    </div>
  );
};

export default RenterBookings;
