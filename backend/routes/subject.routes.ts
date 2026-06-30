import { Router } from "express";
import {
  getSubjects,
  createSubject,
  adjustSubjectWeight,
  deleteSubject,
} from "@controllers/subject/get-subjects.controller";
import { authenticateUser } from "@middleware/authenticate-user";

const router = Router();

router.get("/", authenticateUser, getSubjects);
router.post("/", authenticateUser, createSubject);
router.patch("/:id/weight", authenticateUser, adjustSubjectWeight);
router.delete("/:id", authenticateUser, deleteSubject);

export default router;
