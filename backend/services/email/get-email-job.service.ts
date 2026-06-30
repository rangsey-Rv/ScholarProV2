import { db } from "@db";
import { emailBatchJobs } from "@db/schema/email-batch-jobs";
import { eq } from "drizzle-orm";

export type EmailJobRow = {
  id: number;
  adminId: string;
  templateName: string;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  status: string;
  createdAt: Date;
  completedAt: Date | null;
};

export default async function getEmailJob(
  jobId: number
): Promise<EmailJobRow | null> {
  const [row] = await db
    .select()
    .from(emailBatchJobs)
    .where(eq(emailBatchJobs.id, jobId));
  return row ?? null;
}
