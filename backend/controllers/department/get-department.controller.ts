import { Request, Response } from "express";
import { db } from "@db";
import { department } from "@db/schema/department";
import { asc } from "drizzle-orm";
import { asyncHandler } from "@utils/async-handler";

export const getDepartments = asyncHandler(async (req: Request, res: Response) => {
  const result = await db.select().from(department).orderBy(asc(department.id));
  res.json({ success: true, data: result });
});
