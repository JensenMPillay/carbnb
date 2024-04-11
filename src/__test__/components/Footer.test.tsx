import Footer from "@/src/components/Footer";
import { render, screen } from "../test-utils";

describe("Footer", () => {
  it("renders Footer component with correct  content", () => {
    render(<Footer />);

    const date = new Date().getFullYear();

    const footerText = screen.getByText(/All Rights Reserved/);

    expect(footerText).toBeInTheDocument();
    expect(footerText).toHaveTextContent(date.toString());
  });
});
