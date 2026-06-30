import express from "express";

import { updateExamRecordController } from "@controllers/exam/update-exam-record.controller";
import patchExamScore from "@controllers/exam/patch-exam-score.controller";
import getExamsByCommittee from "@controllers/exam/get-exam-by-committee.controller";
import { authorizeRole } from "@middleware/authorize-role";
import { authenticateUser } from "@middleware/authenticate-user";
import { asyncHandler } from "@middleware/async-handler";


const router = express.Router();


router.put(
  "/:examId/score",
  authenticateUser,
  authorizeRole("committee"),asyncHandler(patchExamScore)
);
router.get(
  "/committee",
  authenticateUser,
  authorizeRole("committee"),
  asyncHandler(getExamsByCommittee)
);



router.put(
  "/:examId/exclude",
  authenticateUser,
  authorizeRole("admin"),
  updateExamRecordController.excludeStudentFromExam.bind(
    updateExamRecordController
  )
);

export default router;
