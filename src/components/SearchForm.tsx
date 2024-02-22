"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  SearchFormSchemaType,
  searchFormSchema,
} from "../lib/schemas/SearchFormSchema";
import { cn } from "../lib/utils";
import useSearchStore from "../store/useSearchStore";
import useStore from "../store/useStore";
import AddressFormField from "./AddressFormField";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

const SearchForm = () => {
  // Router
  const router = useRouter();

  // Form
  const searchForm = useForm<SearchFormSchemaType>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      location: {
        id: "",
        description: "",
      },
      date: { from: new Date(), to: addDays(new Date(), 7) },
    },
  });

  // onSubmit Callback
  const onSubmit: SubmitHandler<SearchFormSchemaType> = async (data, event) => {
    event?.preventDefault();
    try {
      // Set Search Params
      const params = new URLSearchParams({
        locationId: data.location.id,
        startDate: data.date.from.toDateString(),
        endDate: data.date.to.toDateString(),
      });
      // Redirect
      router.push(`/search?${params}`);
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  // Access to Store Data after Rendering (SSR Behavior)
  const defaultValues = useStore(
    useSearchStore,
    (state) => state.searchValues?.formValues,
  );

  // PrefillForm
  useEffect(() => {
    if (defaultValues) {
      const { location, date } = defaultValues;
      searchForm.reset({
        location: {
          id: location.id,
          description: location.description,
        },
        // Verify Date > Today
        date: {
          from: new Date(
            Math.max(new Date(date.from).getTime(), new Date().getTime()),
          ),
          to: new Date(
            Math.max(new Date(date.to).getTime(), new Date().getTime()),
          ),
        },
      });
    }
    return () => {};
  }, [searchForm, defaultValues]);

  return (
    <Form {...searchForm}>
      <form
        onSubmit={searchForm.handleSubmit(onSubmit)}
        className="z-10 flex max-h-fit w-3/4 min-w-fit flex-col items-center justify-center rounded-lg bg-card text-lg shadow-md backdrop-blur-sm md:text-base lg:w-full lg:flex-row lg:items-center lg:rounded-full lg:text-sm"
      >
        <AddressFormField
          form={searchForm}
          fieldName="location"
          defaultValue={defaultValues?.location}
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
                {fieldState.error && (
                  <FormMessage>
                    Please enter a date after current date
                  </FormMessage>
                )}
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
                {fieldState.error && (
                  <FormMessage>
                    Please enter a date after current date
                  </FormMessage>
                )}
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
  );
};

export default SearchForm;
