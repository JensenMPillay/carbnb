import { BookingStatuses } from "@/src/components/BookingStatuses";
import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import {
  GET_LENDER_BOOKINGS_QUERY,
  UPDATE_BOOKING_MUTATION,
} from "@/src/lib/graphql/booking";
import { showErrorNotif } from "@/src/lib/notifications/toasters";
import { useMutation } from "@apollo/client";

const BookingButton = ({
  bookingId,
  action,
}: {
  bookingId: string;
  action: "ACCEPTED" | "REFUSED";
}) => {
  const { icon, variant } = BookingStatuses[action];
  // Mutation
  const [updateBooking, { loading }] = useMutation(UPDATE_BOOKING_MUTATION, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
    },
    // Update Cars on Map
    refetchQueries: [GET_LENDER_BOOKINGS_QUERY],
  });

  // onClick Callback
  const onClickHandler = async () => {
    try {
      await updateBooking({
        variables: {
          id: bookingId,
          status: action,
        },
      });
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  return (
    <Button
      onClick={onClickHandler}
      size="sm"
      variant={variant}
      disabled={loading}
    >
      {loading ? (
        <Loader className="size-6  text-foreground text-foreground" />
      ) : (
        <>{icon({ className: "size-6 text-foreground" })}</>
      )}
    </Button>
  );
};

export default BookingButton;
