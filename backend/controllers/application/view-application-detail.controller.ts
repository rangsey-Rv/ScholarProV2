import { Request, Response } from "express";
import { ViewApplicationDetailService } from "../../services/application/view-application-detail.service";

export class ViewApplicationDetailController {
  private service: ViewApplicationDetailService;

  constructor() {
    this.service = new ViewApplicationDetailService();
  }

  // Get single application detail
  async getApplicationDetail(req: Request, res: Response): Promise<void> {
    try {
      const applicationId = parseInt(req.params.id);
      console.log("applicationId: ", applicationId)
      if (isNaN(applicationId)) {
        res.status(400).json({
          success: false,
          message: "Invalid application ID",
        });
        return;
      }

      const applicationDetail = await this.service.getApplicationDetail(applicationId);

      if (!applicationDetail) {
        res.status(404).json({
          success: false,
          message: "Application not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: applicationDetail,
      });
    } catch (error: any) {
      console.error("Error fetching application detail:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch application detail",
        error: error.message,
      });
    }
  }
}
