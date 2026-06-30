import { Request, Response } from "express";
import { generateGoogleAuthUrl } from "@services/auth/google-oauth.service";

const googleLoginController = async (req: Request, res: Response) => {
    const url = generateGoogleAuthUrl();
    return res.redirect(url);
};

export default googleLoginController;
