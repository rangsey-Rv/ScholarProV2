import { Router } from "express";
import { StudentRegistrationController } from "@controllers/student/student-registration.controller";
import { uploadStudentDocuments } from "@middleware/multer";
import { parseFormData } from "@middleware/parse-form-data";

const router = Router();

// POST /api/v1/students/student-register
router.post(
  "/student-register",
  uploadStudentDocuments.fields([
    { name: "personalDocuments", maxCount: 5 },
    { name: "paymentProof", maxCount: 1 }
  ]),
  parseFormData,
  StudentRegistrationController.register
);

// GET /api/students/:id
router.get("/students/:id", StudentRegistrationController.getById);

export default router;
