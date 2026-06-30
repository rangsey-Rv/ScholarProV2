import { Request, Response } from "express";
import { InterviewScoreService } from "@services/interview/grade-score.service";
import { appLogger, auditLogger } from "@utils/logger"; // your loggers

export default async function InputScore(req: Request, res: Response) {
  const userId = req.user?.id;
  const { examId, criteriaId, score } = req.body;

  // Validate input
  if (!examId || !userId || !criteriaId || score === undefined || 
      isNaN(Number(criteriaId)) || isNaN(Number(examId)) || isNaN(Number(score))) {
    appLogger.warn({
      message: "InputScore validation failed",
      userId: userId ?? "[UNKNOWN]",
      body: { examId, criteriaId, score }
    });
    return res.status(400).json({
      success: false,
      message: "examId, criteriaId, and score are required and must be numbers",
    });
  }

  const service = new InterviewScoreService();

  try {
    const result = await service.updateScoreByCriteria({
      examId: Number(examId),
      userId: String(userId),
      criteriaId: Number(criteriaId),
      score: Number(score),
    });

    if (!result?.success) {
      appLogger.warn({
        message: "InputScore update failed",
        userId: String(userId),
        examId,
        criteriaId,
        score: "[REDACTED]",
        reason: result.msg
      });

      return res.status(404).json({
        success: false,
        message: result.msg,
      });
    }

    // ✅ Log success without exposing the actual score
    auditLogger.info({
      message: "Interview score updated successfully",
      userId: String(userId),
      examId,
      criteriaId,
      score: "[REDACTED]" // do not log sensitive score
    });

    return res.status(200).json({
      success: true,
      message: result.msg,
    });

  } catch (err) {
    appLogger.error({
      message: "InputScoreController Error",
      error: err instanceof Error ? err.message : String(err),
      userId: String(userId),
      examId,
      criteriaId,
      score: "[REDACTED]"
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" && err instanceof Error ? err.message : undefined,
    });
  }
}
