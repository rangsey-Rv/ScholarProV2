import { z } from "zod";

export const updateApplicationSchema = z
  .object({
    paymentStatus: z.enum(["pending", "completed", "failed"]).optional(),
    status: z
      .enum([
        "submitted",
        "shortlisted",
        "shortlisted_email_sent",
        "assessment_scheduled",
        "graded",
        "accepted",
        "accepted_email_sent",
        "rejected",
        "incomplete",
      ])
      .optional(),
    isMathTestSkipped: z.boolean().optional(),
    isEnglishTestSkipped: z.boolean().optional(),
    scholarshipPercentage: z.number().min(0).max(100).optional(),
  })
  .refine(
    (data) =>
      data.paymentStatus !== undefined ||
      data.status !== undefined ||
      data.scholarshipPercentage !== undefined ||
      data.isMathTestSkipped !== undefined ||
      data.isEnglishTestSkipped !== undefined,
    {
      path: ["paymentStatus"],
      message:
        "At least one field must be provided (paymentStatus, status, scholarshipPercentage, isMathTestSkipped, isEnglishTestSkipped)",
    }
  );
