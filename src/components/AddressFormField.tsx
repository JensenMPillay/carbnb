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
  classNameInputWrapper?: string;
  classNameListWrapper?: string;
};

const AddressFormField = <FormSchemaType extends FieldValues>({
  form,
  fieldName,
  classNameItem,
  classNameLabel,
  classNameInput,
  classNameInputWrapper,
  classNameListWrapper,
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
        <FormItem className={cn("bg-inherit flex-1", classNameItem)}>
          <FormLabel className={cn("capitalize", classNameLabel)}>
            {fieldName === "locationId" ? "Location" : "Address"}
          </FormLabel>
          <Command className={cn("rounded-md overflow-visible", classNameInputWrapper)}>
            <div
              className={cn(
                "flex items-center rounded-t-md",
                classNameListWrapper,
              )}
              cmdk-input-wrapper=""
            >
              <MagnifyingGlassIcon className="mr-2 size-4 shrink-0 opacity-50" />
              <FormControl>
                <Input
                  className={classNameInput}
                  placeholder={`Search address...`}
                  value={inputValue}
                  onChange={onInputChange}
                  {...rest}
                />
              </FormControl>
            </div>
            {suggestions.length > 0 ? (
              <div className="relative max-h-full w-max-content">
                <CommandEmpty>No {fieldName} found.</CommandEmpty>
                <CommandList className="max-h-[25vh] absolute left-0 top-0">
                  {suggestions.map((suggestion) => (
                    <CommandItem
                    className="bg-card z-10"
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
              </div>
            ) : null}
          </Command>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AddressFormField;
