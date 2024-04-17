import RangeInputFormField from "@/src/components/RangeInputFormField";
import { Form } from "@/src/components/ui/form";
import { useForm } from "react-hook-form";
import { render, screen } from "../test-utils";

describe("RangeInputFormField", () => {
  const TestComponent = () => {
    const testForm = useForm({
      defaultValues: {
        year: 2005,
      },
    });
    return (
      <Form {...testForm}>
        <form id="testForm">
          <RangeInputFormField
            form={testForm}
            fieldName="year"
            minValue={2000}
            maxValue={2022}
            step={1}
            unit="years"
          />
        </form>
      </Form>
    );
  };

  it("renders", () => {
    render(<TestComponent />);
  });

  it("renders with correct label, slider, and unit", () => {
    render(<TestComponent />);

    expect(screen.getByText("year")).toBeInTheDocument();
    expect(screen.getAllByText(/years/)).toHaveLength(2);

    const slider = screen.getByRole("slider");

    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuemin", "2000");
    expect(slider).toHaveAttribute("aria-valuemax", "2022");
    expect(slider).toHaveAttribute("aria-valuenow", "2005");
  });
});
