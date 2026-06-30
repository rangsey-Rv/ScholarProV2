import { Request, Response } from "express";
import getExamSessionDetailService from "@services/exam-session/get-exam-session-detail.service";

export default async (req: Request, res: Response) => {
  const examSessionId = Number(req.params.id);
  const userRole = req.user?.role ?? "";
  const userId = String(req.user?.id);

  if (!userId || typeof userId !== "string") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - User ID not found or invalid",
    });
  }

  const result = await getExamSessionDetailService(
    userId,
    userRole,
    examSessionId
  );

  if (!result || !result.success) {
    return res.status(404).json({
      success: false,
      message: result.msg,
    });
  }

  return res.status(200).json({
    success: true,
    message: result.msg,
    data: result.data,
  });
};
