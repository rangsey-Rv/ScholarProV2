import { db } from "@db";
import { eq, sql } from "drizzle-orm";
import { exams } from "@db/schema/exam";
import { examSessions } from "@db/schema/exam-session";
import { applications } from "@db/schema/application";
import { students } from "@db/schema/student";

export default async (sessionId: number) => {
  if (!sessionId || isNaN(sessionId)) {
    return {
      success: false,
      msg: "Invalid exam session id",
    };
  }

  const [session] = await db
    .select()
    .from(examSessions)
    .where(eq(examSessions.id, sessionId));

  if (!session) {
    return {
      success: false,
      msg: "Exam session not found",
    };
  }

  const result = await db
    .select({
      examId: exams.id,
      appId: applications.id,
      name: sql<string>`COALESCE(${students.nameEn}, 'N/A')`,
      email: students.email,
      sessionId: examSessions.id,
      examDate: examSessions.examDate,
      examStatus: exams.status,
      examScore: exams.totalScore,
    })
    .from(exams)
    .innerJoin(examSessions, eq(exams.examSessionId, examSessions.id))
    .innerJoin(applications, eq(applications.id, exams.appId))
    .innerJoin(students, eq(students.id, applications.studentId))
    .where(eq(examSessions.id, sessionId));

  if (!result) {
    return {
      success: false,
      msg: "Unable to retrieve exam session applications. Please try again later.",
    };
  }

  if (result.length === 0) {
    return {
      success: true,
      msg: "No applications found for this exam session.",
    };
  }

  return {
    success: true,
    data: result,
  };
}
