"use client";
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
        locationId: data.locationId,
        startDate: data.date.from.toISOString(),
        endDate: data.date.to.toISOString(),
        location: encodeURIComponent(data.location),
      });
      // Redirect
      router.push(`/search?${params}`);
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  return <SearchForm onSubmit={onSubmit} />;
};

export default SearchFormWrapper;
