import { db } from "@db";
import { users } from "@db/schema/user";
import { students } from "@db/schema/student";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { auditLogger } from "@utils/logger";
import { ensureStudentApplication } from "@services/application/ensure-student-application.service";

export interface TelegramUserData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

export const verifyTelegramAuth = (data: TelegramUserData): boolean => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
        throw new Error("TELEGRAM_BOT_TOKEN is not defined in environment variables");
    }

    const { hash, ...dataToVerify } = data;

    // Sort alphabetically by key and create string
    const checkString = Object.keys(dataToVerify)
        .sort()
        .map((key) => `${key}=${(dataToVerify as any)[key]}`)
        .join("\n");

    const secretKey = crypto.createHash("sha256").update(botToken).digest();

    const hmac = crypto
        .createHmac("sha256", secretKey)
        .update(checkString)
        .digest("hex");

    return hmac === hash;
};

export const verifyTelegramData = verifyTelegramAuth;

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

        const [existingStudent] = await db
            .select({ id: students.id })
            .from(students)
            .where(eq(students.userId, updatedUser.id))
            .limit(1);
        if (existingStudent) {
            await ensureStudentApplication(existingStudent.id, db);
        }

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
        const [createdStudent] = await tx
            .insert(students)
            .values({
                userId: newUser.id,
                nameEn: fullName,
                email: null,
            })
            .returning();

        // Save record in applicant (applications) as well
        await ensureStudentApplication(createdStudent.id, tx);

        auditLogger.info("New student created via Telegram OAuth", {
            userId: newUser.id,
            providerId: newUser.providerId
        });

        return newUser;
    });
};
