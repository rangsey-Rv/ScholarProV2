import { z } from "zod";

// Sanitize helper
// const sanitize = (val: string) =>
//   val.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_TYPES = ["text/csv", "application/vnd.ms-excel"];

export const importFileSchema = z.object({
  id: z.number().optional(),

  studentFile: z
    .any()
    .refine((file) => file instanceof File, "A file is required")
    .refine((file) => file?.size <= MAX_FILE_SIZE, "File must be less than 5MB")
    .refine(
      (file) =>
        ACCEPTED_TYPES.includes(file?.type) || file?.name.endsWith(".csv"),
      "Only CSV files are allowed",
    ),
});

// Infer the type from the schema to use in the React component
export type importFileSchemaType = z.infer<typeof importFileSchema>;
