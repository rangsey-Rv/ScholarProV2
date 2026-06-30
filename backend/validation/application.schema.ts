import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
import { applications } from "@db/schema/application";
import { students } from "@db/schema/student";

const insertApplicationSchema = createInsertSchema(applications);
const insertStudentSchema = createInsertSchema(students);

export const createStudentSchema = insertStudentSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    email: z.string().email("Invalid email format"),
  });

// Create schema — studentId is omitted because it will be assigned after creating the student
export const createApplicationSchema = insertApplicationSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    studentId: true,
  })
  .extend({
    scholarshipPercentage: z.number().min(0).max(100).optional(),
  });

// Partial update schema
export const updateApplicationSchema = createApplicationSchema.partial();

// Update single status
export const updateStatusSchema = z.object({
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
  paymentStatus: z.enum(["pending", "completed", "failed"]).optional(),
});

// Bulk update statuses
export const bulkUpdateStatusSchema = z.object({
  ids: z.array(z.number().int().positive()),
  status: z.enum([
    "submitted",
    "shortlisted",
    "shortlisted_email_sent",
    "assessment_scheduled",
    "graded",
    "accepted",
    "accepted_email_sent",
    "rejected",
    "incomplete",
  ]),
});

export const createStudentWithApplicationsSchema = z.object({
  student: createStudentSchema,
  applications: z.array(createApplicationSchema),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type BulkUpdateStatusInput = z.infer<typeof bulkUpdateStatusSchema>;
export type CreateStudentWithApplicationsInput = z.infer<
  typeof createStudentWithApplicationsSchema
>;
