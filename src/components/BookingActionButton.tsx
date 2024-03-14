import { BookingStatuses } from "@/src/components/BookingStatuses";
import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import {
  DELETE_BOOKING_MUTATION,
  UPDATE_BOOKING_MUTATION,
} from "@/src/lib/graphql/booking";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import { useMutation } from "@apollo/client";

const BookingActionButton = ({
  bookingId,
  action,
}: {
  bookingId: string;
  action: "ACCEPTED" | "REFUSED" | "CANCELED" | "DELETED";
}) => {
  const { icon, variant } =
    action === "DELETED"
      ? BookingStatuses["CANCELED"]
      : BookingStatuses[action];
  // Mutation
  const [updateBooking, { loading: updateLoading }] = useMutation(
    UPDATE_BOOKING_MUTATION,
    {
      onCompleted: (data) => {
        showNotif({
          description: `This booking has been successfully ${action}`,
        });
      },
      onError: (error) => {
        showErrorNotif({
          description: error.message,
        });
        console.error("Mutation Error : ", error);
      },
      // Update Cars
      refetchQueries: "active",
    },
  );

  // Mutation
  const [deleteBooking, { loading: deleteLoading }] = useMutation(
    DELETE_BOOKING_MUTATION,
    {
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
      // Update Cars
      refetchQueries: "active",
    },
  );

  // onClick Callback
  const onClickHandler = async () => {
    try {
      if (action === "DELETED") {
        await deleteBooking({
          variables: {
            id: bookingId,
          },
        });
      } else {
        await updateBooking({
          variables: {
            id: bookingId,
            status: action,
          },
        });
      }
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  return (
    <Button
      onClick={onClickHandler}
      size="sm"
      variant={variant}
      disabled={updateLoading || deleteLoading}
    >
      {updateLoading || deleteLoading ? (
        <Loader className="size-6 text-inherit" />
      ) : (
        <>{icon({ className: "size-6 text-inherit" })}</>
      )}
    </Button>
  );
};

export default BookingActionButton;
