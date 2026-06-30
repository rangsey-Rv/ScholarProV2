// src/services/examService.ts
import { db } from "@db";
import { eq } from "drizzle-orm";
import { exams } from "@db/schema/exam";
import { examSessions } from "@db/schema/exam-session";
import { applications } from "@db/schema/application";

export async function getStudentsByExamSession(sessionId: number) {
  const result = await db
    .select({
      examId: exams.id,
      appId: applications.id,
      studentId: applications.studentId,
      sessionId: examSessions.id,
      examDate: examSessions.examDate,
      examStatus: exams.status,
    })
    .from(exams)
    .innerJoin(examSessions, eq(exams.examSessionId, examSessions.id))
    .innerJoin(applications, eq(applications.id, exams.appId))
    .where(eq(examSessions.id, sessionId));

  return result;
}

/**
 * 3️⃣ List all exams in a batch (for admin)
 */
export async function getExamsByBatch(batchId: number) {
  const result = await db
    .select({
      examId: exams.id,
      status: exams.status,
      totalScore: exams.totalScore,
      batchId: examSessions.batchId,
      subjectId: examSessions.subjectId,
      examDate: examSessions.examDate,
    })
    .from(exams)
    .innerJoin(examSessions, eq(exams.examSessionId, examSessions.id))
    .where(eq(examSessions.batchId, batchId));

  return result;
}
