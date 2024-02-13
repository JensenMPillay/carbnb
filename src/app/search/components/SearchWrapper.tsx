"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import SearchContainer from "./SearchContainer";

type Props = {};

const SearchPageWrapper = (props: Props) => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places", "geocoding", "marker"]}
    >
      <SearchContainer />
    </APIProvider>
  );
};

export default SearchPageWrapper;
