import { inviteUsers } from "@db/schema/invite-user";
import { db } from "@db";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auditLogger, securityLogger, userLogger } from "@utils/logger";

export default async (id: string, token: string) => {
  securityLogger.info({
    event: "INVITE_TOKEN_VERIFY_ATTEMPT",
    inviteId: id,
  });

  try {
    if (!token) {
      securityLogger.warn({
        event: "INVITE_TOKEN_VERIFY_FAILED_NO_TOKEN",
        inviteId: id,
      });
      return { success: false, msg: "Token not found" };
    }

    const [inviteRecord] = await db
      .select({
        expiresAt: inviteUsers.expiresAt,
        email: inviteUsers.email,
        token: inviteUsers.token,
      })
      .from(inviteUsers)
      .where(and(eq(inviteUsers.id, id), eq(inviteUsers.status, "pending")));

    if (!inviteRecord) {
      securityLogger.warn({
        event: "INVITE_TOKEN_VERIFY_FAILED_INVALID",
        inviteId: id,
      });
      return { success: false, msg: "Invalid or expired token" };
    }

    if (inviteRecord.expiresAt <= new Date()) {
      await db.update(inviteUsers).set({ status: "fail" }).where(eq(inviteUsers.id, id));
      securityLogger.warn({
        event: "INVITE_TOKEN_VERIFY_EXPIRED",
        inviteId: id,
        email: inviteRecord.email,
      });
      return { success: false, msg: "Invalid or expired token" };
    }

    const isTokenValid = await bcrypt.compare(token, inviteRecord.token ?? "");
    if (!isTokenValid) {
      securityLogger.warn({
        event: "INVITE_TOKEN_VERIFY_FAILED_INVALID_TOKEN",
        inviteId: id,
        email: inviteRecord.email,
      });
      return { success: false, msg: "Invalid Link" };
    }

    // ✅ Audit successful verification
    auditLogger.info({
      event: "INVITE_TOKEN_VERIFY_SUCCESS",
      inviteId: id,
      email: inviteRecord.email,
    });

    userLogger.info(`Invite token verified. Invite ID: ${id}, Email: ${inviteRecord.email}`);

    return { success: true, msg: "Valid token", email: inviteRecord.email };
  } catch (error) {
    securityLogger.error({
      event: "INVITE_TOKEN_VERIFY_EXCEPTION",
      inviteId: id,
      error,
    });
    return { success: false, msg: "Internal server error" };
  }
};
