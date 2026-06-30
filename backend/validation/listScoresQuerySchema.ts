// validations/scoreFilter.validation.ts
import { z } from "zod";

export const scoreFilterSchema = z.object({
  applicationId: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => v === undefined || (Number.isInteger(v) && v > 0), {
      message: "applicationId must be a positive integer",
    }),

  subjectId: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => v === undefined || (Number.isInteger(v) && v > 0), {
      message: "subjectId must be a positive integer",
    }),

  examId: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => v === undefined || (Number.isInteger(v) && v > 0), {
      message: "examId must be a positive integer",
    }),
});
