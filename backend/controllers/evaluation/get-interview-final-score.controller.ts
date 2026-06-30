import { Request, Response } from 'express';
import { InterviewScoreCalculatorService } from '@services/interview/interview-score-calculator.service';

export default async (req: Request, res: Response) => {
  try {
    const { examId, userId } = req.params;

    if (!examId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'examId and committeeId are required',
      });
    }

    const scoreController = new InterviewScoreCalculatorService();

    const result = await scoreController.calculateFinalScore(
      Number(examId),
      String(userId)
    );

    return res.status(200).json({
      success: true,
      data: {
        examId: Number(examId),
        committeeId: Number(userId),
        finalScore: result,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate interview score',
    });
  }
};
