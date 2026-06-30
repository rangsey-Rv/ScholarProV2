import { Request, Response } from "express";
import { ExportApplicationService, ExportStatus } from "@services/application/export-application.service";

/**
 * Controller for exporting applications in JSON format
 */
export class ExportApplicationController {
  private readonly exportService: ExportApplicationService;

  constructor() {
    this.exportService = new ExportApplicationService();
  }

  /**
   * Export applications in JSON format
   * Query parameters: status, batchId, page, limit
   */
    async exportApplications(req: Request, res: Response): Promise<void> {
    try {
      const { status = "all", batchId } = req.query;

      // Validate status
      const validStatuses: ExportStatus[] = [
        "all",
        "submitted",
        "shortlisted",
        "assessment_scheduled",
        "graded",
        "accepted",
        "rejected",
      ];

      if (!validStatuses.includes(status as ExportStatus)) {
        res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
        return;
      }

      // Parse batchId if provided
      let batchIdNum: number | undefined;
      if (batchId) {
        batchIdNum = Number.parseInt(batchId as string, 10);
        if (Number.isNaN(batchIdNum)) {
          res.status(400).json({
            success: false,
            message: "Invalid batchId. Must be a number.",
          });
          return;
        }
      }

      const result = await this.exportService.exportApplications({
        status: status as ExportStatus,
        batchId: batchIdNum,
      });

      res.status(200).json({
        success: true,
        message: "Applications exported successfully",
        ...result,
      });
    } catch (error: any) {
      console.error("Export applications error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export applications",
        error: error.message,
      });
    }
  }
}
