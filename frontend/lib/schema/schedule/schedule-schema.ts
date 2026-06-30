// src/schemas/schedule/schedule-schema.ts
import { z } from "zod";

// Helper for basic string validation reuse
const requiredString = (message: string) =>
  z.string().nonempty({ message: message });

// --- Input Payloads ---

// Base schema for creating any session payload (used for Exam/Interview specifics)
const BaseCreateSessionPayload = z.object({
  batchId: z.number().int({ message: "Batch ID is required" }),
  sessionName: requiredString("Session Name is required")
    .max(100, { message: "Session Name must be less than 100 characters" })
    .transform((val) =>
      val.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()),
    ),
  location: requiredString("Location is required").max(200),
  subjectId: z.number().int({ message: "Subject ID is required" }),
  examDate: requiredString("Date is required").refine(
    (val) => !isNaN(Date.parse(val)),
    { message: "Invalid date format" },
  ),
  startTime: requiredString("Start Time is required"),
  endTime: requiredString("End Time is required"),
  committeeIds: z.array(z.string().uuid(), {
    error: "Committee IDs must be a list of valid UUID strings",
  }),
});

// 1. Create Exam Session Payload (Extends Base)
export const CreateExamSessionPayloadSchema = BaseCreateSessionPayload.extend({
  capacity: z
    .number()
    .int({ message: "Capacity must be a number" })
    .min(1, { message: "Capacity must be at least 1" })
    .max(2000, { message: "Capacity must be less than or equal to 2000" }),
});
export type CreateExamSessionPayload = z.infer<
  typeof CreateExamSessionPayloadSchema
>;

// 2. Create Interview Session Payload (Extends Base)
export const CreateInterviewSessionPayloadSchema =
  BaseCreateSessionPayload.extend({
    facultyId: z
      .number()
      .int({ message: "Faculty (Interviewer) ID is required" })
      .optional()
      .nullable(),
    // Interview sessions break times are optional
    breakStart: z.string().optional().nullable(),
    breakEnd: z.string().optional().nullable(),
  });
export type CreateInterviewSessionPayload = z.infer<
  typeof CreateInterviewSessionPayloadSchema
>;

// Your original user input schema from your last message is similar to BaseCreateSessionPayload
export const ScheduleSchema = CreateInterviewSessionPayloadSchema; // You can alias it if you want
