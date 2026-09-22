import { db } from "@db";
import { applications } from "@db/schema/application";
import { attachments } from "@db/schema/attachment";
import { batches } from "@db/schema/batch";
import { desc, eq } from "drizzle-orm";

export async function ensureStudentApplication(
  studentId: number,
  txOrDb: any = db
) {
  const existing = await txOrDb
    .select({ id: applications.id })
    .from(applications)
    .where(eq(applications.studentId, studentId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  // Find active batch or latest batch
  const [activeBatch] = await txOrDb
    .select({ id: batches.id })
    .from(batches)
    .where(eq(batches.status, "active"))
    .orderBy(desc(batches.id))
    .limit(1);

  const targetBatch =
    activeBatch ||
    (
      await txOrDb
        .select({ id: batches.id })
        .from(batches)
        .orderBy(desc(batches.id))
        .limit(1)
    )[0];

  if (!targetBatch) {
    return null;
  }

  // Create a placeholder attachment
  const [attachment] = await txOrDb
    .insert(attachments)
    .values({
      type: "personalInfo",
      fileUrl: "placeholder",
    })
    .returning({ id: attachments.id });

  const [createdApp] = await txOrDb
    .insert(applications)
    .values({
      studentId,
      batchId: targetBatch.id,
      status: "incomplete",
      paymentStatus: "pending",
      isApplyForScholarShip: false,
      attachmentId: attachment.id,
    })
    .returning();

  return createdApp;
}
