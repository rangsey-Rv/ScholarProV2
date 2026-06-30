import { users } from "@db/schema/user";
import { db } from "@db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auditLogger, securityLogger, userLogger } from "@utils/logger";

export default async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  // 🔐 Log password change attempt
  securityLogger.info({
    event: "PASSWORD_CHANGE_ATTEMPT",
    userId,
  });

  try {
    // Fetch user's current password
    const [user] = await db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.id, userId));

    if (!user || !user.password) {
      securityLogger.warn({
        event: "PASSWORD_CHANGE_FAILED_USER_NOT_FOUND",
        userId,
      });
      return { success: false, msg: "User not found" };
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      securityLogger.warn({
        event: "PASSWORD_CHANGE_FAILED_INVALID_OLD_PASSWORD",
        userId,
      });
      return { success: false, msg: "Incorrect old password" };
    }

    // Hash new password and update DB
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    if (!result) {
      securityLogger.error({
        event: "PASSWORD_CHANGE_FAILED_DB_ERROR",
        userId,
      });
      return { success: false, msg: "Failed to update password" };
    }

    // ✅ Audit successful password change
    auditLogger.info({
      event: "PASSWORD_CHANGE_SUCCESS",
      userId,
    });

    userLogger.info(`Password updated successfully for userId: ${userId}`);

    return { success: true, msg: "Password updated successfully" };
  } catch (error) {
    securityLogger.error({
      event: "PASSWORD_CHANGE_FAILED_EXCEPTION",
      userId,
      error,
    });
    return { success: false, msg: "Error updating password" };
  }
};
