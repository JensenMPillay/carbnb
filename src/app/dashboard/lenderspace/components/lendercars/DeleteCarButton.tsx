"use client";
import { CarQuery } from "@/src/@types/queries.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import { DELETE_CAR_MUTATION } from "@/src/lib/graphql/car";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import { useMutation } from "@apollo/client";
import { TrashIcon } from "@radix-ui/react-icons";
import { MouseEvent, useState } from "react";

type CarProps = {
  car?: CarQuery;
};

const DeleteCarButton = ({ car }: CarProps) => {
  // Open State
  const [open, setOpen] = useState<boolean>(false);

  // Mutation
  const [deleteCar, { loading }] = useMutation(DELETE_CAR_MUTATION, {
    errorPolicy: "all",
    onCompleted: async (data) => {
      showNotif({
        description: "Your car is deleted successfully",
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

  // Delete Callback
  const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    try {
      if (car) {
        await deleteCar({
          variables: { id: car.id },
        });
      }
      setOpen(false);
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <TrashIcon className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this car
            and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event: MouseEvent<HTMLButtonElement>) => onClick(event)}
            disabled={loading}
          >
            {loading ? (
              <Loader className="size-6  text-foreground" />
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCarButton;
