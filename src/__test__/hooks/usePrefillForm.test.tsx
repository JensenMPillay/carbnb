import { usePrefillForm } from "@/src/hooks/usePrefillForm";
import { renderHook } from "@testing-library/react";
import { useForm } from "react-hook-form";

const defaultValues = { name: "Joe", age: 20 };
function renderForm() {
  const { result: form } = renderHook(useForm, {
    initialProps: {
      defaultValues: defaultValues,
    },
  });
  return form;
}

describe("usePrefillForm", () => {
  it("prefills the form with entity data if provided", () => {
    const { current: form } = renderForm();

    const entity = { name: "John", age: 40 };

    renderHook(usePrefillForm, {
      initialProps: {
        form: form,
        entity: entity,
      },
    });

    expect(form.getValues()).toEqual(entity);
  });

  it("does not prefill the form if entity is null or undefined", () => {
    const { current: form } = renderForm();

    renderHook(usePrefillForm, {
      initialProps: {
        form: form,
        entity: null,
      },
    });

    expect(form.getValues()).toEqual(defaultValues);
  });

  it("resets the form with partial values if entity does not contain all form values", () => {
    const { current: form } = renderForm();

    const partialEntity = { name: "Jill" };

    renderHook(usePrefillForm, {
      initialProps: {
        form: form,
        entity: partialEntity,
      },
    });

    expect(form.getValues()).toEqual({
      ...defaultValues,
      ...partialEntity,
    });
  });
});
