import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: "https://a4b8112e6793a00b62187dbc426c142f@o4510526210179072.ingest.us.sentry.io/4510526227742720",
  // Adds request headers and IP for users, for more info visit:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
