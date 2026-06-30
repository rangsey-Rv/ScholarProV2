import  express from "express";
import InputScore from "@controllers/evaluation/update-score-by-eachCriterial.controller";
import listInterviewScores from "@controllers/evaluation/get-interview.controller";
import {getAllApplicationScores , getApplicationScore} from "@controllers/evaluation/list-score.controller";
import { authorizeRole } from "@middleware/authorize-role";
import { authenticateUser } from "@middleware/authenticate-user";
import  UnifiedExamScore from "@controllers/evaluation/unified-exam-score.controller";
import {
  handleCreateOrUpdateCriteria,
  handleActivateCriteria,
  handleDeactivateCriteria,
} from "@controllers/setting/interviewCriteria.controller";

const router = express.Router();
router.put("/score" , authenticateUser , authorizeRole("committee") , InputScore);
router.get("/interview",authenticateUser,listInterviewScores);
// new 
router.get("/exam-scores",authenticateUser,authorizeRole("committee","admin"),UnifiedExamScore);
// 
router.get("/applications/scores",authenticateUser,authorizeRole("admin"),getAllApplicationScores);
router.get("/applications/:id/score" ,authenticateUser,authorizeRole("admin"), getApplicationScore);
router.post("/", authenticateUser,authorizeRole("admin"),handleCreateOrUpdateCriteria);
router.put("/",authenticateUser, authorizeRole("admin"),handleCreateOrUpdateCriteria);
router.patch("/:id/activate", authenticateUser,authorizeRole("admin"), handleActivateCriteria)
router.patch("/:id/deactivate", authenticateUser, authorizeRole("admin"), handleDeactivateCriteria);


export default router;
