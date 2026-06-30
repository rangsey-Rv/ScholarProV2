import { db } from "@db";
import { examSessions } from "@db/schema/exam-session";
import { exams } from "@db/schema/exam";
import { lt, gt, and, eq, inArray } from "drizzle-orm";

export default async function updateExamSessionStatus() {
  const now = new Date();

  await db
    .update(examSessions)
    .set({ status: "ongoing" })
    .where(
      and(
        eq(examSessions.status, "scheduled"),
        lt(examSessions.startTime, now),
        gt(examSessions.endTime, now)
      )
    );

  await db
    .update(examSessions)
    .set({ status: "completed" })
    .where(
      and(eq(examSessions.status, "ongoing"), lt(examSessions.endTime, now))
    );

  const ongoingSessionIds = await db
    .select({ id: examSessions.id })
    .from(examSessions)
    .where(eq(examSessions.status, "ongoing"));

  if (ongoingSessionIds.length > 0) {
    await db
      .update(exams)
      .set({ status: "in_progress" })
      .where(
        inArray(
          exams.examSessionId,
          ongoingSessionIds.map((s: { id: number }) => s.id)
        )
      );
  }

  const completedSessionIds = await db
    .select({ id: examSessions.id })
    .from(examSessions)
    .where(eq(examSessions.status, "completed"));

  if (completedSessionIds.length > 0) {
    await db
      .update(exams)
      .set({ status: "completed" })
      .where(
        inArray(
          exams.examSessionId,
          completedSessionIds.map((s: { id: number }) => s.id)
        )
      );
  }
}
