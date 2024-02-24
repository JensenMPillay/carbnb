"use client";
import CarCard from "@/src/components/CarCard";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { INIT_BOOKING_MUTATION } from "@/src/lib/graphql/booking";
import { GET_AVAILABLE_CARS_QUERY } from "@/src/lib/graphql/car";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import useSearchStore from "@/src/store/useSearchStore";
import useStore from "@/src/store/useStore";
import { useMutation } from "@apollo/client";
import { format } from "date-fns";
import { useState } from "react";

const CarSheet = () => {
  const [open, setOpen] = useState<boolean>(false);

  // Cars Store
  const { setCarSelected, setCars } = useSearchStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const carSelected = useStore(useSearchStore, (state) => state.carSelected);
  const formValues = useStore(
    useSearchStore,
    (state) => state.searchValues?.formValues,
  );

  // Mutation
  const [initBooking] = useMutation(INIT_BOOKING_MUTATION, {
    onCompleted: (data) => {
      setOpen(true);
    },
    onError: (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
    },
    // Update Cars on Map
    refetchQueries: [GET_AVAILABLE_CARS_QUERY],
  });

  // onSubmit Callback
  const onSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event?.preventDefault();
    showNotif({
      description: "Submitting your request, please wait...",
    });
    try {
      await initBooking({
        variables: {
          startDate: formValues?.date.from,
          endDate: formValues?.date.to,
          carId: carSelected?.id,
        },
      });
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  return (
    <Sheet open={!!carSelected} onOpenChange={() => setCarSelected(null)}>
      <SheetContent className="flex flex-col justify-center" side="right">
        <SheetHeader>
          <SheetTitle>Start Your Journey Here!</SheetTitle>
          <SheetDescription>
            Discover the details of this vehicle and begin planning your next
            adventure on wheels.
          </SheetDescription>
        </SheetHeader>
        {carSelected && <CarCard car={carSelected} />}
        {formValues && (
          <Card className="text-xs">
            <p className="text-center">
              {carSelected?.location.formatted_address}
            </p>
            <p className="flex flex-row justify-around">
              <span>{format(formValues.date.from, "PPP")}</span>
              <span>-</span>
              <span>{format(formValues.date.to, "PPP")}</span>
            </p>
            <p></p>
          </Card>
        )}
        <SheetFooter>
          <Button
            size="default"
            variant="default"
            onClick={(event) => onSubmit(event)}
          >
            Book
          </Button>
        </SheetFooter>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
              <DialogDescription>
                Choose What Works Best for You!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit">Pay</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  );
};

export default CarSheet;
