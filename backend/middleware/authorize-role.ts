import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { securityLogger, auditLogger } from "@utils/logger";
import { UnauthorizedError, ForbiddenError } from "@utils/errors";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload; // Define the type of your user object here
        }
    }
}   

export const authorizeRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.user || !roles.includes(req.user.role)) {
            securityLogger.warn("Forbidden access attempt: Insufficient permissions", {
                userId: req.user?.id,
                userRole: req.user?.role,
                requiredRoles: roles,
                url: req.originalUrl,
                method: req.method,
                ip: req.ip
            });
            return next(new ForbiddenError());
        }

        auditLogger.info("Role authorization successful", {
            userId: req.user.id,
            role: req.user.role,
            url: req.originalUrl,
            method: req.method
        });

        next();
    };
};
