"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import SearchForm from "./SearchForm";

type Props = {};

const SearchFormWrapper = (props: Props) => {
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
