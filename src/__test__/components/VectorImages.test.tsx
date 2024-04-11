import {
  RandomSVGComponent,
  SVGDeal,
  SVGGoodbye,
  SVGSearch,
  SVGValidation,
} from "@/src/components/VectorImages";
import { render, screen } from "../test-utils";

describe("SVGDeal", () => {
  it("renders SVGDeal component with className", () => {
    render(<SVGDeal className="w-full" />);

    const svgElement = screen.getByTitle("SVGDeal").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("w-full");
  });

  it("renders SVGDeal component without className", () => {
    render(<SVGDeal />);

    const svgElement = screen.getByTitle("SVGDeal").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).not.toHaveClass();
  });
});

describe("SVGGoodbye", () => {
  it("renders SVGGoodbye component with className", () => {
    render(<SVGGoodbye className="w-full" />);

    const svgElement = screen.getByTitle("SVGGoodbye").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("w-full");
  });

  it("renders SVGGoodbye component without className", () => {
    render(<SVGGoodbye />);

    const svgElement = screen.getByTitle("SVGGoodbye").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).not.toHaveClass();
  });
});

describe("SVGSearch", () => {
  it("renders SVGSearch component with className", () => {
    render(<SVGSearch className="w-full" />);

    const svgElement = screen.getByTitle("SVGSearch").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("w-full");
  });

  it("renders SVGSearch component without className", () => {
    render(<SVGSearch />);

    const svgElement = screen.getByTitle("SVGSearch").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).not.toHaveClass();
  });
});

describe("SVGValidation", () => {
  it("renders SVGValidation component with className", () => {
    render(<SVGValidation className="w-full" />);

    const svgElement = screen.getByTitle("SVGValidation").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("w-full");
  });

  it("renders SVGValidation component without className", () => {
    render(<SVGValidation />);

    const svgElement = screen.getByTitle("SVGValidation").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).not.toHaveClass();
  });
});

describe("RandomSVGComponent", () => {
  it("renders RandomSVGComponent with SVG children", () => {
    render(
      <RandomSVGComponent>
        <SVGSearch className="w-full" />
      </RandomSVGComponent>,
    );

    const svgElement = screen.getByTitle("SVGSearch").parentElement;

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("w-full");
  });
});
