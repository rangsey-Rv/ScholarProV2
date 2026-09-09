import { Request, Response, NextFunction } from "express";
import { StudentRegistrationService } from "@services/student/student-registration.service";
import { allowedImageMimeTypes } from "@middleware/multer";
import validateFileType from "@utils/validate-file-type";

// This endpoint is public (no authenticateUser), so uploaded files must be
// verified by their actual magic bytes rather than trusting the
// client-supplied mimetype/extension, which is trivial to spoof.
const allowedStudentDocMimes = [...allowedImageMimeTypes, "application/pdf"];

export class StudentRegistrationController {
  // POST /api/student-register
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const personalDocuments = files?.personalDocuments || [];
      const paymentProof = files?.paymentProof || [];

      for (const file of [...personalDocuments, ...paymentProof]) {
        const fileCheck = await validateFileType(file.path, allowedStudentDocMimes);
        if (!fileCheck || fileCheck.success === false) {
          return res.status(400).json({
            success: false,
            message: fileCheck?.msg || "Invalid file type.",
          });
        }
      }

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
