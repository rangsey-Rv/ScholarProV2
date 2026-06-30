import { Request, Response } from "express";
import { validateEmailJobAccess } from "@utils/validate-email-job-access";

export default async function getEmailJobController(
  req: Request,
  res: Response
): Promise<void> {
  const jobId = Number(req.params.jobId);
  const job = await validateEmailJobAccess(req, res, jobId);
  if (!job) return;

  res.status(200).json({
    jobId: job.id,
    totalCount: job.totalCount,
    sentCount: job.sentCount,
    failedCount: job.failedCount,
    status: job.status,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
  });
}
