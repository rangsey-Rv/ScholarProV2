import { Request, Response } from "express";
import { updateExamRecordService } from "@services/exam/update-exam-record.service";


export class UpdateExamRecordController {
  async excludeStudentFromExam(req: Request, res: Response): Promise<void> {
    try {
      const examId = parseInt(req.params.examId);
      
      const { reason } = req.body;

      // Validate examId
      if (isNaN(examId) || examId <= 0 || !examId) {
        res.status(400).json({
          success: false,
          message: "Invalid exam ID",
        });
        return;
      }

      const updatedExam = await updateExamRecordService.excludeStudentFromExam(examId);

      res.status(200).json({
        success: true,
        message: "Student successfully excluded from exam",
        data: {
          examId: updatedExam.id,
          status: updatedExam.status,
          reason: reason || "Not provided",
          updatedAt: updatedExam.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error excluding student from exam:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const statusCode = errorMessage.includes("not found") ? 404 
                        : errorMessage.includes("already cancelled") ? 400 
                        : 500;

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
      });
    }
  }
}

export const updateExamRecordController = new UpdateExamRecordController();
