import Logo from "@/src/components/Logo";
import { render, screen } from "../test-utils";

describe("Logo", () => {
  it("renders Logo component with default color", () => {
    render(<Logo className="h-8 w-8" />);

    const logo = screen.getByAltText(/logo/);

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass("h-8 w-8");
  });

  it("renders Logo component with dark theme color", () => {
    render(<Logo className="h-8 w-8" color="dark" />);

    const logo = screen.getByAltText(/dark/);

    expect(logo).toBeInTheDocument();
  });

  it("renders Logo component with white theme color", () => {
    render(<Logo className="h-8 w-8" color="white" />);

    const logo = screen.getByAltText(/white/);

    expect(logo).toBeInTheDocument();
  });
});
