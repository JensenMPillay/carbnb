import { BookingStatuses } from "@/src/components/BookingStatuses";
import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import { UPDATE_BOOKING_MUTATION } from "@/src/lib/graphql/booking";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import { useMutation } from "@apollo/client";

const BookingButton = ({
  bookingId,
  action,
}: {
  bookingId: string;
  action: "ACCEPTED" | "REFUSED" | "CANCELED";
}) => {
  const { icon, variant } = BookingStatuses[action];
  // Mutation
  const [updateBooking, { loading }] = useMutation(UPDATE_BOOKING_MUTATION, {
    onCompleted: (data) => {
      showNotif({
        description: `This booking has been successfully "${action}"`,
      });
    },
    onError: (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
    },
    // Update Cars on Map
    refetchQueries: "active",
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
        <Loader className="size-6 text-inherit" />
      ) : (
        <>{icon({ className: "size-6 text-inherit" })}</>
      )}
    </Button>
  );
};

export default BookingButton;
