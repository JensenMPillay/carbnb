import { BookingStatuses } from "@/src/lib/status/BookingStatuses";
import { render, screen } from "../../test-utils";

describe("BookingStatuses", () => {
  const TestComponent = () => {
    return (
      <ul>
        {Object.values(BookingStatuses).map((bookingStatus) => (
          <li key={bookingStatus.label}>
            <span>
              {bookingStatus.icon({
                className: "mr-2 size-4 text-muted-foreground",
              })}
            </span>
            {bookingStatus.label}
          </li>
        ))}
      </ul>
    );
  };

  it("displays correctly", () => {
    render(<TestComponent />);

    expect(screen.getAllByRole("listitem")).toHaveLength(
      Object.keys(BookingStatuses).length,
    );
  });
});
