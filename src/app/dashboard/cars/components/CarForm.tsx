"use client";
import { CarQuery } from "@/src/@types/queries.types";
import AddressFormField from "@/src/components/AddressFormField";
import {
  EuroIcon,
  FuelTypeIcon,
  TransmissionIcon,
} from "@/src/components/CarCardIcons";
import ComboboxFormField from "@/src/components/ComboboxFormField";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import useGeocoder from "@/src/hooks/useGeocoder";
import { showNotif } from "@/src/lib/notifications/toasters";
import { CarSchemaType, carSchema } from "@/src/lib/schemas/car/CarSchema";
import { cn, getCarModels, getCarTrueColors } from "@/src/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Brand,
  Category,
  Color,
  FuelType,
  Location,
  Transmission,
} from "@prisma/client";
import { PropsWithChildren, useEffect, useState } from "react";
import { Path, SubmitHandler, useForm } from "react-hook-form";
import CarFormImage from "./CarFormImage";

type CarProps = {
  car?: CarQuery;
  callbackAction: ({
    carData,
    locationData,
  }: {
    carData: CarSchemaType;
    locationData: Location | undefined;
  }) => Promise<void>;
};

const CarForm = ({
  car,
  callbackAction,
  children,
}: PropsWithChildren<CarProps>) => {
  // Item Arrays
  const [models, setModels] = useState<string[]>([]);
  const [trueColors, setTrueColors] = useState<string[]>([]);

  // Enums
  const brands = Object.keys(Brand) as Array<keyof typeof Brand>;
  const categories = Object.keys(Category) as Array<keyof typeof Category>;
  const primaryColors = Object.keys(Color) as Array<keyof typeof Color>;
  const transmissions = Object.keys(Transmission) as Array<
    keyof typeof Transmission
  >;
  const fuelTypes = Object.keys(FuelType) as Array<keyof typeof FuelType>;

  // Watched Fields
  const watchedFields: Path<CarSchemaType>[] = [
    "brand",
    "model",
    "year",
    "primaryColor",
    "trueColor",
  ];

  // Form
  const carForm = useForm<CarSchemaType>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      category: "COMPACT",
      brand: "ACURA",
      model: "",
      year: 2010,
      primaryColor: "AQUA",
      trueColor: "",
      transmission: "AUTOMATIC",
      fuelType: "DIESEL",
      imageUrl: "https://dummyimage.com/280x250/21322F/4cc2ae",
      pricePerDay: 50,
      location: {
        id: "",
        description: "",
      },
    },
  });

  // Geocoder
  const { getLocation } = useGeocoder();

  // onSubmit Callback
  const onSubmit: SubmitHandler<CarSchemaType> = async (data, event) => {
    event?.preventDefault();
    showNotif({
      description: "Submitting your request, please wait...",
    });
    try {
      const location = await getLocation(data.location.id);
      await callbackAction({ carData: data, locationData: location });
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  // Update Models List by Brand & Year
  const updateModelItems: () => Promise<void> = async () => {
    const { brand, year } = carForm.getValues();
    const brandPrefix = brand.split("_")[0];
    try {
      const carModels: string[] = await getCarModels({
        brand: brandPrefix,
        year: Number(year),
      });
      setModels(carModels);
    } catch (error) {
      console.error(error);
    }
  };

  // Update TrueColor List by Brand & PrimaryColor
  const updateTrueColorItems: () => Promise<void> = async () => {
    const { brand, primaryColor } = carForm.getValues();
    const brandPrefix = brand.split("_")[0];
    try {
      const carTrueColors: string[] = await getCarTrueColors({
        brand: brandPrefix,
        primaryColor: primaryColor,
      });
      setTrueColors(carTrueColors);
    } catch (error) {
      console.error(error);
    }
  };

  // Prefill Form
  useEffect(() => {
    if (car)
      carForm.reset({
        ...car,
        imageUrl: car.imageUrl[0],
        location: {
          id: car.locationId,
          description: car.location.formatted_address,
        },
      });
    return () => {};
  }, [car, carForm]);

  return (
    <Card className="bg-card/75">
      <Form {...carForm}>
        <form id="carForm" onSubmit={carForm.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col space-y-2 p-4 md:p-5 lg:p-6">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <ComboboxFormField
                form={carForm}
                fieldName="brand"
                items={brands}
                prismaEnum={Brand}
                resetFields={() => {
                  carForm.resetField("model");
                  carForm.resetField("trueColor");
                }}
              />
              <FormField
                control={carForm.control}
                name="year"
                render={({ field: { onChange, ...rest }, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1950}
                        max={new Date().getFullYear()}
                        placeholder="2010"
                        autoCapitalize="off"
                        autoComplete="on"
                        autoCorrect="off"
                        className={cn(
                          "w-fit text-muted-foreground focus:text-foreground",
                          fieldState.isTouched && "text-foreground",
                        )}
                        onChange={(event) => {
                          onChange(parseInt(event.target.value));
                          carForm.resetField("model");
                        }}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ComboboxFormField
                form={carForm}
                fieldName="category"
                items={categories}
                prismaEnum={Category}
              />
              <ComboboxFormField
                form={carForm}
                fieldName="model"
                items={models}
                updateItems={updateModelItems}
              />
              <ComboboxFormField
                form={carForm}
                fieldName="primaryColor"
                items={primaryColors}
                prismaEnum={Color}
                resetFields={() => {
                  carForm.resetField("trueColor");
                }}
              />
              <ComboboxFormField
                form={carForm}
                fieldName="trueColor"
                items={trueColors}
                updateItems={updateTrueColorItems}
              />
            </div>
            <div className="relative aspect-square h-[300px] w-fit self-center rounded-lg border border-muted">
              <CarFormImage
                form={carForm}
                fieldName="imageUrl"
                watchedFields={watchedFields}
              />
            </div>
            <div className="grid grid-cols-1 place-content-center place-items-center gap-4 md:grid-cols-3">
              <div className="block space-y-1">
                <span>
                  <TransmissionIcon className="mx-auto size-6" />
                </span>
                <ComboboxFormField
                  form={carForm}
                  fieldName="transmission"
                  items={transmissions}
                  prismaEnum={Transmission}
                />
              </div>
              <div className="block space-y-1">
                <span>
                  <FuelTypeIcon className="mx-auto size-6" />
                </span>
                <ComboboxFormField
                  form={carForm}
                  fieldName="fuelType"
                  items={fuelTypes}
                  prismaEnum={FuelType}
                />
              </div>
              <div className="block space-y-1">
                <span>
                  <EuroIcon className="mx-auto size-6" />
                </span>
                <FormField
                  control={carForm.control}
                  name="pricePerDay"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Price</FormLabel>
                      <div className="flex flex-row text-3xl font-extrabold leading-10">
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="9999"
                            placeholder="50"
                            autoCapitalize="off"
                            autoComplete="on"
                            autoCorrect="off"
                            className={cn(
                              "w-fit text-muted-foreground focus:text-foreground",
                              fieldState.isTouched && "text-foreground",
                            )}
                            {...field}
                          />
                        </FormControl>
                        <span className="self-start text-sm">€</span>
                        <span className="self-end text-sm font-medium leading-4 text-muted-foreground">
                          /day
                        </span>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <AddressFormField
                form={carForm}
                fieldName="location"
                defaultValue={
                  car
                    ? {
                        id: car.location.id,
                        description: car.location.formatted_address,
                      }
                    : undefined
                }
                classNameLabel="capitalize"
                classNameInput="flex h-9 w-full rounded-md border-none bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                classNameInputWrapper="border"
                classNameListWrapper="border-b p-1 pl-3"
              />
            </div>
          </CardContent>
          <CardFooter className="mx-auto flex justify-between p-1 md:p-2 lg:p-3">
            {children}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CarForm;
