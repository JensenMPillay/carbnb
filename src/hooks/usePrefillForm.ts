import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface UsePrefillFormProps<T extends FieldValues> {
  // Form with Schema<T>
  form: UseFormReturn<T>;
  //   Entity with Partial<T>
  entity?: Partial<T> | null;
}

export function usePrefillForm<T extends FieldValues>({
  form,
  entity,
}: UsePrefillFormProps<T>): void {
  useEffect(() => {
    // Form Values
    const formValues = form.getValues();
    // Initialization of Updated Values
    const updatedValues: Partial<T> = {};

    // Itera over Form Keys
    Object.keys(formValues).forEach((key) => {
      // Create key in Updated Values
      updatedValues[key as keyof T] =
        // Verify Exist in Entity
        entity?.[key as keyof T] ?? formValues[key as keyof T];
    });

    // Reset with Updated Values
    form.reset(updatedValues as T);
  }, [form, entity]);
}
