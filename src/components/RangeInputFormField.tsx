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
            <span className="text-xs">{`${maxValue} ${unit ? unit : ""}`}</span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RangeInputFormField;
