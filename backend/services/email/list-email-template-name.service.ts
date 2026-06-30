import { ListEmailTemplatesCommand } from "@aws-sdk/client-sesv2";
import sesClient from "@utils/ses-client";

export default async () => {
  const command = new ListEmailTemplatesCommand({
    PageSize: 50,
  });

  const result = await sesClient.send(command);

  if (!result) {
    return {
      success: false,
      msg: "Cannot retrieve email templates at the moment. Please try again later.",
    };
  }

  return {
    success: true,
    data: result.TemplatesMetadata,
  };
};
