import { Request, Response } from 'express';
import { updateExamScoreService } from "@services/exam/update-exam-score.service";

export default async function patchExamScore(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const examId = req.params.examId;
    const { totalScore } = req.body;

    if (!examId || totalScore === undefined) {
      return res.status(400).json({
        success: false,
        message: 'examId and totalScore are required',
      });
    }

    const service = new updateExamScoreService();

    const result = await service.updateExamScore({
      userId: String(userId),
      examId: Number(examId),
      totalScore: Number(totalScore),
    });

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update exam score',
    });
  }
}
