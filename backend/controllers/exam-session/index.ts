import createExamSessionController from "@controllers/exam-session/create-exam-session.controller";
import addComitteeToExamSessionController from "@controllers/exam-session/add-comittee-to-exam-session.controller";
import updateExamSessionController from "@controllers/exam-session/update-exam-session.controller";
import getExamSessionDetailController from "./get-exam-session-detail.controller";
import getExamSessionByBatchController from "./get-exam-session-by-batch.controller";
import getApplicantByExamSessionController from "./get-applicant-by-exam-session.controller";
export const examSessionController = {
  createExamSessionController,
  addComitteeToExamSessionController,
  updateExamSessionController,
  getExamSessionDetailController,
  getApplicantByExamSessionController,
  getExamSessionByBatchController,
};