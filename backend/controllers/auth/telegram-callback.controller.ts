import { Request, Response } from "express";
import {
  verifyTelegramData,
  findOrCreateTelegramUser,
  TelegramUserData,
} from "@services/auth/telegram-oauth.service";
import getProfileService from "@services/user/get-profile.service";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@utils/generate-token";
import { UnauthorizedError } from "@utils/errors";
import { auditLogger, securityLogger } from "@utils/logger";

const telegramCallbackController = async (req: Request, res: Response) => {
  // Accept data from both GET query and POST body
  const telegramData: TelegramUserData =
    req.method === "GET" ? req.query : req.body;

  // Verify Telegram Hash
  const isValid = verifyTelegramData(telegramData);

  if (!isValid) {
    securityLogger.warn("Invalid Telegram authentication attempt", {
      method: req.method,
      body: req.body,
      query: req.query,
    });
    throw new UnauthorizedError("Invalid Telegram authentication data");
  }

  //Find or Create User
  const user = await findOrCreateTelegramUser(telegramData);

  const payload = { id: user.id, email: user.email || "", role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  //Fetch Profile
  const userProfile = await getProfileService(user.id);

  //Set Refresh Token in Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  auditLogger.info("User signed in via Telegram OAuth", {
    userId: user.id,
    role: user.role,
    providerId: user.providerId,
  });

  // For GET requests, redirect to frontend with token
  if (req.method === "GET") {
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:3001";
    const params = new URLSearchParams({
      token: accessToken,
      user: encodeURIComponent(JSON.stringify(userProfile)),
    });
    return res.redirect(
      `${frontendUrl}/students/auth/telegram/callback?${params}`,
    );
  }

  // For POST requests, return JSON response
  return res.status(200).json({
    success: true,
    message: "Telegram login successful",
    data: {
      userProfile,
      accessToken,
    },
  });
};

export default telegramCallbackController;
