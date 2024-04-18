import Home from "@/src/app/page";
import { useRouter } from "next/navigation";
import { render, screen } from "../test-utils";

jest.mock("next/navigation");

jest.mocked(useRouter);

describe("Home", () => {
  it("renders", () => {
    render(<Home />);
  });

  it("renders Header, SVG and SearchForm", () => {
    render(<Home />);

    expect(
      screen.getByText(
        "Connect, Share, Roll: Your Collaborative Car Sharing Platform",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTitle(/SVG/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
  });
});
