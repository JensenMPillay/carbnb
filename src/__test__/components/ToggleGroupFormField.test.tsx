import ToggleGroupFormField from "@/src/components/ToggleGroupFormField";
import { Form } from "@/src/components/ui/form";
import { Category } from "@prisma/client";
import user from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { render, screen } from "../test-utils";

describe("ToggleGroupFormField", () => {
  const categories = Object.keys(Category);
  const defaultValue = "SEDAN" as const;
  const TestComponent = ({ type }: { type: "single" | "multiple" }) => {
    const testForm = useForm({
      defaultValues: {
        category: defaultValue,
      },
    });
    return (
      <Form {...testForm}>
        <form id="testForm">
          <ToggleGroupFormField
            form={testForm}
            fieldName="category"
            items={categories}
            type={type}
          />
        </form>
      </Form>
    );
  };

  it("renders", () => {
    render(<TestComponent type="multiple" />);
  });

  it("renders with correct label and values", () => {
    render(<TestComponent type="multiple" />);

    expect(screen.getByText("category")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(categories.length);
  });

  it("renders with correct default value", () => {
    render(<TestComponent type="multiple" />);

    expect(screen.getByRole("button", { name: defaultValue })).toHaveAttribute(
      "data-state",
      "on",
    );
  });

  it("toggles correct value when clicked", async () => {
    user.setup();

    const testValue = "SPORT" as const;

    render(<TestComponent type="multiple" />);

    const testButton = screen.getByRole("button", { name: testValue });

    expect(testButton).toHaveAttribute("data-state", "off");

    await user.click(testButton);

    expect(
      await screen.findByRole("button", { name: testValue }),
    ).toHaveAttribute("data-state", "on");

    await user.click(testButton);

    expect(
      await screen.findByRole("button", { name: testValue }),
    ).toHaveAttribute("data-state", "off");
  });

  it("toggles with single value", async () => {
    user.setup();

    const testValue = "SPORT" as const;

    render(<TestComponent type="single" />);

    const testButton = screen.getByRole("radio", { name: testValue });

    expect(testButton).toHaveAttribute("data-state", "off");

    await user.click(testButton);

    expect(
      await screen.findByRole("radio", { name: testValue }),
    ).toHaveAttribute("data-state", "on");

    expect(
      await screen.findByRole("radio", { name: defaultValue }),
    ).toHaveAttribute("data-state", "off");
  });
});
