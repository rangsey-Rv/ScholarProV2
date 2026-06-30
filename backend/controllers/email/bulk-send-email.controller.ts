import { Request, Response } from "express";
import bulkSendEmailService from "@services/email/bulk-send-email.service";

export default async (req: Request, res: Response) => {
  const userId = String(req.user?.id);
  if (!userId || typeof userId !== "string") {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const templateName = req.params.name as string;

  const { batchId, status, scholarshipPercentage, major } = req.query;

  const filter = { batchId, status, scholarshipPercentage, major };

  const result = await bulkSendEmailService(userId, templateName, filter);

  if (!result?.success || !result) {
    return res.status(404).json({
      success: false,
      message: result.msg,
    });
  }

  return res.status(200).json({
    success: true,
    message: result.msg,
    jobId: result.jobId,
  });
};
