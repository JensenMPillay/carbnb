"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type ToggleGroupFormFieldProps<FormSchemaType extends FieldValues> = {
  form: UseFormReturn<FormSchemaType>;
  fieldName: Path<FormSchemaType>;
  items: Array<string>;
  type: "single" | "multiple";
};

const ToggleGroupFormField = <FormSchemaType extends FieldValues>({
  form,
  fieldName,
  items,
  type,
}: ToggleGroupFormFieldProps<FormSchemaType>) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="capitalize">{fieldName}</FormLabel>
          <FormControl>
            <ToggleGroup
              type={type}
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-wrap justify-start gap-2"
            >
              {items.map((item, index) => (
                <ToggleGroupItem
                  key={index}
                  value={item}
                  data-state={field.value.includes(item) ? "on" : "off"}
                  aria-label={item}
                  variant={"outline"}
                  size={"sm"}
                >
                  {item}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ToggleGroupFormField;
