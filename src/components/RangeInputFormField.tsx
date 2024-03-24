"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { cn } from "../lib/utils";
import { Slider } from "./ui/slider";

type RangeInputFormFieldProps<FormSchemaType extends FieldValues> = {
  form: UseFormReturn<FormSchemaType>;
  fieldName: Path<FormSchemaType>;
  minValue: number;
  maxValue: number;
  step: number;
  unit?: string;
};

/**
 * RangeInputFormField component for rendering a range input field in a form.
 * @component
 * @template FormSchemaType The type of the form schema.
 * @param {object} props The props for the RangeInputFormField component.
 * @param {UseFormReturn<FormSchemaType>} props.form The useForm hook return object.
 * @param {Path<FormSchemaType>} props.fieldName The name of the field in the form schema.
 * @param {number} props.minValue The minimum value of the range input.
 * @param {number} props.maxValue The maximum value of the range input.
 * @param {number} props.step The step value for the range input.
 * @param {string} [props.unit] The unit of measurement for the range input (optional).
 * @example
 * <RangeInputFormField
    form={form}
    fieldName="year"
    minValue={2000}
    maxValue={new Date().getFullYear()}
    step={1}
  />
 */
const RangeInputFormField = <FormSchemaType extends FieldValues>({
  form,
  fieldName,
  minValue,
  maxValue,
  step,
  unit,
}: RangeInputFormFieldProps<FormSchemaType>) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: { value, onChange, ...rest } }) => (
        <FormItem className="flex-1">
          <FormLabel className="capitalize">{fieldName}</FormLabel>
          <div className="flex flex-row space-x-1">
            <span className="text-xs">{`${minValue} ${unit ? unit : ""}`}</span>
            <FormControl>
              <Slider
                orientation="horizontal"
                min={minValue}
                max={maxValue}
                step={step}
                className={cn("mx-auto w-3/4")}
                defaultValue={[value]}
                onValueChange={(vals) => {
                  onChange(vals[0]);
                }}
                value={[form.getValues(fieldName)]}
                {...rest}
              />
            </FormControl>
            <span className="text-xs">{`${value} ${unit ? unit : ""}`}</span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RangeInputFormField;
