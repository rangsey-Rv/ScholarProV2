import { Request, Response, NextFunction } from "express";
import { StudentRegistrationService } from "@services/student/student-registration.service";

export class StudentRegistrationController {
  // POST /api/student-register
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const personalDocuments = files?.personalDocuments || [];
      const paymentProof = files?.paymentProof || [];
      
      const result = await StudentRegistrationService.execute(
        req.body,
        personalDocuments,
        paymentProof
      );
      
      return res.status(201).json({
        success: true,
        message: "Student registration created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/students/:id
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = parseInt(req.params.id);
      
      if (isNaN(studentId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID",
        });
      }

      const result = await StudentRegistrationService.getById(studentId);
      
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
