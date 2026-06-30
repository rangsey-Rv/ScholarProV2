import logoutService from '@services/auth/logout.service';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {

    const token = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
    
    const result = await logoutService(token);

    if (!result || !result.success) {
        return res.status(404).json({
            success: false,
            message: result.msg,
        })
    }

    res.clearCookie("refreshToken", { path: "/" });


    return res.status(200).json(
        {
            success: true,
            message: result.msg
        }
    )
}