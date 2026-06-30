export interface SubjectScoreInput {
  subjectId: number;
  totalScore: number;
  weight: number;
}

export class TotalApplicationScoreCalculatorService {
  static calculate(subjects: SubjectScoreInput[]): number {
    if (!subjects || subjects.length === 0) {
      return 0;
    }

    let weightedSum = 0;

    for (const subject of subjects) {
      const score = Number(subject.totalScore) || 0;
      const weight = Number(subject.weight) || 0;

      // Treat weight as a percentage, e.g., weight 25 -> 25% -> 0.25
      weightedSum += score * (weight / 100);
    }

    return Number(weightedSum.toFixed(2));
  }
}
