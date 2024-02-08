"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { APIProvider } from "@vis.gl/react-google-maps";
import { addDays, format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  SearchFormSchemaType,
  searchFormSchema,
} from "../lib/schemas/SearchFormSchema";
import { cn } from "../lib/utils";
import AddressFormField from "./AddressFormField";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

type SearchFormProps = {
  onSubmit: SubmitHandler<SearchFormSchemaType>;
};

const SearchForm = ({ onSubmit }: SearchFormProps) => {
  const [defaultValue, setDefaultValue] = useState<string>("");
  // Params
  const searchParams = useSearchParams();
  const locationId = searchParams.get("locationId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const location = searchParams.get("location");

  // Form
  const searchForm = useForm<SearchFormSchemaType>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      locationId: "",
      location: "",
      date: { from: new Date(), to: addDays(new Date(), 7) },
    },
  });

  // PrefillForm
  useEffect(() => {
    if (locationId && location && startDate && endDate) {
      searchForm.reset({
        locationId: locationId,
        location: decodeURIComponent(location),
        date: {
          from: new Date(startDate),
          to: new Date(endDate),
        },
      });
      setDefaultValue(decodeURIComponent(location));
    }
    return () => {};
  }, [searchForm, locationId, startDate, endDate, location]);

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places", "geocoding"]}
    >
      <Form {...searchForm}>
        <form
          onSubmit={searchForm.handleSubmit(onSubmit)}
          className="flex max-h-fit w-3/4 min-w-fit flex-col items-center justify-center rounded-lg bg-card text-lg shadow-md backdrop-blur-sm md:text-base lg:w-full lg:flex-row lg:items-center lg:rounded-full lg:text-sm"
        >
          <AddressFormField
            form={searchForm}
            fieldNameId="locationId"
            fieldName="location"
            defaultValue={defaultValue}
            classNameItem="group flex w-full lg:w-2/4 flex-col rounded-t-lg px-4 py-2 transition-all duration-300 ease-in-out lg:h-fit lg:rounded-l-full lg:pl-8"
            classNameLabel="text-base uppercase text-primary transition-all duration-300 ease-in-out group-hover:text-foreground md:text-sm lg:text-xs"
            classNameInput="border-none bg-transparent px-0 py-0 outline-none focus-visible:ring-0"
            classNameInputWrapper="border-none"
            classNameListWrapper="border-none"
          />
          <Separator
            orientation="vertical"
            className="hidden h-3/4 lg:inline-block"
          />
          <Separator
            orientation="horizontal"
            className="inline-block w-3/4 lg:hidden"
          />
          <FormField
            control={searchForm.control}
            name="date"
            render={({ field, fieldState }) => (
              <>
                <FormItem className="group relative flex w-full flex-col px-4 py-2 transition-all duration-300 ease-in-out lg:w-1/4">
                  <FormLabel
                    className={cn(
                      "text-base uppercase text-primary transition-all duration-300 ease-in-out group-hover:text-foreground md:text-sm lg:text-xs",
                      fieldState.error && "text-destructive",
                    )}
                  >
                    Start
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn(
                            "border-none bg-transparent px-0 py-0 text-left font-normal text-foreground outline-none",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value.from ? (
                            format(field.value.from, "PPP")
                          ) : (
                            <span>When</span>
                          )}
                          <CalendarIcon className="mx-2 size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > new Date("2025-01-01")
                        }
                        numberOfMonths={2}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
                <Separator
                  orientation="vertical"
                  className="hidden h-3/4 lg:inline-block"
                />
                <Separator
                  orientation="horizontal"
                  className="inline-block w-3/4 lg:hidden"
                />
                <FormItem className="group relative flex w-full flex-col px-4 py-2 transition-all duration-300 ease-in-out lg:w-1/4">
                  <FormLabel
                    className={cn(
                      "text-base uppercase text-primary transition-all duration-300 ease-in-out group-hover:text-foreground md:text-sm lg:text-xs",
                      fieldState.error && "text-destructive",
                    )}
                  >
                    End
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn(
                            "border-none bg-transparent px-0 py-0 text-left font-normal text-foreground outline-none",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value.to ? (
                            format(field.value.to, "PPP")
                          ) : (
                            <span>When</span>
                          )}
                          <CalendarIcon className="mx-2 size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > new Date("2025-01-01")
                        }
                        numberOfMonths={2}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              </>
            )}
          />
          <div className="group flex min-w-fit flex-col items-center justify-center rounded-b-lg px-4 py-2 lg:h-fit lg:rounded-r-full">
            <Button
              type="submit"
              className="max-w-fit cursor-pointer rounded-full bg-primary p-4 text-accent transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:bg-accent group-hover:text-accent-foreground md:p-3 lg:right-3 lg:top-1/2 lg:p-2"
            >
              <MagnifyingGlassIcon className="size-5" />
            </Button>
          </div>
        </form>
      </Form>
    </APIProvider>
  );
};

export default SearchForm;
