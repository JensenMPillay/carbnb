"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { SearchFormSchemaType } from "../lib/schemas/SearchFormSchema";
import SearchForm from "./SearchForm";

type Props = {};

const SearchFormWrapper = (props: Props) => {
  // Router
  const router = useRouter();

  // onSubmit Callback
  const onSubmit: SubmitHandler<SearchFormSchemaType> = async (data, event) => {
    event?.preventDefault();
    try {
      // Set Search Params
      const params = new URLSearchParams({
        locationId: data.location.id,
        startDate: data.date.from.toISOString(),
        endDate: data.date.to.toISOString(),
      });
      // Redirect
      router.push(`/search?${params}`);
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places", "geocoding"]}
    >
      <SearchForm onSubmit={onSubmit} />
    </APIProvider>
  );
};

export default SearchFormWrapper;
