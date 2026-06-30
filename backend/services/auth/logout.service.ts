import { db } from "@db";
import { eq, and } from "drizzle-orm";
import { userTokens } from "@db/schema/user-token";
import { auditLogger, securityLogger, userLogger } from "@utils/logger";

const logoutService = async (token: string) => {
  // Mask token for logging
  const maskedToken = token ? `${token.slice(0, 4)}****` : "unknown";

  try {
    securityLogger.info({
      event: "LOGOUT_ATTEMPT",
      token: maskedToken,
    });

    const logout = await db
      .update(userTokens)
      .set({ isUsed: true })
      .where(and(eq(userTokens.token, token)))
      .returning();

    if (!logout || logout.length === 0) {
      securityLogger.warn({
        event: "LOGOUT_FAILED",
        token: maskedToken,
      });

      userLogger.warn(`Logout failed: token not found or already used. Token: ${maskedToken}`);
      return { success: false, msg: "Logout failed" };
    }

    //  Successful logout
    auditLogger.info({
      event: "LOGOUT_SUCCESS",
      token: maskedToken,
    });

    userLogger.info(`User logged out successfully. Token: ${maskedToken}`);

    return {
      success: true,
      msg: "Logout successful",
    };
  } catch (error) {
    // Unexpected error
    securityLogger.error({
      event: "LOGOUT_ERROR",
      token: maskedToken,
      error,
    });

    userLogger.error(`Logout error for token: ${maskedToken}`, error);

    return { success: false, msg: "Logout error" };
  }
};

export default logoutService;
