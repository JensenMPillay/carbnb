import Logo from "@/src/components/Logo";
import { render, screen } from "../test-utils";

describe("Logo", () => {
  it("renders", async () => {
    render(<Logo className="h-8 w-8" />);
  });

  it("renders Logo component with default color", async () => {
    render(<Logo className="h-8 w-8" />);

    const logo = await screen.findByAltText(/logo/);

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass("h-8 w-8");
  });

  it("renders Logo component with dark theme color", async () => {
    render(<Logo className="h-8 w-8" color="dark" />);

    const logo = await screen.findByAltText(/dark/);

    expect(logo).toBeInTheDocument();
  });

  it("renders Logo component with white theme color", async () => {
    render(<Logo className="h-8 w-8" color="white" />);

    const logo = await screen.findByAltText(/white/);

    expect(logo).toBeInTheDocument();
  });
});
