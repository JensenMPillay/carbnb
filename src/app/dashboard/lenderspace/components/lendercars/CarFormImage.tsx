"use client";
import { generateCarImageUrl } from "@/src/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
  useWatch,
} from "react-hook-form";

type ImageProps<FormSchemaType extends FieldValues> = {
  form: UseFormReturn<FormSchemaType>;
  fieldName: Path<FormSchemaType>;
  watchedFields: Path<FormSchemaType>[];
};

/**
 * Component representing an image preview for a car form.
 * @component
 * @template FormSchemaType
 * @param {object} props - The props object.
 * @param {UseFormReturn} props.form - The form object returned by useForm hook.
 * @param {Path} props.fieldName - The name of the field in the form.
 * @param {Path[]} props.watchedFields - The fields to watch for changes.
 * @example
 * <CarFormImage
    form={form}
    fieldName="imageUrl"
    watchedFields={["brand", "model", "year"]}
  />
 */
const CarFormImage = <FormSchemaType extends FieldValues>({
  form,
  fieldName,
  watchedFields,
}: ImageProps<FormSchemaType>) => {
  const [src, setSrc] = useState<URL["href"]>(
    "https://dummyimage.com/300x300/21322F/4cc2ae",
  );

  const imageParams = useWatch({
    control: form.control,
    name: watchedFields,
  });

  useEffect(() => {
    let imageUrl: URL["href"] = src;
    if (imageParams[0] && imageParams[1] && imageParams[2]) {
      imageUrl = generateCarImageUrl({
        car: {
          brand: imageParams[0],
          model: imageParams[1],
          year: Number(imageParams[2]),
          trueColor:
            imageParams[4]?.toLowerCase() ??
            imageParams[3]?.toLowerCase() ??
            "",
        },
      });
    }
    setTimeout(() => {
      setSrc(imageUrl);
      form.setValue(
        fieldName,
        src as PathValue<FormSchemaType, Path<FormSchemaType>>,
        {
          shouldTouch: true,
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    }, 2000);
    return () => {};
  }, [form, imageParams, fieldName, src]);

  return (
    <>
      <Image
        src={src}
        alt="car model"
        className="object-contain"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
    </>
  );
};

export default CarFormImage;
