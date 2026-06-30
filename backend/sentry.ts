import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

export default function initSentry() {
  if (!process.env.SENTRY_DSN) {
    console.warn("Sentry DSN not set, skipping Sentry init");
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "dev",
    tracesSampleRate: 1.0, 
    integrations: [nodeProfilingIntegration()],
  });
  console.log("👉 initSentry called");
}
