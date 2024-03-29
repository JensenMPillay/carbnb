"use client";
import { Skeleton } from "@/src/components/ui/skeleton";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Suspense } from "react";
import SearchContainer from "./SearchContainer";

/**
 * Wrapper component for the search page.
 * Provides the necessary context for using the Google Maps API and renders the SearchContainer component.
 * @component
 * @example
 * <SearchPageWrapper />
 */
const SearchPageWrapper = () => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places", "geocoding", "marker", "geometry"]}
    >
      <Suspense fallback={<Skeleton className="h-[75dvh] w-full" />}>
        <SearchContainer />
      </Suspense>
    </APIProvider>
  );
};

export default SearchPageWrapper;
