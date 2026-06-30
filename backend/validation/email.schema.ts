import { z } from "zod";
export const applicationStatusEnum = [
  "submitted",
  "shortlisted",
  "shortlisted_email_sent",
  "assessment_scheduled",
  "graded",
  "accepted",
  "accepted_email_sent",
  "rejected",
  "incomplete",
] as const;
export const createEmailTemplateSchema = z.object({
  templateName: z
    .string()
    .min(2, { message: "Email name should be at least 2 characters" }),
  subject: z
    .string()
    .min(2, { message: "Subject should be at least 2 characters" }),
  html: z.string().min(1, { message: "HTML content is required" }),
});

export const updateEmailTemplateSchema = z.object({
  subject: z
    .string()
    .min(2, { message: "Subject should be at least 2 characters" }),
  html: z.string().min(1, { message: "HTML content is required" }),
});

export const filterSchema = z.object({
  batchId: z.coerce
    .number()
    .int({ message: "Batch ID must be an integer" })
    .positive({ message: "Batch ID must be positive" })
    .optional(),
  status: z.enum(applicationStatusEnum).optional(),
  scholarshipPercentage: z.coerce
    .number()
    .positive({ message: "Scholarship percentage must be positive" })
    .optional(),
  major: z.string().min(1).optional(),
});
