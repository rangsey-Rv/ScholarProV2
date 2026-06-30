import sendForgotPasswordLinkService from "@services/auth/send-forgot-password-link.service";
import { Request, Response } from "express";
import { emailValidate } from "@validation/user/auth.schema";
export default async (req: Request, res: Response) => {
    
    const email = emailValidate.parse(req.body.email);

    const result = await sendForgotPasswordLinkService(email);

    
    if (!result?.success || !result) {
      return res.status(404).json({
        success: false,
        message: result.msg,
      });
    }
    res.status(200).json({
        success: true,
        message: result.msg,
        data: result.data
    });
};
