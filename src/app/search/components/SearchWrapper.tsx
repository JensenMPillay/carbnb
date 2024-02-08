"use client";
import SearchForm from "@/src/components/SearchForm";
import { Skeleton } from "@/src/components/ui/skeleton";
import { GET_AVAILABLE_CARS_QUERY } from "@/src/lib/graphql/car";
import { showErrorNotif } from "@/src/lib/notifications/toasters";
import { SearchFormSchemaType } from "@/src/lib/schemas/SearchFormSchema";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { Car } from "@prisma/client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import SearchCars from "./SearchCars";
import SearchMap from "./SearchMap";

type Props = {};

const SearchWrapper = (props: Props) => {
  // Params
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Router
  const router = useRouter();

  // Pathname
  const pathname = usePathname();

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

  // onSubmit Callback
  const onSubmit: SubmitHandler<SearchFormSchemaType> = async (data, event) => {
    event?.preventDefault();
    try {
      // Set New Search Params
      const params = new URLSearchParams(searchParams.toString());
      params.set("locationId", data.locationId);
      params.set("startDate", data.date.from.toISOString());
      params.set("endDate", data.date.to.toISOString());
      params.set("location", encodeURIComponent(data.location));
      // Refresh Page
      router.push(pathname + "?" + params);
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  const cars: Car[] = data?.getAvailableCars;

  if (loading)
    return (
      <div className="flex flex-1 flex-col items-center space-y-4 p-2 md:p-3 lg:p-4 xl:p-5">
        <SearchForm onSubmit={onSubmit} />
        <Skeleton className="h-[50dvh] w-full" />
        <div className="grid h-full w-full grid-cols-1 place-content-center gap-4 p-2 md:grid-cols-2 md:p-3 lg:grid-cols-3 lg:p-4 xl:grid-cols-3">
          <Skeleton className="h-[50dvh] w-full" />
          <Skeleton className="h-[50dvh] w-full" />
          <Skeleton className="h-[50dvh] w-full" />
        </div>
      </div>
    );

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places", "geocoding"]}
    >
      <div className="flex flex-1 flex-col items-center space-y-4 p-2 md:p-3 lg:p-4 xl:p-5">
        <SearchForm onSubmit={onSubmit} />
        {error || cars?.length <= 0 ? (
          <p>No Car Available. Please Change Dates.</p>
        ) : (
          <>
            <SearchMap cars={cars} />
            <SearchCars cars={cars} />
          </>
        )}
      </div>
    </APIProvider>
  );
};

export default SearchWrapper;
