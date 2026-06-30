import { Request, Response } from "express";
import { ExportApplicationService, ExportStatus } from "@services/application/export-application.service";

export class ExportApplicationToCSVController {
  private readonly exportService: ExportApplicationService;

  constructor() {
    this.exportService = new ExportApplicationService();
  }

  /**
   * Export applications to CSV file
   * Query parameters: status, batchId
   */
  async exportToCSV(req: Request, res: Response): Promise<void> {
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

      if (result.data.length === 0) {
        res.status(404).json({
          success: false,
          message: "No data to export",
        });
        return;
      }

      // Convert to CSV
      const headers = Object.keys(result.data[0]);
      const csvRows = [
        headers.join(","), // Header row
        ...result.data.map((row) =>
          headers.map((header) => {
            const value = row[header];
            // Escape values that contain commas, quotes, or newlines
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"') || value.includes("\n"))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(",")
        ),
      ];

      const csv = csvRows.join("\n");

      // Set headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=applications_${status}_${Date.now()}.csv`
      );

      res.status(200).send(csv);
    } catch (error: any) {
      console.error("Export to CSV error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export to CSV",
        error: error.message,
      });
    }
  }
}
