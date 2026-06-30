import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@utils/verify-token";
import { securityLogger, auditLogger } from "@utils/logger";
import { UnauthorizedError } from "@utils/errors";

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        securityLogger.warn("Unauthorized access attempt: Missing or invalid Authorization header", {
            ip: req.ip,
            url: req.originalUrl,
            method: req.method
        });
        return next(new UnauthorizedError("Missing or invalid Authorization header"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
        securityLogger.warn("Unauthorized access attempt: Invalid token", {
            ip: req.ip,
            url: req.originalUrl,
            method: req.method
        });
        return next(new UnauthorizedError("Invalid token"));
    }

    req.user = {
        id: decoded.id,
        role: decoded.role
    };

    auditLogger.info("User authenticated successfully", {
        userId: decoded.id,
        role: decoded.role,
        url: req.originalUrl,
        method: req.method
    });

    next();
};
