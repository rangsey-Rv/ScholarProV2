import { Request, Response } from "express";
import {
  getGoogleUser,
  findOrCreateGoogleUser,
} from "@services/auth/google-oauth.service";
import getProfileService from "@services/user/get-profile.service";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@utils/generate-token";
import { auditLogger, securityLogger } from "@utils/logger";

const googleCallbackController = async (req: Request, res: Response) => {
  // Accept code from both query (GET) and body (POST)
  const code = req.body?.code || req.query?.code;

  if (!code || typeof code !== "string") {
    securityLogger.warn("Google OAuth: Authorization code missing or invalid", {
      body: req.body,
      query: req.query,
      method: req.method,
    });
    return res.status(400).json({
      success: false,
      message: "Authorization code is missing",
    });
  }

  // 1. Get user info from Google
  const googleUser = await getGoogleUser(code);

  // 2. Find or create user in our DB
  // Note: Google returns the unique user ID in the 'sub' field
  const user = await findOrCreateGoogleUser({
    id: googleUser.sub || googleUser.id,
    email: googleUser.email,
    name: googleUser.name,
    picture: googleUser.picture,
  });
  const payload = { id: user.id, email: user.email, role: user.role };

  // 3. Generate our app's tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  // 4. Fetch user profile
  const userProfile = await getProfileService(user.id);

  // 5. Set refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  auditLogger.info("User signed in via Google OAuth", {
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // 6. For GET requests from Google redirect, redirect to frontend with token
  if (req.method === "GET") {
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:3001";
    const params = new URLSearchParams({
      token: accessToken,
      user: encodeURIComponent(JSON.stringify(userProfile)),
    });
    return res.redirect(
      `${frontendUrl}/students/auth/google/callback?${params}`,
    );
  }

  // 7. For POST requests, return JSON response
  return res.status(200).json({
    success: true,
    message: "Google login successful",
    data: {
      userProfile,
      accessToken,
    },
  });
};

export default googleCallbackController;
