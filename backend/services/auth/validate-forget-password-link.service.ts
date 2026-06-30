import { passwordResets } from "@db/schema/password-reset";
import { db } from "@db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auditLogger, securityLogger, userLogger } from "@utils/logger";

export default async (id: string, token: string) => {
  // 🔐 Log password reset verification attempt
  securityLogger.info({
    event: "PASSWORD_RESET_VERIFY_ATTEMPT",
    resetId: id,
  });

  try {
    const resetPassword = await db
      .select({
        token: passwordResets.token,
        userId: passwordResets.userId,
        expiresAt: passwordResets.expiresAt,
      })
      .from(passwordResets)
      .where(eq(passwordResets.id, id));

    if (!resetPassword || resetPassword.length === 0) {
      securityLogger.warn({
        event: "PASSWORD_RESET_VERIFY_FAILED_INVALID_ID",
        resetId: id,
      });
      return { success: false, msg: "Invalid link" };
    }

    if (resetPassword[0].expiresAt < new Date()) {
      await db.delete(passwordResets).where(eq(passwordResets.id, id));
      securityLogger.warn({
        event: "PASSWORD_RESET_VERIFY_FAILED_EXPIRED",
        resetId: id,
        userId: resetPassword[0].userId,
      });
      return { success: false, msg: "This reset link has expired" };
    }

    const tokenFromDb = resetPassword[0].token;
    if (typeof tokenFromDb !== "string") {
      securityLogger.error({
        event: "PASSWORD_RESET_VERIFY_FAILED_INVALID_TOKEN_TYPE",
        resetId: id,
        userId: resetPassword[0].userId,
      });
      return { success: false, msg: "Invalid token" };
    }

    const isTokenValid = await bcrypt.compare(token, tokenFromDb);
    if (!isTokenValid) {
      securityLogger.warn({
        event: "PASSWORD_RESET_VERIFY_FAILED_INVALID_TOKEN",
        resetId: id,
        userId: resetPassword[0].userId,
      });
      return { success: false, msg: "Invalid link" };
    }

    // ✅ Successful verification
    auditLogger.info({
      event: "PASSWORD_RESET_VERIFY_SUCCESS",
      resetId: id,
      userId: resetPassword[0].userId,
    });

    userLogger.info(`Password reset link verified. Reset ID: ${id}, User ID: ${resetPassword[0].userId}`);

    return { success: true, msg: "Valid link" };
  } catch (error) {
    securityLogger.error({
      event: "PASSWORD_RESET_VERIFY_FAILED_EXCEPTION",
      resetId: id,
      error,
    });
    return { success: false, msg: "Internal server error" };
  }
};
