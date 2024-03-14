import BookingActionButton from "@/src/components/BookingActionButton";

type Props = {};

const BookingTableActionButtons = ({ bookingId }: { bookingId: string }) => {
  return (
    <div className="flex flex-row justify-end space-x-2">
      <BookingActionButton bookingId={bookingId} action="ACCEPTED" />
      <BookingActionButton bookingId={bookingId} action="REFUSED" />
    </div>
  );
};

export default BookingTableActionButtons;
