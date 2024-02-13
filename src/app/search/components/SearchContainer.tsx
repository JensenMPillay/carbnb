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
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import SearchMap from "./SearchMap";
import SearchSheet from "./SearchSheet";

type Props = {};

const SearchContainer = (props: Props) => {
  // location Coordinates State
  const [locationLatLng, setLocationLatLng] =
    useState<google.maps.LatLngLiteral>();

  // Form defaultValues State
  const [defaultValues, setDefaultValues] = useState<SearchFormSchemaType>();

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
  const { getLocation } = useGeocoder();

  // Cars Store
  const { setCars } = useSearchStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const cars = useStore(useSearchStore, (state) => state.cars);

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
      params.set("locationId", data.location.id);
      params.set("startDate", data.date.from.toISOString());
      params.set("endDate", data.date.to.toISOString());
      // Refresh Page
      router.push(pathname + "?" + params);
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  useEffect(() => {
    // Prefill Form & getLatLng Location
    const updateValues = async () => {
      if (!(locationId && startDate && endDate)) return;
      // Get Location
      const location = await getLocation(locationId);
      if (!location) return;
      // Set Default Values
      setDefaultValues({
        location: {
          id: locationId,
          description: `${location.address}, ${location.postalCode}, ${location.city}, ${location.state}, ${location.country}`,
        },
        date: {
          from: new Date(startDate),
          to: new Date(endDate),
        },
      });
      // Get Location Coordinates
      if (!(location.latitude && location.longitude)) return;
      setLocationLatLng({
        lat: location.latitude,
        lng: location.longitude,
      });
    };
    updateValues();
    return () => {};
  }, [locationId, startDate, endDate, getLocation]);

  useEffect(() => {
    // Set Cars Data
    setCars(data?.getAvailableCars);
    return () => {};
  }, [setCars, data?.getAvailableCars]);

  if (loading)
    return (
      <div className="flex flex-1 flex-col items-center space-y-4 p-2 md:p-3 lg:p-4 xl:p-5">
        <SearchForm onSubmit={onSubmit} defaultValues={defaultValues} />
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
          <SearchMap locationLatLng={locationLatLng} />
          <SearchSheet />
        </>
      )}
    </div>
  );
};

export default SearchContainer;
