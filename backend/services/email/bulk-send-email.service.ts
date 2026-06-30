import prepareBulkEmail from "@utils/prepare-bulk-email";
import { admins } from "@db/schema/admin";
import { db } from "@db";
import { eq } from "drizzle-orm";
import { emailBatchJobs } from "@db/schema/email-batch-jobs";
import { emailSents } from "@db/schema/email-sent";
import { isTemplateNameExist } from "@utils/is-template-name-exist";

import { systemLogger } from "@utils/logger";

export default async (userId: string, templateName: string, filter: any) => {
  systemLogger.info(
    `[BulkEmail] Request to send template '${templateName}' by user '${userId}'`,
    { filter },
  );

  const templateExists = await isTemplateNameExist(templateName);
  if (!templateExists) {
    systemLogger.warn(`[BulkEmail] Template '${templateName}' does not exist.`);
    return { success: false, msg: "Template with this name does not exist" };
  }

  const [admin] = await db
    .select({ adminId: admins.id })
    .from(admins)
    .where(eq(admins.userId, userId));
  if (!admin) {
    systemLogger.warn(`[BulkEmail] User '${userId}' is not an admin.`);
    return { success: false, msg: "You are not the admin of this system" };
  }

  // Use a transaction for status update and log insertion
  try {
    const { bulkEntries, insertedLogs, emailBatchJob } = await db.transaction(
      async (tx) => {
        const bulkEntries = await prepareBulkEmail(templateName, filter, tx);
        
        if (!bulkEntries.length) {
          return { bulkEntries: [], insertedLogs: null };
        }
        const emailBatchJob = await tx
          .insert(emailBatchJobs)
          .values({
            adminId: admin.adminId,
            templateName,
            totalCount: bulkEntries.length,
            sentCount: 0,
            failedCount: 0,
            status: "queued",
          })
          .returning();

        const logData = bulkEntries.map((entry) => ({
          adminId: admin.adminId,
          toEmail: entry.Destination?.ToAddresses?.[0] || "",
          status: "pending" as const,
          templateName,
          emailData: JSON.parse(
            entry.ReplacementEmailContent?.ReplacementTemplate
              ?.ReplacementTemplateData || "{}",
          ),
          emailBatchJobId: emailBatchJob[0].id,
        }));

        const insertedLogs = await tx
          .insert(emailSents)
          .values(logData)
          .returning();

        return { bulkEntries, insertedLogs, emailBatchJob };
      },
    );

    if (!bulkEntries.length) {
      systemLogger.info(
        `[BulkEmail] No recipients found for template '${templateName}'.`,
      );
      return {
        success: false,
        msg: "There is no data to send for this email.",
      };
    }
    if (!insertedLogs || insertedLogs.length === 0) {
      systemLogger.error(
        `[BulkEmail] Failed to insert logs for template '${templateName}'.`,
      );
      return { success: false, msg: "Failed to insert email logs" };
    }

    systemLogger.info(
      `[BulkEmail] Successfully queued ${insertedLogs.length} emails for template '${templateName}'.`,
    );
    return {
      success: true,
      msg: `Successfully queued ${bulkEntries.length} emails. They will be sent shortly.`,
      jobId: emailBatchJob[0].id,
    };
  } catch (error: any) {
    systemLogger.error(`[BulkEmail] Error processing bulk email:`, {
      error: error.message,
    });
    throw error;
  }
};
