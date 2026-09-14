# ScholarPro Email Service Handoff

## Purpose

This document explains the ScholarPro email service, the local AWS SES test that was completed, and the remaining work required before deployment.

## Current result

A real test email was sent successfully to:

- Recipient: `rv6024010101@camtech.edu.kh`
- Sender: `virakrangsey@gmail.com`
- AWS region: `ap-southeast-2` (Asia Pacific, Sydney)

Both email addresses were verified in Amazon SES. This confirms that the application can queue and send an email through AWS SES in the current environment.

The recipient address was temporarily assigned to a mock student record for testing. That change is test data only and must not be treated as a production configuration.

## How the email service works

1. An administrator creates or selects an email template in ScholarPro.
2. The recipient page reads the recipient email from `students.email`.
3. Clicking **Send Email** creates a queued batch in `email_batch_jobs`.
4. Individual pending messages are stored in `email_sents`.
5. The background worker processes up to 50 pending emails each run.
6. The worker runs once per minute from `cron-jobs/scheduler.ts`.
7. Each message changes state as follows:

```text
pending -> processing -> sent
pending -> processing -> failed
```

8. The send result can be checked in `email_sents` and the batch result in `email_batch_jobs`.

The HTTP response from the send button means the message was queued. It does not by itself prove delivery.

## AWS SES configuration used for testing

The application uses these settings:

```env
AWS_REGION=ap-southeast-2
AWS_SES_FROM_EMAIL=virakrangsey@gmail.com
```

The worker also uses this SES configuration set:

```text
email-tracking
```

The following SES identities were verified in `ap-southeast-2`:

- `virakrangsey@gmail.com`
- `rv6024010101@camtech.edu.kh`
- `scholarpro.site` domain

Do not put AWS access keys in this document, source code, chat messages, or committed files.

## Creating email templates

Templates are created from:

```text
Settings -> Email Management
```

When a template is created through ScholarPro:

- ScholarPro validates the variables.
- The template is created in AWS SES.
- Template metadata and variable names are stored in PostgreSQL.
- The template can then be selected from the Send Email page.

The AWS SES template and ScholarPro template name must match exactly. Templates are region-specific, so they must exist in the same AWS region used by the backend.

Allowed variables include:

```text
applicantName
 gender
email
status
scholarshipPercentage
major
tuitionFee
mathExamDate
mathStartTime
mathEndTime
mathRoom
englishExamDate
englishStartTime
englishEndTime
englishRoom
interviewExamDate
interviewStartTime
interviewEndTime
interviewRoom
interviewSlotStart
interviewSlotEnd
```

Suggested templates are documented in the project handoff conversation. Use names such as:

```text
application_received
assessment_schedule
interview_schedule
scholarship_accepted
scholarship_rejected
```

## Verifying a send

After sending an email, find the latest record for the recipient:

```sql
SELECT
  id,
  email_batch_job_id,
  to_email,
  template_name,
  status,
  created_at,
  updated_at
FROM email_sents
WHERE to_email = 'TEST_OR_STUDENT_EMAIL'
ORDER BY id DESC
LIMIT 1;
```

Interpret the status as follows:

- `pending`: queued and waiting for the worker
- `processing`: currently being processed
- `sent`: AWS SES accepted the message
- `failed`: AWS SES rejected the message or the request failed

Check the batch with:

```sql
SELECT
  id,
  template_name,
  total_count,
  sent_count,
  failed_count,
  status,
  created_at,
  completed_at
FROM email_batch_jobs
ORDER BY id DESC
LIMIT 1;
```

A `sent` result means SES accepted the message. It is still necessary to check the recipient inbox, Spam, and Promotions folders for final delivery.

## Important application-status behavior

When sending with status `accepted`, the service changes the application status to:

```text
accepted -> accepted_email_sent
```

This prevents the same accepted application from appearing as a new unsent recipient. To find already-processed applications, use the `accepted_email_sent` status filter.

Do not repeatedly reset application status in production just to resend. If a resend workflow is required, implement a dedicated resend action or email history workflow.

## Local testing procedure

1. Verify the sender identity in SES.
2. In SES Sandbox, verify the recipient identity too.
3. Confirm the `email-tracking` configuration set exists.
4. Confirm the selected template exists in the same SES region.
5. Ensure the test student has the test recipient email in `students.email`.
6. Select the correct batch and application status in ScholarPro.
7. Select the template and click **Send Email**.
8. Check `email_sents.status`.
9. Check the recipient inbox and Spam folder.
10. Restore any temporary mock email before using a production database.

## Deployment checklist

The deployer must complete these tasks:

- Use a production PostgreSQL database.
- Set production environment variables securely.
- Use a secure secret manager or deployment secret store for AWS credentials.
- Rotate any AWS credentials that were exposed in local files or chat.
- Keep `AWS_REGION` consistent with the SES identities and templates.
- Verify the production sender identity or sending domain.
- Prefer a verified domain sender such as `admissions@scholarpro.site` instead of a personal Gmail sender.
- Create the `email-tracking` configuration set in the production SES region.
- Create or verify all production SES templates in that same region.
- Confirm the IAM role or user has permission to send email and use SES templates.
- Request SES production access before sending to unverified student addresses.
- Confirm the background scheduler is running with the backend process.
- Confirm the database migrations/schema include `email_templates`, `email_batch_jobs`, and `email_sents`.
- Perform one controlled production test with an approved test address.
- Check the database status and the recipient inbox.

## Do students need AWS identity verification?

No, students do not create AWS identities.

In SES Sandbox, every recipient address must be verified, so local testing requires verifying test recipients. After AWS approves production access, students only provide a valid email address during registration. ScholarPro reads that value from `students.email` and sends to it.

The production sender/domain must remain verified. Student identities are not required after leaving Sandbox, subject to AWS sending limits and account reputation.

## Is the pgAdmin update required after deployment?

No. The manual update used for testing was only a data change that replaced a mock email with a real test address. It is not part of the email service deployment.

In production:

- Student registration saves the student's email in `students.email`.
- The send service uses that stored value automatically.
- No pgAdmin update is required for each student.
- Do not hard-code `rv6024010101@camtech.edu.kh` in application code.

## Security warning

The local environment file currently contains credentials and tokens. Treat them as compromised if they are real:

1. Rotate the AWS access key and secret immediately.
2. Rotate any exposed Google, Telegram, JWT, database, or Sentry secrets as appropriate.
3. Remove secrets from Git history if they were committed.
4. Add `.env*` files to the appropriate ignore rules.
5. Provide replacement values to the deployer through a secure secret manager.

## Main code locations

- `services/email/create-email-template.service.ts`: creates an SES template and stores metadata.
- `services/email/bulk-send-email.service.ts`: queues a bulk email job.
- `utils/prepare-bulk-email.ts`: builds recipient messages and updates email-sent application statuses.
- `cron-jobs/process-email-queue.ts`: sends pending messages through SES.
- `cron-jobs/scheduler.ts`: runs the email worker once per minute.
- `db/schema/email-template.ts`: stores template metadata.
- `db/schema/email-batch-jobs.ts`: stores batch progress.
- `db/schema/email-sent.ts`: stores individual email results.
- `utils/ses-client.ts`: configures the AWS SES client and region.
