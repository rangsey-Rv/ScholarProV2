import previewEmailTemplateService from "@services/email/preview-email-template.service";
import { Request, Response } from "express";

export default async(req: Request, res: Response)=>{
    const templateName = req.params.name as string;

    const result = await previewEmailTemplateService(templateName);

    if (!result || !result.success) {
      return res.status(404).json({
        success: false,
        message: result.msg,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.data,
    });

}