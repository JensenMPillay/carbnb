import {
  EuroIcon,
  FuelTypeIcon,
  TransmissionIcon,
  YearIcon,
} from "@/src/components/CarCardIcons";
import { render, screen } from "../test-utils";

describe("TransmissionIcon", () => {
  it("renders TransmissionIcon component with className", () => {
    render(<TransmissionIcon className="w-full" />);

    const svgElement = screen.getByTitle("TransmissionIcon").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("w-full");
  });

  it("renders TransmissionIcon component without className", () => {
    render(<TransmissionIcon />);

    const svgElement = screen.getByTitle("TransmissionIcon").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).not.toHaveClass();
  });
});

describe("FuelTypeIcon", () => {
  it("renders FuelTypeIcon component with className", () => {
    render(<FuelTypeIcon className="w-full" />);

    const svgElement = screen.getByTitle("FuelTypeIcon").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("w-full");
  });

  it("renders YearIcon component without className", () => {
    render(<YearIcon />);

    const svgElement = screen.getByTitle("YearIcon").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).not.toHaveClass();
  });
});

describe("EuroIcon", () => {
  it("renders EuroIcon component with className", () => {
    render(<EuroIcon className="w-full" />);

    const svgElement = screen.getByTitle("EuroIcon").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("w-full");
  });
});
