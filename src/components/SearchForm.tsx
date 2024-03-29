"use client";
import useStore from "@/src/hooks/useStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { addDays, format, max } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  SearchFormSchemaType,
  searchFormSchema,
} from "../lib/schemas/SearchFormSchema";
import { cn } from "../lib/utils";
import useSearchStore from "../store/useSearchStore";
import AddressFormField from "./AddressFormField";
import { Button, buttonVariants } from "./ui/button";
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

/**
 * SearchForm component for rendering a search form.
 * @component
 * @example
 * <SearchForm />
 */
const SearchForm = () => {
  // Router
  const router = useRouter();

  // Pathname
  const pathname = usePathname();

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
      router.push(`/search?${params}`, { scroll: pathname != "/search" });
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
          from: max([new Date(date.from), new Date()]),
          to: max([new Date(date.to), new Date()]),
        },
      });
    }
    return () => {};
  }, [searchForm, defaultValues]);

  return (
    <Form {...searchForm}>
      <form
        onSubmit={searchForm.handleSubmit(onSubmit)}
        className="z-10 flex max-h-fit w-3/4 min-w-fit flex-col items-center justify-center rounded-lg bg-card/75 text-lg shadow-md backdrop-blur-sm md:text-base lg:w-full lg:flex-row lg:items-center lg:rounded-full lg:text-sm"
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
          className="hidden h-12 lg:inline-block"
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
                className="hidden h-12 lg:inline-block"
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
        <Button
          type="submit"
          className={cn(
            buttonVariants({ variant: "default", size: "icon" }),
            "my-2 size-12 rounded-full lg:mx-2 lg:my-0",
          )}
        >
          <MagnifyingGlassIcon className="absolute size-6" />
        </Button>
      </form>
    </Form>
  );
};

export default SearchForm;
