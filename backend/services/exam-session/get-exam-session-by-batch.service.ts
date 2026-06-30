import { db } from "@db";
import { eq } from "drizzle-orm";
import { examSessions } from "@db/schema/exam-session";
import { examSessionCommittees } from "@db/schema/exam-session-committee";
import { batches } from "@db/schema/batch";
import { subjects } from "@db/schema/subject";
import { committees } from "@db/schema/committee";

export default async (batchId: number) => {
  if (!batchId || isNaN(batchId)) {
    return {
      success: false,
      msg: "Invalid Batch id",
    };
  }

  const [batch] = await db
    .select()
    .from(batches)
    .where(eq(batches.id, batchId));

  if (!batch) {
    return {
      success: false,
      msg: "Batch not found",
    };
  }

  // Query from examSessions directly (not from exams!)
  const rows = await db
    .select({
      examSessionId: examSessions.id,
      examSessionName: examSessions.sessionName,
      location: examSessions.location,
      capacity: examSessions.capacity,
      subjectName: subjects.subjectName,
      examDate: examSessions.examDate,
      committeeId: committees.id,
      committeeName: committees.name,
    })
    .from(examSessions)
    .innerJoin(subjects, eq(examSessions.subjectId, subjects.id))
    .innerJoin(
      examSessionCommittees,
      eq(examSessions.id, examSessionCommittees.examSessionId)
    )
    .innerJoin(committees, eq(examSessionCommittees.committeeId, committees.id))
    .where(eq(examSessions.batchId, batchId));

  if (!rows || rows.length === 0) {
    return {
      success: true,
      msg: "This batch has no exam session yet",
      data: [],
    };
  }

  const sessionsMap: Record<number, any> = {};

  for (const row of rows) {
    if (!sessionsMap[row.examSessionId]) {
      sessionsMap[row.examSessionId] = {
        examSessionId: row.examSessionId,
        examSessionName: row.examSessionName,
        location: row.location,
        capacity: row.capacity,
        subjectName: row.subjectName,
        examDate: row.examDate,
        committees: [],
      };
    }

    
    if (
      row.committeeId &&
      !sessionsMap[row.examSessionId].committees.some(
        (c: any) => c.id === row.committeeId
      )
    ) {
      sessionsMap[row.examSessionId].committees.push({
        id: row.committeeId,
        name: row.committeeName,
      });
    }
  }

  return {
    success: true,
    data: Object.values(sessionsMap),
  };
};
