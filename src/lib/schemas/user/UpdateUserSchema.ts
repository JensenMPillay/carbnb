import { z } from "zod";

/**
 * Zod schema for defining the structure of an update user object.
 */
export const updateUserSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  password: z
    .string()
    .min(12, { message: "Password must be atleast 12 characters" })
    .regex(/^(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least one number",
    })
    .regex(/^(?=.*[@$!%*?&])/, {
      message: "Password must contain at least one special character",
    })
    .optional()
    .or(z.literal("")),
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
});

/**
 * Type definition representing the structure of an update user object.
 */
export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
