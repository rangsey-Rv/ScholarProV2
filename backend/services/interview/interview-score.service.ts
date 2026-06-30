import { db } from '@db';
import { interviewScores } from '@db/schema/interview-score';
import { interviewCriterias } from '@db/schema/interview-criteria';
import { exams } from '@db/schema/exam';
import { committees } from '@db/schema/committee';
import { eq } from 'drizzle-orm';

export class InterviewScoreService {

  async listInterviewScores(examId?: number) {
    const query = db
      .select({
        scoreId: interviewScores.id,
        examId: interviewScores.examId,
        committeeId: interviewScores.committeeId,
        criteriaId: interviewScores.criteriaId,
        criteriaName: interviewCriterias.name,
        weight: interviewCriterias.weight,
        score: interviewScores.score,
        createdAt: interviewScores.createdAt,
      })
      .from(interviewScores)
      .leftJoin(interviewCriterias, eq(interviewScores.criteriaId, interviewCriterias.id))
      .leftJoin(exams, eq(interviewScores.examId, exams.id))
      .leftJoin(committees, eq(interviewScores.committeeId, committees.id));

    if (examId) {
      query.where(eq(interviewScores.examId, examId));
    }

    return query;
  }
}
