import ComboboxFormField from "@/src/components/ComboboxFormField";
import { Form } from "@/src/components/ui/form";
import { Category } from "@prisma/client";
import user from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { render, screen } from "../test-utils";

describe("ComboboxFormField", () => {
  const updateItemsMock = jest.fn();
  const resetFieldsMock = jest.fn();
  const categories = Object.keys(Category);
  const TestComponent = () => {
    const testForm = useForm();
    return (
      <Form {...testForm}>
        <form id="testForm">
          <ComboboxFormField
            form={testForm}
            fieldName="category"
            items={categories}
            updateItems={updateItemsMock}
            resetFields={resetFieldsMock}
          />
        </form>
      </Form>
    );
  };

  it("renders", () => {
    render(<TestComponent />);
  });

  it("renders with correct label and combobox button", () => {
    render(<TestComponent />);

    expect(screen.getByText("category")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands and updates items when combobox button clicked", async () => {
    user.setup();
    render(<TestComponent />);

    await user.click(screen.getByRole("combobox"));

    expect(await screen.findByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(updateItemsMock).toHaveBeenCalled();
  });

  it("selects, closes and reset fields when radio button clicked", async () => {
    user.setup();

    render(<TestComponent />);

    await user.click(screen.getByRole("combobox"));

    await user.click(await screen.findByRole("option", { name: /SPORT/ }));

    expect(await screen.findByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(resetFieldsMock).toHaveBeenCalled();
  });
});
