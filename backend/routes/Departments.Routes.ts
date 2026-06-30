
import express from "express";
import {authenticateUser} from "@middleware/authenticate-user";
import { getDepartments } from "@controllers/department/get-department.controller";
const router = express.Router();

router.get("/", authenticateUser , getDepartments);
export default router;
