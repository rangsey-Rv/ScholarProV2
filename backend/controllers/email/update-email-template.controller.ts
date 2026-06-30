import { Request, Response } from "express";
import updateEmailTemplateService from "@services/email/update-email-template.service";
import { updateEmailTemplateSchema } from "@validation/email.schema";

export default async (req: Request, res: Response) => {
  
    const templateName = req.params.name as string;
    const { subject, html } = updateEmailTemplateSchema.parse(req.body);


  const result = await updateEmailTemplateService(templateName, subject, html);

  if (!result?.success || !result) {
    return res.status(404).json({
      success: false,
      message: result.msg,
    });
  }

  return res.status(200).json({
    success: true,
    message: result.msg,
  });
};
