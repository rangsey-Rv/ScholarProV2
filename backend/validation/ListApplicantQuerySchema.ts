import { z } from "zod";

const stringArray = z.preprocess((val) => {
  if (!val) return undefined;

  if (Array.isArray(val)) {
    return val
      .filter((v): v is string => typeof v === "string")
      .flatMap(v => v.split(","));
  }

  if (typeof val === "string") {
    return val.split(",");
  }

  return undefined;
}, z.array(z.string().trim()));

const numberArray = z.preprocess((val) => {
  if (!val) return undefined;

  if (Array.isArray(val)) return val.map(Number);
  if (typeof val === "string") return val.split(",").map(Number);

  return undefined;
}, z.array(z.number().int().positive()));

export const ListApplicantQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),

  sortBy: z.enum(["name", "dateApplied", "id"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),

  search: z.string().trim().optional(),

  applicationId: z.coerce.number().int().positive().optional(),

  batchId: numberArray.optional(),

  province: stringArray.optional(),

  status: z
    .preprocess((val) => {
      if (!val) return undefined;
      if (Array.isArray(val)) return val;
      if (typeof val === "string") return val.split(",");
      return undefined;
    }, z.array(z.enum(["submitted", "shortlisted", "shortlisted_email_sent", "assessment_scheduled", "graded", "accepted", "accepted_email_sent", "rejected", "incomplete"])))
    .optional(),

  paymentStatus: z.enum(["failed", "pending", "completed"]).optional(),

  scholarshipPercentage: z.coerce.number().min(0).max(100).optional(),
});
