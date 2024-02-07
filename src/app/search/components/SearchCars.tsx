"use client";
import CarCard from "@/src/components/CarCard";
import { Skeleton } from "@/src/components/ui/skeleton";
import { GET_AVAILABLE_CARS_QUERY } from "@/src/lib/graphql/car";
import { showErrorNotif } from "@/src/lib/notifications/toasters";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { Car } from "@prisma/client";
import { useSearchParams } from "next/navigation";

type Props = {};

const SearchCars = () => {
  // Params
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Get Query
  const { loading, error, data } = useQuery(GET_AVAILABLE_CARS_QUERY, {
    variables: {
      locationId: locationId,
      startDate: startDate && new Date(startDate),
      endDate: endDate && new Date(endDate),
    },
    // notifyOnNetworkStatusChange: true,
    // onCompleted: async (data) => {
    // },
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Query Error : ", error);
    },
  });

  if (loading)
    return (
      <>
        <Skeleton className="h-[50dvh] w-full" />
        <Skeleton className="h-[50dvh] w-full" />
        <Skeleton className="h-[50dvh] w-full" />
      </>
    );

  return (
    <>
      {data &&
        data.getAvailableCars.map((car: Car) => (
          <CarCard key={car.id} car={car} />
        ))}
    </>
  );
};

export default SearchCars;
