"use client";
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
import { CANCEL_BOOKING_MUTATION } from "@/src/lib/graphql/booking";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import { useMutation } from "@apollo/client";
import { TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const CancelBookingButton = ({ bookingId }: { bookingId: string }) => {
  // Open State
  const [open, setOpen] = useState<boolean>(false);

  // Mutation
  const [cancelBooking, { loading }] = useMutation(CANCEL_BOOKING_MUTATION, {
    errorPolicy: "all",
    onCompleted: async (data) => {
      showNotif({
        description: "Your booking is deleted successfully",
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
  const onClickHandler = async () => {
    try {
      if (bookingId) {
        await cancelBooking({
          variables: { id: bookingId },
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
            This action cannot be undone. This will permanently delete this
            booking and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClickHandler} disabled={loading}>
            {loading ? <Loader className="size-6 text-inherit" /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelBookingButton;
