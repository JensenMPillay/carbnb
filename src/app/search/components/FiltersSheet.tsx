"use client";
import ComboboxFormField from "@/src/components/ComboboxFormField";
import RangeInputFormField from "@/src/components/RangeInputFormField";
import ToggleGroupFormField from "@/src/components/ToggleGroupFormField";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import useGeometry from "@/src/hooks/useGeometry";
import {
  CarFilterSchemaType,
  carFilterSchema,
} from "@/src/lib/schemas/car/CarSchema";
import useSearchStore from "@/src/store/useSearchStore";
import useStore from "@/src/store/useStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brand, Category, FuelType, Transmission } from "@prisma/client";
import { MixerVerticalIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";

const FiltersSheet = () => {
  // Enums
  const brands = useMemo(
    () => Object.keys(Brand) as Array<keyof typeof Brand>,
    [],
  );
  const categories = useMemo(
    () => Object.keys(Category) as Array<keyof typeof Category>,
    [],
  );
  const transmissions = useMemo(
    () => Object.keys(Transmission) as Array<keyof typeof Transmission>,
    [],
  );
  const fuelTypes = useMemo(
    () => Object.keys(FuelType) as Array<keyof typeof FuelType>,
    [],
  );

  // Store
  const { setFilters, setFilteredCars } = useSearchStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const cars = useStore(useSearchStore, (state) => state.cars);
  const location = useStore(
    useSearchStore,
    (state) => state.searchValues?.formattedLocation,
  );

  const { filterCars } = useGeometry();

  // Form
  const carFilterForm = useForm<CarFilterSchemaType>({
    resolver: zodResolver(carFilterSchema),
    defaultValues: {
      year: 1950,
      pricePerDay: 2500,
      radius: 25,
    },
  });

  // onSubmit Callback
  const onSubmit: SubmitHandler<CarFilterSchemaType> = async (data, event) => {
    event?.preventDefault();
    try {
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  const watchForm = useWatch({
    control: carFilterForm.control,
  });

  useEffect(() => {
    if (!cars) return;
    setFilters(watchForm);
    if (Object.keys(watchForm).length != 0 && location) {
      setFilteredCars(
        filterCars({ filters: watchForm, cars: cars, location: location }),
      );
    } else {
      setFilteredCars(cars);
    }
    console.log(watchForm);
    return () => {};
  }, [watchForm, setFilters, setFilteredCars, filterCars, cars, location]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-4"
        >
          <MixerVerticalIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex flex-col justify-between overflow-y-auto"
        side="left"
      >
        <SheetHeader>
          <SheetTitle>Car Filters</SheetTitle>
          <SheetDescription>
            Refine your search for the perfect car with our customizable
            filters.
          </SheetDescription>
        </SheetHeader>
        <Form {...carFilterForm}>
          <form
            id="carFilterForm"
            onSubmit={carFilterForm.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <div className="grid max-w-fit grid-cols-1 gap-2">
              <ToggleGroupFormField
                form={carFilterForm}
                fieldName="category"
                items={categories}
                type="multiple"
              />
              <ComboboxFormField
                form={carFilterForm}
                fieldName="brand"
                items={brands}
                prismaEnum={Brand}
              />
              <RangeInputFormField
                form={carFilterForm}
                fieldName="year"
                minValue={1950}
                maxValue={new Date().getFullYear()}
                step={1}
              />
              <ToggleGroupFormField
                form={carFilterForm}
                fieldName="transmission"
                items={transmissions}
                type="multiple"
              />
              <ToggleGroupFormField
                form={carFilterForm}
                fieldName="fuelType"
                items={fuelTypes}
                type="multiple"
              />
              <RangeInputFormField
                form={carFilterForm}
                fieldName="pricePerDay"
                minValue={0}
                maxValue={2500}
                step={100}
                unit="€"
              />
              <RangeInputFormField
                form={carFilterForm}
                fieldName="radius"
                minValue={0}
                maxValue={100}
                step={5}
                unit="km"
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="default" type="submit">
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSheet;
