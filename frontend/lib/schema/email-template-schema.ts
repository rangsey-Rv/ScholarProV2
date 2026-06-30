import { z } from "zod";
import { sanitizeEmailTemplate, sanitizeText } from "@/lib/utils/sanitize";

/**
 * Email Template Schema (for creating new templates)
 * Validates email template inputs
 * Following existing project pattern from create-batch-schema.ts
 */
export const emailTemplateSchema = z.object({
  templateName: z
    .string()
    .min(1, "Template name is required")
    .max(100, "Template name too long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, underscores, and hyphens allowed",
    )
    .trim()
    .toLowerCase()
    .transform(sanitizeText),

  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject too long")
    .trim()
    .transform(sanitizeText),

  html: z
    .string()
    .min(1, "Email content is required")
    .max(50000, "Content too long (max 50KB)")
    .trim()
    .transform(sanitizeEmailTemplate),
});

/**
 * Email Template Update Schema
 * For updating existing templates (only subject and html, name is in URL)
 */
export const emailTemplateUpdateSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject too long")
    .trim()
    .transform(sanitizeText),

  html: z
    .string()
    .min(1, "Email content is required")
    .max(50000, "Content too long (max 50KB)")
    .trim()
    .transform(sanitizeEmailTemplate),
});

/**
 * Bulk Email Send Schema
 * Validates bulk email sending requests
 */
export const bulkEmailSchema = z.object({
  templateName: z.string().min(1, "Template name is required"),

  applicationIds: z
    .array(z.number().positive("Invalid applicant ID"))
    .min(1, "At least one recipient is required")
    .max(500, "Cannot send to more than 500 recipients at once"),
});

// Type exports
export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;
export type EmailTemplateUpdateValues = z.infer<
  typeof emailTemplateUpdateSchema
>;
export type BulkEmailFormValues = z.infer<typeof bulkEmailSchema>;
