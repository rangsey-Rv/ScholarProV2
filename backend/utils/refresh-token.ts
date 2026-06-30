import { db } from "@db";
import { userTokens } from "@db/schema/user-token";
import { verifyRefreshToken } from "@utils/verify-token";
import { generateAccessToken, generateRefreshToken } from "./generate-token";
import { and, eq } from 'drizzle-orm';

export default async function refreshTokens(oldToken: string) {
    const payload = await verifyRefreshToken(oldToken);
    if (!payload) return null;  

    const update = await db.update(userTokens)
        .set({ isUsed: true })
        .where(
            and(
                eq(userTokens.token, oldToken),
                eq(userTokens.isUsed, false)
            )
        ).returning();

    if (!update || update.length === 0) {
        return { success: false, msg: "Invalide token" }
    }    

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = await generateRefreshToken(payload);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}


