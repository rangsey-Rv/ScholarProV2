import cron from "node-cron";
import updateExamSessionStatus from "./update-exam-session-status";
import processEmailQueue from "./process-email-queue";
import "./token-renewer"; // Start token renewal job

cron.schedule("*/10 * * * *", async () => {
  await updateExamSessionStatus();
});

// Every minute
cron.schedule("* * * * *", async () => {
  await processEmailQueue();
});
