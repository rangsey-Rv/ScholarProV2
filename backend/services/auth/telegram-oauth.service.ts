import { db } from "@db";
import { users } from "@db/schema/user";
import { students } from "@db/schema/student";
import { eq, and } from "drizzle-orm";
import crypto from "node:crypto";
import { auditLogger } from "@utils/logger";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export interface TelegramUserData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}


export const verifyTelegramData = (data: TelegramUserData): boolean => {
    const botToken = TELEGRAM_BOT_TOKEN;
    if (!botToken) {
        throw new Error("TELEGRAM_BOT_TOKEN is not set");
    }

    const { hash, ...dataToVerify } = data;
    const checkString = Object.keys(dataToVerify)
        .sort((a, b) => a.localeCompare(b))
        .map((key) => `${key}=${(dataToVerify as any)[key]}`)
        .join("\n");

    const secretKey = crypto.createHash("sha256").update(botToken).digest();

    const hmac = crypto
        .createHmac("sha256", secretKey)
        .update(checkString)
        .digest("hex");

    return hmac === hash;
};

export const findOrCreateTelegramUser = async (tgUser: TelegramUserData) => {
    const providerId = tgUser.id.toString();

    const [existingUser] = await db
        .select()
        .from(users)
        .where(and(eq(users.provider, "telegram"), eq(users.providerId, providerId)))
        .limit(1);

    if (existingUser) {
        // Only update lastLogin for existing users
        const [updatedUser] = await db
            .update(users)
            .set({ lastLogin: new Date() })
            .where(eq(users.id, existingUser.id))
            .returning();

        return updatedUser;
    }

    return await db.transaction(async (tx) => {
        const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ");

        const [newUser] = await tx
            .insert(users)
            .values({
                email: null,
                provider: "telegram",
                providerId: providerId,
                role: "student",
                profileUrl: tgUser.photo_url,
                isActive: true,
                lastLogin: new Date(),
            })
            .returning();

        // Create student entry
        await tx.insert(students).values({
            userId: newUser.id,
            nameEn: fullName,
            email: null,
        });

        auditLogger.info("New student created via Telegram OAuth", {
            userId: newUser.id,
            providerId: newUser.providerId
        });

        return newUser;
    });
};
