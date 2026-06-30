import sesClient from "@utils/ses-client";
import { GetEmailTemplateCommand } from "@aws-sdk/client-sesv2";
import { isTemplateNameExist } from "@utils/is-template-name-exist";

export default async (templateName: string) => {
  const istemplateNameExist = await isTemplateNameExist(templateName);
  if (!istemplateNameExist) {
    return {
      success: false,
      msg: "Template with this name does not exist",
    };
  }
  const command = new GetEmailTemplateCommand({
    TemplateName: templateName,
  });

  const result = await sesClient.send(command);

  if (!result) {
    return {
      success: false,
      msg: "Email template not found. It may have been deleted.",
    };
  }

  return {
    success: true,
    data: result,
  };
};
