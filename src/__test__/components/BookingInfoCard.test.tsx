import BookingInfoCard from "@/src/components/BookingInfoCard";
import { format } from "date-fns";
import { render, screen } from "../test-utils";

describe("BookingInfoCard", () => {
  const mockProps = {
    address: "123 Main St",
    startDate: new Date(2024, 3, 15),
    endDate: new Date(2024, 3, 20),
  };

  it("renders", () => {
    render(<BookingInfoCard {...mockProps} />);
  });

  it("displays booking information correctly", () => {
    render(<BookingInfoCard {...mockProps} />);

    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(
      screen.getByText(format(mockProps.startDate, "yyyy-MM-dd")),
    ).toBeInTheDocument();
    expect(
      screen.getByText(format(mockProps.endDate, "yyyy-MM-dd")),
    ).toBeInTheDocument();
  });

  it("applies correct md size classes based on props", () => {
    render(<BookingInfoCard size="md" {...mockProps} />);

    const cardElement = screen.getByText("123 Main St");

    expect(cardElement.parentElement).toHaveClass("md:p-3 md:text-sm");
  });

  it("applies correct lg size classes based on props", () => {
    render(<BookingInfoCard size="lg" {...mockProps} />);

    const cardElement = screen.getByText("123 Main St");

    expect(cardElement.parentElement).toHaveClass(
      "md:text-sm lg:p-4 lg:text-base",
    );
  });
});
