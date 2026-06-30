import { db } from "@db";
import { users } from "@db/schema/user";
import { students } from "@db/schema/student";
import { eq } from "drizzle-orm";
import { ForbiddenError } from "@utils/errors";
import { securityLogger, auditLogger } from "@utils/logger";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export const generateGoogleAuthUrl = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: GOOGLE_REDIRECT_URI as string,
        client_id: GOOGLE_CLIENT_ID as string,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
};

export const getGoogleUser = async (code: string) => {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            body: new URLSearchParams(values as any),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        const { id_token, access_token } = await res.json();

        const googleUserRes = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );

        return await googleUserRes.json();
    } catch (error: any) {
        securityLogger.error("Failed to fetch Google user", { error: error.message || error });
        throw new Error("Failed to fetch Google user");
    }
};

export const findOrCreateGoogleUser = async (googleUser: {
    id: string;
    email: string;
    name: string;
    picture?: string;
}) => {
    //Try to find user by providerId (google id)
    const [userByProvider] = await db
        .select()
        .from(users)
        .where(eq(users.providerId, googleUser.id))
        .limit(1);

    if (userByProvider) {
        return userByProvider;
    }

    //Try to find user by email
    const [userByEmail] = await db
        .select()
        .from(users)
        .where(eq(users.email, googleUser.email.toLowerCase()))
        .limit(1);

    if (userByEmail) {
        //If account exists but is not a student, block social login
        if (userByEmail.role !== "student") {
            securityLogger.warn("Social login blocked: Non-student role attempt", {
                email: googleUser.email,
                role: userByEmail.role,
                provider: "google"
            });
            throw new ForbiddenError(
                "Social login is only supported for student accounts. Admin and Committee accounts must use email and password."
            );
        }

        // Link the provider info to existing student email user
        const [updatedUser] = await db
            .update(users)
            .set({
                provider: "google",
                providerId: googleUser.id,
                profileUrl: googleUser.picture || users.profileUrl,
            })
            .where(eq(users.id, userByEmail.id))
            .returning();
        return updatedUser;
    }

    // 3. Create new user (always as student)
    return await db.transaction(async (tx) => {
        const [newUser] = await tx
            .insert(users)
            .values({
                email: googleUser.email.toLowerCase(),
                provider: "google",
                providerId: googleUser.id,
                role: "student",
                profileUrl: googleUser.picture,
                isActive: true,
                lastLogin: new Date(),
            })
            .returning();

        // Create entry in students table
        await tx.insert(students).values({
            userId: newUser.id,
            nameEn: googleUser.name,
            email: googleUser.email.toLowerCase(),
        });

        auditLogger.info("New student created via Google OAuth", {
            userId: newUser.id,
            email: newUser.email
        });

        return newUser;
    });
};
