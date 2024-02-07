"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Car } from "@prisma/client";
import Image from "next/image";
import { PropsWithChildren } from "react";
import { cn } from "../lib/utils";
import { FuelTypeIcon, TransmissionIcon, YearIcon } from "./CarCardIcons";

type CarCardProps = {
  car: Car;
  className?: string;
};

const CarCard = ({
  car: {
    category,
    brand,
    model,
    year,
    transmission,
    fuelType,
    imageUrl,
    pricePerDay,
  },
  className,
  children,
}: PropsWithChildren<CarCardProps>) => {
  return (
    <Card
      className={cn(
        "overflow-hidden border-transparent bg-transparent",
        className,
      )}
    >
      <CardHeader className="flex flex-col items-start justify-between space-y-0 p-1 md:p-2 lg:p-3">
        <CardTitle className="space-x-2 truncate text-xl normal-case">
          <span className="font-semibold capitalize">{brand}</span>
          <span className="font-light uppercase">{model}</span>
        </CardTitle>
        <CardDescription className="flex w-full flex-row justify-between">
          <span className="uppercase">{category}</span>
          <span className="flex h-fit text-3xl font-extrabold leading-10 text-primary">
            {pricePerDay}
            <span className="self-start text-sm">€</span>
            <span className="self-end text-sm font-medium leading-4 text-muted-foreground">
              /day
            </span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2 p-1 md:p-2 lg:p-3">
        <Carousel>
          <CarouselContent>
            {imageUrl.map((url, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square h-[250px] w-full rounded-lg border border-muted">
                  <Image
                    src={url}
                    alt="car model"
                    className="object-contain"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-[4px]" />
          <CarouselNext className="right-[4px]" />
        </Carousel>
        <div className="grid grid-cols-3 place-content-center place-items-center gap-4">
          <div className="block space-y-1">
            <span>
              <TransmissionIcon className="mx-auto size-6" />
            </span>
            <span className="uppercase text-muted-foreground">
              {transmission}
            </span>
          </div>
          <div className="block space-y-1">
            <span>
              <FuelTypeIcon className="mx-auto size-6" />
            </span>
            <span className="uppercase text-muted-foreground">{fuelType}</span>
          </div>
          <div className="block space-y-1">
            <span>
              <YearIcon className="mx-auto size-6" />
            </span>
            <span className="uppercase text-muted-foreground">{year}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mx-auto flex justify-between p-1 md:p-2 lg:p-3">
        {children}
      </CardFooter>
    </Card>
  );
};

export default CarCard;
