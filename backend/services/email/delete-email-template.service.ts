import sesClient from "@utils/ses-client";
import { DeleteEmailTemplateCommand } from "@aws-sdk/client-sesv2";
import { emailTemplates } from "@db/schema/email-template";
import { db } from "@db";
import { eq } from "drizzle-orm";
import previewEmailTemplateService from "@services/email/preview-email-template.service";
import createEmailTemplateService from "./create-email-template.service";
import { isTemplateNameExist } from "@utils/is-template-name-exist";

export default async (templateName: string) => {
  const istemplateNameExist = await isTemplateNameExist(templateName);
  if (!istemplateNameExist) {
    return {
      success: false,
      msg: "Template with this name does not exist",
    };
  }

  const command = new DeleteEmailTemplateCommand({
    TemplateName: templateName,
  });
  const originalTemplate = await previewEmailTemplateService(templateName);

  const originalHtml = originalTemplate.data?.TemplateContent?.Html;
  const originalSubject = originalTemplate.data?.TemplateContent?.Subject;
  if (!originalSubject || !originalHtml) {
    return {
      success: false,
      msg: "Original template content not found, cannot proceed.",
    };
  }

  const result = await sesClient.send(command);

  if (!result) {
    return {
      success: false,
      msg: "Email template not found. It may have been deleted.",
    };
  }

  const deleteCount = await db
    .delete(emailTemplates)
    .where(eq(emailTemplates.name, templateName));

  if (!deleteCount) {
    await createEmailTemplateService(
      templateName,
      originalSubject,
      originalHtml
    );
    return {
      success: false,
      msg: "Template deleted from SES but not found in DB.",
    };
  }

  return {
    success: true,
    msg: "Delete email tempate successfully",
  };
};
