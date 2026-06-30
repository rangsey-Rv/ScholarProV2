import { Request, Response } from 'express';
import { InterviewScoreService } from '@services/interview/interview-score.service';

export default async (req: Request, res: Response) => {
  try {
    const { examId } = req.query;

    const scoreService = new InterviewScoreService();

    const data = await scoreService.listInterviewScores(
       examId ? Number(examId) : undefined
    );

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch interview scores',
    });
  }
};
