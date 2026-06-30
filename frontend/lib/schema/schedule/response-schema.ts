// src/schemas/schedule/response-schema.ts
import { z } from "zod";
import {
  ISODate,
  SessionCommitteeSchema,
  SessionSubjectSchema,
  SessionApplicationSchema,
  FacultySchema,
  ApiResponseSchema,
  BatchSchema,
  CommitteeSchema,
} from "./common-schema";

// --- Response Sub-Structures ---

// 1. The main Session Details structure (used nested inside *DetailResponse)
export const ExamSessionDetailSchema = z.object({
  sessionId: z.number().int(),
  sessionName: z.string(),
  location: z.string(),
  capacity: z.number().int(),
  startTime: ISODate,
  endTime: ISODate,
  breakStart: ISODate.nullable(),
  breakEnd: ISODate.nullable(),
});
export type ExamSessionDetail = z.infer<typeof ExamSessionDetailSchema>;

// 2. Base API Response for Exams/Interviews (shared fields)
const BaseSessionApiResponseSchema = z.object({
  id: z.number().int(),
  batchId: z.number().int(),
  subjectId: z.number().int(),
  sessionName: z.string(),
  location: z.string(),
  capacity: z.number().int(),
  examDate: ISODate,
  startTime: ISODate,
  endTime: ISODate,
  status: z.enum([
    "scheduled",
    "ongoing",
    "completed",
    "cancelled",
    "active",
    "inactive",
    "close",
  ]),
  createdAt: ISODate,
  updatedAt: ISODate,
});

// --- Specific Response Types ---

// 3. Exam Session Response (Extends Base, Null faculty/breaks)
export const ExamSessionResponseSchema = BaseSessionApiResponseSchema.extend({
  facultyId: z.null(),
  breakStart: z.null(),
  breakEnd: z.null(),
});
export type ExamSessionResponse = z.infer<typeof ExamSessionResponseSchema>;
export const WrappedExamSessionResponseSchema = ApiResponseSchema(
  ExamSessionResponseSchema,
);

// 4. Interview Session Response (Extends Base, Number faculty/string breaks)
export const InterviewSessionResponseSchema =
  BaseSessionApiResponseSchema.extend({
    facultyId: z.number().int(),
    breakStart: ISODate.nullable(),
    breakEnd: ISODate.nullable(),
  });
export type InterviewSessionResponse = z.infer<
  typeof InterviewSessionResponseSchema
>;
export const WrappedInterviewSessionResponseSchema = ApiResponseSchema(
  InterviewSessionResponseSchema,
);

// 5. Exam Detail Response (Nested structure) - Used for fetching EXAM details
export const ExamDetailResponseSchema = z.object({
  examSession: ExamSessionDetailSchema,
  faculty: z.null(),
  committees: z.array(SessionCommitteeSchema),
  subject: SessionSubjectSchema,
  applications: z.array(SessionApplicationSchema),
});
export type ExamDetailResponse = z.infer<typeof ExamDetailResponseSchema>;
export const WrappedExamDetailResponseSchema = ApiResponseSchema(
  ExamDetailResponseSchema,
);

// 6. Interview Detail Response (Nested structure) - Used for fetching INTERVIEW details
export const InterviewDetailApiResponseSchema = z.object({
  examSession: ExamSessionDetailSchema,
  faculty: z.object({ facultyName: z.string() }).nullable(),
  committees: z.array(SessionCommitteeSchema),
  subject: SessionSubjectSchema,
  applications: z.array(SessionApplicationSchema),
});
// Type for the raw API response
export type InterviewDetailApiResponse = z.infer<
  typeof InterviewDetailApiResponseSchema
>;
// Final type for application state, merging API response with manually added batchId
export type InterviewDetailResponse = InterviewDetailApiResponse & {
  batchId: number;
};
export const WrappedInterviewDetailResponseSchema = ApiResponseSchema(
  InterviewDetailApiResponseSchema,
);

// 8. Unified Detail Response (for use in services where endpoint returns either exam or interview)
export const UnifiedDetailResponseSchema = z.union([
  ExamDetailResponseSchema,
  InterviewDetailApiResponseSchema,
]);
export type UnifiedDetailResponse = z.infer<typeof UnifiedDetailResponseSchema>;
export const WrappedUnifiedDetailResponseSchema = ApiResponseSchema(
  UnifiedDetailResponseSchema,
);

// 7. Get All Sessions (Flat list response for the sidebar list)
export const GetAllSessionSchema = z.object({
  examSessionId: z.number().int(),
  examSessionName: z.string(),
  location: z.string(),
  capacity: z.number().int(),
  subjectName: z.string(),
  examDate: ISODate,
  committees: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
  ),
});
export type GetAllSession = z.infer<typeof GetAllSessionSchema>;

// --- API Response Wrappers (for your service file use) ---

export const FacultyApiResponseSchema = ApiResponseSchema(
  z.array(FacultySchema),
);
export const SingleFacultyApiResponseSchema = ApiResponseSchema(FacultySchema);
export const BatchApiResponseSchema = ApiResponseSchema(z.array(BatchSchema));

// Raw schema for the inconsistent batches API response
export const RawBatchesResponseSchema = z.object({
  batches: z.array(BatchSchema),
});

export const CommitteesApiResponseSchema = ApiResponseSchema(
  z.array(CommitteeSchema),
);
export const GetAllSessionsApiResponseSchema = ApiResponseSchema(
  z.array(GetAllSessionSchema),
);
