import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface UsePrefillFormProps<T extends FieldValues> {
  // Form with Schema<T>
  form: UseFormReturn<T>;
  //   Entity with Partial<T>
  entity?: Partial<T> | null;
}

/**
 * Custom hook to prefill a form with entity data.
 * @template T - Field values type.
 * @param {object} props - Props object.
 * @param {UseFormReturn<T>} props.form - Form with Schema<T>.
 * @param {Partial<T> | null | undefined} props.entity - Entity with Partial<T>.
 * @example
 * const form = useForm<SchemaType>({
 *  resolver: zodResolver(schema),
 *  defaultValues: { name: "Eve", age: 25 }
 * });
 * const entity = { name: "John", age: 30 };
 * usePrefillForm({ form, entity });
 */
export function usePrefillForm<T extends FieldValues>({
  form,
  entity,
}: UsePrefillFormProps<T>): void {
  useEffect(() => {
    if (entity) {
      const formValues = form.getValues();
      const updatedValues: Partial<T> = {};

      // Iterate over formValues to set updatedValues[keyField] = entity[entityKey as keyField]
      Object.keys(formValues).forEach((key) => {
        const keyField = key as keyof T;

        // Verify Existence
        if (keyField in entity) {
          updatedValues[keyField] = entity[keyField];
        } else {
          // Use Default Value
          updatedValues[keyField] = formValues[keyField];
        }
      });

      form.reset(updatedValues as T);
    }
  }, [form, entity]);
}
