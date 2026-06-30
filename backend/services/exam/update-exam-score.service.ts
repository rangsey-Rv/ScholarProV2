import { db } from "@db";
import { exams } from "@db/schema/exam";
import { committees } from "@db/schema/committee";
import { examSessionCommittees } from "@db/schema/exam-session-committee";
import { eq, and } from "drizzle-orm";
import { applications } from "@db/schema/application";
interface UpdateExamScorePayload {
  userId: string;
  examId: number;
  totalScore: number;
}

export class updateExamScoreService {
  async updateExamScore(payload: UpdateExamScorePayload) {
    const { userId, examId, totalScore } = payload;

    return await db.transaction(async (tx) => {
      const [committee] = await tx
        .select({ committeeId: committees.id })
        .from(committees)
        .where(eq(committees.userId, userId));

      if (!committee) {
        return {
          success: false,
          msg: "Committee not found",
        };
      }

      const [examSession] = await tx
        .select({ examSessionId: exams.examSessionId, appId: exams.appId })
        .from(exams)
        .where(eq(exams.id, examId));

      if (!examSession) {
        return {
          success: false,
          msg: "Exam session not found",
        };
      }

      const examSessionCommittee = await tx
        .select({ committeeId: examSessionCommittees.committeeId })
        .from(examSessionCommittees)
        .where(
          and(
            eq(examSessionCommittees.examSessionId, examSession.examSessionId),
            eq(examSessionCommittees.committeeId, committee.committeeId)
          )
        );

      if (!examSessionCommittee || examSessionCommittee.length === 0) {
        return {
          success: false,
          msg: "You are not assign to this exam session",
        };
      }

      if (totalScore < 0 || totalScore > 100) {
        throw new Error("Total score must be between 0 and 100");
      }

      const existing = await tx
        .select()
        .from(exams)
        .where(eq(exams.id, examId));

      if (!existing.length) {
        throw new Error("Exam not found");
      }

      await tx
        .update(exams)
        .set({
          totalScore: totalScore.toString(),
          status: "completed",
          updatedAt: new Date(),
        })
        .where(eq(exams.id, examId));

      await tx
        .update(applications)
        .set({ status: "graded" })
        .where(eq(applications.id, examSession.appId));

      return {
        message: "Exam score updated successfully",
        examId,
        totalScore,
      };
    });
  }
}
