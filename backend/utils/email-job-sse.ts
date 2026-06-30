import { Response } from "express";

const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

const jobSubscribers = new Map<number, Set<Response>>();

export function subscribe(
  jobId: number,
  res: Response,
  options?: { timeoutMs?: number },
): void {
  let set = jobSubscribers.get(jobId);
  if (!set) {
    set = new Set();
    jobSubscribers.set(jobId, set);
  }
  set.add(res);

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => {
    unsubscribe(jobId, res);
  }, timeoutMs);

  res.on("close", () => {
    clearTimeout(timer);
    unsubscribe(jobId, res);
  });
}


export function unsubscribe(jobId: number, res: Response): void {
  const set = jobSubscribers.get(jobId);
  if (set) {
    set.delete(res);
    if (set.size === 0) {
      jobSubscribers.delete(jobId);
    }
  }
}

export type EmailJobEventPayload = {
  jobId: number;
  totalCount: number;
  sentCount: number;
  failedCount: number;
  status: string;
  completedAt: string | null;
};

export function broadcastToJob(
  jobId: number,
  data: EmailJobEventPayload,
): void {
  const set = jobSubscribers.get(jobId);
  if (!set) return;

  const payload = `data: ${JSON.stringify(data)}\n\n`;
  const dead: Response[] = [];

  set.forEach((res) => {
    try {
      if (res.writableEnded) {
        dead.push(res);
      } else {
        res.write(payload);
      }
    } catch {
      dead.push(res);
    }
  });

  dead.forEach((res) => unsubscribe(jobId, res));
}
