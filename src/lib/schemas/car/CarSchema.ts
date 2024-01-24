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
  locationId: z.string().min(1, { message: "Location is required" }),
});

export type CarSchemaType = z.infer<typeof carSchema>;
