import express from "express";
import { cirteriaController } from "@controllers/cirteria";
const router = express.Router();
import { asyncHandler } from "@utils/async-handler";
import { authenticateUser } from "@middleware/authenticate-user";
import { authorizeRole } from "@middleware/authorize-role";

router.get("/", authenticateUser,authorizeRole("committee", "admin") ,asyncHandler(cirteriaController.getCirteriaController));
export default router;
