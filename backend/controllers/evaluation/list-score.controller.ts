import { Request, Response } from "express";
import { InterviewScoreService } from "@services/interview/get-all-score-for-application.service";

const service = new InterviewScoreService();

export const getAllApplicationScores = async (req: Request, res: Response) => {
  try {
    const data = await service.listAllByApplications();

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch scores",
    });
  }
};

export const getApplicationScore = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid application id" });
    }

    const data = await service.listByApplication(id);

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch application score",
    });
  }
};
