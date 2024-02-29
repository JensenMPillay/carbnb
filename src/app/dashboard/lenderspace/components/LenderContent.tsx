"use client";
import { CarQuery } from "@/src/@types/queries.types";
import { Skeleton } from "@/src/components/ui/skeleton";
import { TabsContent } from "@/src/components/ui/tabs";
import { GET_LENDER_BOOKINGS_QUERY } from "@/src/lib/graphql/booking";
import { GET_LENDER_CARS_QUERY } from "@/src/lib/graphql/car";
import { showErrorNotif } from "@/src/lib/notifications/toasters";
import useSessionStore from "@/src/store/useSessionStore";
import useStore from "@/src/store/useStore";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { DataTable } from "./lenderbookings/DataTable";
import { bookingColumns } from "./lenderbookings/bookingsColumns";
import AddCarButton from "./lendercars/AddCarButton";
import LenderCarCard from "./lendercars/LenderCarCard";

type Props = {};

const LenderContent = (props: Props) => {
  // Access to Store Data after Rendering (SSR Behavior)
  const session = useStore(useSessionStore, (state) => state.session);

  // User
  const user = session?.user;

  // Get Queries
  const {
    loading: loadingBookings,
    error: errorBookings,
    data: dataBookings,
  } = useQuery(GET_LENDER_BOOKINGS_QUERY, {
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Query Error : ", error);
    },
  });

  const {
    loading: loadingCars,
    error: errorCars,
    data: dataCars,
  } = useQuery(GET_LENDER_CARS_QUERY, {
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Query Error : ", error);
    },
  });

  return (
    <>
      <TabsContent value="bookings">
        <div className="flex h-full w-full flex-col space-y-6 px-2 md:px-4 lg:px-6">
          {loadingBookings && (
            <>
              <Skeleton className="h-[10dvh] w-full" />
              <Skeleton className="h-[10dvh] w-full" />
              <Skeleton className="h-[10dvh] w-full" />
            </>
          )}
          {dataBookings && (
            <DataTable
              columns={bookingColumns}
              data={dataBookings.getLenderBookings}
            />
          )}
          {errorBookings && (
            <p className="text-center text-xl">
              An error occurred while retrieving bookings. Please try again
              later.
            </p>
          )}
        </div>
      </TabsContent>
      <TabsContent value="cars">
        <div className="flex h-full w-full flex-col">
          <div className="grid grid-cols-1 place-content-center gap-4 p-2 md:grid-cols-2 md:p-3 lg:grid-cols-3 lg:p-4 xl:grid-cols-3">
            {loadingCars && (
              <>
                <Skeleton className="h-[50dvh] w-full" />
                <Skeleton className="h-[50dvh] w-full" />
                <Skeleton className="h-[50dvh] w-full" />
              </>
            )}
            {dataCars && !dataCars.getLenderCars.length && (
              <p className="col-span-1 text-center text-xl  md:col-span-2 lg:col-span-3">
                Your car collection is empty. Let&pos;s add a car to start
                hosting!
              </p>
            )}
            {dataCars &&
              dataCars.getLenderCars.map((car: CarQuery) => (
                <LenderCarCard key={car.id} car={car} />
              ))}
            {errorCars && (
              <p className="col-span-1 text-center text-xl  md:col-span-2 lg:col-span-3">
                An error occurred while retrieving cars. Please try again later.
              </p>
            )}
          </div>
          <div className="mb-1 mt-auto w-full space-y-1 text-center text-xl">
            <AddCarButton disabled={!user?.user_metadata.stripeVerified} />
          </div>
        </div>
      </TabsContent>
    </>
  );
};

export default LenderContent;
