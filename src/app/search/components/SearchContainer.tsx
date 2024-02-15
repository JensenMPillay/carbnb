"use client";
import SearchForm from "@/src/components/SearchForm";
import { Skeleton } from "@/src/components/ui/skeleton";
import useGeocoder from "@/src/hooks/useGeocoder";
import { GET_AVAILABLE_CARS_QUERY } from "@/src/lib/graphql/car";
import { showErrorNotif } from "@/src/lib/notifications/toasters";
import { SearchFormSchemaType } from "@/src/lib/schemas/SearchFormSchema";
import useSearchStore from "@/src/store/useSearchStore";
import useStore from "@/src/store/useStore";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import CarSheet from "./CarSheet";
import SearchMap from "./SearchMap";

type Props = {};

const SearchContainer = (props: Props) => {
  // Params
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Router
  const router = useRouter();

  // Pathname
  const pathname = usePathname();

  // Geocoder
  const { getFormattedLocation } = useGeocoder();

  // Store
  const { setSearchValues, setCars } = useSearchStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const cars = useStore(useSearchStore, (state) => state.cars);

  // Get Query
  const { loading, error, data } = useQuery(GET_AVAILABLE_CARS_QUERY, {
    variables: {
      startDate: startDate && new Date(startDate),
      endDate: endDate && new Date(endDate),
    },
    onCompleted: async (data) => {
      // Set Cars Data
      setCars(data?.getAvailableCars);
    },
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
      params.set("locationId", data.location.id);
      params.set("startDate", data.date.from.toISOString().slice(0, 10));
      params.set("endDate", data.date.to.toISOString().slice(0, 10));
      // Refresh Page
      router.push(pathname + "?" + params);
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  useEffect(() => {
    // Prefill Form
    const updateValues = async () => {
      if (!(locationId && startDate && endDate)) return;
      // Get FormattedLocation
      const formattedLocation = await getFormattedLocation(locationId);
      if (!formattedLocation) return;
      // Set SearchValues
      setSearchValues({
        locationId: locationId,
        startDate: startDate,
        endDate: endDate,
        formattedLocation: formattedLocation,
      });
    };
    updateValues();
    return () => {};
  }, [locationId, startDate, endDate, getFormattedLocation, setSearchValues]);

  if (loading)
    return (
      <div className="flex flex-1 flex-col items-center space-y-4 p-2 md:p-3 lg:p-4 xl:p-5">
        <SearchForm onSubmit={onSubmit} />
        <Skeleton className="h-[75dvh] w-full" />
      </div>
    );

  return (
    <div className="flex flex-1 flex-col items-center space-y-4 p-2 md:p-3 lg:p-4 xl:p-5">
      <SearchForm onSubmit={onSubmit} />
      {error || !cars || cars?.length <= 0 ? (
        <p>No cars available. Please adjust your dates.</p>
      ) : (
        <>
          <SearchMap />
          <CarSheet />
        </>
      )}
    </div>
  );
};

export default SearchContainer;
