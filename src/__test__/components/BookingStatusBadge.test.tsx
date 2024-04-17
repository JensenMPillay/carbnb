import BookingStatusBadge from "@/src/components/BookingStatusBadge";
import user from "@testing-library/user-event";
import { render, screen } from "../test-utils";

describe("BookingStatusBadge", () => {
  it("renders", () => {
    render(<BookingStatusBadge status="ACCEPTED" />);
  });

  it("displays correct badge label", () => {
    render(<BookingStatusBadge status="ACCEPTED" />);

    expect(screen.getByText("ACCEPTED")).toBeInTheDocument();
  });

  it("displays correct badge tooltip", async () => {
    user.setup();

    render(<BookingStatusBadge status="ACCEPTED" />);

    expect(screen.getByText("ACCEPTED")).toBeInTheDocument();

    const tooltipTrigger = screen.getByRole("button");

    await user.hover(tooltipTrigger);

    const tooltipContent = await screen.findAllByText(
      "This booking has been accepted.",
    );

    tooltipContent.forEach((tooltip) => {
      expect(tooltip).toBeInTheDocument();
    });
  });
});
