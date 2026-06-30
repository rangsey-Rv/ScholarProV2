import { db } from "@db";
import { users } from "@db/schema/user";
import { passwordResets } from "@db/schema/password-reset";
import { eq, and, gt } from "drizzle-orm";
import { sendEmail } from "@services/email/send-email.service";
import { v7 as uuidv7 } from "uuid";
import bcrypt from "bcryptjs";
import { auditLogger, securityLogger, userLogger } from "@utils/logger";

export default async (email: string) => {
  // 🔐 Log forgot password attempt
  securityLogger.info({
    event: "FORGOT_PASSWORD_ATTEMPT",
    email,
  });

  try {
    const [user] = await db
      .select({ userId: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      securityLogger.warn({
        event: "FORGOT_PASSWORD_FAILED_USER_NOT_FOUND",
        email,
      });
      return {
        success: false,
        msg: "No account found with this email address. Please check your email and try again.",
      };
    }

    // Check for existing active reset link
    const existingResetLink = await db
      .select()
      .from(passwordResets)
      .where(
        and(
          eq(passwordResets.userId, String(user.userId)),
          gt(passwordResets.expiresAt, new Date())
        )
      );

    if (existingResetLink.length > 0) {
      securityLogger.warn({
        event: "FORGOT_PASSWORD_FAILED_EXISTING_LINK",
        userId: user.userId,
      });
      return {
        success: false,
        msg: "A password reset link has already been sent. Please check your inbox.",
      };
    }

    // Generate and hash token
    const token = uuidv7().toString();
    const tokenHash = await bcrypt.hash(token, 10);

    const record = await db
      .insert(passwordResets)
      .values({
        userId: user.userId,
        token: tokenHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      })
      .returning();

    if (!record || record.length === 0) {
      securityLogger.error({
        event: "FORGOT_PASSWORD_FAILED_DB_INSERT",
        userId: user.userId,
      });
      return {
        success: false,
        msg: "Something went wrong, please try again later",
      };
    }

    // Prepare reset links
    const resetPasswordUrl = process.env.PUBLIC_FORGOT_PASSWORD_URL;
    const resetPasswordMobileUrl = process.env.MOBILE_FORGOT_PASSWORD_URL;
    const resetPasswordLink = `${resetPasswordUrl}?id=${record[0].id}&token=${token}`;
    const resetPasswordLinkMobile = `${resetPasswordMobileUrl}?id=${record[0].id}&token=${token}`;

    const emailVariables = { resetPasswordLink, resetPasswordLinkMobile };

    // Send email
    const emailSend = await sendEmail(email, "Forgot_password_link", emailVariables);

    if (!emailSend?.MessageId) {
      securityLogger.error({
        event: "FORGOT_PASSWORD_FAILED_EMAIL",
        userId: user.userId,
        email,
      });
      return {
        success: false,
        msg: "Failed to send the reset password link. Please try again later.",
      };
    }

    // ✅ Audit log for successful password reset request
    auditLogger.info({
      event: "FORGOT_PASSWORD_SUCCESS",
      userId: user.userId,
      email,
      resetId: record[0].id,
    });

    userLogger.info(`Password reset email sent to ${email}`);

    return {
      success: true,
      msg: "Reset password link sent successfully. Please check your inbox.",
      data: emailSend,
    };
  } catch (error) {
    securityLogger.error({
      event: "FORGOT_PASSWORD_FAILED_EXCEPTION",
      email,
      error,
    });
    return {
      success: false,
      msg: "Internal server error. Please try again later",
    };
  }
};
