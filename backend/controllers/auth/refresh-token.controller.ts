import { Request, Response } from "express";
import refreshTokens from "@utils/refresh-token";

export default async (req: Request, res: Response) => {
    const oldToken = req.cookies?.refreshToken;

    if (!oldToken) {
        return res.status(401).json({ success: false, message: "No refresh token provided" });
    }
    
    const newToken = await refreshTokens(oldToken);

    if (!newToken || 'msg' in newToken) {
        return res.status(403).json({
            success: false,
            message: newToken?.msg || "Unable to refresh token"
        });
    }
    res.cookie('refreshToken', newToken.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        success: true,
        message: "Refresh token successfully",
        token: newToken.accessToken,
        refreshToken: newToken.refreshToken
    });
};