import { z } from "zod";

export const searchFormSchema = z.object({
  location: z
    .string({
      required_error: "Required.",
    })
    .min(1, { message: "Required" }),
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

export type SearchFormSchemaType = z.infer<typeof searchFormSchema>;
