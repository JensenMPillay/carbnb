"use client";
import {
  Command,
  CommandEmpty,
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
import { cn } from "@/src/lib/utils";
import { CheckIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import useAutocomplete from "../hooks/useAutocomplete";
import { Input } from "./ui/input";

type AddressFormFieldProps<FormSchemaType extends FieldValues> = {
  form: UseFormReturn<FormSchemaType>;
  fieldName: Path<FormSchemaType>;
  classNameItem?: string;
  classNameLabel?: string;
  classNameInput?: string;
};

const AddressFormField = <FormSchemaType extends FieldValues>({
  form,
  fieldName,
  classNameItem,
  classNameLabel,
  classNameInput,
}: AddressFormFieldProps<FormSchemaType>) => {
  const {
    inputValue,
    setInputValue,
    onInputChange,
    suggestions,
    clearSuggestions,
  } = useAutocomplete();

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field: { value, onChange, ...rest }, fieldState }) => (
        <FormItem className={cn("flex-1", classNameItem)}>
          <FormLabel className={cn("capitalize", classNameLabel)}>
            {fieldName === "locationId" ? "Location" : "Address"}
          </FormLabel>
          <Command className="rounded-md border">
            <div
              className="flex items-center rounded-t-md border-b p-1 pl-3"
              cmdk-input-wrapper=""
            >
              <MagnifyingGlassIcon className="mr-2 size-4 shrink-0 opacity-50" />
              <FormControl>
                <Input
                  className={cn(
                    "flex h-9 w-full rounded-md border-none bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                    classNameInput,
                  )}
                  placeholder={`Search address...`}
                  value={inputValue}
                  onChange={onInputChange}
                  {...rest}
                />
              </FormControl>
            </div>
            {suggestions.length > 0 ? (
              <>
                <CommandEmpty>No {fieldName} found.</CommandEmpty>
                <CommandList>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      value={suggestion.description}
                      key={suggestion.place_id}
                      onSelect={() => {
                        form.setValue(
                          fieldName,
                          suggestion.place_id as PathValue<
                            FormSchemaType,
                            Path<FormSchemaType>
                          >,
                          {
                            shouldTouch: true,
                            shouldDirty: true,
                            shouldValidate: true,
                          },
                        );
                        setInputValue(suggestion.description);
                        clearSuggestions();
                      }}
                    >
                      {suggestion.description}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          suggestion === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </>
            ) : null}
          </Command>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AddressFormField;
