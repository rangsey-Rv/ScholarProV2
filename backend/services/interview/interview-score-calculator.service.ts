import { db } from '@db';
import { interviewCriterias } from '@db/schema/interview-criteria';
import {  interviewScores} from '@db/schema/interview-score';
import { eq } from 'drizzle-orm';

export class InterviewScoreCalculatorService {

  async calculateFinalScore(examId: number, userId: string): Promise<number> {
   
    const criterias = await db.select().from(interviewCriterias).where(eq(interviewCriterias.isActive, true));

    if (!criterias.length) {
      throw new Error('No active interview criteria found.');
    }

    const totalWeight = criterias.reduce((sum, c) => sum + c.weight, 0);

    if (totalWeight !== 100) {
      throw new Error(`Total criteria weight must equal 100%. Current: ${totalWeight}%`);
    }

    const scores = await db
      .select()
      .from(interviewScores)
      .where(
        eq(interviewScores.examId, examId) &&
        eq(interviewScores.committeeId, userId)
      );

    if (!scores.length) {
      throw new Error('No interview scores found for this exam and committee.');
    }

    let finalScore = 0;

    for (const criteria of criterias) {
      const criteriaScore = scores.find(s => s.criteriaId === criteria.id);

      if (!criteriaScore || criteriaScore.score === null) {
        throw new Error(`Missing score for criteria: ${criteria.name}`);
      }

      finalScore += (criteriaScore.score * criteria.weight) / 100;
    }

    return Number(finalScore.toFixed(2));
  }
}
