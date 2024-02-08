"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { APIProvider } from "@vis.gl/react-google-maps";
import { addDays, format } from "date-fns";
import { useRouter } from "next/navigation";
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

type Props = {};

const SearchForm = (props: Props) => {
  // Router
  const router = useRouter();

  // Form
  const searchForm = useForm<SearchFormSchemaType>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      locationId: "",
      date: { from: new Date(), to: addDays(new Date(), 7) },
    },
  });

  // onSubmit Callback
  const onSubmit: SubmitHandler<SearchFormSchemaType> = async (data, event) => {
    event?.preventDefault();
    try {
      const params = new URLSearchParams({
        locationId: data.locationId,
        startDate: data.date.from.toISOString(),
        endDate: data.date.to.toISOString(),
      });
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
      <Form {...searchForm}>
        <form
          onSubmit={searchForm.handleSubmit(onSubmit)}
          className="order-2 flex max-h-fit w-3/4 min-w-fit flex-col items-center justify-center rounded-lg bg-card text-lg shadow-md backdrop-blur-sm md:text-base xl:order-1 xl:w-full xl:flex-row xl:items-center xl:rounded-full xl:text-sm"
        >
          <AddressFormField
            form={searchForm}
            fieldName="locationId"
            classNameItem="group flex w-full xl:w-2/4 flex-col rounded-t-lg px-4 py-2 transition-all duration-300 ease-in-out xl:h-fit xl:rounded-l-full xl:pl-8"
            classNameLabel="text-base uppercase text-primary transition-all duration-300 ease-in-out group-hover:text-foreground md:text-sm xl:text-xs"
            classNameInput="border-none bg-transparent px-0 py-0 outline-none focus-visible:ring-0"
            classNameInputWrapper="border-none"
            classNameListWrapper="border-none"
          />
          <Separator
            orientation="vertical"
            className="hidden h-3/4 xl:inline-block"
          />
          <Separator
            orientation="horizontal"
            className="inline-block w-3/4 xl:hidden"
          />
          <FormField
            control={searchForm.control}
            name="date"
            render={({ field, fieldState }) => (
              <>
                <FormItem className="group relative flex w-full flex-col px-4 py-2 transition-all duration-300 ease-in-out xl:w-1/4">
                  <FormLabel
                    className={cn(
                      "text-base uppercase text-primary transition-all duration-300 ease-in-out group-hover:text-foreground md:text-sm xl:text-xs",
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
                  className="hidden h-3/4 xl:inline-block"
                />
                <Separator
                  orientation="horizontal"
                  className="inline-block w-3/4 xl:hidden"
                />
                <FormItem className="group relative flex w-full flex-col px-4 py-2 transition-all duration-300 ease-in-out xl:w-1/4">
                  <FormLabel
                    className={cn(
                      "text-base uppercase text-primary transition-all duration-300 ease-in-out group-hover:text-foreground md:text-sm xl:text-xs",
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
          <div className="group flex min-w-fit flex-col items-center justify-center rounded-b-lg px-4 py-2 xl:h-fit xl:rounded-r-full">
            <Button
              type="submit"
              className="max-w-fit cursor-pointer rounded-full bg-primary p-4 text-accent transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:bg-accent group-hover:text-accent-foreground md:p-3 xl:right-3 xl:top-1/2 xl:p-2"
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
