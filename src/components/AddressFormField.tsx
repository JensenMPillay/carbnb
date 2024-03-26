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
import useAutocomplete from "@/src/hooks/useAutocomplete";
import { cn } from "@/src/lib/utils";
import { CheckIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { Input } from "./ui/input";

// TO DO : Verify fieldName Object type {id, description}
type AddressFormFieldProps<FormSchemaType extends FieldValues> = {
  form: UseFormReturn<FormSchemaType>;
  fieldName: Path<FormSchemaType>;
  defaultValue?: { id: string; description: string };
  classNameItem?: string;
  classNameLabel?: string;
  classNameInput?: string;
  classNameInputWrapper?: string;
  classNameListWrapper?: string;
};

/**
 * AddressFormField component for handling address input with autocomplete.
 * @component
 * @template FormSchemaType - Type of form schema.
 * @param {object} props - Props object.
 * @param {UseFormReturn<FormSchemaType>} props.form - Form with Schema<T>.
 * @param {Path<FormSchemaType>} props.fieldName - Name of the field in the form schema.
 * @param {{ id: string; description: string } | undefined} [props.defaultValue] - Default value for the address field (optional).
 * @param {string} [props.classNameItem] - Classname for the form item container (optional).
 * @param {string} [props.classNameLabel] - Classname for the form label (optional).
 * @param {string} [props.classNameInput] - Classname for the input element (optional).
 * @param {string} [props.classNameInputWrapper] - Classname for the input wrapper (optional).
 * @param {string} [props.classNameListWrapper] - Classname for the suggestion list wrapper (optional).
 * @example
 * <AddressFormField
 *   form={form}
 *   fieldName="address"
 *   defaultValue={{ id: "1", description: "New York, USA" }}
 * />
 */
const AddressFormField = <FormSchemaType extends FieldValues>({
  form,
  fieldName,
  defaultValue,
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

  // Prefill Field
  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue.description);
    }

    return () => {};
  }, [defaultValue, setInputValue]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({
        field: { value, onBlur, disabled, name, ref },
        fieldState,
      }) => (
        <FormItem className={cn("flex-1", classNameItem)}>
          <FormLabel className={cn("capitalize", classNameLabel)}>
            Address
          </FormLabel>
          <Command
            className={cn(
              "overflow-visible rounded-md bg-transparent",
              classNameInputWrapper,
            )}
          >
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
                  onBlur={onBlur}
                  disabled={disabled}
                  name={name}
                  ref={ref}
                />
              </FormControl>
            </div>
            {suggestions.length > 0 ? (
              <div className="w-max-content relative max-h-full">
                <CommandEmpty>No {fieldName} found.</CommandEmpty>
                <CommandList className="absolute left-0 top-0 max-h-[25vh]">
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      className="z-10 bg-card/75"
                      value={suggestion.description}
                      key={suggestion.place_id}
                      onSelect={() => {
                        form.setValue(
                          fieldName,
                          {
                            id: suggestion.place_id,
                            description: suggestion.description,
                          } as PathValue<FormSchemaType, Path<FormSchemaType>>,
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
                          "ml-auto size-4",
                          suggestion === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </div>
            ) : null}
          </Command>
          {fieldState.error && (
            <FormMessage>Please confirm the address</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
};

export default AddressFormField;
