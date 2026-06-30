import { db } from "@db";
import { inviteUsers } from "@db/schema/invite-user";
import { users } from "@db/schema/user";
import { admins } from "@db/schema/admin";
import { committees } from "@db/schema/committee";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auditLogger, securityLogger, userLogger } from "@utils/logger";

export default async (id: string, token: string, email: string, password: string) => {
  try {
    return await db.transaction(async (tx) => {
      // Registration attempt log
      securityLogger.info({
        event: "REGISTRATION_ATTEMPT",
        inviteId: id,
        email,
      });

      // Fetch invitation record
      const [inviteUser] = await tx
        .select({
          role: inviteUsers.role,
          name: inviteUsers.name,
          token: inviteUsers.token,
        })
        .from(inviteUsers)
        .where(
          and(
            eq(inviteUsers.id, id),
            eq(inviteUsers.email, email),
            eq(inviteUsers.status, "pending"),
            gt(inviteUsers.expiresAt, new Date())
          )
        )
        .limit(1);

      if (!inviteUser || !inviteUser.token) {
        securityLogger.warn({
          event: "REGISTRATION_FAILED_INVALID_INVITE",
          inviteId: id,
          email,
        });
        return { success: false, msg: "The invitation link is invalid or expired." };
      }

      // Validate invitation token
      const isTokenValid = await bcrypt.compare(token, inviteUser.token);
      if (!isTokenValid) {
        securityLogger.warn({
          event: "REGISTRATION_FAILED_INVALID_TOKEN",
          inviteId: id,
          email,
        });
        return { success: false, msg: "Invalid invitation link" };
      }

      // Check if user already exists
      const [existingUser] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser) {
        securityLogger.warn({
          event: "REGISTRATION_FAILED_EMAIL_EXISTS",
          email,
        });
        return { success: false, msg: "Email already registered" };
      }

      // Hash password & create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const [newUser] = await tx
        .insert(users)
        .values({
          email:email.toLowerCase(),
          password: hashedPassword,
          role: inviteUser.role,
          lastLogin: new Date(),
        })
        .returning();

      auditLogger.info({
        event: "REGISTRATION_SUCCESS",
        userId: newUser.id,
        email,
        role: inviteUser.role,
      });

      userLogger.info(`User created: ${newUser.id}, Email: ${email}`);

      // Create role-specific entry
      if (inviteUser.role === "admin") {
        await tx.insert(admins).values({ userId: newUser.id, name: inviteUser.name || "" });
      } else if (inviteUser.role === "committee") {
        await tx.insert(committees).values({ userId: newUser.id, name: inviteUser.name || "" });
      } else {
        securityLogger.error({
          event: "REGISTRATION_FAILED_INVALID_ROLE",
          userId: newUser.id,
          role: inviteUser.role,
        });
        return { success: false, msg: "Invalid role or missing logic" };
      }

      // Delete invitation after successful registration
      await tx.delete(inviteUsers).where(eq(inviteUsers.id, id));
      auditLogger.info({
        event: "INVITE_CONSUMED",
        inviteId: id,
        userId: newUser.id,
      });

      return { success: true, msg: "Register successfully" };
    });
  } catch (error) {
    securityLogger.error({
      event: "REGISTRATION_FAILED_SERVER_ERROR",
      inviteId: id,
      email,
      error,
    });
    return { success: false, msg: "Registration failed due to server error" };
  }
};
