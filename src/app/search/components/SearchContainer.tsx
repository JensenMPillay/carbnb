"use client";
import SearchForm from "@/src/components/SearchForm";
import { Skeleton } from "@/src/components/ui/skeleton";
import useGeocoder from "@/src/hooks/useGeocoder";
import { GET_AVAILABLE_CARS_QUERY } from "@/src/lib/graphql/car";
import { showErrorNotif } from "@/src/lib/notifications/toasters";
import useSearchStore from "@/src/store/useSearchStore";
import useStore from "@/src/store/useStore";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import CarSheet from "./CarSheet";
import SearchMap from "./SearchMap";

const SearchContainer = () => {
  // Params
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Geocoder
  const { getFormattedLocation } = useGeocoder();

  // Store
  const { setSearchValues, setCars } = useSearchStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const cars = useStore(useSearchStore, (state) => state.cars);
  const date = useStore(
    useSearchStore,
    (state) => state.searchValues?.formValues.date,
  );

  // Get Query
  const { loading, error, data } = useQuery(GET_AVAILABLE_CARS_QUERY, {
    variables: {
      startDate: startDate
        ? new Date(startDate)
        : date
          ? new Date(date.from)
          : new Date(),
      endDate: endDate
        ? new Date(endDate)
        : date
          ? new Date(date.to)
          : new Date(),
    },
    onCompleted: (data) => {
      // setCars(data?.getAvailableCars);
    },
    onError: (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Query Error : ", error);
    },
    pollInterval: 5000,
    ssr: false,
  });

  useEffect(() => {
    // Set Cars Data
    setCars(data?.getAvailableCars);
    return () => {};
  }, [data, setCars]);

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

  return (
    <div className="flex flex-1 flex-col items-center space-y-4 p-2 md:p-3 lg:p-4 xl:p-5">
      <SearchForm />
      {loading ? (
        <Skeleton className="h-[75dvh] w-full" />
      ) : error || !cars || cars.length <= 0 ? (
        <p className="text-center text-xl font-semibold">
          No cars available. <br />
          Please adjust your dates.
        </p>
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
