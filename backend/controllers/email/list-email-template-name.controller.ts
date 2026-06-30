import { Request, Response } from "express";
import listEmailTemplateNameService from "@services/email/list-email-template-name.service";

export default async(req:Request,res: Response)=>{
    const result = await listEmailTemplateNameService();
    
     if (!result || !result.success) {
       return res.status(404).json({
         success: false,
         message: result.msg,
       });
     }

     return res.status(200).json({
       success: true,
       data: result.data,
     });

}