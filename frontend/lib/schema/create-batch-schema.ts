// import { z } from "zod";

// // Sanitize helper
// const sanitize = (val: string) =>
//   val.replace(/</g, "&lt;").replace(/>/g, "&gt;");

// export const createBatchSchema = z.object({

//   batchName: z
//     .string()
//     .min(2, "Batch name is too short")
//     .max(100, "Batch name too long")
//     .trim()
//     .transform(sanitize),

//   startDate: z.date({}),
//   endDate: z.date({}),
//   description: z
//     .string()
//     .max(500, "Description too long")
//     .trim()
//     .transform(sanitize)
//     .optional(),

// });

// export type BatchFormValues = z.infer<typeof createBatchSchema>;

import { z } from "zod";
import DOMPurify from "dompurify";

const containsHtmlOrScript = (value: string) => {
  const sanitized = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  return sanitized !== value;
};
export const createBatchSchema = z.object({
  batchName: z
    .string()
    .min(2, "Batch name is too short")
    .max(100, "Batch name is too long")
    .trim()
    .refine((value) => !containsHtmlOrScript(value), {
      message: "Script or HTML tags are not allowed in this field",
    }),
  startDate: z.date("Start date is required"),
  endDate: z.date("End date is required"),
  description: z
    .string()
    .max(500, "Description is too long")
    .trim()
    .refine((value) => !containsHtmlOrScript(value), {
      message: "Script or HTML tags are not allowed in this field",
    })
    .optional(),
  status: z.string().max(50, "Status is too long").trim(),
});
export type BatchFormValues = z.infer<typeof createBatchSchema>;
