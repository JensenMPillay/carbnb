"use client";
import { CarQuery } from "@/src/@types/queries.types";
import { Button, buttonVariants } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { UPDATE_CAR_MUTATION } from "@/src/lib/graphql/car";
import { REGISTER_LOCATION_MUTATION } from "@/src/lib/graphql/location";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import { CarSchemaType } from "@/src/lib/schemas/car/CarSchema";
import { cn } from "@/src/lib/utils";
import { useMutation } from "@apollo/client";
import { Location } from "@prisma/client";
import { UpdateIcon } from "@radix-ui/react-icons";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useState } from "react";
import CarForm from "./CarForm";

type CarProps = {
  car?: CarQuery;
};

type CallbackActionProps = {
  carData: CarSchemaType;
  locationData: Location | undefined;
};

const UpdateCarButton = ({ car }: CarProps) => {
  // Open State
  const [open, setOpen] = useState<boolean>(false);

  // Mutation
  const [registerLocation] = useMutation(REGISTER_LOCATION_MUTATION, {
    // onCompleted: async (data) => {
    //   showNotif({
    //     description: "Your car is added successfully",
    //   });
    // },
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
    },
  });

  // Mutation
  const [updateCar] = useMutation(UPDATE_CAR_MUTATION, {
    onCompleted: async (data) => {
      showNotif({
        description: "Your car is updated successfully",
      });
    },
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
    },
    refetchQueries: "active",
  });

  // Callback Action
  const updateCarCallback = async ({
    carData,
    locationData,
  }: CallbackActionProps) => {
    if (car) {
      await registerLocation({
        variables: locationData,
      });
      await updateCar({
        variables: { ...carData, id: car.id },
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <UpdateIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Your Car</DialogTitle>
          <DialogDescription>
            List your car for rental in just a few simple steps.
          </DialogDescription>
        </DialogHeader>
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          libraries={["places", "geocoding"]}
        >
          <CarForm car={car} callbackAction={updateCarCallback} />
        </APIProvider>
        <DialogFooter>
          <DialogClose
            className={cn(
              buttonVariants({ variant: "outline" }),
              "my-1 w-fit place-self-center",
            )}
          >
            Cancel
          </DialogClose>
          <Button
            type="submit"
            className="my-1 w-fit place-self-center"
            variant="default"
            form="carForm"
            size="default"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCarButton;
