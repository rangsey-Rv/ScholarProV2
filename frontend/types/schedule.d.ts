// 1. The main Session Details
export interface ExamSessionDetail {
  sessionId: number;
  sessionName: string;
  location: string;
  capacity: number;
  startTime: string; // ISO Date String (e.g., "2025-12-27T02:00:00.000Z")
  endTime: string; // ISO Date String
  breakStart: string | null;
  breakEnd: string | null;
}

// 2. The Committee Member
export interface SessionCommittee {
  committeeId: string; // UUID String (Not a number!)
  committeeName: string;
}

// 3. The Subject/Batch Info
export interface SessionSubject {
  subjectId: number;
  subjectName: string;
}

// 4. The Student/Application
export interface SessionApplication {
  applicationId: number;
  applicantName: string;
  interviewSlotStart: string | null;
  interviewSlotEnd: string | null;
}

//* Exam Session
export interface CreateExamSessionPayload {
  batchId: number; // ADDED: Backend requires batch ID in request body
  sessionName: string;
  capacity: number;
  location: string;
  subjectId: number; // 1=Math, 2=English, 3=Interview
  examDate: string; // ISO string (e.g., "2025-12-01T00:00:00.000Z")
  startTime: string; // ISO string (e.g., "2025-12-01T09:00:00.000Z")
  endTime: string; // ISO string (e.g., "2025-12-01T11:00:00.000Z")
  committeeIds: string[]; // Array of committee member IDs
}

export interface ExamSessionResponse {
  id: number;
  batchId: number;
  subjectId: number;
  facultyId: null;
  sessionName: string;
  location: string;
  capacity: number;
  examDate: string; // ISO string
  startTime: string; // ISO string
  endTime: string; // ISO string
  breakStart: null;
  breakEnd: null;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  // committeeIds?: string[]; // Array of committee member IDs
  createdAt: string;
  updatedAt: string;
}

export interface ExamDetailResponse {
  examSession: ExamSessionDetail;
  faculty: {
    facultyName: string;
  } | null;
  committees: SessionCommittee[];
  subject: SessionSubject;
  applications: SessionApplication[];
}

//* Interview Session
export interface CreateInterviewSessionPayload {
  batchId: number; // ADDED: Backend requires batch ID in request body
  sessionName: string;
  location: string;
  subjectId: number; // 1=Math, 2=English, 3=Interview
  facultyId: number | null; // Interviewer ID (nullable)
  examDate: string; // ISO string (e.g., "2025-12-01T00:00:00.000Z")
  startTime: string; // ISO string (e.g., "2025-12-01T09:00:00.000Z")
  endTime: string; // ISO string (e.g., "2025-12-01T11:00:00.000Z")
  breakStart: string | null; // ISO string (e.g., "2025-12-01T09:30:00.000Z")
  breakEnd: string | null; // ISO string (e.g., "2025-12-01T10:00:00.000Z")
  committeeIds: string[]; // Array of committee member IDs
}

export interface InterviewSessionResponse {
  id: number;
  batchId: number;
  subjectId: number;
  facultyId: number;
  sessionName: string;
  location: string;
  capacity: number;
  examDate: string; // ISO string
  startTime: string; // ISO string
  endTime: string; // ISO string
  breakStart: string;
  breakEnd: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface InterviewDetailResponse {
  examSession: ExamSessionDetail;
  faculty: {
    facultyName: string;
  } | null;
  committees: SessionCommittee[];
  subject: SessionSubject;
  applications: SessionApplication[];
  batchId: number;
}

export type UnifiedDetailResponse =
  | ExamDetailResponse
  | InterviewDetailResponse;

//* Get All Sessions
export interface GetAllSession {
  examSessionsId: string;
  examSessionName: string;
  location: string;
  capacity: number;
  subjectName: string;
  examDate: string;
  committee: {
    id: string;
    name: string;
  }[];
}

//* Generic response wrapper
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}
