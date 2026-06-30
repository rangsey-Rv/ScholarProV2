import dotenv from "dotenv";
import initSentry from "./sentry";
import * as Sentry from "@sentry/node";

dotenv.config({
  path: [`.env.${process.env.NODE_ENV || "dev"}`, ".env"],
});

initSentry();

import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import path from "path";
import morgan from "morgan";
import { errorHandler } from "@middleware/error-handler";
import { systemLogger } from "@utils/logger";
import { requestLogger } from "@middleware/requestLogger";

// Add error handlers at the top
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  systemLogger.error("Unhandled Rejection", { reason, promise });
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  systemLogger.error("Uncaught Exception", { error });
  process.exit(1);
});

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
console.log(baseUrl);

systemLogger.info("Server booting...");

import router from "@routes/index";

systemLogger.info("Router imported successfully");

import "./cron-jobs/scheduler";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1200,
  message: "Too many requests, please try again later",
});

app.set("trust proxy", 1);
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(limiter);

app.use("/image", express.static(path.join(__dirname, "public/image")));

app.use("/api/v1", router);
app.get("/login-demo", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "telegram-login-demo.html"));
});

app.get("/home", (_req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express!");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

Sentry.setupExpressErrorHandler(app);
//custome error handler
app.use(errorHandler);

systemLogger.info("About to start server...");

const server = app.listen(PORT, () => {
  systemLogger.info(`✅ Server running on ${baseUrl}`);
  systemLogger.info(`📂 Started from ${process.cwd()}`);
});

server.on("error", (error) => {
  console.error("❌ Server error:", error);
  systemLogger.error("Server error", { error });
  process.exit(1);
});

const shutdown = (signal: string) => {
  systemLogger.info(`🛑 Shutdown signal received: ${signal}`);

  server.close(() => {
    systemLogger.info("🔒 HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    systemLogger.error("⏰ Force shutdown");
    process.exit(1);
  }, 10_000);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("SIGQUIT", shutdown);
