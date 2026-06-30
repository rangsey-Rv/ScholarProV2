import { Request, Response } from "express";
import createEmailTemplateService from "@services/email/create-email-template.service"
import { createEmailTemplateSchema } from "@validation/email.schema";

export default async(req: Request, res: Response)=>{
    const {templateName, subject, html} = createEmailTemplateSchema.parse(req.body);
    
    const result  = await createEmailTemplateService(templateName, subject, html);

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
}
