"use client";
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
import { Loader } from "@/src/components/ui/loader";
import { REGISTER_CAR_MUTATION } from "@/src/lib/graphql/car";
import { REGISTER_LOCATION_MUTATION } from "@/src/lib/graphql/location";
import {
  showErrorNotif,
  showNotif,
  showWarningNotif,
} from "@/src/lib/notifications/toasters";
import { CarSchemaType } from "@/src/lib/schemas/car/CarSchema";
import { cn } from "@/src/lib/utils";
import { useMutation } from "@apollo/client";
import { Location } from "@prisma/client";
import { PlusIcon } from "@radix-ui/react-icons";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import CarForm from "./CarForm";

type CallbackActionProps = {
  carData: CarSchemaType;
  locationData: Location | undefined;
};

const AddCarButton = ({ disabled }: { disabled: boolean }) => {
  // Open State
  const [open, setOpen] = useState<boolean>(false);

  // Mutation
  const [registerLocation, { loading: loadingLocation }] = useMutation(
    REGISTER_LOCATION_MUTATION,
    {
      onError: async (error) => {
        showErrorNotif({
          description: error.message,
        });
        console.error("Mutation Error : ", error);
      },
    },
  );

  // Mutation
  const [registerCar, { loading: loadingCar }] = useMutation(
    REGISTER_CAR_MUTATION,
    {
      onCompleted: async (data) => {
        showNotif({
          description: "Your car is added successfully",
        });
      },
      onError: async (error) => {
        showErrorNotif({
          description: error.message,
        });
        console.error("Mutation Error : ", error);
      },
      refetchQueries: "active",
    },
  );

  // Callback Action
  const addCarCallback = async ({
    carData,
    locationData,
  }: CallbackActionProps) => {
    await registerLocation({
      variables: locationData,
    });
    await registerCar({
      variables: carData,
    });
    setOpen(false);
  };

  useEffect(() => {
    if (disabled)
      showWarningNotif({
        description:
          "Complete the Stripe onboarding process on your profile before adding cars.",
      });
  }, [disabled]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={buttonVariants({
            className: "w-1/2",
            variant: "default",
            size: "default",
          })}
          type="button"
          disabled={disabled}
        >
          <PlusIcon className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add Your Car</DialogTitle>
          <DialogDescription>
            List your car for rental in just a few simple steps.
          </DialogDescription>
        </DialogHeader>
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          libraries={["places", "geocoding"]}
        >
          <CarForm callbackAction={addCarCallback} />
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
            disabled={loadingLocation || loadingCar}
          >
            {loadingLocation || loadingCar ? (
              <Loader className="size-6 text-inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCarButton;
