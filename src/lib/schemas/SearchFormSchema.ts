import { z } from "zod";

/**
 * Zod schema for defining the structure of a search form object.
 */
export const searchFormSchema = z.object({
  location: z.object({
    id: z
      .string({
        required_error: "Required.",
      })
      .min(1, { message: "Required" }),
    description: z
      .string({
        required_error: "Required.",
      })
      .min(1, { message: "Required" }),
  }),
  date: z.object({
    from: z
      .date({
        required_error: "Required.",
      })
      .min(new Date(), {
        message: "After current date",
      }),
    to: z
      .date({
        required_error: "Required.",
      })
      .min(new Date(), {
        message: "After current date",
      }),
  }),
});

/**
 * Type definition representing the structure of a search form object.
 */
export type SearchFormSchemaType = z.infer<typeof searchFormSchema>;
