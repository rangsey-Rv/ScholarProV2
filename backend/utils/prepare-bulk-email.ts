import { db } from "@db";
import { applications } from "@db/schema/application";
import { emailTemplates } from "@db/schema/email-template";
import fetchGlobalVariable from "./fetch-global-variable";
import { eq, inArray } from "drizzle-orm";

export default async function prepareBulkEmail(
  templateName: string,
  filter: any,
  tx: any = db
) {
  const [template] = await tx
    .select()
    .from(emailTemplates)
    .where(eq(emailTemplates.name, templateName));

  const recipients = await fetchGlobalVariable({
    ...filter,
    limit: 10000, // limit to 10000 recipients
    offset: 0,
    fullEnrichment: true,
  });

  if (!recipients.length) return [];

  const applicationIds = recipients.map((r) => r.applicationId);
  if (applicationIds.length > 0) {
    switch (filter.status) {
      case "shortlisted":
        await tx
          .update(applications)
          .set({ status: "shortlisted_email_sent" })
          .where(inArray(applications.id, applicationIds));
        break;
      case "accepted":
        await tx
          .update(applications)
          .set({ status: "accepted_email_sent" })
          .where(inArray(applications.id, applicationIds));
        break;
    }
  }

  const bulkEntries = recipients
    .filter((r): r is typeof r & { email: string } => !!r.email)
    .map((r) => {
      const templateData: Record<string, any> = {};
      for (const v of template?.variable ?? []) {
        templateData[v] = r[v as keyof typeof r];
        
      }
      return {
        Destination: { ToAddresses: [r.email] },
        ReplacementEmailContent: {
          ReplacementTemplate: {
            ReplacementTemplateData: JSON.stringify(templateData),
          },
        },
      };
    });

  return bulkEntries;
}