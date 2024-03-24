import BookingActionButton from "@/src/components/BookingActionButton";

/**
 * BookingTableActionButtons component for rendering action buttons for a booking in a table.
 * @component
 * @param {Object} props - The props object.
 * @param {string} props.bookingId - The ID of the booking.
 * @example
 * <BookingTableActionButtons bookingId="booking-id" />
 */
const BookingTableActionButtons = ({ bookingId }: { bookingId: string }) => {
  return (
    <div className="flex flex-row justify-end space-x-2">
      <BookingActionButton bookingId={bookingId} action="ACCEPTED" />
      <BookingActionButton bookingId={bookingId} action="REFUSED" />
    </div>
  );
};

export default BookingTableActionButtons;
