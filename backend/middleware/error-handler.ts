import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "@middleware/app-error";

export function errorHandler(
    error: any,
    req: Request,  
    res: Response,
    next: NextFunction
) {
    if (error instanceof ZodError) {
        const messages = error.issues.map((err) => err.message);
        return res.status(400).json({ success: false, errors: messages });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    if (error?.query) {
        console.error("Database Error:", error.query, error.params);
        return res.status(500).json({
            success: false,
            message: "A database error occurred while processing your request. Please try again later.",
        });
    }

    console.error("Unexpected error:", error);
    return res.status(500).json({
        success: false,
        message: error?.message || "Internal Server Error",
    });
}