import { db } from "@db";
import { users } from "@db/schema/user";
import { passwordResets } from "@db/schema/password-reset";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { appLogger, securityLogger, userLogger } from "@utils/logger";

export default async (id: string, token: string, password: string) => {
  // Log attempt (userId unknown at this stage)
  securityLogger.info({
    event: "PASSWORD_RESET_ATTEMPT",
    resetId: id
  });

  // Fetch password reset record
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
      event: "PASSWORD_RESET_INVALID_ID",
      resetId: id
    });
    return {
      success: false,
      msg: "Invalid link",
    };
  }

  // Extract userId safely
  const { userId, expiresAt, token: tokenFromDb } = resetPassword[0];

  if (expiresAt < new Date()) {
    securityLogger.warn({
      event: "PASSWORD_RESET_EXPIRED",
      resetId: id,
      userId, // Now safe
    });

    await db.delete(passwordResets).where(eq(passwordResets.id, id));
    return {
      success: false,
      msg: "This reset link has expired",
    };
  }

  if (typeof tokenFromDb !== "string") {
    appLogger.error("Password reset failed: token missing in DB", {
      resetId: id,
      userId,
    });
    return {
      success: false,
      msg: "Invalid token",
    };
  }

  const isTokenValid = await bcrypt.compare(token, tokenFromDb);
  if (!isTokenValid) {
    appLogger.warn("Password reset failed: invalid token", {
      resetId: id,
      userId,
    });
    return {
      success: false,
      msg: "Invalid link",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, String(userId)))
    .returning();

  if (!updatedUser || updatedUser.length === 0) {
    appLogger.error("Password reset failed: password update error", {
      resetId: id,
      userId,
    });
    return {
      success: false,
      msg: "Failed to update password. Try again later",
    };
  }

  // Delete reset token
  await db.delete(passwordResets).where(eq(passwordResets.id, id));

  appLogger.info("Password reset successful", { userId });
  userLogger.info("User password changed via reset", { userId });

  return {
    success: true,
    msg: "Password updated successfully",
  };
};
