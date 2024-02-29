"use client";
import BookingInfoCard from "@/src/components/BookingInfoCard";
import CarCard from "@/src/components/CarCard";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { INIT_BOOKING_MUTATION } from "@/src/lib/graphql/booking";
import { GET_AVAILABLE_CARS_QUERY } from "@/src/lib/graphql/car";
import { showErrorNotif } from "@/src/lib/notifications/toasters";
import { cn } from "@/src/lib/utils";
import useSearchStore from "@/src/store/useSearchStore";
import useSessionStore from "@/src/store/useSessionStore";
import useStore from "@/src/store/useStore";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CarSheet = () => {
  // Router
  const router = useRouter();

  // Cars Store
  const { setCarSelected } = useSearchStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const session = useStore(useSessionStore, (state) => state.session);
  const carSelected = useStore(useSearchStore, (state) => state.carSelected);
  const formValues = useStore(
    useSearchStore,
    (state) => state.searchValues?.formValues,
  );

  const user = session?.user;

  // Mutation
  const [initBooking, { loading }] = useMutation(INIT_BOOKING_MUTATION, {
    onCompleted: (data) => {
      setCarSelected(null);
      router.push(`/booking/${data.initBooking.id}`);
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
        {carSelected && formValues && (
          <BookingInfoCard
            address={carSelected.location.formatted_address}
            startDate={formValues.date.from}
            endDate={formValues.date.to}
          />
        )}
        <SheetFooter>
          {!user || !user.user_metadata.isRegistered ? (
            <SheetClose asChild>
              <Link
                className={cn(buttonVariants({ variant: "link" }))}
                href="/auth/sign?origin=search"
              >
                Sign in to continue
              </Link>
            </SheetClose>
          ) : (
            <Button
              size="default"
              variant="default"
              onClick={(event) => onSubmit(event)}
              disabled={loading}
            >
              {loading ? <Loader className="size-6   text-inherit" /> : "Book"}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CarSheet;
