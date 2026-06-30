import { db } from "@db";
import { inviteUsers } from "@db/schema/invite-user";
import { sendEmail } from "@services/email/send-email.service";
import { and, eq } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import bcrypt from "bcryptjs";
import { users } from "@db/schema/user";
import { userLogger, auditLogger } from "@utils/logger";

export default async (
  role: "admin" | "committee",
  name: string,
  email: string,
  invitedBy: string
) => {
  try {

    const existUser = await db
      .select({ email: users.email })
      .from(users)
      .where(and(eq(users.email, email)));

    if (existUser.length > 0) {
      const logData = {
        action: "invite_user_failed",
        reason: "user_already_exists",
        invitedUser: { name, email, role },
        invitedBy,
        timestamp: new Date().toISOString(),
      };
      userLogger.warn(logData);
      auditLogger.warn(logData);

      return {
        success: false,
        msg: "User already exist in the system",
      };
    }

    // -------------------------
    // 2️⃣ Create invite record
    // -------------------------
    const token = uuidv7().toString();
    const tokenHash = await bcrypt.hash(token, 10);

    const record = await db
      .insert(inviteUsers)
      .values({
        role,
        name,
        email,
        invitedBy,
        token: tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .returning();

    if (!record || record.length === 0) {
      const logData = {
        action: "invite_user_failed",
        reason: "invite_record_creation_failed",
        invitedUser: { name, email, role },
        invitedBy,
        timestamp: new Date().toISOString(),
      };
      userLogger.error(logData);
      auditLogger.error(logData);

      return {
        success: false,
        msg: "Failed to create invite record",
      };
    }

    // -------------------------
    // 3️⃣ Send email
    // -------------------------
    const registerBaseUrl = process.env.PUBLIC_REGISTER_URL;
    const inviteLink = `${registerBaseUrl}?id=${record[0].id}&token=${token}`;

    const templateVariables = {
      name,
      role,
      inviteLink,
      expiry: record[0].expiresAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const emailSend = await sendEmail(
      email,
      "invite_user_email_template",
      templateVariables
    );

    if (!emailSend?.MessageId) {
      const logData = {
        action: "invite_user_failed",
        reason: "email_send_failed",
        invitedUser: { name, email, role },
        invitedBy,
        timestamp: new Date().toISOString(),
      };
      userLogger.error(logData);
      auditLogger.error(logData);

      return {
        success: false,
        msg: "Failed to send the invitation email. Please check the email address or try again.",
      };
    }

    // -------------------------
    // 4️⃣ Log success
    // -------------------------
    const logData = {
      action: "invite_user_success",
      invitedUser: { name, email, role },
      invitedBy,
      emailMessageId: emailSend.MessageId,
      timestamp: new Date().toISOString(),
    };
    userLogger.info(logData);
    auditLogger.info(logData);

    return {
      success: true,
      msg: "Invitation email sent successfully",
      data: emailSend,
    };
  } catch (error) {
    const logData = {
      action: "invite_user_error",
      invitedUser: { name, email, role },
      invitedBy,
      error,
      timestamp: new Date().toISOString(),
    };
    userLogger.error(logData);
    auditLogger.error(logData);

    throw error;
  }
};
