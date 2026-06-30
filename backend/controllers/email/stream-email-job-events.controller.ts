import { Request, Response } from "express";
import {
  subscribe,
  unsubscribe,
  type EmailJobEventPayload,
} from "@utils/email-job-sse";
import { validateEmailJobAccess } from "@utils/validate-email-job-access";

function jobToPayload(row: {
  id: number;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  status: string;
  completedAt: Date | null;
}): EmailJobEventPayload {
  return {
    jobId: row.id,
    totalCount: row.totalCount,
    sentCount: row.sentCount,
    failedCount: row.failedCount,
    status: row.status,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
  };
}

export default async function streamEmailJobEventsController(
  req: Request,
  res: Response
): Promise<void> {
  const jobId = Number(req.params.jobId);
  const job = await validateEmailJobAccess(req, res, jobId);
  if (!job) return;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  subscribe(jobId, res);

  const initialPayload = jobToPayload(job);
  res.write(`data: ${JSON.stringify(initialPayload)}\n\n`);

  req.on("close", () => {
    unsubscribe(jobId, res);
  });
}
