import { db } from "@db";
import { committees } from "@db/schema/committee";
import { interviewScores } from "@db/schema/interview-score";
import { examSessionCommittees } from "@db/schema/exam-session-committee";
import { eq, and } from "drizzle-orm";
import { exams } from "@db/schema/exam";
import { interviewCriterias } from "@db/schema/interview-criteria";
import { applications } from "@db/schema/application";
interface UpdateInterviewScorePayload {
  examId: number;
  userId: string;
  criteriaId: number;
  score: number;
}

export class InterviewScoreService {
  async updateScoreByCriteria(payload: UpdateInterviewScorePayload) {
    const { examId, userId, criteriaId, score } = payload;

    if (score < 0) {
      return {
        success: false,
        msg: "Score cannot be negative",
      };
    }

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

      const [criteria] = await tx
        .select({ weight: interviewCriterias.weight })
        .from(interviewCriterias)
        .where(
          and(
            eq(interviewCriterias.id, criteriaId),
            eq(interviewCriterias.isActive, true)
          )
        );

      if (!criteria) {
        return {
          success: false,
          msg: "Criteria not found",
        };
      }

      if (score > criteria.weight) {
        return {
          success: false,
          msg: `Score cannot be bigger than ${criteria.weight}`,
        };
      }

      const [examSession] = await tx
        .select({ examSessionId: exams.examSessionId , appId: exams.appId})
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
          msg: "You are not assigned to this exam session",
        };
      }

      const result = await tx
        .insert(interviewScores)
        .values({
          examId: examId,
          committeeId: committee.committeeId,
          criteriaId: criteriaId,
          score: score,
        })
        .onConflictDoUpdate({
          target: [interviewScores.examId, interviewScores.criteriaId, interviewScores.committeeId],
          set: { score: score },
        })
        .returning();

      if (!result || result.length === 0) {
        return {
          success: false,
          msg: "Failed to input score for this applicant",
        };
      }

      const interviewScore = await tx
        .select({
          score: interviewScores.score,
          committeeId: interviewScores.committeeId,
        })
        .from(interviewScores)
        .where(eq(interviewScores.examId, examId));

      const committeeScores = new Map<string, number>();
      
      for (const item of interviewScore) {
        const currentScore = committeeScores.get(item.committeeId) || 0;
        committeeScores.set(item.committeeId, currentScore + (item.score ?? 0));
      }
      const committeeTotals = Array.from(committeeScores.values());
      
      const totalScore =
        committeeTotals.length > 0
          ? committeeTotals.reduce((sum, score) => sum + score, 0) /
            committeeTotals.length
          : 0;

      const updateScore = await tx
        .update(exams)
        .set({ totalScore: totalScore.toFixed(2) })
        .where(eq(exams.id, examId))
        .returning();
     
      if (!updateScore || updateScore.length === 0) {
        return {
          success: false,
          msg: "Failed to input score for this applicant",
        };
      }
      await tx.update(applications).set({ status: "graded" }).where(eq(applications.id, examSession.appId));
      return {
        success: true,
        msg: "Score updated successfully",
      };
    });
  }
}
