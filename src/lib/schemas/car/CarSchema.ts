import { Brand, Category, Color, FuelType, Transmission } from "@prisma/client";
import { z } from "zod";

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

export type CarSchemaType = z.infer<typeof carSchema>;

const carFilterBaseSchema = carSchema.pick({
  category: true,
  brand: true,
  year: true,
  transmission: true,
  fuelType: true,
  pricePerDay: true,
});

const carFilterExtendedSchema = z.object({
  category: z.array(carSchema.shape.category),
  transmission: z.array(carSchema.shape.transmission),
  fuelType: z.array(carSchema.shape.fuelType),
  radius: z.number().min(1, { message: "Search area is required." }),
});

export const carFilterSchema = carFilterBaseSchema
  .merge(carFilterExtendedSchema)
  .partial();

export type CarFilterSchemaType = z.infer<typeof carFilterSchema>;
