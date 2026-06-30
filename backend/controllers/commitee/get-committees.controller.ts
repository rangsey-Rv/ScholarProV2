import { Request, Response } from "express";
import { getAllCommitteeService } from "@services/committee/committee.service";
import { asyncHandler } from "@utils/async-handler";

export const getCommittees = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || undefined;
  const status = req.query.status as string;

  const result = await getAllCommitteeService.getAllCommittees(page, limit, status);
  res.json({ success: true, ...result });
});
