import forgotPasswordService from "@services/auth/forgot-password.service";
import { Request, Response } from "express";
import { forgotPasswordSchema , tokenUrl} from "@validation/user/auth.schema";

export default async(req: Request, res: Response)=>{
    const id = tokenUrl.parse(req.params.id);
    const token = tokenUrl.parse(req.params.token);
    const {password} = forgotPasswordSchema.parse(req.body);

    const result = await forgotPasswordService(id, token, password);

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