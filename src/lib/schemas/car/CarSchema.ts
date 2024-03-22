import { Brand, Category, Color, FuelType, Transmission } from "@prisma/client";
import { z } from "zod";

/**
 * Zod schema for defining the structure of a car object.
 */
export const carSchema = z.object({
  category: z.nativeEnum(Category),
  brand: z.nativeEnum(Brand),
  model: z
    .string()
    .min(1, { message: "Model is required" })
    .regex(/^[A-Za-z0-9-\s]+$/, {
      message: "Name should only contain letters , numbers and dashes",
    }),
  year: z.coerce.number().min(4, { message: "Format YYYY" }),
  primaryColor: z.nativeEnum(Color),
  trueColor: z.string().optional(),
  transmission: z.nativeEnum(Transmission),
  fuelType: z.nativeEnum(FuelType),
  imageUrl: z.string(),
  pricePerDay: z.coerce.number().min(1, { message: "Price is required" }),
  location: z.object({
    id: z
      .string({
        required_error: "Required.",
      })
      .min(1, { message: "Required." }),
    description: z
      .string({
        required_error: "Required.",
      })
      .min(1, { message: "Required." }),
  }),
});

/**
 * Type definition representing the structure of a car object.
 */
export type CarSchemaType = z.infer<typeof carSchema>;

/**
 * Base schema for filtering cars.
 */
const carFilterBaseSchema = carSchema.pick({
  category: true,
  brand: true,
  year: true,
  transmission: true,
  fuelType: true,
  pricePerDay: true,
});

/**
 * Extended schema for filtering cars.
 */
const carFilterExtendedSchema = z.object({
  category: z.array(carSchema.shape.category),
  transmission: z.array(carSchema.shape.transmission),
  fuelType: z.array(carSchema.shape.fuelType),
  radius: z.number().min(1, { message: "Search area is required." }),
});

/**
 * Combined schema for filtering cars.
 */
export const carFilterSchema = carFilterBaseSchema
  .merge(carFilterExtendedSchema)
  .partial();

/**
 * Type definition representing the structure of a car filter.
 */
export type CarFilterSchemaType = z.infer<typeof carFilterSchema>;
