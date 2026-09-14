import sesClient from "@utils/ses-client";
import { UpdateEmailTemplateCommand } from "@aws-sdk/client-sesv2";
import { htmlToText } from "html-to-text";
import { extractVariables } from "@utils/extract-variable-from-email-template";
import { emailTemplates } from "@db/schema/email-template";
import { db } from "@db";
import { eq } from "drizzle-orm";
import { isTemplateNameExist } from "@utils/is-template-name-exist";

export default async (templateName: string, subject: string, html: string) => {
  try {
    const istemplateNameExist = await isTemplateNameExist(templateName);
    if (!istemplateNameExist) {
      return {
        success: false,
        msg: "Template with this name does not exist in AWS SES",
      };
    }
    const text = htmlToText(html, {
      wordwrap: 130,
      selectors: [
        { selector: "a", format: "inline" },
        { selector: "p", format: "paragraph" },
      ],
    });

    const command = new UpdateEmailTemplateCommand({
      TemplateName: templateName,
      TemplateContent: {
        Subject: subject,
        Html: html,
        Text: text || "",
      },
    });

    await sesClient.send(command);
    const vars = extractVariables(html);
    const updateCount = await db
      .update(emailTemplates)
      .set({ variable: vars })
      .where(eq(emailTemplates.name, templateName))
      .returning();

    if (updateCount.length === 0) {
      await db
        .insert(emailTemplates)
        .values({ name: templateName, variable: vars })
        .onConflictDoUpdate({
          target: emailTemplates.name,
          set: { variable: vars },
        });
    }

    return {
      success: true,
      msg: "Update email template successfully",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      msg: `Failed to update template: ${message}`,
    };
  }
};
