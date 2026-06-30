import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import crypto from "crypto";

const isProd = process.env.NODE_ENV === "dev";

/**
 * 🔐 Mask sensitive fields
 */
const maskSensitive = winston.format((info) => {
  const sensitiveKeys = [
    "password",
    "otp",
    "token",
    "authorization",
  ];

  sensitiveKeys.forEach((key) => {
    if (info[key]) info[key] = "***";
  });

  return info;
});

/**
 * 🔐 Integrity hash (tamper detection)
 */
const addIntegrityHash = winston.format((info) => {
  info.integrityHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(info))
    .digest("hex");
  return info;
});

const logFormat = winston.format.combine(
  maskSensitive(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  addIntegrityHash(),
  winston.format.json({space: 2})
);

const createLogger = (folder: string, level = "info") =>
  winston.createLogger({
    level,
    format: logFormat,
    defaultMeta: {
      system: "scholarship-management"
    },
    transports: [
      new winston.transports.Console({ silent: isProd }),
      new DailyRotateFile({
        filename: `logs/${folder}/%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        maxFiles: "90d",
        zippedArchive: true
      })
    ],
    exceptionHandlers: [
      new DailyRotateFile({
        filename: `logs/${folder}/exceptions/%DATE%.log`
      })
    ],
    rejectionHandlers: [
      new DailyRotateFile({
        filename: `logs/${folder}/rejections/%DATE%.log`
      })
    ]
  });

/**
 * 🔐 Purpose-based loggers
 */
export const systemLogger = createLogger("system", "error");       
export const serverLogger = createLogger("server", "info");        
export const securityLogger = createLogger("security", "warn");    
export const auditLogger = createLogger("audit", "info");          
export const appLogger = createLogger("application", "info");      
export const userLogger = createLogger("user", "info");            
