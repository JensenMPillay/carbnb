import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ-\s]+$/, {
      message: "Name should only contain letters, dashes, and accents",
    }),
  phone: z
    .string()
    .min(1, { message: "Phone is required" })
    .regex(/^\+?\d+$/, {
      message:
        "Phone should only contain valid numbers and may start with an optional + sign",
    }),
  role: z.string().min(1, { message: "Role is required" }),
});

export type RegisterUserSchemaType = z.infer<typeof registerUserSchema>;
