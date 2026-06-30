import { Request, Response } from "express";
import resetPasswordService from "@services/auth/reset-password.service";
import { resetPasswordSchema } from "@validation/user/auth.schema";

export default async(req: Request, res: Response)=>{
    const userId = String(req.user?.id);
    const validatedData = resetPasswordSchema.parse(req.body);
    
    const result = await resetPasswordService(userId, validatedData.oldPassword, validatedData.newPassword);

    if (!result || !result.success) {
      return res.status(404).json({
        success: false,
        message: result.msg,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.msg
    });

}