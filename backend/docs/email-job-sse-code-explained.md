# Email job SSE – code explained in detail

This document walks through every file we added for the email job + SSE feature, one by one, so you can understand exactly what each part does.

---

## File 1: `utils/email-job-sse.ts` – the “radio station” for job updates

**What this file does in one sentence:** It keeps a list of which browser connections are listening to which job, and when the server has an update for a job, it sends that update to every connection listening to that job.

---

### Line 1: `import { Response } from "express";`

- We need the type of an Express HTTP response. We don’t create the response ourselves; the controller gives it to us. We use it so we can store the response and later call `res.write()` to send data to the browser.

---

### Line 3: `const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000;`

- A number: 5 minutes in milliseconds.
- We use it so that if a connection stays open for 5 minutes with no activity, we stop tracking it. That way we don’t keep thousands of old connections in memory forever.

---

### Line 5: `const jobSubscribers = new Map<number, Set<Response>>();`

- This is the only place we store “who is listening to which job.”
- **Map:** key = job ID (number), value = a Set of Responses.
- **Set of Response:** each Response is one open HTTP connection (one browser tab). So for job 42 we might have a Set with 2 Responses = 2 tabs listening to job 42.
- We never write this to the database; it’s only in the server’s memory. When the server restarts, this map is empty again (and clients would need to reconnect).

---

### Lines 7–11: `export function subscribe(jobId, res, options?)`

- **Purpose:** “This HTTP response (this browser tab) wants to listen to updates for this job.” We add that response to our map so we can push events to it later.
- **Parameters:**
  - `jobId`: which job this connection cares about.
  - `res`: the Express Response object for this request. We will call `res.write()` on it later.
  - `options`: optional. If you pass `{ timeoutMs: 60000 }`, we use 60 seconds instead of the default 5 minutes.

---

### Lines 12–17 inside `subscribe`

```ts
let set = jobSubscribers.get(jobId);
if (!set) {
  set = new Set();
  jobSubscribers.set(jobId, set);
}
set.add(res);
```

- Get the Set of connections for this `jobId`. If there isn’t one yet, create a new Set and put it in the map. Then add this `res` to that Set.
- After this, `res` is “subscribed” to `jobId`: any call to `broadcastToJob(jobId, data)` will send `data` to this response.

---

### Lines 19–22 inside `subscribe`

```ts
const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
const timer = setTimeout(() => {
  unsubscribe(jobId, res);
}, timeoutMs);
```

- Start a timer. When it fires (after 5 minutes by default), we call `unsubscribe(jobId, res)` so we stop tracking this connection and free memory.

---

### Lines 24–27 inside `subscribe`

```ts
res.on("close", () => {
  clearTimeout(timer);
  unsubscribe(jobId, res);
});
```

- When the client closes the connection (user closes tab, navigates away, or network drops), the response emits a `"close"` event. We listen for that, cancel the timeout, and call `unsubscribe` so we remove this response from the map. So we clean up as soon as the connection is gone.

---

### Lines 29–37: `export function unsubscribe(jobId, res)`

- **Purpose:** “This connection is no longer listening.” Remove this `res` from the Set for this `jobId`.
- Get the Set for `jobId`. If it exists, remove `res` from it. If the Set is now empty, delete the map entry so we don’t keep an empty Set in memory.

---

### Lines 39–46: `export type EmailJobEventPayload`

- This is only a TypeScript type: it describes the shape of the object we send in every SSE event.
- **jobId:** which job this event is about.
- **totalCount:** total number of emails in the job.
- **sentCount:** how many were sent so far.
- **failedCount:** how many failed so far.
- **status:** `"queued"`, `"processing"`, or `"completed"`.
- **completedAt:** ISO date string when the job finished, or `null` if not finished yet.
- The cron and the stream controller both use this same shape so the frontend can handle every event the same way.

---

### Lines 48–52: `export function broadcastToJob(jobId, data)`

- **Purpose:** “Something changed for this job; send this data to every connection that is listening to this job.” The **cron** (process-email-queue) will call this after it updates the job in the database.
- Get the Set of responses for this `jobId`. If there are none, we do nothing and return.

---

### Line 55: `const payload = \`data: ${JSON.stringify(data)}\n\n\`;`

- SSE format is simple: each event is a line that starts with `data: `, then the JSON, then two newlines. So we build a string like:
  - `data: {"jobId":42,"totalCount":100,"sentCount":50,...}\n\n`
- The browser’s `EventSource` API reads this and gives the frontend the parsed JSON.

---

### Line 56: `const dead: Response[] = [];`

- We’ll collect any responses that we can’t write to (already closed or error). We’ll unsubscribe them after the loop so we don’t try to write to them again.

---

### Lines 57–68 inside `broadcastToJob`

```ts
set.forEach((res) => {
  try {
    if (!res.writableEnded) {
      res.write(payload);
    } else {
      dead.push(res);
    }
  } catch {
    dead.push(res);
  }
});
```

- For each connection in the Set:
  - If the response is not ended (`!res.writableEnded`), we call `res.write(payload)` to send this one event to that browser.
  - If the response is already ended, or if `res.write` throws (e.g. connection already closed), we add that `res` to `dead`.
- Then we call `unsubscribe(jobId, res)` for every `res` in `dead` so we remove broken connections from our map.

---

## File 2: `services/email/get-email-job.service.ts` – load one job from the database

**What this file does in one sentence:** Given a job ID, it fetches that one row from the `email_batch_jobs` table and returns it (or null if not found).

---

### Lines 1–3: imports

- `db`: our database client (Drizzle).
- `emailBatchJobs`: the table we query.
- `eq`: helper to build “column equals value” in the query.

---

### Lines 5–15: `export type EmailJobRow`

- TypeScript type that matches one row of `email_batch_jobs`: id, adminId, templateName, totalCount, sentCount, failedCount, status, createdAt, completedAt. We use it so the rest of the code knows the shape of the object returned from the DB.

---

### Lines 17–24: `getEmailJob(jobId)`

- Run: “SELECT \* FROM email_batch_jobs WHERE id = jobId”.
- `const [row] = await db.select()...` takes the first row. If there are no rows, `row` is undefined, and we return `row ?? null` so the function returns `null` when the job doesn’t exist.
- So: one place in the app that “get job by ID” lives; both the SSE controller and the “get job” controller use this.

---

## File 3: `controllers/email/stream-email-job-events.controller.ts` – open the SSE stream

**What this file does in one sentence:** When the frontend calls `GET /email/email-jobs/:jobId/events`, we check the user is allowed to see this job, then we keep the HTTP connection open and send job updates over it (first one immediately, then more when the cron calls `broadcastToJob`).

---

### Lines 12–27: `function jobToPayload(row)`

- **Purpose:** Turn a database row (which has `completedAt` as a `Date` or `null`) into the object we send in SSE events (where `completedAt` is an ISO string or `null`). So the payload is always the same shape and safe to send as JSON.
- It just copies id → jobId, and the counts and status, and converts `row.completedAt` to `row.completedAt.toISOString()` or `null`.

---

### Lines 33–37: get user and reject if not logged in

```ts
const userId = String(req.user?.id);
if (!userId) {
  res.status(401).json({ success: false, message: "Unauthorized" });
  return;
}
```

- We need to know who is asking. The auth middleware puts the user on `req.user`. If there’s no user, we respond 401 and stop.

---

### Lines 39–43: get jobId from the URL and validate it

```ts
const jobId = Number(req.params.jobId);
if (!Number.isInteger(jobId) || jobId <= 0) {
  res.status(400).json({ success: false, message: "Invalid job ID" });
  return;
}
```

- The URL is like `/email/email-jobs/42/events`, so `req.params.jobId` is `"42"`. We convert to a number. If it’s not a positive integer, we respond 400 and stop.

---

### Lines 45–52: check the user is an admin

```ts
const [admin] = await db
  .select({ id: admins.id })
  .from(admins)
  .where(eq(admins.userId, userId));
if (!admin) {
  res.status(403).json({ success: false, message: "Forbidden" });
  return;
}
```

- We look up the admin row for this user. Only admins can use bulk send and see job progress. If this user is not an admin, we respond 403 and stop.

---

### Lines 54–62: load the job and check ownership

```ts
const job = await getEmailJob(jobId);
if (!job) {
  res.status(404).json({ success: false, message: "Job not found" });
  return;
}
if (job.adminId !== admin.id) {
  res.status(403).json({ success: false, message: "Forbidden" });
  return;
}
```

- We load the job from the DB. If it doesn’t exist, 404. If it exists but was created by a different admin (`job.adminId !== admin.id`), we don’t let this user see it: 403. So each admin only sees their own jobs.

---

### Lines 64–68: set SSE headers and flush

```ts
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-store");
res.setHeader("Connection", "keep-alive");
res.setHeader("X-Accel-Buffering", "no");
res.flushHeaders();
```

- **Content-Type: text/event-stream:** Tells the browser this response is an SSE stream, so it will keep the connection open and parse `data: ...` lines.
- **Cache-Control: no-store:** Don’t cache this response.
- **Connection: keep-alive:** Keep the connection open.
- **X-Accel-Buffering: no:** If you use nginx in front, this tells it not to buffer the response; events get to the client as we write them.
- **flushHeaders():** Send the headers to the client right away so the connection is “established” and the client knows the request succeeded.

---

### Lines 70–73: subscribe and send first event

```ts
subscribe(jobId, res);

const initialPayload = jobToPayload(job);
res.write(`data: ${JSON.stringify(initialPayload)}\n\n`);
```

- `subscribe(jobId, res)` adds this response to the SSE module’s map so future `broadcastToJob(jobId, ...)` calls will send to this connection.
- We immediately send one event with the current job state (from the DB). So the frontend gets the current progress as soon as it connects, then will get more events when the cron runs and calls `broadcastToJob`.

---

### Lines 75–77: cleanup when the client disconnects

```ts
req.on("close", () => {
  unsubscribe(jobId, res);
});
```

- When the client closes the connection, we remove this response from the map so we don’t try to write to it again and we free memory.

---

## File 4: `controllers/email/get-email-job.controller.ts` – return job as JSON (one request, one response)

**What this file does in one sentence:** When the frontend calls `GET /email/email-jobs/:jobId`, we check the user is allowed, then return the current job data as normal JSON and close the response. No stream; just one request/response.

---

### Why we have this

- Sometimes the frontend doesn’t want to open an SSE connection. It might just want to poll: “give me the current state of job 42.” This endpoint does that.
- The first part (user check, jobId check, admin check, load job, ownership check) is the same as the stream controller. We do the same validations so only the right admin can see the job.

---

### Lines 11–21: same as stream controller

- Get `userId` from `req.user`; 401 if missing.
- Parse `jobId` from `req.params.jobId`; 400 if invalid.
- Load admin by `userId`; 403 if not admin.

---

### Lines 23–39: same as stream controller

- Load job with `getEmailJob(jobId)`; 404 if not found.
- If `job.adminId !== admin.id`, 403.

---

### Lines 41–49: send JSON and end

```ts
res.status(200).json({
  jobId: job.id,
  totalCount: job.totalCount,
  sentCount: job.sentCount,
  failedCount: job.failedCount,
  status: job.status,
  createdAt: job.createdAt,
  completedAt: job.completedAt,
});
```

- We send one JSON object with the job’s current state and then the response ends. No `subscribe`, no `res.write` later. So this is a normal REST endpoint: one request, one response.

---

## File 5: `controllers/email/index.ts` – export the new controllers

**What this file does:** It imports the two new controller functions and adds them to the `emailController` object so the router can call them by name.

- **Lines 8–9:** Import `getEmailJobController` and `streamEmailJobEventsController`.
- **Lines 18–19:** Add them to the object as `getEmailJobController` and `streamEmailJobEventsController`.
- So in the router we can do `emailController.streamEmailJobEventsController` and `emailController.getEmailJobController`.

---

## File 6: `routes/email.routes.ts` – register the two new URLs

**What this file does:** It tells Express: “When someone does GET /email-jobs/:jobId/events, run the stream controller; when someone does GET /email-jobs/:jobId, run the get-job controller.” Both require login and admin role.

---

### Why the order of routes matters

- We have another route: `GET /:name` (preview template by name). Express matches routes in the order they are defined. So if we defined `GET /:name` first, a request to `GET /email-jobs/42/events` would match `/:name` with `name = "email-jobs"`, and we’d run the wrong handler.
- So we define the **more specific** routes first:
  - `GET /email-jobs/:jobId/events`
  - `GET /email-jobs/:jobId`
- Then we define `GET /template-name`, `GET /:name`, etc. That way “email-jobs” is not treated as a template name.

---

### Lines 9–14: SSE stream route

```ts
router.get(
  "/email-jobs/:jobId/events",
  authenticateUser,
  authorizeRole("admin"),
  asyncHandler(emailController.streamEmailJobEventsController)
);
```

- Path: `/email-jobs/:jobId/events`. So the full URL is whatever the app mounts this router under (e.g. `/email`) + this path → e.g. `GET /email/email-jobs/42/events`.
- **authenticateUser:** Must be logged in; otherwise 401.
- **authorizeRole("admin"):** Must be admin; otherwise 403.
- **asyncHandler:** Wraps the controller so any thrown error or rejected promise is passed to Express’s error handler instead of crashing.
- Handler: `streamEmailJobEventsController` – the one that opens the SSE stream and subscribes the response.

---

### Lines 15–20: get job JSON route

```ts
router.get(
  "/email-jobs/:jobId",
  authenticateUser,
  authorizeRole("admin"),
  asyncHandler(emailController.getEmailJobController)
);
```

- Path: `/email-jobs/:jobId` → e.g. `GET /email/email-jobs/42`.
- Same auth and asyncHandler. Handler: `getEmailJobController` – the one that returns the job as JSON once and closes.

---

## How it all fits together

1. **Bulk send** creates a row in `email_batch_jobs` and returns `jobId` to the frontend.
2. **Frontend** opens `GET /email/email-jobs/:jobId/events`. The **stream controller** runs: it checks auth and ownership, sets SSE headers, calls **subscribe(jobId, res)**, and sends one initial event. The connection stays open.
3. **Cron** (process-email-queue) runs. It updates `email_batch_jobs` (e.g. sentCount, failedCount, status). After each update it should call **broadcastToJob(jobId, payload)** with the current job data.
4. **broadcastToJob** in `email-job-sse.ts` finds every `res` in the map for that `jobId` and does `res.write(payload)`. So every tab that opened the stream gets the new event.
5. When the user closes the tab, **req** emits `"close"`, and we call **unsubscribe(jobId, res)** so we stop tracking that connection.

That’s the full flow, with each file and each important part explained in detail.
