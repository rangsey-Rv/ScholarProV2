import { db } from "@db";
import { eq } from "drizzle-orm";

import { interviewScores } from "@db/schema/interview-score";
import { interviewCriterias } from "@db/schema/interview-criteria";
import { exams } from "@db/schema/exam";
import { applications } from "@db/schema/application";

export class InterviewScoreService {
  async listAllByApplications() {
    const rows = await db
      .select({
        applicationId: exams.appId,
        examId: exams.id,
        committeeId: interviewScores.committeeId,
        criteriaId: interviewCriterias.id,
        criteriaName: interviewCriterias.name,
        weight: interviewCriterias.weight,
        score: interviewScores.score,
      })
      .from(exams)
      .leftJoin(interviewScores, eq(interviewScores.examId, exams.id))
      .leftJoin(
        interviewCriterias,
        eq(interviewScores.criteriaId, interviewCriterias.id)
      )
      .innerJoin(applications, eq(exams.appId, applications.id))
      .where(eq(interviewCriterias.isActive, true));

    const grouped: Record<number, any> = {};

    for (const row of rows) {
      if (!row.applicationId || !row.criteriaId || !row.committeeId) continue;

      const appId = row.applicationId;
      const score = row.score ?? 0;
      const weight = row.weight ?? 0;

      if (!grouped[appId]) {
        grouped[appId] = {
          applicationId: appId,
          examId: row.examId,
          committeeScores: {} as Record<string, number>, // committeeId (UUID) -> total weighted score
          totalWeight: 0,
          criterias: {} as Record<number, any>,
        };
      }

      // Sum weighted score per committee for final average
      if (!grouped[appId].committeeScores[row.committeeId]) {
        grouped[appId].committeeScores[row.committeeId] = 0;
      }
      grouped[appId].committeeScores[row.committeeId] += score * (weight / 100);

      // Save criteria info and store score per committee
      if (!grouped[appId].criterias[row.criteriaId]) {
        grouped[appId].criterias[row.criteriaId] = {
          id: row.criteriaId,
          name: row.criteriaName,
          weight,
          committeeScores: {} as Record<string, number>, // committeeId (UUID) -> weighted score for this criterion
        };
        grouped[appId].totalWeight += weight;
      }

      // Add committee score for this criterion
      grouped[appId].criterias[row.criteriaId].committeeScores[
        row.committeeId
      ] =
        (grouped[appId].criterias[row.criteriaId].committeeScores[
          row.committeeId
        ] ?? 0) +
        score * (weight / 100);
    }

    return Object.values(grouped).map((app: any) => {
      const committeeScores = Object.values(app.committeeScores) as number[];
      const finalScore = committeeScores.length
        ? committeeScores.reduce((a: number, b: number) => a + b, 0) /
          committeeScores.length
        : 0;

      return {
        applicationId: app.applicationId,
        examId: app.examId,
        finalScore: Number(finalScore.toFixed(2)),
        totalWeight: app.totalWeight,
        criterias: Object.values(app.criterias),
      };
    });
  }

  async listByApplication(applicationId: number) {
    const rows = await db
      .select({
        examId: exams.id,
        committeeId: interviewScores.committeeId,
        criteriaId: interviewCriterias.id,
        criteriaName: interviewCriterias.name,
        weight: interviewCriterias.weight,
        score: interviewScores.score,
      })
      .from(exams)
      .leftJoin(interviewScores, eq(interviewScores.examId, exams.id))
      .leftJoin(
        interviewCriterias,
        eq(interviewScores.criteriaId, interviewCriterias.id)
      )
      .where(eq(exams.appId, applicationId));

    if (!rows.length) {
      return {
        applicationId,
        examId: null,
        finalScore: 0,
        totalWeight: 0,
        criterias: [],
      };
    }

    const committeeScores: Record<string, number> = {}; // Changed to string for UUID
    const criteriasMap: Record<number, any> = {};
    let totalWeight = 0;

    for (const row of rows) {
      if (!row.criteriaId || !row.committeeId) continue;

      const score = row.score ?? 0;
      const weight = row.weight ?? 0;

      // Sum weighted score per committee for final average
      if (!committeeScores[row.committeeId])
        committeeScores[row.committeeId] = 0;
      committeeScores[row.committeeId] += score * (weight / 100);

      // Save criteria info
      if (!criteriasMap[row.criteriaId]) {
        criteriasMap[row.criteriaId] = {
          id: row.criteriaId,
          name: row.criteriaName,
          weight,
          committeeScores: {} as Record<string, number>, // Changed to string for UUID
        };
        totalWeight += weight;
      }

      // Add committee score for this criterion
      criteriasMap[row.criteriaId].committeeScores[row.committeeId] =
        (criteriasMap[row.criteriaId].committeeScores[row.committeeId] ?? 0) +
        score * (weight / 100);
    }

    const numberOfCommittees = Object.keys(committeeScores).length;
    const finalScore = numberOfCommittees
      ? Object.values(committeeScores).reduce((a, b) => a + b, 0) /
        numberOfCommittees
      : 0;

    const result = {
      applicationId,
      examId: rows[0].examId,
      finalScore: Number(finalScore.toFixed(2)),
      totalWeight,
      criterias: Object.values(criteriasMap),
    };

    if (result.examId) {
        try {
          await db
            .update(exams)
            .set({
              totalScore: result.finalScore.toString(), 
              updatedAt: new Date()
            })
            .where(eq(exams.appId, applicationId));
        } catch (error) {
          console.error('Failed to update exam score:', error);
        }
      try {
        await db
          .update(exams)
          .set({
            totalScore: result.finalScore.toString(),
            updatedAt: new Date(),
          })
          .where(eq(exams.appId, applicationId));
      } catch (error) {
        console.error("Failed to update exam score:", error);
      }
    }

    return result;
  }
}
