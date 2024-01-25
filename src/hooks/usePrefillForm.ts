import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

// Change imageUrl Type : String -> String[]
type AdjustImageUrlType<T> = Omit<T, "imageUrl"> & { imageUrl?: string[] };

interface UsePrefillFormProps<T extends FieldValues> {
  // Form with Schema<T>
  form: UseFormReturn<T>;
  //   Entity with Partial<T>
  entity?: Partial<AdjustImageUrlType<T>> | null;
}

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

        // imageUrl Case
        if (keyField === "imageUrl") {
          updatedValues[keyField] =
            entity.imageUrl && Array.isArray(entity.imageUrl)
              ? entity.imageUrl[0]
              : [formValues[keyField] as string];
          // Verify Exist
        } else if (keyField in entity) {
          const entityKey = keyField as keyof AdjustImageUrlType<T>;
          updatedValues[keyField] = entity[entityKey];
        } else {
          // Use Default Value
          updatedValues[keyField] = formValues[keyField];
        }
      });

      form.reset(updatedValues as T);
    }
  }, [form, entity]);
}
