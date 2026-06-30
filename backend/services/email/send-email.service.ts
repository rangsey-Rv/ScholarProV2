import { SendEmailCommand } from "@aws-sdk/client-sesv2";
import sesClient from "@utils/ses-client";

export async function sendEmail(
  to: string,
  templateName: string,
  variables: Record<string, string>
) {
  const params = {
    FromEmailAddress: process.env.AWS_SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Content: {
      Template: {
        TemplateName: templateName,
        TemplateData: JSON.stringify(variables),
      },
    },
    ConfigurationSetName: "email-tracking",
  };

  const result = await sesClient.send(new SendEmailCommand(params));

  if (!result?.MessageId) {
    throw new Error(`Email not sent: ${JSON.stringify(result)}`);
  }

  console.log("Email sent successfully, MessageId:", result.MessageId);
  return result;
}
