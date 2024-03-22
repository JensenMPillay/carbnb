"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import SearchForm from "./SearchForm";

/**
 * SearchFormWrapper component for wrapping the SearchForm component with the APIProvider to provide Google Maps API functionality (places, geocoding).
 * @component
 * @example
 * <SearchFormWrapper />
 */
const SearchFormWrapper = () => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places", "geocoding"]}
    >
      <SearchForm />
    </APIProvider>
  );
};

export default SearchFormWrapper;
