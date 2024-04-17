import Header from "@/src/components/Header";
import { render, screen } from "../test-utils";

describe("Header", () => {
  it("renders", () => {
    render(<Header />);
  });

  it("renders Header component with correct logo", () => {
    render(<Header />);

    const logo = screen.getByAltText(/logo/);

    expect(logo).toBeInTheDocument();
  });

  it("renders Header component with correct text content", () => {
    render(<Header />);

    const headerText = screen.getByText(
      /Connect, Share, Roll: Your Collaborative Car Sharing Platform/,
    );

    expect(headerText).toBeInTheDocument();
  });
});
