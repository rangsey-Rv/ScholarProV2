import { UnifiedExamScoreService } from "@services/scoring/get-score.service";
import { Request, Response } from "express";
import { appLogger } from "@utils/logger"; // your winston logger

export default async function UnifiedExamScore(req: Request, res: Response) {
  const service = new UnifiedExamScoreService();
  try {
    const { 
      applicationId, subjectId, examId, examSessionId,
      batchId, committeeId,
      applicationIds, subjectIds, examIds, examSessionIds,
      batchIds, committeeIds,
      page, limit
    } = req.query;

    // Helper functions
    const parseIds = (value: any): number[] | undefined => {
      if (!value) return undefined;
      if (Array.isArray(value)) return value.map(v => Number(v)).filter(n => !isNaN(n));
      return String(value).split(',').map(v => Number(v.trim())).filter(n => !isNaN(n));
    };

    const parseStringIds = (value: any): string[] | undefined => {
      if (!value) return undefined;
      if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(s => s.length > 0);
      return String(value).split(',').map(v => v.trim()).filter(s => s.length > 0);
    };

    // Build filters
    const filters = {
      applicationId: applicationId ? Number(applicationId) : undefined,
      subjectId: subjectId ? Number(subjectId) : undefined,
      examId: examId ? Number(examId) : undefined,
      examSessionId: examSessionId ? Number(examSessionId) : undefined,
      batchId: batchId ? Number(batchId) : undefined,
      committeeId: committeeId ? String(committeeId) : undefined,
      applicationIds: parseIds(applicationIds),
      subjectIds: parseIds(subjectIds),
      examIds: parseIds(examIds),
      examSessionIds: parseIds(examSessionIds),
      batchIds: parseIds(batchIds),
      committeeIds: parseStringIds(committeeIds),
    };

    // Pagination
    const paginationOptions = {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };

    // Validate pagination
    if (paginationOptions.page !== undefined && (isNaN(paginationOptions.page) || paginationOptions.page < 1)) {
      return res.status(400).json({ success: false, message: "Page must be a positive number" });
    }

    if (paginationOptions.limit !== undefined && (isNaN(paginationOptions.limit) || paginationOptions.limit < 1)) {
      return res.status(400).json({ success: false, message: "Limit must be a positive number" });
    }

    const result = await service.listAll(filters, paginationOptions);

    // ✅ Log request success without sensitive data
    appLogger.info({
      message: "UnifiedExamScore retrieved successfully",
      filters: { ...filters, applicationIds: "[REDACTED]" }, // redact sensitive IDs
      paginationOptions
    });

    return res.json(result);
  } catch (err) {
    // 🔐 Safe logging for errors
    appLogger.error({
      message: "UnifiedExamScoreController Error",
      error: err instanceof Error ? err.message : String(err)
    });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" && err instanceof Error ? err.message : undefined,
    });
  }
}
