import deleteEmailTemplateService from "@services/email/delete-email-template.service";
import { Request, Response } from "express";

export default async(req: Request, res: Response)=>{
    const tempalteName = req.params.name as string;

    const result = await deleteEmailTemplateService(tempalteName);

    if (!result || !result.success) {
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