# Email queue + SSE: implementation plan

Plan for trackable email batch jobs and Server-Sent Events so the frontend can show progress and know when the process-email-queue task is complete.

---

## 1. Data model

- **New table `email_batch_jobs`** (e.g. `db/schema/email-batch-jobs.ts`):
  - `id` (PK)
  - `adminId` (FK to admins), `templateName`, `totalCount`, `sentCount`, `failedCount`
  - `status`: enum `queued` | `processing` | `completed`
  - `createdAt`, `completedAt` (nullable)
- **`email_sents`**: add nullable `emailBatchJobId` (FK to `email_batch_jobs.id`).
- Migration: create table + column; no backfill needed.
- Register in schema index.

---

## 2. SSE module (in-memory)

- New module (e.g. `services/email/email-job-sse.ts` or `utils/email-job-sse.ts`):
  - Store: `Map<jobId, Set<Response>>` for active SSE responses.
  - `subscribe(jobId, res)`: add response; optional timeout and cleanup on close.
  - `unsubscribe(jobId, res)`: remove response; clean empty sets.
  - `broadcastToJob(jobId, data)`: for each response, write SSE format and remove dead connections. Called from the same process that runs the cron.

---

## 3. Bulk email service

- In the same transaction:
  1. Insert one row in `email_batch_jobs` with `totalCount`, `sentCount = 0`, `failedCount = 0`, `status = 'queued'`; get `jobId`.
  2. Insert into `email_sents` with `emailBatchJobId: jobId` on each row.
  3. Return `{ success: true, msg: '...', jobId, totalCount }`.
- Controller returns `jobId` and `totalCount` to the frontend.

---

## 4. Process email queue (cron)

- When updating an `email_sents` row to `sent` or `failed`:
  1. If `emailBatchJobId` is set, update `email_batch_jobs`: increment `sentCount` or `failedCount`; set `status = 'processing'` when first touched.
  2. If `sentCount + failedCount === totalCount`, set `status = 'completed'` and `completedAt = now()`.
  3. Call `broadcastToJob(jobId, payload)` with the job payload (see below) so all subscribers get the event.

---

## 5. SSE HTTP endpoint

- Use existing Express app (no separate server).
- New route: `GET /email-jobs/:jobId/events`:
  - Auth: same as bulk-send; optionally restrict to job’s `adminId`.
  - Headers: `Content-Type: text/event-stream`, `Cache-Control: no-store`, `Connection: keep-alive`.
  - Call `subscribe(jobId, res)`; on request/response close call `unsubscribe(jobId, res)`.
  - Optionally send one initial event with current job state from DB.
- Optional: `GET /email-jobs/:jobId` returns current job row for initial state or fallback.

---

## 6. When we send / what data we send (SSE)

### When we send

- **After each email processed** in `process-email-queue`: when you update the job’s `sentCount` or `failedCount`, call `broadcastToJob(jobId, payload)`. So the frontend gets an event every time one more email is sent or failed (progress updates).
- **When the job is completed**: when you set `status = 'completed'` and `completedAt`, call `broadcastToJob(jobId, payload)` with the final payload. The frontend can treat this as “task done” and close the stream or show a final state.

So: one event per progress update (and the last one is the completion event).

### SSE wire format

Each event is plain text:

```
data: <JSON string>\n\n
```

So you send a line starting with `data: `, then the JSON, then two newlines. Example:

```
data: {"jobId":1,"totalCount":100,"sentCount":50,"failedCount":0,"status":"processing"}\n\n
```

### Payload shape (what data we send)

Use a single shape for both progress and completion so the frontend can handle all events the same way.

| Field         | Type           | Description                                         |
| ------------- | -------------- | --------------------------------------------------- |
| `jobId`       | number         | Email batch job ID.                                 |
| `totalCount`  | number         | Total emails in the job.                            |
| `sentCount`   | number         | Emails successfully sent so far.                    |
| `failedCount` | number         | Emails failed so far.                               |
| `status`      | string         | `"queued"` \| `"processing"` \| `"completed"`.      |
| `completedAt` | string \| null | ISO date when job completed, or `null` if not done. |

**Example – progress (mid-job):**

```json
{
  "jobId": 42,
  "totalCount": 100,
  "sentCount": 50,
  "failedCount": 0,
  "status": "processing",
  "completedAt": null
}
```

**Example – completion:**

```json
{
  "jobId": 42,
  "totalCount": 100,
  "sentCount": 98,
  "failedCount": 2,
  "status": "completed",
  "completedAt": "2025-02-05T14:30:00.000Z"
}
```

Optional: you can add `createdAt` (ISO string) for the job if the frontend needs it. Keep the payload small and consistent.

### Summary

- **When:** On every job update in the cron (each email processed), and the final update is when the job is marked `completed`.
- **How:** Write to each subscribed response: `data: ${JSON.stringify(payload)}\n\n`.
- **What:** The object above (`jobId`, `totalCount`, `sentCount`, `failedCount`, `status`, `completedAt`). Same shape for progress and completion; frontend checks `status === "completed"` to know the task is done.

---

## 7. Wire-up order

1. Schema + migration for `email_batch_jobs` and `email_sents.emailBatchJobId`.
2. Implement SSE module (subscribe / unsubscribe / broadcastToJob).
3. Add `GET /email-jobs/:jobId/events` (and optional `GET /email-jobs/:jobId`).
4. Bulk-send: create job, link rows, return `jobId` and `totalCount`.
5. Process-queue: update job counts and status; call `broadcastToJob(jobId, payload)` after each job update.

---

## 8. Frontend (reference)

- After POST bulk-send, read `jobId` from the response.
- Open stream to `GET /email-jobs/:jobId/events` (auth via query param or cookie if EventSource doesn’t support headers).
- On each event: parse `event.data` as JSON, update progress (e.g. `sentCount`/`totalCount`), then when `status === "completed"` show “Done” and close the stream.
