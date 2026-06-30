import jwt from "jsonwebtoken";
import { db } from "@db";
import { userTokens } from "@db/schema/user-token";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

const JWT_PUBLIC_KEY_PATH = process.env.JWT_PUBLIC_KEY_PATH;

if (!JWT_PUBLIC_KEY_PATH) {
  throw new Error("JWT_PUBLIC_KEY_PATH environment variable is not set");
}

const resolvedPublicKeyPath = path.resolve(process.cwd(), JWT_PUBLIC_KEY_PATH);
const PUBLIC_KEY = fs.readFileSync(resolvedPublicKeyPath, "utf8");

const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    }) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

async function verifyRefreshToken(token: string) {
  try {
    const checkToken = await db
      .select({ userId: userTokens.userId, token: userTokens.token })
      .from(userTokens)
      .where(eq(userTokens.token, token));

    if (!checkToken || checkToken.length === 0) {
      return null;
    }

    const decode = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    }) as JwtPayload;
    return decode;
  } catch (err) {
    return null;
  }
}

export { verifyAccessToken, verifyRefreshToken };
