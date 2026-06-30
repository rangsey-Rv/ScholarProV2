import jwt from "jsonwebtoken";
import { db } from "@db";
import { userTokens } from "@db/schema/user-token";
import { and, eq, inArray } from "drizzle-orm";
import fs from "fs";
import path from "path";

const JWT_PRIVATE_KEY_PATH = process.env.JWT_PRIVATE_KEY_PATH;

if (!JWT_PRIVATE_KEY_PATH) {
  throw new Error("JWT_PRIVATE_KEY_PATH environment variable is not set");
}
const resolvedPrivateKeyPath = path.resolve(process.cwd(), JWT_PRIVATE_KEY_PATH);
const PRIVATE_KEY = fs.readFileSync(resolvedPrivateKeyPath, "utf8");

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "15d";

function generateAccessToken(user: { id: string; role: string }) {
  return jwt.sign({ id: user.id, role: user.role }, PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

async function generateRefreshToken(user: { id: string; role: string }) {
  const token = jwt.sign({ id: user.id, role: user.role }, PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  //Limit to 5 active sessions
  const SESSION_LIMIT = 5;

  const activeSessions = await db
    .select({ id: userTokens.id })
    .from(userTokens)
    .where(
      and(
        eq(userTokens.userId, user.id),
        eq(userTokens.isUsed, false)
      )
    )
    .orderBy(userTokens.createdAt);

  if (activeSessions.length >= SESSION_LIMIT) {
    // Revoke the oldest session(s) to stay within the limit
    const numToRevoke = (activeSessions.length - SESSION_LIMIT) + 1;
    const sessionsToRevoke = activeSessions.slice(0, numToRevoke);
    const idsToRevoke = sessionsToRevoke.map((s) => s.id);

    await db
      .update(userTokens)
      .set({ isUsed: true })
      .where(inArray(userTokens.id, idsToRevoke));
  }

  const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days
  await db.insert(userTokens).values({
    userId: user.id,
    token,
    expiredAt: expiresAt,
    isUsed: false,
  });
  return token;
}

export { generateAccessToken, generateRefreshToken }; 
