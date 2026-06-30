import { Request, Response, NextFunction } from "express";
import { ApplicationUpdateService } from "@services/application/update-application-status.service";

export class ApplicationController {
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const appId = Number(req.params.id);

      if (isNaN(appId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application ID",
        });
      }

      const updatedApplication =
        await ApplicationUpdateService.execute(appId, req.body);

      return res.status(200).json({
        success: true,
        message: "Application updated successfully",
        data: updatedApplication,
      });
    } catch (error) {
      next(error); // 🔥 all errors go to middleware
    }
  }
}
