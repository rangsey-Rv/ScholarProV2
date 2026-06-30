// src/schemas/schedule/common-schema.ts

import { z } from "zod";

// Helper: Defines a standard ISO date string validation
const ISODate = z
  .string()
  .datetime({ message: "Must be a valid ISO 8601 date string" });
export { ISODate };

// --- Core Data Structures ---

// 1. The Committee Member (both detail and generic list item)
export const SessionCommitteeSchema = z.object({
  committeeId: z.string().uuid(), // Use UUID validation if appropriate for your backend
  committeeName: z.string(),
});
export type SessionCommittee = z.infer<typeof SessionCommitteeSchema>;

// 2. The Subject/Batch Info
export const SessionSubjectSchema = z.object({
  subjectId: z.number().int(),
  subjectName: z.string(),
});
export type SessionSubject = z.infer<typeof SessionSubjectSchema>;

// 3. The Student/Application
export const SessionApplicationSchema = z.object({
  applicationId: z.number().int(),
  applicantName: z.string(),
  interviewSlotStart: ISODate.nullable(),
  interviewSlotEnd: ISODate.nullable(),
});
export type SessionApplication = z.infer<typeof SessionApplicationSchema>;

// 4. Faculty (Interviewer)
export const FacultySchema = z.object({
  id: z.number().int(),
  facultyName: z.string(),
});
export type Faculty = z.infer<typeof FacultySchema>;

// 5. Batch
export const BatchSchema = z.object({
  id: z.number().int(), // Corrected from z.string()
  batchName: z.string(),
  startDate: ISODate,
  endDate: ISODate,
  description: z.string().nullable(),
  status: z.enum(["active", "inactive", "cancelled", "closed"]),
  createdAt: ISODate,
  updatedAt: ISODate,
});
export type Batch = z.infer<typeof BatchSchema>;

// 6. Committee User Details
export const CommitteeUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["admin", "committee"]),
  phoneNumber: z.string().nullable(),
  isActive: z.boolean(),
});

export const CommitteeSchema = z.object({
  // Renamed from CommitteeDetailSchema
  id: z.string().uuid(),
  name: z.string(),
  // CORRECTED THIS LINE to match your API response UUID format
  userId: z.string().uuid(),
  departmentId: z.number().int().nullable(),
  createdAt: ISODate,
  updatedAt: ISODate,
  user: CommitteeUserSchema,
  department: z
    .object({ id: z.number().int(), name: z.string().optional() })
    .nullable(),
});
// Update the export type alias as well
export type Committee = z.infer<typeof CommitteeSchema>;

// 8. Generic Response Wrapper Utility (used in response-schema.ts)
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataType: T) =>
  z.object({
    success: z.boolean().optional(),
    message: z.string().optional(),
    data: dataType.optional(), // Make data optional
  });
