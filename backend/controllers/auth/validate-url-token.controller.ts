import validateUrlTokenService from "@services/auth/validate-url-token.service";
import { Request, Response } from "express";
import { tokenUrl } from "@validation/user/auth.schema";
export default async (req: Request, res: Response) => {
  const token  = tokenUrl.parse(req.params.token);
  const id = tokenUrl.parse(req.params.id);
  
  const result = await validateUrlTokenService(id,token);

  if (!result?.success || !result) {
    return res.status(404).json({
      success: false,
      message: result.msg,
    });
  }

  return res.status(200).json({
    success: true,
    message: result.msg,
    email: result.email
  });
};
