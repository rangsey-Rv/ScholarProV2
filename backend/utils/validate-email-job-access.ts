import { Request, Response } from "express";
import { db } from "@db";
import { admins } from "@db/schema/admin";
import { eq } from "drizzle-orm";
import getEmailJob, { EmailJobRow } from "@services/email/get-email-job.service";

/**
 * Validates that the requesting user is an admin and owns the given email job.
 * Returns the job if successful, otherwise sends the appropriate error response and returns null.
 */
export async function validateEmailJobAccess(
  req: Request,
  res: Response,
  jobId: number
): Promise<EmailJobRow | null> {
  const userId = String(req.user?.id);
  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return null;
  }

  if (!Number.isInteger(jobId) || jobId <= 0) {
    res.status(400).json({ success: false, message: "Invalid job ID" });
    return null;
  }

  const [admin] = await db
    .select({ id: admins.id })
    .from(admins)
    .where(eq(admins.userId, userId));

  if (!admin) {
    res.status(403).json({ success: false, message: "Forbidden" });
    return null;
  }

  const job = await getEmailJob(jobId);
  if (!job) {
    res.status(404).json({ success: false, message: "Job not found" });
    return null;
  }

  if (job.adminId !== admin.id) {
    res.status(403).json({ success: false, message: "Forbidden" });
    return null;
  }

  return job;
}
