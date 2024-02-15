"use client";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

type PrismaEnum<T> = {
  [key: string]: string;
};

type ComboboxFormFieldProps<
  FormSchemaType extends FieldValues,
  T extends PrismaEnum<T>,
> = {
  form: UseFormReturn<FormSchemaType>;
  fieldName: Path<FormSchemaType>;
  prismaEnum?: PrismaEnum<T>;
  items: Array<string>;
  updateItems?: () => Promise<void>;
  resetFields?: () => void;
};

const ComboboxFormField = <
  FormSchemaType extends FieldValues,
  T extends PrismaEnum<T>,
>({
  form,
  fieldName,
  prismaEnum,
  items,
  updateItems,
  resetFields,
}: ComboboxFormFieldProps<FormSchemaType, T>) => {
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState }) => (
        <FormItem className="flex-1">
          <FormLabel className="capitalize">{fieldName}</FormLabel>
          <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between truncate",
                    !field.value && "text-muted-foreground",
                  )}
                  onClick={() => {
                    updateItems && updateItems();
                  }}
                >
                  {field.value && prismaEnum
                    ? items
                        .find((key) => prismaEnum[key] === field.value)
                        ?.replace("_", " ") ?? `Select ${fieldName}`
                    : field.value?.replace("_", " ") ?? `Select ${fieldName}`}
                  <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${fieldName}...`}
                  className="h-9"
                />
                <CommandEmpty>No {fieldName} found.</CommandEmpty>
                <CommandList>
                  {items.map((item) => (
                    <CommandItem
                      value={item}
                      key={item}
                      onSelect={() => {
                        form.setValue(
                          fieldName,
                          item as PathValue<
                            FormSchemaType,
                            Path<FormSchemaType>
                          >,
                          {
                            shouldTouch: true,
                            shouldDirty: true,
                            shouldValidate: true,
                          },
                        );
                        setOpen(false);
                        resetFields && resetFields();
                      }}
                    >
                      {item.replace("_", " ")}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          item === field.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ComboboxFormField;
