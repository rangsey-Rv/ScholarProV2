import cron from "node-cron";
import axios from "axios";
import { systemLogger } from "../utils/logger";

const RENEW_TOKEN_SCHEDULE = "0 0 */85 * *"; // Run every 85 days (Token expires in 90 days)

export const tokenRenewerJob = cron.schedule(RENEW_TOKEN_SCHEDULE, async () => {
  systemLogger.info("Starting Bakong Token Renewal Job...");
  
  const email = process.env.BAKONG_REGISTERED_EMAIL;
  const baseUrl = process.env.BAKONG_API_URL || "https://sit-api-bakong.nbc.org.kh";

  if (!email) {
    systemLogger.error("Bakong Token Renewal Failed: BAKONG_REGISTERED_EMAIL is not set.");
    return;
  }

  try {
    const response = await axios.post(`${baseUrl}/v1/renew_token`, { email });
    
    if (response.data.responseCode === 0) {
        // In a real production scenario, you would update the token in your secrets manager, 
        // database, or trigger a deployment to update the ENV variable.
        // For this implementation, we will log the new token. 
        // WARNING: Logging tokens is a security risk, but necessary here as we don't have a dynamic config store.
        systemLogger.info(`Bakong Token Renewed Successfully. New Token: ${response.data.data.token}`);
    } else {
        systemLogger.error(`Bakong Token Renewal Failed: ${response.data.responseMessage}`);
    }
  } catch (error) {
    systemLogger.error("Bakong Token Renewal Error:", error);
  }
});
