import { CreateEmailTemplateCommand } from "@aws-sdk/client-sesv2";
import sesClient from "@utils/ses-client";
import { htmlToText } from "html-to-text";
import { extractVariables } from "@utils/extract-variable-from-email-template";
import { emailTemplates } from "@db/schema/email-template";
import deleteEmailTemplateService from "./delete-email-template.service";
import { db } from "@db";

const allowedVariables = [
  "applicantName",
  "gender",
  "email",
  "status",
  "scholarshipPercentage",
  "major",
  "tuitionFee",

  "mathExamDate",
  "mathStartTime",
  "mathEndTime",
  "mathRoom",

  "englishExamDate",
  "englishStartTime",
  "englishEndTime",
  "englishRoom",

  "interviewExamDate",
  "interviewStartTime",
  "interviewEndTime",
  "interviewRoom",
  "interviewSlotStart",
  "interviewSlotEnd",
];

export default async (templateName: string, subject: string, html: string) => {
  const text = htmlToText(html, {
    wordwrap: 130,
    selectors: [
      { selector: "a", format: "inline" },
      { selector: "p", format: "paragraph" },
    ],
  });

  const vars = extractVariables(html);

  const invalidVars = vars.filter((v) => !allowedVariables.includes(v));

  if (invalidVars.length > 0) {
    return {
      success: false,
      msg: `Invalid variables: ${invalidVars.join(", ")}`,
    };
  }

  const command = new CreateEmailTemplateCommand({
    TemplateName: templateName,
    TemplateContent: {
      Subject: subject,
      Html: html,
      Text: text || "",
    },
  });

  const result = await sesClient.send(command);

  if (!result) {
    return {
      success: false,
      msg: "SES create template error",
    };
  }
  try {
    const record = await db
      .insert(emailTemplates)
      .values({ name: templateName, variable: vars })
      .returning();

    if (!record || record.length === 0) {
      await deleteEmailTemplateService(templateName);
      return {
        success: false,
        msg: "SES create template error",
      };
    }
  } catch (err) {
    await deleteEmailTemplateService(templateName);

    return {
      success: false,
      msg:
        "Database error: " + (err instanceof Error ? err.message : String(err)),
    };
  }
  return {
    success: true,
    msg: "Create email template successfully",
  };
};
