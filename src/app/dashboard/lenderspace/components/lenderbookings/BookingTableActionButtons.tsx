import BookingButton from "./BookingButton";

type Props = {};

const BookingTableActionButtons = ({ bookingId }: { bookingId: string }) => {
  return (
    <div className="flex flex-row justify-end space-x-2">
      <BookingButton bookingId={bookingId} action="ACCEPTED" />
      <BookingButton bookingId={bookingId} action="REFUSED" />
    </div>
  );
};

export default BookingTableActionButtons;
