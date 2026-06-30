import express from "express";
import {authenticateUser} from "@middleware/authenticate-user";
import { getAdmins } from "@controllers/admin/get-admin.controller";
const router = express.Router();

router.get("/", authenticateUser,getAdmins);
export default router;
